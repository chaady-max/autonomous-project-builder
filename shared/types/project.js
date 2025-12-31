"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRecommendationsSchema = exports.PackageRecommendationSchema = exports.AgentSchema = exports.ResearchResultSchema = exports.TechStackRecommendationSchema = exports.FeatureSchema = exports.ParseSummaryResponseSchema = exports.CompletenessSchema = exports.ProjectSummarySchema = void 0;
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
//# sourceMappingURL=project.js.map