import Anthropic from '@anthropic-ai/sdk';
import { ProjectSummary, ResearchResult } from '../../../shared/types/project';
import { LocalResearcher } from './local-researcher';

export class AIResearcher {
  private client: Anthropic | null;
  private localResearcher: LocalResearcher;
  private useLocalMode: boolean;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    this.localResearcher = new LocalResearcher();

    // Check if API key is configured and valid
    if (!apiKey || apiKey === 'sk-ant-api-key-placeholder' || !apiKey.startsWith('sk-ant-')) {
      console.log('[AIResearcher] No valid API key found, using local analysis mode');
      this.useLocalMode = true;
      this.client = null;
    } else {
      console.log('[AIResearcher] API key configured, using Claude API');
      this.useLocalMode = false;
      this.client = new Anthropic({ apiKey });
    }
  }

  /**
   * Analyze project requirements using Claude API or local fallback
   */
  async analyzeProject(parsedData: ProjectSummary): Promise<ResearchResult> {
    // Use local analysis if no API key
    if (this.useLocalMode) {
      return this.localResearcher.analyzeProject(parsedData);
    }

    // Use Claude API
    console.log('[Researcher] Starting AI analysis for:', parsedData.projectName);

    const prompt = this.buildPrompt(parsedData);

    try {
      const response = await this.client!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      console.log('[Researcher] Claude API response received');

      // Extract text from response
      const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      // Parse JSON from response
      const result = this.parseResponse(responseText);

      console.log('[Researcher] Analysis complete:', {
        features: result.requiredFeatures.length,
        complexity: result.estimatedComplexity,
        timeline: result.estimatedTimeline
      });

      return result;

    } catch (error) {
      console.error('[Researcher] Claude API error:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build analysis prompt for Claude
   */
  private buildPrompt(data: ProjectSummary): string {
    return `You are an expert software architect and project analyst. Analyze this project and provide detailed recommendations.

PROJECT SUMMARY:
Name: ${data.projectName}
Description: ${data.description}
Features: ${data.features?.join(', ') || 'Not specified'}
Tech Stack:
  - Backend: ${data.techStack?.backend?.join(', ') || 'Not specified'}
  - Frontend: ${data.techStack?.frontend?.join(', ') || 'Not specified'}
  - Database: ${data.techStack?.database || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}
Team Size: ${data.teamSize || 'Not specified'}
Constraints: ${data.constraints?.join(', ') || 'None specified'}

TASK:
Provide a comprehensive analysis with:

1. **Required Features**: Break down the project into specific, measurable features. For each feature provide:
   - name (clear, specific)
   - priority (critical, high, medium, low)
   - complexity (low, medium, high)
   - estimatedHours (realistic estimate)

2. **Recommended Tech Stack**: Based on the requirements, recommend the optimal technology stack. For each component (backend, frontend, database), provide:
   - framework (specific technology)
   - reasoning (why this choice)

3. **Architecture Pattern**: Recommend the best architectural approach:
   - pattern (e.g., "Monolithic", "Microservices", "Serverless", "JAMstack")
   - reasoning (why this pattern fits)

4. **Complexity Assessment**: Rate the overall project complexity (low, medium, high)

5. **Timeline Estimate**: Provide a realistic timeline estimate

IMPORTANT:
- Return ONLY valid JSON (no markdown, no code blocks, no explanations outside JSON)
- Use this exact structure:

{
  "requiredFeatures": [
    {
      "name": "User Authentication",
      "priority": "critical",
      "complexity": "medium",
      "estimatedHours": 16
    }
  ],
  "recommendedTechStack": {
    "backend": {
      "framework": "Express.js with TypeScript",
      "reasoning": "Fast development, strong ecosystem, TypeScript for type safety"
    },
    "frontend": {
      "framework": "Next.js 14",
      "reasoning": "Server components, app router, excellent DX, SEO-friendly"
    },
    "database": {
      "type": "PostgreSQL",
      "reasoning": "Relational data model, ACID compliance, excellent for structured data"
    }
  },
  "architecture": {
    "pattern": "Monolithic (for MVP)",
    "reasoning": "Simpler deployment, faster iteration, lower operational complexity for initial launch"
  },
  "estimatedComplexity": "medium",
  "estimatedTimeline": "6-8 weeks"
}

Analyze the project and return the JSON:`;
  }

  /**
   * Parse Claude's response and extract ResearchResult
   */
  private parseResponse(responseText: string): ResearchResult {
    try {
      // Try to extract JSON from response
      // Claude might wrap it in markdown code blocks
      let jsonText = responseText.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(jsonText);

      // Validate required fields
      if (!parsed.requiredFeatures || !Array.isArray(parsed.requiredFeatures)) {
        throw new Error('Missing requiredFeatures array');
      }
      if (!parsed.recommendedTechStack) {
        throw new Error('Missing recommendedTechStack');
      }
      if (!parsed.architecture) {
        throw new Error('Missing architecture');
      }
      if (!parsed.estimatedComplexity) {
        throw new Error('Missing estimatedComplexity');
      }
      if (!parsed.estimatedTimeline) {
        throw new Error('Missing estimatedTimeline');
      }

      return parsed as ResearchResult;

    } catch (error) {
      console.error('[Researcher] Failed to parse response:', responseText.substring(0, 200));
      throw new Error(`Invalid JSON response from Claude: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }
}
