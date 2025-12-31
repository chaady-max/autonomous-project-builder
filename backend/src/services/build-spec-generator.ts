import { ProjectSummary, ResearchResult, ADR, CostEstimate, DependencyRisk } from '../../../shared/types/project';
import { AgentTeam } from './agent-factory';
import { ToolRecommendations } from './tool-recommender';

export interface BuildSpecification {
  projectOverview: {
    name: string;
    description: string;
    complexity: string;
    estimatedTimeline: string;
    totalEstimatedHours: number;
  };
  technicalStack: {
    backend: string;
    frontend: string;
    database: string;
    architecture: string;
  };
  setupInstructions: {
    prerequisites: string[];
    environmentSetup: string[];
    dependencies: string[];
  };
  fileStructure: string;
  features: FeatureImplementationPlan[];
  agentTasks: AgentTaskBreakdown[];
  testingStrategy: TestingPlan;
  deploymentGuide: DeploymentInstructions;
  completeBuildDocument: string; // The comprehensive markdown document
}

interface FeatureImplementationPlan {
  name: string;
  priority: string;
  complexity: string;
  estimatedHours: number;
  tasks: string[];
  files: string[];
  dependencies: string[];
  acceptanceCriteria: string[];
}

interface AgentTaskBreakdown {
  agentName: string;
  phase: number;
  tasks: string[];
  deliverables: string[];
  estimatedHours: number;
}

interface TestingPlan {
  unitTests: string[];
  integrationTests: string[];
  e2eTests: string[];
  coverageTarget: string;
}

interface DeploymentInstructions {
  steps: string[];
  environmentVariables: string[];
  buildCommands: string[];
}

/**
 * BuildSpecGenerator - Creates comprehensive build specification
 * This generates a complete document that Claude can use to build the entire project
 */
export class BuildSpecGenerator {
  /**
   * Generate complete build specification (v0.7: with planning intelligence)
   */
  generateBuildSpec(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    agentTeam: AgentTeam,
    tools: ToolRecommendations,
    customInstructions: string = '',
    planningDetails?: {
      adrs: ADR[];
      diagrams: { c4Context?: string; c4Container?: string; erDiagram?: string; sequenceDiagrams?: string[] };
      costEstimate: CostEstimate;
      dependencyRisks: DependencyRisk[];
    }
  ): BuildSpecification {
    console.log('[BuildSpecGenerator] Creating build specification for:', parsedData.projectName);

    const projectOverview = this.createProjectOverview(parsedData, researchResult, agentTeam);
    const technicalStack = this.createTechnicalStack(researchResult);
    const setupInstructions = this.createSetupInstructions(researchResult, tools);
    const fileStructure = this.createFileStructure(researchResult);
    const features = this.createFeatureImplementationPlans(researchResult);
    const agentTasks = this.createAgentTaskBreakdowns(agentTeam, features);
    const testingStrategy = this.createTestingStrategy(researchResult);
    const deploymentGuide = this.createDeploymentGuide(researchResult);

    // Generate the complete build document
    const completeBuildDocument = this.generateCompleteBuildDocument({
      projectOverview,
      technicalStack,
      setupInstructions,
      fileStructure,
      features,
      agentTasks,
      testingStrategy,
      deploymentGuide,
      parsedData,
      researchResult,
      agentTeam,
      tools,
      customInstructions,
      planningDetails
    });

    console.log('[BuildSpecGenerator] Build specification complete');

    return {
      projectOverview,
      technicalStack,
      setupInstructions,
      fileStructure,
      features,
      agentTasks,
      testingStrategy,
      deploymentGuide,
      completeBuildDocument
    };
  }

  /**
   * Create project overview
   */
  private createProjectOverview(
    data: ProjectSummary,
    research: ResearchResult,
    team: AgentTeam
  ) {
    return {
      name: data.projectName,
      description: data.description || '',
      complexity: research.estimatedComplexity,
      estimatedTimeline: research.estimatedTimeline,
      totalEstimatedHours: team.estimatedTotalHours
    };
  }

