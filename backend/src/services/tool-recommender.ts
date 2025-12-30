import { ProjectSummary, ResearchResult } from '../../../shared/types/project';

export interface ToolRecommendation {
  name: string;
  category: 'mcp-server' | 'npm-package' | 'dev-tool' | 'service';
  purpose: string;
  installation: string;
  priority: 'required' | 'recommended' | 'optional';
  reason: string;
}

export interface ToolRecommendations {
  mcpServers: ToolRecommendation[];
  npmPackages: ToolRecommendation[];
  devTools: ToolRecommendation[];
  services: ToolRecommendation[];
  totalRecommendations: number;
}

/**
 * ToolRecommender - Recommends tools, packages, and MCP servers
 * Based on tech stack and project requirements
 */
export class ToolRecommender {
  /**
   * Generate tool recommendations
   */
  recommendTools(
    parsedData: ProjectSummary,
    researchResult: ResearchResult
  ): ToolRecommendations {
    console.log('[ToolRecommender] Generating recommendations for:', parsedData.projectName);

    const mcpServers = this.recommendMCPServers(parsedData, researchResult);
    const npmPackages = this.recommendNPMPackages(parsedData, researchResult);
    const devTools = this.recommendDevTools(parsedData, researchResult);
    const services = this.recommendServices(parsedData, researchResult);

    const totalRecommendations =
      mcpServers.length +
      npmPackages.length +
      devTools.length +
      services.length;

    console.log('[ToolRecommender] Generated', totalRecommendations, 'recommendations');

    return {
      mcpServers,
      npmPackages,
      devTools,
      services,
      totalRecommendations
    };
  }

  /**
   * Recommend MCP Servers
   */
  private recommendMCPServers(
    data: ProjectSummary,
    research: ResearchResult
  ): ToolRecommendation[] {
    const recommendations: ToolRecommendation[] = [];

    // File system operations
    recommendations.push({
      name: 'Filesystem MCP Server',
      category: 'mcp-server',
      purpose: 'Read, write, and manage project files during development',
      installation: 'npx -y @modelcontextprotocol/server-filesystem',
      priority: 'required',
      reason: 'Essential for code generation and file manipulation'
    });

    // Git operations
    recommendations.push({
      name: 'Git MCP Server',
      category: 'mcp-server',
      purpose: 'Version control and repository management',
      installation: 'npx -y @modelcontextprotocol/server-git',
      priority: 'recommended',
      reason: 'Enables automated commits and version control'
    });

    // Database-specific MCP servers
    const dbType = research.recommendedTechStack.database.type.toLowerCase();
    if (dbType.includes('postgres')) {
      recommendations.push({
        name: 'PostgreSQL MCP Server',
        category: 'mcp-server',
        purpose: 'Direct PostgreSQL database operations and queries',
        installation: 'npx -y @modelcontextprotocol/server-postgres',
        priority: 'recommended',
        reason: 'Useful for database schema management and testing'
      });
    } else if (dbType.includes('sqlite')) {
      recommendations.push({
        name: 'SQLite MCP Server',
        category: 'mcp-server',
        purpose: 'SQLite database operations',
        installation: 'npx -y @modelcontextprotocol/server-sqlite',
        priority: 'recommended',
        reason: 'Direct database access for development'
      });
    }

    // Fetch for API testing
    recommendations.push({
      name: 'Fetch MCP Server',
      category: 'mcp-server',
      purpose: 'Test API endpoints and make HTTP requests',
      installation: 'npx -y @modelcontextprotocol/server-fetch',
      priority: 'recommended',
      reason: 'Essential for API testing and validation'
    });

    return recommendations;
  }

  /**
   * Recommend NPM Packages
   */
  private recommendNPMPackages(
    data: ProjectSummary,
    research: ResearchResult
  ): ToolRecommendation[] {
    const recommendations: ToolRecommendation[] = [];

    const backendFramework = research.recommendedTechStack.backend?.framework?.toLowerCase() || '';
    const frontendFramework = research.recommendedTechStack.frontend?.framework?.toLowerCase() || '';
    const dbType = research.recommendedTechStack.database.type.toLowerCase();

    // Backend packages
    if (backendFramework.includes('express')) {
      recommendations.push({
        name: 'Express.js',
        category: 'npm-package',
        purpose: 'Backend web server framework',
        installation: 'npm install express cors dotenv',
        priority: 'required',
        reason: 'Core backend framework'
      });

      recommendations.push({
        name: 'Express Middleware',
        category: 'npm-package',
        purpose: 'Request validation, logging, error handling',
        installation: 'npm install express-validator morgan helmet',
        priority: 'recommended',
        reason: 'Essential middleware for production-ready API'
      });
    }

    // TypeScript
    if (backendFramework.includes('typescript') || frontendFramework.includes('typescript')) {
      recommendations.push({
        name: 'TypeScript',
        category: 'npm-package',
        purpose: 'Type-safe JavaScript development',
        installation: 'npm install -D typescript @types/node tsx',
        priority: 'required',
        reason: 'Type safety and better developer experience'
      });
    }

    // Database ORM
    if (dbType.includes('postgres') || dbType.includes('mysql') || dbType.includes('sqlite')) {
      recommendations.push({
        name: 'Prisma ORM',
        category: 'npm-package',
        purpose: 'Type-safe database access and schema management',
        installation: 'npm install @prisma/client && npm install -D prisma',
        priority: 'required',
        reason: 'Modern ORM with excellent TypeScript support'
      });
    }

    // Authentication
    const hasAuth = research.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') ||
      f.name.toLowerCase().includes('login')
    );
    if (hasAuth) {
      recommendations.push({
        name: 'Authentication Libraries',
        category: 'npm-package',
        purpose: 'JWT tokens, password hashing, session management',
        installation: 'npm install jsonwebtoken bcrypt express-session',
        priority: 'required',
        reason: 'Secure authentication implementation'
      });
    }

