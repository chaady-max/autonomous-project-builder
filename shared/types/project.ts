import { z } from 'zod';

// Project Summary Schema
export const ProjectSummarySchema = z.object({
  projectName: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()).optional(),
  techStack: z.object({
    backend: z.array(z.string()).optional(),
    frontend: z.array(z.string()).optional(),
    database: z.string().optional(),
  }).optional(),
  timeline: z.string().optional(),
  teamSize: z.string().optional(),
  constraints: z.array(z.string()).optional(),
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;

// Completeness Score
export const CompletenessSchema = z.object({
  score: z.number().min(0).max(1),
  missing: z.array(z.string()),
});

export type Completeness = z.infer<typeof CompletenessSchema>;

// Parse Summary Response
export const ParseSummaryResponseSchema = z.object({
  success: z.boolean(),
  data: ProjectSummarySchema,
  completeness: CompletenessSchema,
});

export type ParseSummaryResponse = z.infer<typeof ParseSummaryResponseSchema>;

// Feature Schema
export const FeatureSchema = z.object({
  name: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  complexity: z.enum(['low', 'medium', 'high']),
  estimatedHours: z.number(),
});

export type Feature = z.infer<typeof FeatureSchema>;

// Tech Stack Recommendation
export const TechStackRecommendationSchema = z.object({
  backend: z.object({
    framework: z.string(),
    reasoning: z.string(),
  }).optional(),
  frontend: z.object({
    framework: z.string(),
    reasoning: z.string(),
  }).optional(),
  database: z.object({
    type: z.string(),
    reasoning: z.string(),
  }).optional(),
});

export type TechStackRecommendation = z.infer<typeof TechStackRecommendationSchema>;

// Research Result
export const ResearchResultSchema = z.object({
  requiredFeatures: z.array(FeatureSchema),
  recommendedTechStack: TechStackRecommendationSchema,
  architecture: z.object({
    pattern: z.string(),
    reasoning: z.string(),
  }),
  estimatedComplexity: z.enum(['low', 'medium', 'high']),
  estimatedTimeline: z.string(),
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;

// Agent Schema
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  workloadPercentage: z.number().min(0).max(100),
  responsibilities: z.array(z.string()),
  systemPrompt: z.string(),
  successCriteria: z.array(z.string()),
});

export type Agent = z.infer<typeof AgentSchema>;

// Tool/Package Recommendation
export const PackageRecommendationSchema = z.object({
  name: z.string(),
  version: z.string(),
  category: z.string(),
  reasoning: z.string(),
});

export type PackageRecommendation = z.infer<typeof PackageRecommendationSchema>;

export const ToolRecommendationsSchema = z.object({
  backend: z.array(PackageRecommendationSchema),
  frontend: z.array(PackageRecommendationSchema),
  devDependencies: z.array(PackageRecommendationSchema),
  claudeCodePlugins: z.array(z.object({
    name: z.string(),
    reasoning: z.string(),
  })).optional(),
  packageJson: z.object({
    backend: z.record(z.any()),
    frontend: z.record(z.any()),
  }).optional(),
});

export type ToolRecommendations = z.infer<typeof ToolRecommendationsSchema>;
