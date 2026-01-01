"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningDetailsSchema = exports.DependencyRiskSchema = exports.CostEstimateSchema = exports.CostItemSchema = exports.DiagramSchema = exports.ADRSchema = exports.ClarificationQASchema = exports.InputEnrichmentSchema = exports.PersonaSchema = exports.NFRAccessibilitySchema = exports.NFRScalabilitySchema = exports.NFRSecuritySchema = exports.NFRPerformanceSchema = exports.FeaturePrioritySchema = exports.ToolRecommendationsSchema = exports.PackageRecommendationSchema = exports.AgentSchema = exports.ResearchResultSchema = exports.TechStackRecommendationSchema = exports.FeatureSchema = exports.ParseSummaryResponseSchema = exports.CompletenessSchema = exports.ProjectSummarySchema = void 0;
const zod_1 = require("zod");
// Project Summary Schema
exports.ProjectSummarySchema = zod_1.z.object({
    projectName: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    techStack: zod_1.z.object({
        backend: zod_1.z.array(zod_1.z.string()).optional(),
        frontend: zod_1.z.array(zod_1.z.string()).optional(),
        database: zod_1.z.string().optional(),
    }).optional(),
    timeline: zod_1.z.string().optional(),
    teamSize: zod_1.z.string().optional(),
    constraints: zod_1.z.array(zod_1.z.string()).optional(),
});
// Completeness Score
exports.CompletenessSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(1),
    missing: zod_1.z.array(zod_1.z.string()),
});
// Parse Summary Response
exports.ParseSummaryResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: exports.ProjectSummarySchema,
    completeness: exports.CompletenessSchema,
});
// Feature Schema
exports.FeatureSchema = zod_1.z.object({
    name: zod_1.z.string(),
    priority: zod_1.z.enum(['critical', 'high', 'medium', 'low']),
    complexity: zod_1.z.enum(['low', 'medium', 'high']),
    estimatedHours: zod_1.z.number(),
});
// Tech Stack Recommendation
exports.TechStackRecommendationSchema = zod_1.z.object({
    backend: zod_1.z.object({
        framework: zod_1.z.string(),
        reasoning: zod_1.z.string(),
    }).optional(),
    frontend: zod_1.z.object({
        framework: zod_1.z.string(),
        reasoning: zod_1.z.string(),
    }).optional(),
    database: zod_1.z.object({
        type: zod_1.z.string(),
        reasoning: zod_1.z.string(),
    }).optional(),
});
// Research Result
exports.ResearchResultSchema = zod_1.z.object({
    requiredFeatures: zod_1.z.array(exports.FeatureSchema),
    recommendedTechStack: exports.TechStackRecommendationSchema,
    architecture: zod_1.z.object({
        pattern: zod_1.z.string(),
        reasoning: zod_1.z.string(),
    }),
    estimatedComplexity: zod_1.z.enum(['low', 'medium', 'high']),
    estimatedTimeline: zod_1.z.string(),
});
// Agent Schema
exports.AgentSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: zod_1.z.string(),
    workloadPercentage: zod_1.z.number().min(0).max(100),
    responsibilities: zod_1.z.array(zod_1.z.string()),
    systemPrompt: zod_1.z.string(),
    successCriteria: zod_1.z.array(zod_1.z.string()),
});
// Tool/Package Recommendation
exports.PackageRecommendationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    version: zod_1.z.string(),
    category: zod_1.z.string(),
    reasoning: zod_1.z.string(),
});
exports.ToolRecommendationsSchema = zod_1.z.object({
    backend: zod_1.z.array(exports.PackageRecommendationSchema),
    frontend: zod_1.z.array(exports.PackageRecommendationSchema),
    devDependencies: zod_1.z.array(exports.PackageRecommendationSchema),
    claudeCodePlugins: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        reasoning: zod_1.z.string(),
    })).optional(),
    packageJson: zod_1.z.object({
        backend: zod_1.z.record(zod_1.z.any()),
        frontend: zod_1.z.record(zod_1.z.any()),
    }).optional(),
});
// ==================== ADVANCED FEATURES (v0.7) ====================
// Feature Priority Schema
exports.FeaturePrioritySchema = zod_1.z.object({
    feature: zod_1.z.string(),
    priority: zod_1.z.enum(['must', 'should', 'nice']),
    reasoning: zod_1.z.string().optional(),
});
// Non-Functional Requirements - Performance
exports.NFRPerformanceSchema = zod_1.z.object({
    responseTimeMs: zod_1.z.number().optional(),
    throughputRPS: zod_1.z.number().optional(),
    concurrentUsers: zod_1.z.number().optional(),
    requirements: zod_1.z.array(zod_1.z.string()).optional(),
});
// Non-Functional Requirements - Security
exports.NFRSecuritySchema = zod_1.z.object({
    authenticationRequired: zod_1.z.boolean(),
    authenticationMethod: zod_1.z.enum(['email-password', 'oauth', 'saml', 'magic-link', 'two-factor']).optional(),
    encryptionAtRest: zod_1.z.boolean().optional(),
    encryptionInTransit: zod_1.z.boolean().optional(),
    complianceStandards: zod_1.z.array(zod_1.z.string()).optional(),
    requirements: zod_1.z.array(zod_1.z.string()).optional(),
});
// Non-Functional Requirements - Scalability
exports.NFRScalabilitySchema = zod_1.z.object({
    expectedUsers: zod_1.z.number(),
    expectedUsersAtPeak: zod_1.z.number().optional(),
    growthRate: zod_1.z.string().optional(),
    dataVolume: zod_1.z.string().optional(),
    requirements: zod_1.z.array(zod_1.z.string()).optional(),
});
// Non-Functional Requirements - Accessibility
exports.NFRAccessibilitySchema = zod_1.z.object({
    wcagLevel: zod_1.z.enum(['A', 'AA', 'AAA']).optional(),
    screenReaderSupport: zod_1.z.boolean().optional(),
    keyboardNavigation: zod_1.z.boolean().optional(),
    requirements: zod_1.z.array(zod_1.z.string()).optional(),
});
// User Persona Schema
exports.PersonaSchema = zod_1.z.object({
    name: zod_1.z.string(),
    role: zod_1.z.string(),
    goals: zod_1.z.array(zod_1.z.string()),
    painPoints: zod_1.z.array(zod_1.z.string()),
    technicalSkill: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    frequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'rarely']).optional(),
});
// Complete Input Enrichment Schema
exports.InputEnrichmentSchema = zod_1.z.object({
    featurePriorities: zod_1.z.array(exports.FeaturePrioritySchema).optional(),
    nfrPerformance: exports.NFRPerformanceSchema.optional(),
    nfrSecurity: exports.NFRSecuritySchema.optional(),
    nfrScalability: exports.NFRScalabilitySchema.optional(),
    nfrAccessibility: exports.NFRAccessibilitySchema.optional(),
    personas: zod_1.z.array(exports.PersonaSchema).optional(),
    approachPreference: zod_1.z.enum(['api-first', 'ui-first', 'balanced']).optional(),
    budgetConstraint: zod_1.z.enum(['low', 'medium', 'high', 'unlimited']).optional(),
    complexitySlider: zod_1.z.number().min(1).max(10).optional(),
    scalabilityTier: zod_1.z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
    architectureStyle: zod_1.z.enum(['monolith', 'modular', 'microservices', 'auto']).optional(),
});
// Clarification Q&A Schema
exports.ClarificationQASchema = zod_1.z.object({
    question: zod_1.z.string(),
    answer: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    skipped: zod_1.z.boolean().optional(),
});
// Architecture Decision Record Schema
exports.ADRSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    status: zod_1.z.enum(['proposed', 'accepted', 'rejected', 'deprecated', 'superseded']),
    context: zod_1.z.string(),
    decision: zod_1.z.string(),
    consequences: zod_1.z.array(zod_1.z.string()),
    alternatives: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        pros: zod_1.z.array(zod_1.z.string()),
        cons: zod_1.z.array(zod_1.z.string()),
    })).optional(),
    dateCreated: zod_1.z.string().optional(),
});
// Diagram Schema
exports.DiagramSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(['c4-context', 'c4-container', 'er-diagram', 'sequence', 'flow']),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    mermaidCode: zod_1.z.string(),
});
// Cost Item Schema
exports.CostItemSchema = zod_1.z.object({
    service: zod_1.z.string(),
    category: zod_1.z.enum(['hosting', 'database', 'storage', 'bandwidth', 'third-party', 'developer', 'other']),
    monthlyEstimate: zod_1.z.number(),
    annualEstimate: zod_1.z.number().optional(),
    tier: zod_1.z.string(),
    assumptions: zod_1.z.array(zod_1.z.string()),
    scalingNotes: zod_1.z.string().optional(),
});
// Cost Estimate Schema
exports.CostEstimateSchema = zod_1.z.object({
    items: zod_1.z.array(exports.CostItemSchema),
    totalMonthly: zod_1.z.number(),
    totalAnnual: zod_1.z.number(),
    confidence: zod_1.z.enum(['low', 'medium', 'high']),
    notes: zod_1.z.array(zod_1.z.string()).optional(),
    developmentCost: zod_1.z.object({
        totalHours: zod_1.z.number(),
        hourlyRateMin: zod_1.z.number(),
        hourlyRateMax: zod_1.z.number(),
        totalMin: zod_1.z.number(),
        totalMax: zod_1.z.number(),
    }).optional(),
});
// Dependency Risk Schema
exports.DependencyRiskSchema = zod_1.z.object({
    packageName: zod_1.z.string(),
    version: zod_1.z.string().optional(),
    riskLevel: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    riskFactors: zod_1.z.array(zod_1.z.string()),
    mitigation: zod_1.z.string(),
    alternatives: zod_1.z.array(zod_1.z.string()).optional(),
    category: zod_1.z.enum(['security', 'maintenance', 'performance', 'compatibility', 'licensing']).optional(),
});
// Planning Details Schema (complete)
exports.PlanningDetailsSchema = zod_1.z.object({
    adrs: zod_1.z.array(exports.ADRSchema),
    diagrams: zod_1.z.object({
        c4Context: zod_1.z.string().optional(),
        c4Container: zod_1.z.string().optional(),
        erDiagram: zod_1.z.string().optional(),
        sequenceDiagrams: zod_1.z.array(zod_1.z.string()).optional(),
    }),
    costEstimate: exports.CostEstimateSchema,
    techJustification: exports.TechStackRecommendationSchema,
    dependencyRisks: zod_1.z.array(exports.DependencyRiskSchema),
});
//# sourceMappingURL=project.js.map