  /**
   * Create technical stack summary
   */
  private createTechnicalStack(research: ResearchResult) {
    return {
      backend: research.recommendedTechStack.backend.framework,
      frontend: research.recommendedTechStack.frontend.framework,
      database: research.recommendedTechStack.database.type,
      architecture: research.architecture.pattern
    };
  }

  /**
   * Create setup instructions
   */
  private createSetupInstructions(research: ResearchResult, tools: ToolRecommendations) {
    const requiredTools = tools.npmPackages.filter(t => t.priority === 'required');

    return {
      prerequisites: [
        'Node.js 20+ and npm 9+',
        'Git',
        research.recommendedTechStack.database.type + ' database',
        'Code editor (VS Code recommended)'
      ],
      environmentSetup: [
        'Clone repository',
        'Copy .env.example to .env',
        'Configure database connection string',
        'Set up API keys (if required)'
      ],
      dependencies: requiredTools.map(t => t.installation)
    };
  }

  /**
   * Create file structure
   */
  private createFileStructure(research: ResearchResult) {
    const backend = research.recommendedTechStack.backend?.framework?.toLowerCase() || '';
    const frontend = research.recommendedTechStack.frontend?.framework?.toLowerCase() || '';

    let structure = `${research.architecture.pattern.includes('Monolithic') ? 'monorepo' : 'microservices'}/\n`;

    if (backend) {
      structure += `├── backend/\n`;
      structure += `│   ├── src/\n`;
      structure += `│   │   ├── index.ts\n`;
      structure += `│   │   ├── routes/\n`;
      structure += `│   │   ├── services/\n`;
      structure += `│   │   ├── models/\n`;
      structure += `│   │   └── utils/\n`;
      structure += `│   ├── prisma/\n│   │   └── schema.prisma\n`;
      structure += `│   ├── tests/\n`;
      structure += `│   ├── .env\n`;
      structure += `│   └── package.json\n`;
    }

    if (frontend) {
      structure += `├── frontend/\n`;
      structure += `│   ├── app/\n`;
      structure += `│   │   ├── layout.tsx\n`;
      structure += `│   │   ├── page.tsx\n`;
      structure += `│   │   └── globals.css\n`;
      structure += `│   ├── components/\n`;
      structure += `│   ├── lib/\n`;
      structure += `│   ├── tests/\n`;
      structure += `│   └── package.json\n`;
    }

    structure += `├── shared/\n│   └── types/\n`;
    structure += `├── docs/\n`;
    structure += `├── .gitignore\n`;
    structure += `└── README.md\n`;

    return structure;
  }

  /**
   * Create feature implementation plans
   */
  private createFeatureImplementationPlans(research: ResearchResult): FeatureImplementationPlan[] {
    return research.requiredFeatures.map(feature => {
      const tasks = this.generateTasksForFeature(feature.name, feature.complexity);
      const files = this.generateFilesForFeature(feature.name);
      const dependencies = this.generateDependenciesForFeature(feature.name);
      const acceptanceCriteria = this.generateAcceptanceCriteria(feature.name);

      return {
        name: feature.name,
        priority: feature.priority,
        complexity: feature.complexity,
        estimatedHours: feature.estimatedHours,
        tasks,
        files,
        dependencies,
        acceptanceCriteria
      };
    });
  }

