import { DependencyRisk, ToolRecommendations } from '../../../shared/types/project';

/**
 * Dependency Analyzer Service (v0.7)
 * Analyzes NPM packages for risk factors and provides mitigation strategies
 */
export class DependencyAnalyzer {
  /**
   * Analyze all recommended dependencies
   */
  async analyzeDependencies(tools: ToolRecommendations): Promise<DependencyRisk[]> {
    const risks: DependencyRisk[] = [];

    // Analyze backend packages
    if (tools.backend) {
      for (const pkg of tools.backend) {
        const risk = this.analyzePackage(pkg.name, 'backend');
        if (risk && risk.riskLevel !== 'low') {
          risks.push(risk);
        }
      }
    }

    // Analyze frontend packages
    if (tools.frontend) {
      for (const pkg of tools.frontend) {
        const risk = this.analyzePackage(pkg.name, 'frontend');
        if (risk && risk.riskLevel !== 'low') {
          risks.push(risk);
        }
      }
    }

    // Analyze dev dependencies
    if (tools.devDependencies) {
      for (const pkg of tools.devDependencies) {
        const risk = this.analyzePackage(pkg.name, 'dev');
        if (risk && risk.riskLevel !== 'low') {
          risks.push(risk);
        }
      }
    }

    return risks;
  }

  /**
   * Analyze individual package
   */
  private analyzePackage(packageName: string, context: 'backend' | 'frontend' | 'dev'): DependencyRisk | null {
    const riskFactors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let category: 'security' | 'maintenance' | 'performance' | 'compatibility' | 'licensing' = 'maintenance';

    // Security-critical packages
    if (this.isSecurityCritical(packageName)) {
      riskLevel = 'medium';
      category = 'security';
      riskFactors.push('Security-critical package - vulnerabilities have high impact');
      riskFactors.push('Must keep updated with security patches');
    }

    // Authentication packages
    if (this.isAuthPackage(packageName)) {
      riskLevel = 'medium';
      category = 'security';
      riskFactors.push('Authentication critical - must stay current');
      riskFactors.push('Breaking changes can affect user access');
    }

    // Database drivers
    if (this.isDatabaseDriver(packageName)) {
      riskLevel = 'medium';
      category = 'compatibility';
      riskFactors.push('Database driver - breaking changes possible');
      riskFactors.push('Version must match database version');
    }

    // Large bundle size packages
    if (context === 'frontend' && this.isLargePackage(packageName)) {
      riskFactors.push('Large bundle size - impacts page load performance');
      riskLevel = riskLevel === 'low' ? 'low' : riskLevel;
      category = 'performance';
    }

    // Known problematic packages
    if (this.hasKnownIssues(packageName)) {
      riskLevel = 'high';
      category = 'maintenance';
      riskFactors.push('Package has history of breaking changes');
      riskFactors.push('Check changelogs carefully before upgrading');
    }

    // Return null for low-risk packages (don't clutter the report)
    if (riskLevel === 'low' && riskFactors.length === 0) {
      return null;
    }

    return {
      packageName,
      riskLevel,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['No significant risk factors identified'],
      mitigation: this.getMitigationStrategy(packageName, riskLevel, category),
      alternatives: this.getAlternatives(packageName),
      category,
    };
  }

  private isSecurityCritical(pkg: string): boolean {
    const critical = ['bcrypt', 'bcryptjs', 'crypto', 'helmet', 'cors', 'express-validator'];
    return critical.some(c => pkg.toLowerCase().includes(c));
  }

  private isAuthPackage(pkg: string): boolean {
    const auth = ['jsonwebtoken', 'passport', 'jose', 'iron-session', 'next-auth'];
    return auth.some(a => pkg.toLowerCase().includes(a));
  }

  private isDatabaseDriver(pkg: string): boolean {
    const drivers = ['pg', 'mysql', 'mongodb', 'redis', '@prisma/client'];
    return drivers.some(d => pkg.toLowerCase().includes(d));
  }

  private isLargePackage(pkg: string): boolean {
    const large = ['moment', 'lodash', '@material-ui'];
    return large.some(l => pkg.toLowerCase().includes(l));
  }

  private hasKnownIssues(pkg: string): boolean {
    // Packages with historical breaking change issues
    const problematic = ['node-sass'];
    return problematic.some(p => pkg.toLowerCase().includes(p));
  }

  private getMitigationStrategy(pkg: string, level: string, category: string): string {
    if (category === 'security') {
      return 'Pin major version, use Dependabot/Renovate for automated security updates, audit regularly with npm audit';
    } else if (category === 'maintenance') {
      return 'Read release notes before upgrading, test thoroughly, consider version pinning';
    } else if (category === 'performance') {
      return 'Use code splitting, lazy loading, or alternative lighter packages where possible';
    } else if (category === 'compatibility') {
      return 'Ensure version compatibility with your stack, test migrations in staging environment';
    } else {
      return 'Monitor for updates, review license compatibility with your project';
    }
  }

  private getAlternatives(pkg: string): string[] | undefined {
    const alternatives: Record<string, string[]> = {
      'moment': ['date-fns', 'dayjs', 'luxon'],
      'lodash': ['lodash-es (tree-shakeable)', 'ramda', 'native JS methods'],
      'jsonwebtoken': ['jose', 'paseto'],
      'node-sass': ['sass (Dart Sass)', 'postcss'],
      'axios': ['fetch API', 'ky', 'got'],
      'bcrypt': ['bcryptjs (pure JS)', 'argon2'],
    };

    for (const [key, alts] of Object.entries(alternatives)) {
      if (pkg.toLowerCase().includes(key.toLowerCase())) {
        return alts;
      }
    }

    return undefined;
  }
}
