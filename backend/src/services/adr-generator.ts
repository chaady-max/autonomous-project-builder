import Anthropic from '@anthropic-ai/sdk';
import {
  ProjectSummary,
  ResearchResult,
  InputEnrichment,
  ClarificationQA,
  ADR,
} from '../../../shared/types/project';

/**
 * ADR Generator Service (v0.7)
 * Generates 5-8 comprehensive Architecture Decision Records
 * Supports dual-mode: Claude API or local heuristics
 */
export class ADRGenerator {
  private client: Anthropic | null;
  private useLocalMode: boolean;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'sk-ant-api-key-placeholder' || !apiKey.startsWith('sk-ant-')) {
      console.log('[ADRGenerator] Using local ADR generation');
      this.useLocalMode = true;
      this.client = null;
    } else {
      console.log('[ADRGenerator] Using Claude for ADR generation');
      this.useLocalMode = false;
      this.client = new Anthropic({ apiKey });
    }
  }

  /**
   * Generate 5-8 comprehensive ADRs
   */
  async generateADRs(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment,
    clarificationQA?: ClarificationQA[]
  ): Promise<ADR[]> {
    if (this.useLocalMode) {
      return this.generateADRsLocal(parsedData, researchResult, enrichment, clarificationQA);
    }

    return this.generateADRsWithClaude(parsedData, researchResult, enrichment, clarificationQA);
  }

  /**
   * Local mode: Rule-based ADR generation
   */
  private generateADRsLocal(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment,
    clarificationQA?: ClarificationQA[]
  ): ADR[] {
    const adrs: ADR[] = [];
    const now = new Date().toISOString();

    // ADR 1: Technology Stack Selection
    adrs.push({
      id: 1,
      title: 'Technology Stack Selection',
      status: 'accepted',
      context: `Project ${parsedData.projectName} requires a technology stack that supports ${parsedData.features?.length || 0} core features with ${researchResult.estimatedComplexity} complexity.`,
      decision: `Backend: ${researchResult.recommendedTechStack.backend?.framework || 'Not specified'}
Frontend: ${researchResult.recommendedTechStack.frontend?.framework || 'Not specified'}
Database: ${researchResult.recommendedTechStack.database?.type || 'Not specified'}`,
      consequences: [
        'Development team must have or acquire expertise in chosen technologies',
        'Ecosystem maturity provides strong community support and libraries',
        'Type safety (if TypeScript) reduces runtime errors and improves maintainability',
        'Migration to different stack would be costly in the future',
      ],
      alternatives: [
        {
          name: 'MERN Stack (MongoDB, Express, React, Node)',
          pros: ['JavaScript everywhere', 'Large community', 'Flexible NoSQL'],
          cons: ['NoSQL may not fit relational data', 'Less type safety without TypeScript'],
        },
        {
          name: 'Django + React',
          pros: ['Batteries included', 'Admin panel', 'ORM'],
          cons: ['Python learning curve', 'Slower than Node for real-time'],
        },
      ],
      dateCreated: now,
    });

    // ADR 2: Architecture Pattern
    adrs.push({
      id: 2,
      title: `Architecture Pattern: ${researchResult.architecture.pattern}`,
      status: 'accepted',
      context: researchResult.architecture.reasoning,
      decision: `Implement ${researchResult.architecture.pattern} architecture${enrichment?.architectureStyle && enrichment.architectureStyle !== 'auto' ? ` (user preference: ${enrichment.architectureStyle})` : ''}.`,
      consequences: this.getArchitectureConsequences(researchResult.architecture.pattern),
      alternatives: this.getArchitectureAlternatives(researchResult.architecture.pattern),
      dateCreated: now,
    });

    // ADR 3: Authentication Strategy (if authentication feature exists)
    const hasAuth = researchResult.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') || f.name.toLowerCase().includes('login')
    );
    if (hasAuth) {
      adrs.push({
        id: 3,
        title: 'Authentication Strategy',
        status: 'accepted',
        context: `Application requires user authentication${enrichment?.nfrSecurity ? ` with ${enrichment.nfrSecurity.authenticationMethod || 'standard'} method` : ''}.`,
        decision: this.getAuthDecision(enrichment),
        consequences: [
          'User accounts provide personalization and security',
          'Session management adds complexity',
          'Password storage requires secure hashing (bcrypt/argon2)',
          'Must handle password reset flows',
          enrichment?.nfrSecurity?.authenticationMethod === 'two-factor' ? '2FA significantly improves security but adds friction' : '',
        ].filter(Boolean),
        alternatives: [
          {
            name: 'JWT Tokens',
            pros: ['Stateless', 'Scalable', 'Works across domains'],
            cons: ['Cannot invalidate before expiry', 'Token size larger than session ID'],
          },
          {
            name: 'Session Cookies',
            pros: ['Can invalidate immediately', 'Smaller size', 'Familiar pattern'],
            cons: ['Requires session storage', 'Not great for mobile apps'],
          },
        ],
        dateCreated: now,
      });
    }

    // ADR 4: Database Schema Design
    adrs.push({
      id: 4,
      title: 'Database Schema Design',
      status: 'accepted',
      context: `Application needs to store ${parsedData.features?.length || 'multiple'} types of data with ${enrichment?.nfrScalability ? `~${enrichment.nfrScalability.expectedUsers} users` : 'moderate scale'}.`,
      decision: `Use ${researchResult.recommendedTechStack.database?.type || 'relational database'} with normalized schema design.`,
      consequences: [
        'Normalized design reduces data redundancy',
        'Foreign keys maintain referential integrity',
        'Indexes improve query performance',
        'Schema migrations must be carefully managed',
        'Consider denormalization for high-read scenarios',
      ],
      alternatives: [
        {
          name: 'Denormalized Schema',
          pros: ['Faster reads', 'Simpler queries', 'Better for analytics'],
          cons: ['Data redundancy', 'Update complexity', 'Storage overhead'],
        },
      ],
      dateCreated: now,
    });

    // ADR 5: API Design Approach
    const apiFirst = enrichment?.approachPreference === 'api-first';
    adrs.push({
      id: 5,
      title: 'API Design Approach',
      status: 'accepted',
      context: `${apiFirst ? 'API-first development prioritizes backend completion before frontend.' : 'Balanced development approach with iterative frontend-backend integration.'}`,
      decision: `RESTful API with JSON responses${enrichment?.approachPreference ? ` (${enrichment.approachPreference} strategy)` : ''}.`,
      consequences: [
        'RESTful patterns are well-understood by most developers',
        'Easy to test with tools like Postman/Insomnia',
        'Versioning strategy needed for breaking changes',
        'Consider GraphQL for complex data requirements in future',
      ],
      alternatives: [
        {
          name: 'GraphQL',
          pros: ['Flexible queries', 'Single endpoint', 'Strong typing', 'Avoid over-fetching'],
          cons: ['Learning curve', 'Caching complexity', 'More backend setup'],
        },
        {
          name: 'gRPC',
          pros: ['High performance', 'Strong typing', 'Bi-directional streaming'],
          cons: ['Limited browser support', 'Requires protocol buffers', 'Smaller ecosystem'],
        },
      ],
      dateCreated: now,
    });

    // ADR 6: Frontend State Management
    if (researchResult.estimatedComplexity !== 'low') {
      adrs.push({
        id: 6,
        title: 'Frontend State Management',
        status: 'accepted',
        context: `Complex application with ${parsedData.features?.length || 'multiple'} features requires organized state management.`,
        decision: 'Use React Context API for global state, local state for component-specific data.',
        consequences: [
          'Context API is built-in, no additional dependencies',
          'Simpler than Redux for medium complexity',
          'May need to upgrade to Zustand/Redux for very complex state',
          'Performance considerations with frequent context updates',
        ],
        alternatives: [
          {
            name: 'Redux Toolkit',
            pros: ['Predictable state', 'DevTools', 'Large ecosystem', 'Best for complex apps'],
            cons: ['Boilerplate code', 'Learning curve', 'Overkill for simple apps'],
          },
          {
            name: 'Zustand',
            pros: ['Minimal boilerplate', 'Simple API', 'Good performance'],
            cons: ['Smaller community than Redux', 'Less middleware options'],
          },
        ],
        dateCreated: now,
      });
    }

    // ADR 7: Deployment Strategy
    adrs.push({
      id: 7,
      title: 'Deployment Strategy',
      status: 'accepted',
      context: `Application needs ${enrichment?.scalabilityTier || 'moderate'} scalability with ${enrichment?.budgetConstraint || 'reasonable'} budget constraints.`,
      decision: this.getDeploymentDecision(enrichment),
      consequences: this.getDeploymentConsequences(enrichment),
      alternatives: [
        {
          name: 'AWS ECS/Fargate',
          pros: ['Full control', 'Scales infinitely', 'Mature ecosystem'],
          cons: ['More complex setup', 'Higher operational overhead', 'Costlier than PaaS'],
        },
        {
          name: 'DigitalOcean App Platform',
          pros: ['Simple deployment', 'Affordable', 'Good DX'],
          cons: ['Less flexible than AWS', 'Smaller feature set'],
        },
      ],
      dateCreated: now,
    });

    // ADR 8: Testing Strategy
    adrs.push({
      id: 8,
      title: 'Testing Strategy',
      status: 'accepted',
      context: `${researchResult.estimatedComplexity} complexity project requires appropriate test coverage to ensure quality.`,
      decision: 'Implement unit tests for business logic, integration tests for API endpoints, E2E tests for critical user flows.',
      consequences: [
        'Unit tests provide fast feedback during development',
        'Integration tests catch API contract issues',
        'E2E tests ensure user flows work end-to-end',
        'Test maintenance overhead must be balanced with coverage',
        'Aim for 70-80% code coverage, 100% for critical paths',
      ],
      alternatives: [
        {
          name: 'Test-Driven Development (TDD)',
          pros: ['Better design', 'Higher coverage', 'Fewer bugs'],
          cons: ['Slower initial development', 'Requires discipline'],
        },
        {
          name: 'Manual Testing Only',
          pros: ['Faster initial development', 'No test code maintenance'],
          cons: ['Regression bugs', 'Slower long-term', 'Not scalable'],
        },
      ],
      dateCreated: now,
    });

    return adrs;
  }

  /**
   * Claude mode: AI-generated ADRs
   */
  private async generateADRsWithClaude(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment,
    clarificationQA?: ClarificationQA[]
  ): Promise<ADR[]> {
    console.log('[ADRGenerator] Generating ADRs with Claude...');

    const prompt = `You are a senior software architect creating Architecture Decision Records (ADRs) for a new project.

PROJECT DETAILS:
${JSON.stringify(parsedData, null, 2)}

RESEARCH RESULTS:
${JSON.stringify(researchResult, null, 2)}

${enrichment ? `ENRICHMENT DATA:
${JSON.stringify(enrichment, null, 2)}` : ''}

${clarificationQA ? `CLARIFICATION Q&A:
${JSON.stringify(clarificationQA, null, 2)}` : ''}

Generate 5-8 comprehensive Architecture Decision Records covering:
1. Technology Stack Selection (backend, frontend, database choices)
2. Architecture Pattern (monolith/microservices/etc and why)
3. Authentication Strategy (if user auth is needed)
4. Database Schema Design (normalized vs denormalized, relationships)
5. API Design Approach (REST/GraphQL/gRPC)
6. Frontend State Management (if complex app)
7. Deployment Strategy (hosting, CI/CD)
8. Testing Strategy (unit/integration/E2E)

For EACH ADR, provide:
- id: number (1-8)
- title: string (concise, descriptive)
- status: "accepted"
- context: string (why this decision is needed, 2-3 sentences)
- decision: string (what was decided, clear and specific)
- consequences: array of strings (3-5 trade-offs, both positive and negative)
- alternatives: array of objects with {name, pros[], cons[]} (2-3 alternatives considered)
- dateCreated: ISO timestamp

Return ONLY valid JSON array of ADR objects:
[{id: 1, title: "...", status: "accepted", context: "...", decision: "...", consequences: [...], alternatives: [{name: "...", pros: [...], cons: [...]}]}, ...]`;

    try {
      const response = await this.client!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

      // Parse JSON response
      let adrs: ADR[];
      try {
        adrs = JSON.parse(responseText.trim());
      } catch {
        const jsonMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (jsonMatch) {
          adrs = JSON.parse(jsonMatch[1]);
        } else {
          const arrayMatch = responseText.match(/\[[\s\S]*\]/);
          if (arrayMatch) {
            adrs = JSON.parse(arrayMatch[0]);
          } else {
            throw new Error('Could not parse ADRs from response');
          }
        }
      }

      console.log(`[ADRGenerator] Generated ${adrs.length} ADRs with Claude`);
      return adrs.slice(0, 8);

    } catch (error) {
      console.error('[ADRGenerator] Claude API error:', error);
      console.log('[ADRGenerator] Falling back to local ADR generation');
      return this.generateADRsLocal(parsedData, researchResult, enrichment, clarificationQA);
    }
  }

  // Helper methods for local generation

  private getArchitectureConsequences(pattern: string): string[] {
    if (pattern.toLowerCase().includes('monolith')) {
      return [
        'Faster initial development and deployment',
        'Simpler operational complexity',
        'Easier to debug and test locally',
        'May become harder to scale team as codebase grows',
        'All components must scale together',
      ];
    } else if (pattern.toLowerCase().includes('microservice')) {
      return [
        'Independent scaling of services',
        'Team autonomy and parallel development',
        'Technology diversity possible',
        'Higher operational complexity (DevOps, monitoring)',
        'Network latency between services',
        'Distributed system challenges (eventual consistency, etc.)',
      ];
    } else {
      return [
        'Balanced approach to complexity and scalability',
        'Can evolve architecture as needs grow',
        'Moderate operational overhead',
      ];
    }
  }

  private getArchitectureAlternatives(currentPattern: string): any[] {
    const all = [
      {
        name: 'Monolithic',
        pros: ['Simple deployment', 'Easy local development', 'Lower ops cost'],
        cons: ['Hard to scale teams', 'Technology lock-in', 'Deploy entire app for small changes'],
      },
      {
        name: 'Microservices',
        pros: ['Independent scaling', 'Team autonomy', 'Technology flexibility'],
        cons: ['High complexity', 'DevOps overhead', 'Distributed system issues'],
      },
      {
        name: 'Modular Monolith',
        pros: ['Organized codebase', 'Can extract services later', 'Simpler than microservices'],
        cons: ['Still shares deployment', 'Requires discipline', 'Not true isolation'],
      },
    ];

    return all.filter(a => !currentPattern.toLowerCase().includes(a.name.toLowerCase()));
  }

  private getAuthDecision(enrichment?: InputEnrichment): string {
    if (!enrichment?.nfrSecurity) {
      return 'JWT-based authentication with bcrypt password hashing and secure token storage.';
    }

    const method = enrichment.nfrSecurity.authenticationMethod || 'email-password';
    const twoFactor = method === 'two-factor';

    return `${method.replace('-', ' ')} authentication${twoFactor ? ' with TOTP-based 2FA' : ''} using ${enrichment.nfrSecurity.encryptionAtRest ? 'encrypted' : 'hashed'} credentials.`;
  }

  private getDeploymentDecision(enrichment?: InputEnrichment): string {
    const tier = enrichment?.scalabilityTier || 'small';
    const budget = enrichment?.budgetConstraint || 'low';

    if (tier === 'small' && budget !== 'high') {
      return 'Deploy to Vercel (frontend) + Railway/Render (backend) for cost-effective hosting with good DX.';
    } else if (tier === 'enterprise' || budget === 'high') {
      return 'Deploy to AWS with ECS/Fargate for full control, scalability, and enterprise features.';
    } else {
      return 'Deploy to Vercel (frontend) + DigitalOcean App Platform (backend) for balanced cost and features.';
    }
  }

  private getDeploymentConsequences(enrichment?: InputEnrichment): string[] {
    const tier = enrichment?.scalabilityTier || 'small';

    if (tier === 'enterprise') {
      return [
        'Full control over infrastructure',
        'Unlimited scalability potential',
        'Requires dedicated DevOps expertise',
        'Higher cost but predictable at scale',
        'Comprehensive monitoring and logging',
      ];
    } else {
      return [
        'Simplified deployment process',
        'Built-in CI/CD pipelines',
        'Lower operational overhead',
        'May need migration if scale exceeds platform limits',
        'Cost-effective for target scale',
      ];
    }
  }
}