  /**
   * Generate tasks for a specific feature
   */
  private generateTasksForFeature(featureName: string, complexity: string): string[] {
    const tasks: string[] = [];
    const lower = featureName.toLowerCase();

    // Common tasks
    tasks.push(`Define data schema for ${featureName}`);
    tasks.push(`Create database migrations`);

    // Backend tasks
    if (lower.includes('api') || lower.includes('crud') || lower.includes('auth')) {
      tasks.push(`Implement backend API routes for ${featureName}`);
      tasks.push(`Add request validation and error handling`);
      tasks.push(`Write unit tests for business logic`);
    }

    if (lower.includes('auth')) {
      tasks.push('Set up JWT token generation and validation');
      tasks.push('Implement password hashing with bcrypt');
      tasks.push('Create authentication middleware');
    }

    // Frontend tasks
    if (lower.includes('ui') || lower.includes('interface') || lower.includes('display')) {
      tasks.push(`Create React components for ${featureName}`);
      tasks.push(`Implement state management`);
      tasks.push(`Add form validation and error messages`);
      tasks.push(`Style components with Tailwind CSS`);
    }

    // Real-time features
    if (lower.includes('real-time') || lower.includes('websocket')) {
      tasks.push('Set up WebSocket server');
      tasks.push('Implement client-side WebSocket connection');
      tasks.push('Add reconnection logic');
    }

    // Testing
    tasks.push(`Write integration tests for ${featureName}`);
    tasks.push(`Test edge cases and error scenarios`);

    // Documentation
    tasks.push(`Document ${featureName} API endpoints`);
    tasks.push(`Add usage examples`);

    return tasks;
  }

  /**
   * Generate files needed for a feature
   */
  private generateFilesForFeature(featureName: string): string[] {
    const files: string[] = [];
    const lower = featureName.toLowerCase();
    const slug = featureName.toLowerCase().replace(/\s+/g, '-');

    // Backend files
    files.push(`backend/src/routes/${slug}.ts`);
    files.push(`backend/src/services/${slug}-service.ts`);
    files.push(`backend/src/models/${slug}.ts`);
    files.push(`backend/tests/${slug}.test.ts`);

    // Frontend files if UI-related
    if (lower.includes('ui') || lower.includes('interface')) {
      files.push(`frontend/app/${slug}/page.tsx`);
      files.push(`frontend/components/${slug}/Component.tsx`);
    }

    // Shared types
    files.push(`shared/types/${slug}.ts`);

    return files;
  }

  /**
   * Generate dependencies for a feature
   */
  private generateDependenciesForFeature(featureName: string): string[] {
    const deps: string[] = [];
    const lower = featureName.toLowerCase();

    if (lower.includes('auth')) {
      deps.push('Database schema must be defined');
      deps.push('User model must exist');
    }

    if (lower.includes('real-time')) {
      deps.push('WebSocket server infrastructure');
      deps.push('Authentication system (for secure connections)');
    }

    return deps;
  }

  /**
   * Generate acceptance criteria
   */
  private generateAcceptanceCriteria(featureName: string): string[] {
    const criteria: string[] = [];
    const lower = featureName.toLowerCase();

    criteria.push(`${featureName} functionality works as expected`);
    criteria.push('All tests passing with >80% coverage');
    criteria.push('Error handling works correctly');
    criteria.push('API responses match specification');

    if (lower.includes('ui') || lower.includes('interface')) {
      criteria.push('UI is responsive on mobile and desktop');
      criteria.push('Accessibility standards met (WCAG AA)');
    }

    if (lower.includes('auth')) {
      criteria.push('Passwords are hashed and never stored in plain text');
      criteria.push('JWT tokens expire after reasonable time');
      criteria.push('Invalid credentials return appropriate errors');
    }

    return criteria;
  }

  /**
   * Create agent task breakdowns
   */
  private createAgentTaskBreakdowns(team: AgentTeam, features: FeatureImplementationPlan[]): AgentTaskBreakdown[] {
    return team.agents.map((agent, index) => {
      const phase = team.recommendedSequence.indexOf(agent.name) + 1;
      const tasks = this.generateAgentSpecificTasks(agent.name, features);
      const deliverables = this.generateAgentDeliverables(agent.name, features);

      return {
        agentName: agent.name,
        phase,
        tasks,
        deliverables,
        estimatedHours: agent.estimatedHours
      };
    });
  }

