import yaml from 'js-yaml';
import { marked } from 'marked';
import { ProjectSummary, Completeness, InputEnrichment } from '../../../shared/types/project';

export class ProjectSummaryParser {
  /**
   * Parse project summary from various formats (YAML, Markdown, plain text)
   */
  async parse(content: string, format: 'yaml' | 'markdown' | 'text'): Promise<{
    data: ProjectSummary;
    completeness: Completeness;
  }> {
    let parsedData: Partial<ProjectSummary> = {};

    try {
      switch (format) {
        case 'yaml':
          parsedData = this.parseYAML(content);
          break;
        case 'markdown':
          parsedData = this.parseMarkdown(content);
          break;
        case 'text':
          parsedData = await this.parsePlainText(content);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Validate and fill defaults
      const validatedData = this.validateAndFillDefaults(parsedData);

      // Calculate completeness
      const completeness = this.calculateCompleteness(validatedData);

      return {
        data: validatedData,
        completeness,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse ${format}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Parse with enrichment data and optional strict mode validation (v0.7)
   */
  async parseWithEnrichment(
    content: string,
    format: 'yaml' | 'markdown' | 'text',
    enrichment?: InputEnrichment,
    strictMode: boolean = false
  ): Promise<{
    data: ProjectSummary;
    completeness: Completeness;
    enrichment?: InputEnrichment;
    strictModeErrors?: string[];
  }> {
    // First do normal parsing
    const { data, completeness } = await this.parse(content, format);

    // If strict mode, validate requirements
    if (strictMode) {
      const errors = this.validateStrictMode(data, enrichment);
      if (errors.length > 0) {
        return {
          data,
          completeness,
          enrichment,
          strictModeErrors: errors,
        };
      }
    }

    return {
      data,
      completeness,
      enrichment,
    };
  }

  /**
   * Validate strict mode requirements (v0.7)
   */
  private validateStrictMode(data: ProjectSummary, enrichment?: InputEnrichment): string[] {
    const errors: string[] = [];

    // Required: Project name must be meaningful
    if (!data.projectName || data.projectName === 'Untitled Project' || data.projectName.length < 3) {
      errors.push('Project name is required and must be at least 3 characters');
    }

    // Required: Description must be present
    if (!data.description || data.description === 'No description provided' || data.description.length < 10) {
      errors.push('Project description is required and must be at least 10 characters');
    }

    // Required: At least 3 features
    if (!data.features || data.features.length < 3) {
      errors.push('At least 3 features are required in strict mode');
    }

    // Required: Backend tech stack
    if (!data.techStack?.backend || data.techStack.backend.length === 0) {
      errors.push('Backend technology stack is required');
    }

    // Required: Frontend tech stack
    if (!data.techStack?.frontend || data.techStack.frontend.length === 0) {
      errors.push('Frontend technology stack is required');
    }

    // Required: Database specification
    if (!data.techStack?.database) {
      errors.push('Database technology is required');
    }

    // Enrichment validations (if enrichment is expected in strict mode)
    if (enrichment) {
      // Feature prioritization recommended for projects with many features
      if (data.features && data.features.length > 5 && !enrichment.featurePriorities?.length) {
        errors.push('Feature prioritization is recommended for projects with more than 5 features');
      }

      // Security requirements if authentication mentioned
      const hasAuth = data.features?.some(f =>
        f.toLowerCase().includes('auth') ||
        f.toLowerCase().includes('login') ||
        f.toLowerCase().includes('user')
      );
      if (hasAuth && !enrichment.nfrSecurity) {
        errors.push('Security requirements are required when authentication features are present');
      }

      // Scalability info for larger projects
      if (data.teamSize && (data.teamSize.includes('large') || data.teamSize.includes('enterprise'))) {
        if (!enrichment.nfrScalability) {
          errors.push('Scalability requirements are required for large or enterprise projects');
        }
      }
    }

    return errors;
  }

  /**
   * Parse YAML format
   */
  private parseYAML(content: string): Partial<ProjectSummary> {
    try {
      const parsed = yaml.load(content) as any;

      // Handle both "PROJECT:" wrapper and direct format
      const projectData = parsed.PROJECT || parsed;

      // Handle tech_stack - can be array or object
      let backendStack: string[] = [];
      let frontendStack: string[] = [];
      let database: string | undefined;

      if (Array.isArray(projectData.tech_stack)) {
        // Array format can be strings or objects
        for (const item of projectData.tech_stack) {
          if (typeof item === 'string') {
            // String format: "Backend: Node.js"
            if (item.toLowerCase().includes('backend')) {
              backendStack.push(item.replace(/^backend:\s*/i, '').trim());
            } else if (item.toLowerCase().includes('frontend')) {
              frontendStack.push(item.replace(/^frontend:\s*/i, '').trim());
            } else if (item.toLowerCase().includes('database')) {
              database = item.replace(/^database:\s*/i, '').trim();
            }
          } else if (typeof item === 'object' && item !== null) {
            // Object format: { Backend: "Node.js" }
            if ('Backend' in item || 'backend' in item) {
              backendStack.push(item.Backend || item.backend);
            }
            if ('Frontend' in item || 'frontend' in item) {
              frontendStack.push(item.Frontend || item.frontend);
            }
            if ('Database' in item || 'database' in item) {
              database = item.Database || item.database;
            }
          }
        }
      } else if (projectData.tech_stack && typeof projectData.tech_stack === 'object') {
        // Object format with backend/frontend/database keys
        backendStack = projectData.tech_stack.backend || projectData.techStack?.backend || [];
        frontendStack = projectData.tech_stack.frontend || projectData.techStack?.frontend || [];
        database = projectData.tech_stack.database || projectData.techStack?.database;
      } else if (projectData.techStack) {
        // Alternative techStack spelling
        backendStack = projectData.techStack.backend || [];
        frontendStack = projectData.techStack.frontend || [];
        database = projectData.techStack.database;
      }

      return {
        projectName: projectData.name || projectData.projectName,
        description: projectData.description,
        features: projectData.features || projectData.objectives,
        techStack: {
          backend: backendStack,
          frontend: frontendStack,
          database: database,
        },
        timeline: projectData.timeline,
        teamSize: projectData.team_size || projectData.teamSize,
        constraints: projectData.constraints,
      };
    } catch (error) {
      throw new Error(`Invalid YAML syntax: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse Markdown format
   */
  private parseMarkdown(content: string): Partial<ProjectSummary> {
    const lines = content.split('\n');
    const data: Partial<ProjectSummary> = {
      features: [],
      techStack: { backend: [], frontend: [] },
      constraints: [],
    };

    let currentSection: string | null = null;

    for (const line of lines) {
      const trimmed = line.trim();

      // Detect headers
      if (trimmed.startsWith('# ')) {
        const headerText = trimmed.substring(2).toLowerCase();
        if (!data.projectName && (headerText.includes('project') || headerText.includes('name'))) {
          currentSection = 'name';
        }
      } else if (trimmed.startsWith('## ')) {
        const headerText = trimmed.substring(3).toLowerCase();
        if (headerText.includes('description')) currentSection = 'description';
        else if (headerText.includes('feature')) currentSection = 'features';
        else if (headerText.includes('tech') || headerText.includes('stack')) currentSection = 'techStack';
        else if (headerText.includes('timeline')) currentSection = 'timeline';
        else if (headerText.includes('constraint')) currentSection = 'constraints';
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Bullet points
        const item = trimmed.substring(2).trim();
        if (currentSection === 'features' && data.features) {
          data.features.push(item);
        } else if (currentSection === 'constraints' && data.constraints) {
          data.constraints.push(item);
        } else if (currentSection === 'techStack') {
          if (item.toLowerCase().includes('backend') || item.toLowerCase().includes('node') || item.toLowerCase().includes('express')) {
            data.techStack!.backend!.push(item);
          } else if (item.toLowerCase().includes('frontend') || item.toLowerCase().includes('react') || item.toLowerCase().includes('next')) {
            data.techStack!.frontend!.push(item);
          }
        }
      } else if (trimmed && currentSection) {
        // Regular text
        if (currentSection === 'name' && !data.projectName) {
          data.projectName = trimmed;
        } else if (currentSection === 'description' && !data.description) {
          data.description = trimmed;
        } else if (currentSection === 'timeline' && !data.timeline) {
          data.timeline = trimmed;
        }
      }
    }

    return data;
  }

  /**
   * Parse plain text (fallback - uses Claude API if available, otherwise basic extraction)
   */
  private async parsePlainText(content: string): Promise<Partial<ProjectSummary>> {
    // For now, use simple pattern matching
    // In production, this would call Claude API for better extraction
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);

    const data: Partial<ProjectSummary> = {
      projectName: lines[0] || 'Untitled Project',
      description: lines.slice(1, 3).join(' '),
      features: [],
      techStack: { backend: [], frontend: [] },
      constraints: [],
    };

    // Extract features (lines containing "feature", "include", "need", etc.)
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('feature') || lower.includes('include') || lower.includes('should')) {
        data.features!.push(line);
      }
    }

    return data;
  }

  /**
   * Validate and fill default values
   */
  private validateAndFillDefaults(data: Partial<ProjectSummary>): ProjectSummary {
    return {
      projectName: data.projectName || 'Untitled Project',
      description: data.description || 'No description provided',
      features: data.features || [],
      techStack: {
        backend: data.techStack?.backend || [],
        frontend: data.techStack?.frontend || [],
        database: data.techStack?.database,
      },
      timeline: data.timeline,
      teamSize: data.teamSize,
      constraints: data.constraints,
    };
  }

  /**
   * Calculate completeness score
   */
  private calculateCompleteness(data: ProjectSummary): Completeness {
    const checks = {
      projectName: !!data.projectName && data.projectName !== 'Untitled Project',
      description: !!data.description && data.description !== 'No description provided',
      features: data.features && data.features.length > 0,
      techStackBackend: data.techStack?.backend && data.techStack.backend.length > 0,
      techStackFrontend: data.techStack?.frontend && data.techStack.frontend.length > 0,
      database: !!data.techStack?.database,
      timeline: !!data.timeline,
      teamSize: !!data.teamSize,
      constraints: data.constraints && data.constraints.length > 0,
    };

    const total = Object.keys(checks).length;
    const completed = Object.values(checks).filter(Boolean).length;
    const score = completed / total;

    const missing: string[] = [];
    if (!checks.features) missing.push('features');
    if (!checks.techStackBackend) missing.push('backend tech stack');
    if (!checks.techStackFrontend) missing.push('frontend tech stack');
    if (!checks.database) missing.push('database');
    if (!checks.timeline) missing.push('timeline');
    if (!checks.teamSize) missing.push('team size');

    return {
      score,
      missing,
    };
  }
}