    // Frontend packages
    if (frontendFramework.includes('next')) {
      recommendations.push({
        name: 'Next.js',
        category: 'npm-package',
        purpose: 'React framework with SSR and routing',
        installation: 'npx create-next-app@latest',
        priority: 'required',
        reason: 'Core frontend framework'
      });
    }

    // UI libraries
    recommendations.push({
      name: 'Tailwind CSS',
      category: 'npm-package',
      purpose: 'Utility-first CSS framework',
      installation: 'npm install -D tailwindcss postcss autoprefixer',
      priority: 'recommended',
      reason: 'Rapid UI development with consistent styling'
    });

    // Validation
    recommendations.push({
      name: 'Zod',
      category: 'npm-package',
      purpose: 'Runtime type validation and schema definition',
      installation: 'npm install zod',
      priority: 'required',
      reason: 'Validate API requests and user input'
    });

    // Testing
    recommendations.push({
      name: 'Testing Libraries',
      category: 'npm-package',
      purpose: 'Unit, integration, and E2E testing',
        installation: 'npm install -D vitest @testing-library/react @testing-library/jest-dom',
      priority: 'recommended',
      reason: 'Comprehensive testing suite'
    });

    return recommendations;
  }

  /**
   * Recommend Development Tools
   */
  private recommendDevTools(
    data: ProjectSummary,
    research: ResearchResult
  ): ToolRecommendation[] {
    const recommendations: ToolRecommendation[] = [];

    // Code formatting
    recommendations.push({
      name: 'Prettier',
      category: 'dev-tool',
      purpose: 'Code formatting and style consistency',
      installation: 'npm install -D prettier',
      priority: 'recommended',
      reason: 'Maintain consistent code style across team'
    });

    // Linting
    recommendations.push({
      name: 'ESLint',
      category: 'dev-tool',
      purpose: 'Code quality and best practices enforcement',
      installation: 'npm install -D eslint @typescript-eslint/parser',
      priority: 'recommended',
      reason: 'Catch errors and enforce coding standards'
    });

    // Git hooks
    recommendations.push({
      name: 'Husky',
      category: 'dev-tool',
      purpose: 'Git hooks for pre-commit checks',
      installation: 'npm install -D husky lint-staged',
      priority: 'optional',
      reason: 'Enforce quality checks before commits'
    });

    // API documentation
    recommendations.push({
      name: 'Swagger/OpenAPI',
      category: 'dev-tool',
      purpose: 'API documentation and testing interface',
      installation: 'npm install swagger-ui-express swagger-jsdoc',
      priority: 'optional',
      reason: 'Interactive API documentation'
    });

    return recommendations;
  }

  /**
   * Recommend External Services
   */
  private recommendServices(
    data: ProjectSummary,
    research: ResearchResult
  ): ToolRecommendation[] {
    const recommendations: ToolRecommendation[] = [];

    // Hosting
    const complexity = research.estimatedComplexity;
    if (complexity === 'low' || complexity === 'medium') {
      recommendations.push({
        name: 'Vercel',
        category: 'service',
        purpose: 'Frontend and API hosting with automatic deployments',
        installation: 'Sign up at vercel.com and connect GitHub repo',
        priority: 'recommended',
        reason: 'Zero-config Next.js deployments with excellent DX'
      });
    }

    // Database hosting
    const dbType = research.recommendedTechStack.database.type.toLowerCase();
    if (dbType.includes('postgres')) {
      recommendations.push({
        name: 'Supabase / Neon',
        category: 'service',
        purpose: 'Managed PostgreSQL database hosting',
        installation: 'Sign up at supabase.com or neon.tech',
        priority: 'recommended',
        reason: 'Free tier available, automatic backups, connection pooling'
      });
    }

    // Monitoring
    if (complexity === 'high') {
      recommendations.push({
        name: 'Sentry',
        category: 'service',
        purpose: 'Error tracking and performance monitoring',
        installation: 'npm install @sentry/node @sentry/react',
        priority: 'recommended',
        reason: 'Real-time error tracking and debugging'
      });
    }

    // Analytics
    recommendations.push({
      name: 'Vercel Analytics / Plausible',
      category: 'service',
      purpose: 'Privacy-friendly website analytics',
      installation: 'Enable in Vercel dashboard or sign up at plausible.io',
      priority: 'optional',
      reason: 'Understand user behavior without cookies'
    });

    return recommendations;
  }
}