  /**
   * Generate agent-specific tasks
   */
  private generateAgentSpecificTasks(agentName: string, features: FeatureImplementationPlan[]): string[] {
    const tasks: string[] = [];

    if (agentName === 'Planning Agent') {
      tasks.push('Review and validate project requirements');
      tasks.push('Create detailed system architecture diagram');
      tasks.push('Define API contracts and data schemas');
      tasks.push('Set up project structure and boilerplate');
      tasks.push('Create task breakdown for other agents');
    }

    if (agentName === 'Backend Agent') {
      tasks.push('Set up Express server with TypeScript');
      tasks.push('Configure CORS and middleware');
      tasks.push('Implement all API routes');
      features.forEach(f => {
        if (!f.name.toLowerCase().includes('ui')) {
          tasks.push(`Implement ${f.name}`);
        }
      });
      tasks.push('Add comprehensive error handling');
      tasks.push('Write API documentation');
    }

    if (agentName === 'Frontend Agent') {
      tasks.push('Set up Next.js 14 application');
      tasks.push('Configure Tailwind CSS');
      tasks.push('Create component library');
      features.forEach(f => {
        if (f.name.toLowerCase().includes('ui') || f.name.toLowerCase().includes('interface')) {
          tasks.push(`Build ${f.name} UI`);
        }
      });
      tasks.push('Implement API integration');
      tasks.push('Ensure responsive design');
    }

    if (agentName === 'Database Agent') {
      tasks.push('Design complete database schema');
      tasks.push('Create Prisma schema file');
      tasks.push('Generate and run migrations');
      tasks.push('Add indexes for performance');
      tasks.push('Set up seed data for development');
    }

    if (agentName === 'QA Agent') {
      tasks.push('Write unit tests for all services');
      tasks.push('Create integration tests for API endpoints');
      tasks.push('Implement E2E tests for critical flows');
      tasks.push('Set up CI/CD testing pipeline');
      tasks.push('Verify >80% code coverage');
    }

    if (agentName === 'DevOps Agent') {
      tasks.push('Set up GitHub Actions CI/CD');
      tasks.push('Configure deployment to Vercel/Railway');
      tasks.push('Set up environment variables');
      tasks.push('Configure database backups');
      tasks.push('Add monitoring and logging');
    }

    return tasks;
  }

  /**
   * Generate agent deliverables
   */
  private generateAgentDeliverables(agentName: string, features: FeatureImplementationPlan[]): string[] {
    const deliverables: string[] = [];

    if (agentName === 'Planning Agent') {
      deliverables.push('Architecture diagram');
      deliverables.push('API specification document');
      deliverables.push('Database schema design');
      deliverables.push('Project setup with boilerplate');
    }

    if (agentName === 'Backend Agent') {
      deliverables.push('Working Express server');
      deliverables.push('All API endpoints implemented');
      deliverables.push('Database models and services');
      deliverables.push('API documentation');
    }

    if (agentName === 'Frontend Agent') {
      deliverables.push('Next.js application');
      deliverables.push('All UI components');
      deliverables.push('Responsive layouts');
      deliverables.push('API integration layer');
    }

    if (agentName === 'Database Agent') {
      deliverables.push('Prisma schema');
      deliverables.push('Database migrations');
      deliverables.push('Seed data scripts');
    }

    if (agentName === 'QA Agent') {
      deliverables.push('Test suite with >80% coverage');
      deliverables.push('CI/CD test integration');
      deliverables.push('Test documentation');
    }

    if (agentName === 'DevOps Agent') {
      deliverables.push('CI/CD pipeline');
      deliverables.push('Deployment configuration');
      deliverables.push('Monitoring setup');
      deliverables.push('Deployment documentation');
    }

    return deliverables;
  }

  /**
   * Create testing strategy
   */
  private createTestingStrategy(research: ResearchResult): TestingPlan {
    return {
      unitTests: [
        'Test all service layer functions',
        'Test utility functions',
        'Test data validation schemas'
      ],
      integrationTests: [
        'Test API endpoints end-to-end',
        'Test database operations',
        'Test authentication flows'
      ],
      e2eTests: [
        'Test critical user flows',
        'Test form submissions',
        'Test navigation and routing'
      ],
      coverageTarget: '80%'
    };
  }

