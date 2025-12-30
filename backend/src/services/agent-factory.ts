import { ProjectSummary, ResearchResult } from '../../../shared/types/project';

export interface AgentDefinition {
  name: string;
  role: string;
  responsibilities: string[];
  skills: string[];
  workloadPercentage: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
}

export interface AgentTeam {
  agents: AgentDefinition[];
  totalAgents: number;
  estimatedTotalHours: number;
  recommendedSequence: string[];
}

/**
 * AgentFactory - Automatically generates optimal agent team for a project
 * Based on research results, tech stack, and project complexity
 */
export class AgentFactory {
  /**
   * Generate agent team based on project analysis
   */
  generateAgentTeam(
    parsedData: ProjectSummary,
    researchResult: ResearchResult
  ): AgentTeam {
    console.log('[AgentFactory] Generating agent team for:', parsedData.projectName);

    const agents: AgentDefinition[] = [];

    // Always need a Planning Agent
    agents.push(this.createPlanningAgent(parsedData, researchResult));

    // Backend agent if backend tech stack exists
    if (this.needsBackendAgent(researchResult)) {
      agents.push(this.createBackendAgent(parsedData, researchResult));
    }

    // Frontend agent if frontend tech stack exists
    if (this.needsFrontendAgent(researchResult)) {
      agents.push(this.createFrontendAgent(parsedData, researchResult));
    }

    // Database agent for complex data requirements
    if (this.needsDatabaseAgent(researchResult)) {
      agents.push(this.createDatabaseAgent(parsedData, researchResult));
    }

    // DevOps agent for deployment and infrastructure
    if (this.needsDevOpsAgent(parsedData, researchResult)) {
      agents.push(this.createDevOpsAgent(parsedData, researchResult));
    }

    // QA/Testing agent
    agents.push(this.createQAAgent(parsedData, researchResult));

    // Calculate totals
    const totalAgents = agents.length;
    const estimatedTotalHours = agents.reduce((sum, a) => sum + a.estimatedHours, 0);

    // Determine execution sequence
    const recommendedSequence = this.determineExecutionSequence(agents);

    console.log('[AgentFactory] Team generated:', {
      totalAgents,
      estimatedTotalHours,
      agents: agents.map(a => a.name)
    });

    return {
      agents,
      totalAgents,
      estimatedTotalHours,
      recommendedSequence
    };
  }

