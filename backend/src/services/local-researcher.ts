import { ProjectSummary, ResearchResult } from '../../../shared/types/project';

/**
 * LocalResearcher - Fallback analyzer for development/testing
 * Uses heuristics and rules to generate realistic analysis without API calls
 * Perfect for development when API key is not configured
 */
export class LocalResearcher {
  /**
   * Analyze project requirements using local heuristics
   */
  async analyzeProject(parsedData: ProjectSummary): Promise<ResearchResult> {
    console.log('[LocalResearcher] Using local analysis (no API key required)');
    console.log('[LocalResearcher] Analyzing:', parsedData.projectName);

    // Generate features based on provided data
    const requiredFeatures = this.generateFeatures(parsedData);

    // Generate tech stack recommendations
    const recommendedTechStack = this.recommendTechStack(parsedData);

    // Determine architecture pattern
    const architecture = this.determineArchitecture(parsedData);

    // Estimate complexity
    const estimatedComplexity = this.estimateComplexity(parsedData);

    // Estimate timeline
    const estimatedTimeline = this.estimateTimeline(parsedData, requiredFeatures);

    console.log('[LocalResearcher] Analysis complete:', {
      features: requiredFeatures.length,
      complexity: estimatedComplexity,
      timeline: estimatedTimeline
    });

    return {
      requiredFeatures,
      recommendedTechStack,
      architecture,
      estimatedComplexity,
      estimatedTimeline
    };
  }

  /**
   * Generate feature breakdown from project summary
   */
  private generateFeatures(data: ProjectSummary) {
    const features: any[] = [];

    // Add features from the provided list
    if (data.features && data.features.length > 0) {
      data.features.forEach((feature, index) => {
        features.push({
          name: feature,
          priority: this.inferPriority(feature, index),
          complexity: this.inferComplexity(feature),
          estimatedHours: this.estimateHours(feature)
        });
      });
    }

    // Add implied features based on description
    const description = data.description?.toLowerCase() || '';

    // Authentication implied
    if (description.includes('user') || description.includes('login') || description.includes('auth')) {
      if (!features.some(f => f.name.toLowerCase().includes('auth'))) {
        features.push({
          name: 'User Authentication & Authorization',
          priority: 'critical',
          complexity: 'medium',
          estimatedHours: 16
        });
      }
    }

    // Database/Storage implied
    if (description.includes('store') || description.includes('save') || description.includes('data')) {
      if (!features.some(f => f.name.toLowerCase().includes('database') || f.name.toLowerCase().includes('storage'))) {
        features.push({
          name: 'Data Persistence Layer',
          priority: 'critical',
          complexity: 'medium',
          estimatedHours: 12
        });
      }
    }

    // API implied
    if (description.includes('api') || description.includes('backend')) {
      if (!features.some(f => f.name.toLowerCase().includes('api'))) {
        features.push({
          name: 'RESTful API Endpoints',
          priority: 'high',
          complexity: 'medium',
          estimatedHours: 20
        });
      }
    }

    return features;
  }

  /**
   * Infer priority based on feature name and position
   */
  private inferPriority(feature: string, index: number): string {
    const lower = feature.toLowerCase();

    // Critical features
    if (lower.includes('auth') || lower.includes('security') || lower.includes('login')) {
      return 'critical';
    }
    if (lower.includes('core') || lower.includes('essential')) {
      return 'critical';
    }

    // High priority
    if (index < 2) return 'high'; // First features are usually important
    if (lower.includes('crud') || lower.includes('database') || lower.includes('api')) {
      return 'high';
    }

    // Medium priority
    if (lower.includes('ui') || lower.includes('interface') || lower.includes('display')) {
      return 'medium';
    }

    // Low priority (nice-to-have)
    if (lower.includes('optional') || lower.includes('future') || lower.includes('analytics')) {
      return 'low';
    }

    return 'medium'; // Default
  }

  /**
   * Infer complexity based on feature description
   */
  private inferComplexity(feature: string): string {
    const lower = feature.toLowerCase();

    // High complexity indicators
    if (lower.includes('real-time') || lower.includes('websocket') || lower.includes('streaming')) {
      return 'high';
    }
    if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine learning')) {
      return 'high';
    }
    if (lower.includes('payment') || lower.includes('billing')) {
      return 'high';
    }

    // Low complexity indicators
    if (lower.includes('display') || lower.includes('view') || lower.includes('show')) {
      return 'low';
    }
    if (lower.includes('simple') || lower.includes('basic')) {
      return 'low';
    }

