/**
 * QualityValidator - Validates spec quality and detects vague language
 */

export interface QualityReport {
  overallScore: number;
  sectionScores: Record<string, number>;
  errors: Array<{ section: string; field: string; message: string; severity: string }>;
  warnings: Array<{ section: string; field: string; message: string }>;
  suggestions: Array<{ section: string; field: string; message: string }>;
  vagueTermsFound: Array<{ term: string; location: string; suggestion: string }>;
  missingDetails: Array<{ section: string; what_is_missing: string }>;
  passedQualityGate: boolean;
  requiredFixes: string[];
}

export class QualityValidator {
  private vagueTerms = [
    'TBD', 'TODO', 'FIXME', 'maybe', 'might', 'could', 'should probably',
    'nice to have', 'if possible', 'when time permits', 'tentative',
    'approximately', 'roughly', 'about', 'around', 'some', 'various',
    'several', 'many', 'few', 'multiple', 'numerous', 'etc'
  ];

  validate(specMarkdown: string, decisionsYaml: string): QualityReport {
    const errors: Array<{ section: string; field: string; message: string; severity: string }> = [];
    const warnings: Array<{ section: string; field: string; message: string }> = [];
    const suggestions: Array<{ section: string; field: string; message: string }> = [];
    const vagueTermsFound: Array<{ term: string; location: string; suggestion: string }> = [];
    const missingDetails: Array<{ section: string; what_is_missing: string }> = [];

    // Check for vague language
    this.detectVagueLanguage(specMarkdown, vagueTermsFound);

    // Check section completeness
    const sectionScores = this.calculateSectionScores(specMarkdown);

    // Check for common issues
    this.checkCommonIssues(specMarkdown, errors, warnings, suggestions);

    // Check for missing critical sections
    this.checkMissingSections(specMarkdown, missingDetails);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(sectionScores, vagueTermsFound, errors);

    // Determine if quality gate passed
    const passedQualityGate = this.checkQualityGate(overallScore, errors, vagueTermsFound);

    // Get required fixes
    const requiredFixes = this.getRequiredFixes(errors, vagueTermsFound);

    return {
      overallScore,
      sectionScores,
      errors,
      warnings,
      suggestions,
      vagueTermsFound,
      missingDetails,
      passedQualityGate,
      requiredFixes,
    };
  }

  private detectVagueLanguage(
    content: string,
    vagueTermsFound: Array<{ term: string; location: string; suggestion: string }>
  ): void {
    const lines = content.split('\n');

    this.vagueTerms.forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      lines.forEach((line, lineIndex) => {
        if (regex.test(line)) {
          vagueTermsFound.push({
            term,
            location: `Line ${lineIndex + 1}`,
            suggestion: this.getSuggestionForVagueTerm(term),
          });
        }
      });
    });
  }

  private getSuggestionForVagueTerm(term: string): string {
    const suggestions: Record<string, string> = {
      'TBD': 'Provide specific information',
      'TODO': 'Complete this item or remove it',
      'maybe': 'Make a definitive decision',
      'might': 'Be explicit about the requirement',
      'could': 'Specify if it will or will not be included',
      'approximately': 'Provide exact numbers',
      'roughly': 'Provide exact numbers',
      'some': 'Specify the exact number or list',
      'various': 'List the specific items',
      'etc': 'Complete the list explicitly',
    };

    return suggestions[term.toLowerCase()] || 'Be more specific';
  }

  private calculateSectionScores(content: string): Record<string, number> {
    const scores: Record<string, number> = {};

    // Check each of the 18 sections
    for (let i = 1; i <= 18; i++) {
      const sectionRegex = new RegExp(`## ${i}\\. `, 'i');
      const hasSection = sectionRegex.test(content);

      if (hasSection) {
        // Extract section content
        const sectionMatch = content.match(new RegExp(`## ${i}\\. .*?(?=## ${i + 1}\\. |$)`, 'is'));
        const sectionContent = sectionMatch ? sectionMatch[0] : '';
        const wordCount = sectionContent.split(/\s+/).length;

        // Score based on content length
        if (wordCount > 200) scores[`section${i}`] = 100;
        else if (wordCount > 100) scores[`section${i}`] = 80;
        else if (wordCount > 50) scores[`section${i}`] = 60;
        else scores[`section${i}`] = 40;
      } else {
        scores[`section${i}`] = 0;
      }
    }

    return scores;
  }

  private checkCommonIssues(
    content: string,
    errors: Array<{ section: string; field: string; message: string; severity: string }>,
    warnings: Array<{ section: string; field: string; message: string }>,
    suggestions: Array<{ section: string; field: string; message: string }>
  ): void {
    // Check for placeholders
    if (content.includes('Not specified') || content.includes('Not defined')) {
      warnings.push({
        section: 'General',
        field: 'completeness',
        message: 'Contains "Not specified" or "Not defined" placeholders',
      });
    }

    // Check for empty sections
    const emptySectionRegex = /##\s+\d+\.\s+.*?\n\s*\n##/gs;
    if (emptySectionRegex.test(content)) {
      warnings.push({
        section: 'General',
        field: 'sections',
        message: 'Some sections appear to be empty or minimal',
      });
    }

    // Check minimum length
    if (content.length < 10000) {
      warnings.push({
        section: 'General',
        field: 'length',
        message: 'Specification is shorter than recommended (< 10,000 characters)',
      });
    }

    // Suggest improvements
    if (!content.includes('```')) {
      suggestions.push({
        section: 'General',
        field: 'formatting',
        message: 'Consider adding code examples or API definitions',
      });
    }
  }

  private checkMissingSections(
    content: string,
    missingDetails: Array<{ section: string; what_is_missing: string }>
  ): void {
    const requiredSections = [
      '1. Executive Summary',
      '2. Non-Negotiables',
      '7. Functional Requirements',
      '8. Non-Functional Requirements',
      '10. System Architecture',
    ];

    requiredSections.forEach((section) => {
      if (!content.includes(section)) {
        missingDetails.push({
          section,
          what_is_missing: 'Entire section is missing',
        });
      }
    });
  }

  private calculateOverallScore(
    sectionScores: Record<string, number>,
    vagueTermsFound: Array<any>,
    errors: Array<any>
  ): number {
    // Average section scores
    const scores = Object.values(sectionScores);
    const avgSectionScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Penalty for vague terms (1 point per term, max 20 points)
    const vaguePenalty = Math.min(vagueTermsFound.length, 20);

    // Penalty for errors (5 points per error, max 30 points)
    const errorPenalty = Math.min(errors.length * 5, 30);

    // Final score
    const finalScore = Math.max(0, avgSectionScore - vaguePenalty - errorPenalty);

    return Math.round(finalScore);
  }

  private checkQualityGate(
    overallScore: number,
    errors: Array<any>,
    vagueTermsFound: Array<any>
  ): boolean {
    // Quality gate requirements:
    // 1. Overall score >= 80%
    // 2. No critical errors
    // 3. Fewer than 10 vague terms

    const criticalErrors = errors.filter(e => e.severity === 'critical');

    return (
      overallScore >= 80 &&
      criticalErrors.length === 0 &&
      vagueTermsFound.length < 10
    );
  }

  private getRequiredFixes(
    errors: Array<any>,
    vagueTermsFound: Array<any>
  ): string[] {
    const fixes: string[] = [];

    if (errors.length > 0) {
      fixes.push(`Fix ${errors.length} validation error(s)`);
    }

    if (vagueTermsFound.length >= 10) {
      fixes.push(`Remove or clarify ${vagueTermsFound.length} vague terms`);
    }

    return fixes;
  }
}
