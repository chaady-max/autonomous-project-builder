import Anthropic from '@anthropic-ai/sdk';
import { ProjectSummary, ResearchResult, InputEnrichment } from '../../../shared/types/project';

/**
 * AI Clarifier Service (v0.7)
 * Generates 3-5 critical clarifying questions to improve build spec quality
 * Supports dual-mode: Claude API or local heuristics
 */
export class AIClarifier {
  private client: Anthropic | null;
  private useLocalMode: boolean;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Check if API key is configured and valid
    if (!apiKey || apiKey === 'sk-ant-api-key-placeholder' || !apiKey.startsWith('sk-ant-')) {
      console.log('[AIClarifier] No valid API key found, using local question generation');
      this.useLocalMode = true;
      this.client = null;
    } else {
      console.log('[AIClarifier] API key configured, using Claude for question generation');
      this.useLocalMode = false;
      this.client = new Anthropic({ apiKey });
    }
  }

  /**
   * Generate 3-5 clarifying questions
   */
  async generateQuestions(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment
  ): Promise<string[]> {
    if (this.useLocalMode) {
      return this.generateQuestionsLocal(parsedData, researchResult, enrichment);
    }

    return this.generateQuestionsWithClaude(parsedData, researchResult, enrichment);
  }

  /**
   * Local mode: Rule-based question generation
   */
  private generateQuestionsLocal(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment
  ): string[] {
    const questions: string[] = [];

    // Check for missing personas
    if (!enrichment?.personas || enrichment.personas.length === 0) {
      questions.push(
        'Who are the primary users of this application? (e.g., admin users, end customers, team members)'
      );
    }

    // Check for scalability information
    if (!enrichment?.nfrScalability) {
      questions.push(
        'How many concurrent users do you expect at launch, and what is the expected peak load?'
      );
    }

    // Check for feature prioritization (if many features)
    if (parsedData.features && parsedData.features.length > 8 && !enrichment?.featurePriorities?.length) {
      questions.push(
        'Which features are critical for the initial MVP, and which can be deferred to later versions?'
      );
    }

    // Check for authentication details
    const hasAuth = researchResult.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') ||
      f.name.toLowerCase().includes('login') ||
      f.name.toLowerCase().includes('user')
    );
    if (hasAuth && !enrichment?.nfrSecurity) {
      questions.push(
        'What level of authentication is required? (e.g., simple email/password, social login, 2FA, SSO)'
      );
    }

    // Check for API vs UI preference
    if (!enrichment?.approachPreference) {
      questions.push(
        'Should we prioritize building the API first (backend-driven development) or UI first (frontend-driven development)?'
      );
    }

    // Check for performance requirements
    if (!enrichment?.nfrPerformance && researchResult.estimatedComplexity === 'high') {
      questions.push(
        'Are there specific performance requirements? (e.g., page load time, API response time, real-time features)'
      );
    }

    // Check for deployment preferences
    if (researchResult.estimatedComplexity !== 'low' && !enrichment?.scalabilityTier) {
      questions.push(
        'What is your expected scale? (small: <1K users, medium: 1K-10K, large: 10K-100K, enterprise: 100K+)'
      );
    }

    // Check for budget constraints
    if (!enrichment?.budgetConstraint) {
      questions.push(
        'What is your budget constraint for infrastructure and third-party services? (low: <$50/mo, medium: $50-500/mo, high: $500+/mo)'
      );
    }

    // Check for data privacy/compliance
    const hasUserData = parsedData.features?.some(f =>
      f.toLowerCase().includes('user') ||
      f.toLowerCase().includes('profile') ||
      f.toLowerCase().includes('account')
    );
    if (hasUserData && !enrichment?.nfrSecurity?.complianceStandards) {
      questions.push(
        'Are there any data privacy or compliance requirements? (e.g., GDPR, HIPAA, SOC 2)'
      );
    }

    // Return top 5 most relevant questions
    return questions.slice(0, 5);
  }

  /**
   * Claude mode: AI-generated smart questions
   */
  private async generateQuestionsWithClaude(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment
  ): Promise<string[]> {
    console.log('[AIClarifier] Generating questions with Claude API...');

    const prompt = `You are an expert software architect helping to clarify project requirements.

PROJECT SUMMARY:
${JSON.stringify(parsedData, null, 2)}

RESEARCH RESULTS:
${JSON.stringify(researchResult, null, 2)}

${enrichment ? `CURRENT ENRICHMENT DATA:
${JSON.stringify(enrichment, null, 2)}` : 'NO ENRICHMENT DATA PROVIDED YET'}

Your task is to generate 3-5 critical clarifying questions that would significantly improve the quality of the build specification. Focus on:

1. **Ambiguities in requirements** - Where project goals or features are unclear
2. **Missing critical technical details** - Information needed to make architectural decisions
3. **Unclear priorities or trade-offs** - What matters most to the user
4. **Potential architecture decisions** - Choices that need user input
5. **Non-functional requirements** - Performance, security, scalability needs

IMPORTANT RULES:
- Generate EXACTLY 3-5 questions (no more, no less)
- Each question should be specific and actionable
- Avoid questions about information already provided
- Focus on questions that will affect architectural decisions
- Questions should be clear and easy for non-technical users to understand
- Prioritize questions by impact on project success

Return ONLY a JSON array of question strings (no explanations, no markdown):
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    try {
      const response = await this.client!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      // Parse JSON response
      let questions: string[];
      try {
        // Try direct JSON parse
        questions = JSON.parse(responseText.trim());
      } catch {
        // Try extracting JSON from markdown code block
        const jsonMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[1]);
        } else {
          // Fallback: try to find array in text
          const arrayMatch = responseText.match(/\[[\s\S]*\]/);
          if (arrayMatch) {
            questions = JSON.parse(arrayMatch[0]);
          } else {
            throw new Error('Could not parse questions from response');
          }
        }
      }

      // Validate and limit to 5 questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format');
      }

      console.log(`[AIClarifier] Generated ${questions.length} questions`);
      return questions.slice(0, 5);

    } catch (error) {
      console.error('[AIClarifier] Claude API error:', error);
      console.log('[AIClarifier] Falling back to local question generation');
      return this.generateQuestionsLocal(parsedData, researchResult, enrichment);
    }
  }
}
