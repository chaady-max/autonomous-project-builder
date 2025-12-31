import { z } from 'zod';
export declare const ProjectSummarySchema: z.ZodObject<{
    projectName: z.ZodString;
    description: z.ZodString;
    features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    techStack: z.ZodOptional<z.ZodObject<{
        backend: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        frontend: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        database: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        backend?: string[] | undefined;
        frontend?: string[] | undefined;
        database?: string | undefined;
    }, {
        backend?: string[] | undefined;
        frontend?: string[] | undefined;
        database?: string | undefined;
    }>>;
    timeline: z.ZodOptional<z.ZodString>;
    teamSize: z.ZodOptional<z.ZodString>;
    constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    projectName: string;
    description: string;
    features?: string[] | undefined;
    techStack?: {
        backend?: string[] | undefined;
        frontend?: string[] | undefined;
        database?: string | undefined;
    } | undefined;
    timeline?: string | undefined;
    teamSize?: string | undefined;
    constraints?: string[] | undefined;
}, {
    projectName: string;
    description: string;
    features?: string[] | undefined;
    techStack?: {
        backend?: string[] | undefined;
        frontend?: string[] | undefined;
        database?: string | undefined;
    } | undefined;
    timeline?: string | undefined;
    teamSize?: string | undefined;
    constraints?: string[] | undefined;
}>;
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
export declare const CompletenessSchema: z.ZodObject<{
    score: z.ZodNumber;
    missing: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    score: number;
    missing: string[];
}, {
    score: number;
    missing: string[];
}>;
export type Completeness = z.infer<typeof CompletenessSchema>;
export declare const ParseSummaryResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodObject<{
        projectName: z.ZodString;
        description: z.ZodString;
        features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        techStack: z.ZodOptional<z.ZodObject<{
            backend: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            frontend: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            database: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            backend?: string[] | undefined;
            frontend?: string[] | undefined;
            database?: string | undefined;
        }, {
            backend?: string[] | undefined;
            frontend?: string[] | undefined;
            database?: string | undefined;
        }>>;
        timeline: z.ZodOptional<z.ZodString>;
        teamSize: z.ZodOptional<z.ZodString>;
        constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        projectName: string;
        description: string;
        features?: string[] | undefined;
        techStack?: {
            backend?: string[] | undefined;
            frontend?: string[] | undefined;
            database?: string | undefined;
        } | undefined;
        timeline?: string | undefined;
        teamSize?: string | undefined;
        constraints?: string[] | undefined;
    }, {
        projectName: string;
        description: string;
        features?: string[] | undefined;
        techStack?: {
            backend?: string[] | undefined;
            frontend?: string[] | undefined;
            database?: string | undefined;
        } | undefined;
        timeline?: string | undefined;
        teamSize?: string | undefined;
        constraints?: string[] | undefined;
    }>;
    completeness: z.ZodObject<{
        score: z.ZodNumber;
        missing: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        missing: string[];
    }, {
        score: number;
        missing: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data: {
        projectName: string;
        description: string;
        features?: string[] | undefined;
        techStack?: {
            backend?: string[] | undefined;
            frontend?: string[] | undefined;
            database?: string | undefined;
        } | undefined;
        timeline?: string | undefined;
        teamSize?: string | undefined;
        constraints?: string[] | undefined;
    };
    completeness: {
        score: number;
        missing: string[];
    };
}, {
    success: boolean;
    data: {
        projectName: string;
        description: string;
        features?: string[] | undefined;
        techStack?: {
            backend?: string[] | undefined;
            frontend?: string[] | undefined;
            database?: string | undefined;
        } | undefined;
        timeline?: string | undefined;
        teamSize?: string | undefined;
        constraints?: string[] | undefined;
    };
    completeness: {
        score: number;
        missing: string[];
    };
}>;
export type ParseSummaryResponse = z.infer<typeof ParseSummaryResponseSchema>;
export declare const FeatureSchema: z.ZodObject<{
    name: z.ZodString;
    priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
    complexity: z.ZodEnum<["low", "medium", "high"]>;
    estimatedHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    priority: "critical" | "high" | "medium" | "low";
    complexity: "high" | "medium" | "low";
    estimatedHours: number;
}, {
    name: string;
    priority: "critical" | "high" | "medium" | "low";
    complexity: "high" | "medium" | "low";
    estimatedHours: number;
}>;
export type Feature = z.infer<typeof FeatureSchema>;
export declare const TechStackRecommendationSchema: z.ZodObject<{
    backend: z.ZodOptional<z.ZodObject<{
        framework: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        framework: string;
        reasoning: string;
    }, {
        framework: string;
        reasoning: string;
    }>>;
    frontend: z.ZodOptional<z.ZodObject<{
        framework: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        framework: string;
        reasoning: string;
    }, {
        framework: string;
        reasoning: string;
    }>>;
    database: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        reasoning: string;
    }, {
        type: string;
        reasoning: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    backend?: {
        framework: string;
        reasoning: string;
    } | undefined;
    frontend?: {
        framework: string;
        reasoning: string;
    } | undefined;
    database?: {
        type: string;
        reasoning: string;
    } | undefined;
}, {
    backend?: {
        framework: string;
        reasoning: string;
    } | undefined;
    frontend?: {
        framework: string;
        reasoning: string;
    } | undefined;
    database?: {
        type: string;
        reasoning: string;
    } | undefined;
}>;
export type TechStackRecommendation = z.infer<typeof TechStackRecommendationSchema>;
export declare const ResearchResultSchema: z.ZodObject<{
    requiredFeatures: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        priority: z.ZodEnum<["critical", "high", "medium", "low"]>;
        complexity: z.ZodEnum<["low", "medium", "high"]>;
        estimatedHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        priority: "critical" | "high" | "medium" | "low";
        complexity: "high" | "medium" | "low";
        estimatedHours: number;
    }, {
        name: string;
        priority: "critical" | "high" | "medium" | "low";
        complexity: "high" | "medium" | "low";
        estimatedHours: number;
    }>, "many">;
    recommendedTechStack: z.ZodObject<{
        backend: z.ZodOptional<z.ZodObject<{
            framework: z.ZodString;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            framework: string;
            reasoning: string;
        }, {
            framework: string;
            reasoning: string;
        }>>;
        frontend: z.ZodOptional<z.ZodObject<{
            framework: z.ZodString;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            framework: string;
            reasoning: string;
        }, {
            framework: string;
            reasoning: string;
        }>>;
        database: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            reasoning: string;
        }, {
            type: string;
            reasoning: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        backend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        frontend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        database?: {
            type: string;
            reasoning: string;
        } | undefined;
    }, {
        backend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        frontend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        database?: {
            type: string;
            reasoning: string;
        } | undefined;
    }>;
    architecture: z.ZodObject<{
        pattern: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reasoning: string;
        pattern: string;
    }, {
        reasoning: string;
        pattern: string;
    }>;
    estimatedComplexity: z.ZodEnum<["low", "medium", "high"]>;
    estimatedTimeline: z.ZodString;
}, "strip", z.ZodTypeAny, {
    requiredFeatures: {
        name: string;
        priority: "critical" | "high" | "medium" | "low";
        complexity: "high" | "medium" | "low";
        estimatedHours: number;
    }[];
    recommendedTechStack: {
        backend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        frontend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        database?: {
            type: string;
            reasoning: string;
        } | undefined;
    };
    architecture: {
        reasoning: string;
        pattern: string;
    };
    estimatedComplexity: "high" | "medium" | "low";
    estimatedTimeline: string;
}, {
    requiredFeatures: {
        name: string;
        priority: "critical" | "high" | "medium" | "low";
        complexity: "high" | "medium" | "low";
        estimatedHours: number;
    }[];
    recommendedTechStack: {
        backend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        frontend?: {
            framework: string;
            reasoning: string;
        } | undefined;
        database?: {
            type: string;
            reasoning: string;
        } | undefined;
    };
    architecture: {
        reasoning: string;
        pattern: string;
    };
    estimatedComplexity: "high" | "medium" | "low";
    estimatedTimeline: string;
}>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;
export declare const AgentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    workloadPercentage: z.ZodNumber;
    responsibilities: z.ZodArray<z.ZodString, "many">;
    systemPrompt: z.ZodString;
    successCriteria: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    role: string;
    workloadPercentage: number;
    responsibilities: string[];
    systemPrompt: string;
    successCriteria: string[];
}, {
    name: string;
    id: string;
    role: string;
    workloadPercentage: number;
    responsibilities: string[];
    systemPrompt: string;
    successCriteria: string[];
}>;
export type Agent = z.infer<typeof AgentSchema>;
export declare const PackageRecommendationSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    category: z.ZodString;
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    reasoning: string;
    version: string;
    category: string;
}, {
    name: string;
    reasoning: string;
    version: string;
    category: string;
}>;
export type PackageRecommendation = z.infer<typeof PackageRecommendationSchema>;
export declare const ToolRecommendationsSchema: z.ZodObject<{
    backend: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        category: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }, {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }>, "many">;
    frontend: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        category: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }, {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }>, "many">;
    devDependencies: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        category: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }, {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }>, "many">;
    claudeCodePlugins: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reasoning: string;
    }, {
        name: string;
        reasoning: string;
    }>, "many">>;
    packageJson: z.ZodOptional<z.ZodObject<{
        backend: z.ZodRecord<z.ZodString, z.ZodAny>;
        frontend: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        backend: Record<string, any>;
        frontend: Record<string, any>;
    }, {
        backend: Record<string, any>;
        frontend: Record<string, any>;
    }>>;
}, "strip", z.ZodTypeAny, {
    backend: {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }[];
    frontend: {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }[];
    devDependencies: {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }[];
    claudeCodePlugins?: {
        name: string;
        reasoning: string;
    }[] | undefined;
    packageJson?: {
        backend: Record<string, any>;
        frontend: Record<string, any>;
    } | undefined;
}, {
    backend: {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }[];
    frontend: {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }[];
    devDependencies: {
        name: string;
        reasoning: string;
        version: string;
        category: string;
    }[];
    claudeCodePlugins?: {
        name: string;
        reasoning: string;
    }[] | undefined;
    packageJson?: {
        backend: Record<string, any>;
        frontend: Record<string, any>;
    } | undefined;
}>;
export type ToolRecommendations = z.infer<typeof ToolRecommendationsSchema>;
//# sourceMappingURL=project.d.ts.map