  /**
   * Create Planning Agent
   */
  private createPlanningAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): AgentDefinition {
    const complexity = research.estimatedComplexity;
    const featureCount = research.requiredFeatures.length;

    return {
      name: 'Planning Agent',
      role: 'Project Architect & Coordinator',
      responsibilities: [
        'Create detailed project architecture',
        'Define API contracts and data schemas',
        'Break down features into development tasks',
        'Coordinate between other agents',
        'Review and validate final implementation'
      ],
      skills: [
        'System Architecture',
        'API Design',
        'Project Management',
        'Technical Documentation'
      ],
      workloadPercentage: 15,
      priority: 'critical',
      estimatedHours: complexity === 'high' ? 20 : complexity === 'medium' ? 12 : 8
    };
  }

  /**
   * Create Backend Agent
   */
  private createBackendAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): AgentDefinition {
    const backendFramework = research.recommendedTechStack.backend.framework;
    const featureCount = research.requiredFeatures.length;
    const hasAuth = research.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') ||
      f.name.toLowerCase().includes('login')
    );
    const hasRealtime = research.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('real-time') ||
      f.name.toLowerCase().includes('websocket')
    );

    const backendHours = research.requiredFeatures
      .filter(f => !f.name.toLowerCase().includes('ui') && !f.name.toLowerCase().includes('frontend'))
      .reduce((sum, f) => sum + f.estimatedHours, 0);

    const responsibilities = [
      `Implement ${backendFramework} server`,
      'Create RESTful API endpoints',
      'Set up database models and migrations',
      'Implement business logic and services'
    ];

    if (hasAuth) responsibilities.push('Implement authentication & authorization');
    if (hasRealtime) responsibilities.push('Set up WebSocket/real-time communication');

    return {
      name: 'Backend Agent',
      role: 'Backend Infrastructure Engineer',
      responsibilities,
      skills: [
        backendFramework,
        research.recommendedTechStack.database.type,
        'API Development',
        'Database Design',
        hasAuth ? 'Authentication/JWT' : 'Security Best Practices',
        hasRealtime ? 'WebSocket/SSE' : 'HTTP/REST'
      ],
      workloadPercentage: 40,
      priority: 'critical',
      estimatedHours: backendHours || featureCount * 8
    };
  }

  /**
   * Create Frontend Agent
   */
  private createFrontendAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): AgentDefinition {
    const frontendFramework = research.recommendedTechStack.frontend.framework;
    const featureCount = research.requiredFeatures.length;

    const frontendHours = research.requiredFeatures
      .filter(f =>
        f.name.toLowerCase().includes('ui') ||
        f.name.toLowerCase().includes('frontend') ||
        f.name.toLowerCase().includes('interface') ||
        f.name.toLowerCase().includes('display')
      )
      .reduce((sum, f) => sum + f.estimatedHours, 0);

    return {
      name: 'Frontend Agent',
      role: 'UI/UX Implementation Specialist',
      responsibilities: [
        `Build ${frontendFramework} application`,
        'Create responsive UI components',
        'Implement state management',
        'Integrate with backend API',
        'Ensure accessibility standards (WCAG AA)',
        'Optimize performance and bundle size'
      ],
      skills: [
        frontendFramework,
        'React/TypeScript',
        'CSS/Tailwind',
        'State Management',
        'API Integration',
        'Responsive Design'
      ],
      workloadPercentage: 35,
      priority: 'high',
      estimatedHours: frontendHours || featureCount * 6
    };
  }

  /**
   * Create Database Agent
   */
  private createDatabaseAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): AgentDefinition {
    const dbType = research.recommendedTechStack.database.type;

    return {
      name: 'Database Agent',
      role: 'Database Architecture Specialist',
      responsibilities: [
        `Design ${dbType} schema`,
        'Create database migrations',
        'Optimize queries and indexes',
        'Set up data validation and constraints',
        'Design backup and recovery strategies'
      ],
      skills: [
        dbType,
        'Schema Design',
        'Query Optimization',
        'Data Modeling',
        'Migration Management'
      ],
      workloadPercentage: 15,
      priority: 'high',
      estimatedHours: research.estimatedComplexity === 'high' ? 16 : 12
    };
  }

  /**
   * Create DevOps Agent
   */
  private createDevOpsAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): AgentDefinition {
    return {
      name: 'DevOps Agent',
      role: 'Infrastructure & Deployment Engineer',
      responsibilities: [
        'Set up CI/CD pipeline',
        'Configure production environment',
        'Implement monitoring and logging',
        'Set up database backups',
        'Create deployment documentation'
      ],
      skills: [
        'Docker/Containerization',
        'CI/CD (GitHub Actions/GitLab)',
        'Cloud Platforms (AWS/Vercel/Railway)',
        'Monitoring (Sentry/DataDog)',
        'Infrastructure as Code'
      ],
      workloadPercentage: 10,
      priority: 'medium',
      estimatedHours: 12
    };
  }

  /**
   * Create QA/Testing Agent
   */
  private createQAAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): AgentDefinition {
    const featureCount = research.requiredFeatures.length;

    return {
      name: 'QA Agent',
      role: 'Quality Assurance & Testing Specialist',
      responsibilities: [
        'Write unit tests for backend logic',
        'Create integration tests for API endpoints',
        'Implement frontend component tests',
        'Set up end-to-end testing',
        'Ensure >80% code coverage',
        'Validate accessibility compliance'
      ],
      skills: [
        'Jest/Vitest',
        'React Testing Library',
        'Cypress/Playwright (E2E)',
        'Test-Driven Development',
        'API Testing (Supertest)'
      ],
      workloadPercentage: 15,
      priority: 'high',
      estimatedHours: featureCount * 2
    };
  }

  /**
   * Determine if backend agent is needed
   */
  private needsBackendAgent(research: ResearchResult): boolean {
    return !!research.recommendedTechStack.backend;
  }

  /**
   * Determine if frontend agent is needed
   */
  private needsFrontendAgent(research: ResearchResult): boolean {
    return !!research.recommendedTechStack.frontend;
  }

  /**
   * Determine if dedicated database agent is needed
   */
  private needsDatabaseAgent(research: ResearchResult): boolean {
    // Need database agent if:
    // - Complex data requirements
    // - High complexity project
    // - More than 5 features with data storage
    const complexity = research.estimatedComplexity;
    const dataFeatures = research.requiredFeatures.filter(f =>
      f.name.toLowerCase().includes('data') ||
      f.name.toLowerCase().includes('database') ||
      f.name.toLowerCase().includes('storage') ||
      f.name.toLowerCase().includes('crud')
    );

    return complexity === 'high' || dataFeatures.length >= 3;
  }

  /**
   * Determine if DevOps agent is needed
   */
  private needsDevOpsAgent(
    data: ProjectSummary,
    research: ResearchResult
  ): boolean {
    // Need DevOps if:
    // - Not explicitly an MVP/prototype
    // - Medium or high complexity
    // - Mentions production/deployment
    const description = data.description?.toLowerCase() || '';
    const complexity = research.estimatedComplexity;

    const isMVP = description.includes('mvp') || description.includes('prototype');
    const needsProduction = description.includes('production') ||
                           description.includes('deploy') ||
                           complexity === 'high';

    return !isMVP && needsProduction;
  }

  /**
   * Determine optimal execution sequence
   */
  private determineExecutionSequence(agents: AgentDefinition[]): string[] {
    const sequence: string[] = [];

    // 1. Planning always first
    sequence.push('Planning Agent');

    // 2. Database schema design
    if (agents.some(a => a.name === 'Database Agent')) {
      sequence.push('Database Agent');
    }

    // 3. Backend implementation
    if (agents.some(a => a.name === 'Backend Agent')) {
      sequence.push('Backend Agent');
    }

    // 4. Frontend implementation (parallel with backend if possible)
    if (agents.some(a => a.name === 'Frontend Agent')) {
      sequence.push('Frontend Agent');
    }

    // 5. QA/Testing
    sequence.push('QA Agent');

    // 6. DevOps/Deployment (if exists)
    if (agents.some(a => a.name === 'DevOps Agent')) {
      sequence.push('DevOps Agent');
    }

    return sequence;
  }
}
