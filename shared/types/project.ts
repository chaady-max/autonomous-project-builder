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

// ==================== ADVANCED FEATURES (v0.7) ====================

// Feature Priority Schema
export const FeaturePrioritySchema = z.object({
  feature: z.string(),
  priority: z.enum(['must', 'should', 'nice']),
  reasoning: z.string().optional(),
});

export type FeaturePriority = z.infer<typeof FeaturePrioritySchema>;

// Non-Functional Requirements - Performance
export const NFRPerformanceSchema = z.object({
  responseTimeMs: z.number().optional(),
  throughputRPS: z.number().optional(),
  concurrentUsers: z.number().optional(),
  requirements: z.array(z.string()).optional(),
});

export type NFRPerformance = z.infer<typeof NFRPerformanceSchema>;

// Non-Functional Requirements - Security
export const NFRSecuritySchema = z.object({
  authenticationRequired: z.boolean(),
  authenticationMethod: z.enum(['email-password', 'oauth', 'saml', 'magic-link', 'two-factor']).optional(),
  encryptionAtRest: z.boolean().optional(),
  encryptionInTransit: z.boolean().optional(),
  complianceStandards: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

export type NFRSecurity = z.infer<typeof NFRSecuritySchema>;

// Non-Functional Requirements - Scalability
export const NFRScalabilitySchema = z.object({
  expectedUsers: z.number(),
  expectedUsersAtPeak: z.number().optional(),
  growthRate: z.string().optional(),
  dataVolume: z.string().optional(),
  requirements: z.array(z.string()).optional(),
});

export type NFRScalability = z.infer<typeof NFRScalabilitySchema>;

// Non-Functional Requirements - Accessibility
export const NFRAccessibilitySchema = z.object({
  wcagLevel: z.enum(['A', 'AA', 'AAA']).optional(),
  screenReaderSupport: z.boolean().optional(),
  keyboardNavigation: z.boolean().optional(),
  requirements: z.array(z.string()).optional(),
});

export type NFRAccessibility = z.infer<typeof NFRAccessibilitySchema>;

// User Persona Schema
export const PersonaSchema = z.object({
  name: z.string(),
  role: z.string(),
  goals: z.array(z.string()),
  painPoints: z.array(z.string()),
  technicalSkill: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'rarely']).optional(),
});

export type Persona = z.infer<typeof PersonaSchema>;

// Complete Input Enrichment Schema
export const InputEnrichmentSchema = z.object({
  featurePriorities: z.array(FeaturePrioritySchema).optional(),
  nfrPerformance: NFRPerformanceSchema.optional(),
  nfrSecurity: NFRSecuritySchema.optional(),
  nfrScalability: NFRScalabilitySchema.optional(),
  nfrAccessibility: NFRAccessibilitySchema.optional(),
  personas: z.array(PersonaSchema).optional(),
  approachPreference: z.enum(['api-first', 'ui-first', 'balanced']).optional(),
  budgetConstraint: z.enum(['low', 'medium', 'high', 'unlimited']).optional(),
  complexitySlider: z.number().min(1).max(10).optional(),
  scalabilityTier: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
  architectureStyle: z.enum(['monolith', 'modular', 'microservices', 'auto']).optional(),
});

export type InputEnrichment = z.infer<typeof InputEnrichmentSchema>;

// Clarification Q&A Schema
export const ClarificationQASchema = z.object({
  question: z.string(),
  answer: z.string(),
  timestamp: z.string(),
  skipped: z.boolean().optional(),
});

export type ClarificationQA = z.infer<typeof ClarificationQASchema>;

// Architecture Decision Record Schema
export const ADRSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.enum(['proposed', 'accepted', 'rejected', 'deprecated', 'superseded']),
  context: z.string(),
  decision: z.string(),
  consequences: z.array(z.string()),
  alternatives: z.array(z.object({
    name: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
  })).optional(),
  dateCreated: z.string().optional(),
});

export type ADR = z.infer<typeof ADRSchema>;

// Diagram Schema
export const DiagramSchema = z.object({
  id: z.string(),
  type: z.enum(['c4-context', 'c4-container', 'er-diagram', 'sequence', 'flow']),
  title: z.string(),
  description: z.string().optional(),
  mermaidCode: z.string(),
});

export type Diagram = z.infer<typeof DiagramSchema>;

// Cost Item Schema
export const CostItemSchema = z.object({
  service: z.string(),
  category: z.enum(['hosting', 'database', 'storage', 'bandwidth', 'third-party', 'developer', 'other']),
  monthlyEstimate: z.number(),
  annualEstimate: z.number().optional(),
  tier: z.string(),
  assumptions: z.array(z.string()),
  scalingNotes: z.string().optional(),
});

export type CostItem = z.infer<typeof CostItemSchema>;

// Cost Estimate Schema
export const CostEstimateSchema = z.object({
  items: z.array(CostItemSchema),
  totalMonthly: z.number(),
  totalAnnual: z.number(),
  confidence: z.enum(['low', 'medium', 'high']),
  notes: z.array(z.string()).optional(),
  developmentCost: z.object({
    totalHours: z.number(),
    hourlyRateMin: z.number(),
    hourlyRateMax: z.number(),
    totalMin: z.number(),
    totalMax: z.number(),
  }).optional(),
});

export type CostEstimate = z.infer<typeof CostEstimateSchema>;

// Dependency Risk Schema
export const DependencyRiskSchema = z.object({
  packageName: z.string(),
  version: z.string().optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  riskFactors: z.array(z.string()),
  mitigation: z.string(),
  alternatives: z.array(z.string()).optional(),
  category: z.enum(['security', 'maintenance', 'performance', 'compatibility', 'licensing']).optional(),
});

export type DependencyRisk = z.infer<typeof DependencyRiskSchema>;

// Planning Details Schema (complete)
export const PlanningDetailsSchema = z.object({
  adrs: z.array(ADRSchema),
  diagrams: z.object({
    c4Context: z.string().optional(),
    c4Container: z.string().optional(),
    erDiagram: z.string().optional(),
    sequenceDiagrams: z.array(z.string()).optional(),
  }),
  costEstimate: CostEstimateSchema,
  techJustification: TechStackRecommendationSchema,
  dependencyRisks: z.array(DependencyRiskSchema),
});

export type PlanningDetails = z.infer<typeof PlanningDetailsSchema>;