  /**
   * Create deployment guide
   */
  private createDeploymentGuide(research: ResearchResult): DeploymentInstructions {
    return {
      steps: [
        'Set up production database',
        'Configure environment variables',
        'Run database migrations',
        'Build frontend and backend',
        'Deploy to hosting platform',
        'Verify deployment health checks'
      ],
      environmentVariables: [
        'DATABASE_URL',
        'JWT_SECRET',
        'API_URL',
        'FRONTEND_URL',
        'NODE_ENV=production'
      ],
      buildCommands: [
        'npm run build',
        'npx prisma migrate deploy',
        'npm start'
      ]
    };
  }

  /**
   * Generate complete build document (the key output!)
   */
  private generateCompleteBuildDocument(data: any): string {
    const { projectOverview, technicalStack, setupInstructions, fileStructure, features, agentTasks, testingStrategy, deploymentGuide, parsedData, researchResult, agentTeam, tools, customInstructions, planningDetails } = data;

    return `# ${projectOverview.name} - Complete Build Specification

**Generated:** ${new Date().toISOString()}
**Estimated Timeline:** ${projectOverview.estimatedTimeline}
**Total Hours:** ${projectOverview.totalEstimatedHours}h
**Complexity:** ${projectOverview.complexity}

---

## Project Overview

${projectOverview.description}

### Technical Stack

- **Backend:** ${technicalStack.backend}
- **Frontend:** ${technicalStack.frontend}
- **Database:** ${technicalStack.database}
- **Architecture:** ${technicalStack.architecture}

**Reasoning:**
- Backend: ${researchResult.recommendedTechStack.backend.reasoning}
- Frontend: ${researchResult.recommendedTechStack.frontend.reasoning}
- Database: ${researchResult.recommendedTechStack.database.reasoning}
- Architecture: ${researchResult.architecture.reasoning}

---

## Prerequisites

${setupInstructions.prerequisites.map(p => `- ${p}`).join('\n')}

---

## Initial Setup

### 1. Environment Setup

${setupInstructions.environmentSetup.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### 2. Install Dependencies

\`\`\`bash
${setupInstructions.dependencies.join('\n')}
\`\`\`

### 3. Project Structure

\`\`\`
${fileStructure}
\`\`\`

---

## Development Plan

### Agent Team (${agentTeam.totalAgents} agents)

${agentTeam.agents.map(agent => `
#### ${agent.name} (${agent.workloadPercentage}% workload, ${agent.estimatedHours}h)
**Role:** ${agent.role}
**Priority:** ${agent.priority}

**Responsibilities:**
${agent.responsibilities.map(r => `- ${r}`).join('\n')}

**Required Skills:**
${agent.skills.map(s => `- ${s}`).join('\n')}
`).join('\n')}

### Execution Sequence

${agentTeam.recommendedSequence.map((agent, i) => `${i + 1}. ${agent}`).join('\n')}

---

## Feature Implementation Guide

${features.map((feature, i) => `
### Feature ${i + 1}: ${feature.name}

**Priority:** ${feature.priority}
**Complexity:** ${feature.complexity}
**Estimated Hours:** ${feature.estimatedHours}h

#### Tasks
${feature.tasks.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

#### Files to Create/Modify
${feature.files.map(f => `- \`${f}\``).join('\n')}

${feature.dependencies.length > 0 ? `
#### Dependencies
${feature.dependencies.map(d => `- ${d}`).join('\n')}
` : ''}

#### Acceptance Criteria
${feature.acceptanceCriteria.map(c => `- [ ] ${c}`).join('\n')}

---
`).join('\n')}

## Detailed Agent Tasks

${agentTasks.map(task => `
### ${task.agentName} - Phase ${task.phase}

**Estimated Hours:** ${task.estimatedHours}h

#### Tasks
${task.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

#### Deliverables
${task.deliverables.map(d => `- ${d}`).join('\n')}
`).join('\n')}

---

## Testing Strategy

### Unit Tests
${testingStrategy.unitTests.map(t => `- ${t}`).join('\n')}

### Integration Tests
${testingStrategy.integrationTests.map(t => `- ${t}`).join('\n')}

### End-to-End Tests
${testingStrategy.e2eTests.map(t => `- ${t}`).join('\n')}

**Coverage Target:** ${testingStrategy.coverageTarget}

---

## Recommended Tools & Services

### MCP Servers (${tools.mcpServers.length})
${tools.mcpServers.map(tool => `
#### ${tool.name}
**Purpose:** ${tool.purpose}
**Priority:** ${tool.priority}
**Installation:** \`${tool.installation}\`
**Reason:** ${tool.reason}
`).join('\n')}

### NPM Packages (${tools.npmPackages.length})
${tools.npmPackages.map(tool => `
#### ${tool.name}
**Purpose:** ${tool.purpose}
**Priority:** ${tool.priority}
**Installation:** \`${tool.installation}\`
**Reason:** ${tool.reason}
`).join('\n')}

### Development Tools (${tools.devTools.length})
${tools.devTools.map(tool => `
#### ${tool.name}
**Purpose:** ${tool.purpose}
**Priority:** ${tool.priority}
**Installation:** \`${tool.installation}\`
**Reason:** ${tool.reason}
`).join('\n')}

### External Services (${tools.services.length})
${tools.services.map(tool => `
#### ${tool.name}
**Purpose:** ${tool.purpose}
**Priority:** ${tool.priority}
**Setup:** ${tool.installation}
**Reason:** ${tool.reason}
`).join('\n')}

---

## Deployment Guide

### Environment Variables

\`\`\`bash
${deploymentGuide.environmentVariables.map(v => `${v}=your_value_here`).join('\n')}
\`\`\`

### Build Commands

\`\`\`bash
${deploymentGuide.buildCommands.join('\n')}
\`\`\`

### Deployment Steps

${deploymentGuide.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## Implementation Checklist

### Phase 1: Planning & Setup
- [ ] Review this complete specification
- [ ] Set up development environment
- [ ] Install all dependencies
- [ ] Create project structure
- [ ] Initialize Git repository

### Phase 2: Backend Development
- [ ] Set up Express server
- [ ] Configure database with Prisma
- [ ] Implement all API routes
- [ ] Add authentication (if required)
- [ ] Write backend tests

### Phase 3: Frontend Development
- [ ] Set up Next.js application
- [ ] Create component library
- [ ] Implement all pages and features
- [ ] Integrate with backend API
- [ ] Write frontend tests

### Phase 4: Integration & Testing
- [ ] Integration testing
- [ ] E2E testing
- [ ] Bug fixes and optimization
- [ ] Code review and refactoring
- [ ] Documentation

### Phase 5: Deployment
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging
- [ ] Production deployment
- [ ] Post-deployment verification
- [ ] Monitoring setup

---

## Success Criteria

- [ ] All features implemented as specified
- [ ] All tests passing with >80% coverage
- [ ] No critical bugs or security issues
- [ ] API documentation complete
- [ ] Deployment successful
- [ ] Performance targets met
- [ ] Accessibility standards met (WCAG AA)

---

## Notes for Claude/AI Builder

**This document contains everything needed to build the complete application. Follow these guidelines:**

1. **Work sequentially** through the agent tasks in the recommended order
2. **Complete each feature** fully before moving to the next
3. **Write tests** as you implement features (TDD approach)
4. **Follow the file structure** exactly as specified
5. **Use the recommended tools** for consistency
6. **Implement all acceptance criteria** for each feature
7. **Document your code** with clear comments
8. **Handle errors gracefully** with proper validation
9. **Ensure type safety** with TypeScript throughout
10. **Test thoroughly** before considering a feature complete

**Do NOT:**
- Skip any features marked as "critical" or "high" priority
- Implement features in a different order without justification
- Ignore the testing strategy
- Deploy without proper testing
- Hard-code sensitive values (use environment variables)

${planningDetails ? `
---

## Architecture Decision Records (ADRs)

${planningDetails.adrs.map(adr => `
### ADR ${adr.id}: ${adr.title}

**Status:** ${adr.status}${adr.dateCreated ? ` | **Date:** ${adr.dateCreated}` : ''}

#### Context

${adr.context}

#### Decision

${adr.decision}

#### Consequences

${adr.consequences.map(c => `- ${c}`).join('\n')}

${adr.alternatives && adr.alternatives.length > 0 ? `
#### Alternatives Considered

${adr.alternatives.map(alt => `
**${alt.name}:**
- Pros: ${alt.pros.join(', ')}
- Cons: ${alt.cons.join(', ')}
`).join('\n')}
` : ''}
`).join('\n---\n')}

---

## System Architecture Diagrams

${planningDetails.diagrams.c4Context ? `
### C4 Context Diagram

\`\`\`mermaid
${planningDetails.diagrams.c4Context}
\`\`\`
` : ''}

${planningDetails.diagrams.c4Container ? `
### C4 Container Diagram

\`\`\`mermaid
${planningDetails.diagrams.c4Container}
\`\`\`
` : ''}

${planningDetails.diagrams.erDiagram ? `
### Database Schema (ER Diagram)

\`\`\`mermaid
${planningDetails.diagrams.erDiagram}
\`\`\`
` : ''}

${planningDetails.diagrams.sequenceDiagrams && planningDetails.diagrams.sequenceDiagrams.length > 0 ? `
### Sequence Diagrams

${planningDetails.diagrams.sequenceDiagrams.map((diagram, index) => `
#### Flow ${index + 1}

\`\`\`mermaid
${diagram}
\`\`\`
`).join('\n')}
` : ''}

---

## Cost Estimation

**Confidence Level:** ${planningDetails.costEstimate.confidence.toUpperCase()}

### Infrastructure Costs

**Total Monthly:** $${planningDetails.costEstimate.totalMonthly.toFixed(2)}
**Total Annual:** $${planningDetails.costEstimate.totalAnnual.toFixed(2)}

| Service | Category | Monthly | Tier | Assumptions |
|---------|----------|---------|------|-------------|
${planningDetails.costEstimate.items.map(item =>
  `| ${item.service} | ${item.category} | $${item.monthlyEstimate.toFixed(2)} | ${item.tier} | ${item.assumptions[0] || 'N/A'} |`
).join('\n')}

${planningDetails.costEstimate.developmentCost ? `
### Development Costs

- **Total Hours:** ${planningDetails.costEstimate.developmentCost.totalHours}h
- **Hourly Rate Range:** $${planningDetails.costEstimate.developmentCost.hourlyRateMin}-${planningDetails.costEstimate.developmentCost.hourlyRateMax}/hr
- **Estimated Cost:** $${planningDetails.costEstimate.developmentCost.totalMin.toLocaleString()}-$${planningDetails.costEstimate.developmentCost.totalMax.toLocaleString()}
` : ''}

${planningDetails.costEstimate.notes && planningDetails.costEstimate.notes.length > 0 ? `
**Notes:**
${planningDetails.costEstimate.notes.map(note => `- ${note}`).join('\n')}
` : ''}

---

## Dependency Risk Analysis

${planningDetails.dependencyRisks.length > 0 ? `
${planningDetails.dependencyRisks.map(risk => `
### ${risk.packageName}${risk.version ? ` (${risk.version})` : ''}

**Risk Level:** ${risk.riskLevel.toUpperCase()} ${risk.riskLevel === 'critical' ? '🔴' : risk.riskLevel === 'high' ? '🟠' : risk.riskLevel === 'medium' ? '🟡' : '🟢'}
**Category:** ${risk.category || 'general'}

**Risk Factors:**
${risk.riskFactors.map(f => `- ${f}`).join('\n')}

**Mitigation Strategy:**
${risk.mitigation}

${risk.alternatives && risk.alternatives.length > 0 ? `
**Alternatives:** ${risk.alternatives.join(', ')}
` : ''}
`).join('\n---\n')}
` : 'No significant dependency risks identified.'}

` : ''}

${customInstructions ? `
---

## Custom Instructions

${customInstructions}

` : ''}
---

**END OF BUILD SPECIFICATION**

Generated by Autonomous Project Builder v0.7.0
`;
  }
}