    return 'medium'; // Default
  }

  /**
   * Estimate hours for a feature
   */
  private estimateHours(feature: string): number {
    const complexity = this.inferComplexity(feature);
    const lower = feature.toLowerCase();

    // Base estimates by complexity
    let hours = complexity === 'high' ? 24 : complexity === 'low' ? 8 : 16;

    // Adjust based on keywords
    if (lower.includes('auth')) hours = 16;
    if (lower.includes('crud')) hours = 12;
    if (lower.includes('ui') || lower.includes('interface')) hours += 8;
    if (lower.includes('test')) hours += 4;

    return hours;
  }

  /**
   * Recommend tech stack based on project requirements
   */
  private recommendTechStack(data: ProjectSummary) {
    // Use provided tech stack as hints
    const providedBackend = data.techStack?.backend || [];
    const providedFrontend = data.techStack?.frontend || [];
    const providedDatabase = data.techStack?.database;

    // Backend recommendation
    let backendFramework = 'Express.js with TypeScript';
    let backendReasoning = 'Fast development, strong ecosystem, TypeScript for type safety';

    if (providedBackend.some(t => t.toLowerCase().includes('node'))) {
      backendFramework = 'Express.js with TypeScript';
      backendReasoning = 'Matches stated preference for Node.js, excellent ecosystem';
    } else if (providedBackend.some(t => t.toLowerCase().includes('python'))) {
      backendFramework = 'FastAPI with Python';
      backendReasoning = 'Matches Python preference, excellent for APIs and async operations';
    } else if (providedBackend.some(t => t.toLowerCase().includes('go'))) {
      backendFramework = 'Go with Gin/Echo';
      backendReasoning = 'High performance, great concurrency, matches Go preference';
    }

    // Frontend recommendation
    let frontendFramework = 'Next.js 14 with App Router';
    let frontendReasoning = 'Server components, excellent DX, SEO-friendly, modern React';

    if (providedFrontend.some(t => t.toLowerCase().includes('next'))) {
      frontendFramework = 'Next.js 14 with App Router';
      frontendReasoning = 'Matches Next.js preference, latest features with App Router';
    } else if (providedFrontend.some(t => t.toLowerCase().includes('react'))) {
      frontendFramework = 'React with Vite';
      frontendReasoning = 'Fast build times, modern tooling, matches React preference';
    } else if (providedFrontend.some(t => t.toLowerCase().includes('vue'))) {
      frontendFramework = 'Vue 3 with Composition API';
      frontendReasoning = 'Matches Vue preference, modern Composition API, great DX';
    }

    // Database recommendation
    let databaseType = providedDatabase || 'PostgreSQL';
    let databaseReasoning = 'ACID compliance, excellent for structured data, scalable';

    if (providedDatabase) {
      const dbLower = providedDatabase.toLowerCase();
      if (dbLower.includes('postgres')) {
        databaseReasoning = 'Matches stated preference, robust relational database';
      } else if (dbLower.includes('mongo')) {
        databaseReasoning = 'Matches MongoDB preference, flexible schema, great for rapid development';
      } else if (dbLower.includes('mysql')) {
        databaseReasoning = 'Matches MySQL preference, widely supported, reliable';
      }
    }

    return {
      backend: {
        framework: backendFramework,
        reasoning: backendReasoning
      },
      frontend: {
        framework: frontendFramework,
        reasoning: frontendReasoning
      },
      database: {
        type: databaseType,
        reasoning: databaseReasoning
      }
    };
  }

  /**
   * Determine appropriate architecture pattern
   */
  private determineArchitecture(data: ProjectSummary) {
    const teamSize = data.teamSize?.toLowerCase() || '';
    const description = data.description?.toLowerCase() || '';

    // Check for microservices indicators
    if (description.includes('microservice') || description.includes('distributed')) {
      return {
        pattern: 'Microservices',
        reasoning: 'Project explicitly mentions distributed architecture, suitable for scalability'
      };
    }

    // Check for serverless indicators
    if (description.includes('serverless') || description.includes('lambda')) {
      return {
        pattern: 'Serverless',
        reasoning: 'Serverless architecture reduces operational overhead and scales automatically'
      };
    }

    // Small team or MVP - recommend monolith
    if (teamSize.includes('1') || teamSize.includes('solo') || description.includes('mvp')) {
      return {
        pattern: 'Monolithic (for MVP)',
        reasoning: 'Simpler deployment, faster iteration, ideal for small team and MVP stage'
      };
    }

    // Default to monolith
    return {
      pattern: 'Monolithic',
      reasoning: 'Simpler architecture, easier to develop and deploy, suitable for initial launch'
    };
  }

  /**
   * Estimate overall project complexity
   */
  private estimateComplexity(data: ProjectSummary): string {
    let complexityScore = 0;

    // Features count
    const featureCount = data.features?.length || 0;
    if (featureCount > 10) complexityScore += 2;
    else if (featureCount > 5) complexityScore += 1;

    // Check for complex features
    const description = data.description?.toLowerCase() || '';
    const allFeatures = (data.features || []).join(' ').toLowerCase();

    if (description.includes('real-time') || allFeatures.includes('real-time')) complexityScore += 2;
    if (description.includes('ai') || description.includes('ml')) complexityScore += 2;
    if (description.includes('payment') || description.includes('billing')) complexityScore += 1;
    if (description.includes('auth') || allFeatures.includes('auth')) complexityScore += 1;

    // Timeline consideration
    const timeline = data.timeline?.toLowerCase() || '';
    if (timeline.includes('week') && parseInt(timeline) > 12) complexityScore += 1;
    if (timeline.includes('month') && parseInt(timeline) > 3) complexityScore += 1;

    if (complexityScore >= 4) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Estimate timeline based on features and complexity
   */
  private estimateTimeline(data: ProjectSummary, features: any[]): string {
    // Use provided timeline if available
    if (data.timeline) {
      return data.timeline;
    }

    // Calculate based on features
    const totalHours = features.reduce((sum, f) => sum + f.estimatedHours, 0);
    const teamSize = data.teamSize?.match(/\d+/)?.[0] || '1';
    const weeks = Math.ceil(totalHours / (parseInt(teamSize) * 40)); // 40 hours per week per person

    if (weeks <= 2) return '1-2 weeks';
    if (weeks <= 4) return '3-4 weeks';
    if (weeks <= 8) return '6-8 weeks';
    if (weeks <= 12) return '2-3 months';
    return '3+ months';
  }
}
