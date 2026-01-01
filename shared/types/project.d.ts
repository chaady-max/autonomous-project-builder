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
export declare const FeaturePrioritySchema: z.ZodObject<{
    feature: z.ZodString;
    priority: z.ZodEnum<["must", "should", "nice"]>;
    reasoning: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    priority: "must" | "should" | "nice";
    feature: string;
    reasoning?: string | undefined;
}, {
    priority: "must" | "should" | "nice";
    feature: string;
    reasoning?: string | undefined;
}>;
export type FeaturePriority = z.infer<typeof FeaturePrioritySchema>;
export declare const NFRPerformanceSchema: z.ZodObject<{
    responseTimeMs: z.ZodOptional<z.ZodNumber>;
    throughputRPS: z.ZodOptional<z.ZodNumber>;
    concurrentUsers: z.ZodOptional<z.ZodNumber>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    responseTimeMs?: number | undefined;
    throughputRPS?: number | undefined;
    concurrentUsers?: number | undefined;
    requirements?: string[] | undefined;
}, {
    responseTimeMs?: number | undefined;
    throughputRPS?: number | undefined;
    concurrentUsers?: number | undefined;
    requirements?: string[] | undefined;
}>;
export type NFRPerformance = z.infer<typeof NFRPerformanceSchema>;
export declare const NFRSecuritySchema: z.ZodObject<{
    authenticationRequired: z.ZodBoolean;
    authenticationMethod: z.ZodOptional<z.ZodEnum<["email-password", "oauth", "saml", "magic-link", "two-factor"]>>;
    encryptionAtRest: z.ZodOptional<z.ZodBoolean>;
    encryptionInTransit: z.ZodOptional<z.ZodBoolean>;
    complianceStandards: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    authenticationRequired: boolean;
    requirements?: string[] | undefined;
    authenticationMethod?: "email-password" | "oauth" | "saml" | "magic-link" | "two-factor" | undefined;
    encryptionAtRest?: boolean | undefined;
    encryptionInTransit?: boolean | undefined;
    complianceStandards?: string[] | undefined;
}, {
    authenticationRequired: boolean;
    requirements?: string[] | undefined;
    authenticationMethod?: "email-password" | "oauth" | "saml" | "magic-link" | "two-factor" | undefined;
    encryptionAtRest?: boolean | undefined;
    encryptionInTransit?: boolean | undefined;
    complianceStandards?: string[] | undefined;
}>;
export type NFRSecurity = z.infer<typeof NFRSecuritySchema>;
export declare const NFRScalabilitySchema: z.ZodObject<{
    expectedUsers: z.ZodNumber;
    expectedUsersAtPeak: z.ZodOptional<z.ZodNumber>;
    growthRate: z.ZodOptional<z.ZodString>;
    dataVolume: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    expectedUsers: number;
    requirements?: string[] | undefined;
    expectedUsersAtPeak?: number | undefined;
    growthRate?: string | undefined;
    dataVolume?: string | undefined;
}, {
    expectedUsers: number;
    requirements?: string[] | undefined;
    expectedUsersAtPeak?: number | undefined;
    growthRate?: string | undefined;
    dataVolume?: string | undefined;
}>;
export type NFRScalability = z.infer<typeof NFRScalabilitySchema>;
export declare const NFRAccessibilitySchema: z.ZodObject<{
    wcagLevel: z.ZodOptional<z.ZodEnum<["A", "AA", "AAA"]>>;
    screenReaderSupport: z.ZodOptional<z.ZodBoolean>;
    keyboardNavigation: z.ZodOptional<z.ZodBoolean>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    requirements?: string[] | undefined;
    wcagLevel?: "A" | "AA" | "AAA" | undefined;
    screenReaderSupport?: boolean | undefined;
    keyboardNavigation?: boolean | undefined;
}, {
    requirements?: string[] | undefined;
    wcagLevel?: "A" | "AA" | "AAA" | undefined;
    screenReaderSupport?: boolean | undefined;
    keyboardNavigation?: boolean | undefined;
}>;
export type NFRAccessibility = z.infer<typeof NFRAccessibilitySchema>;
export declare const PersonaSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    goals: z.ZodArray<z.ZodString, "many">;
    painPoints: z.ZodArray<z.ZodString, "many">;
    technicalSkill: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
    frequency: z.ZodOptional<z.ZodEnum<["daily", "weekly", "monthly", "rarely"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    role: string;
    goals: string[];
    painPoints: string[];
    technicalSkill?: "beginner" | "intermediate" | "advanced" | undefined;
    frequency?: "daily" | "weekly" | "monthly" | "rarely" | undefined;
}, {
    name: string;
    role: string;
    goals: string[];
    painPoints: string[];
    technicalSkill?: "beginner" | "intermediate" | "advanced" | undefined;
    frequency?: "daily" | "weekly" | "monthly" | "rarely" | undefined;
}>;
export type Persona = z.infer<typeof PersonaSchema>;
export declare const InputEnrichmentSchema: z.ZodObject<{
    featurePriorities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        feature: z.ZodString;
        priority: z.ZodEnum<["must", "should", "nice"]>;
        reasoning: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        priority: "must" | "should" | "nice";
        feature: string;
        reasoning?: string | undefined;
    }, {
        priority: "must" | "should" | "nice";
        feature: string;
        reasoning?: string | undefined;
    }>, "many">>;
    nfrPerformance: z.ZodOptional<z.ZodObject<{
        responseTimeMs: z.ZodOptional<z.ZodNumber>;
        throughputRPS: z.ZodOptional<z.ZodNumber>;
        concurrentUsers: z.ZodOptional<z.ZodNumber>;
        requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        responseTimeMs?: number | undefined;
        throughputRPS?: number | undefined;
        concurrentUsers?: number | undefined;
        requirements?: string[] | undefined;
    }, {
        responseTimeMs?: number | undefined;
        throughputRPS?: number | undefined;
        concurrentUsers?: number | undefined;
        requirements?: string[] | undefined;
    }>>;
    nfrSecurity: z.ZodOptional<z.ZodObject<{
        authenticationRequired: z.ZodBoolean;
        authenticationMethod: z.ZodOptional<z.ZodEnum<["email-password", "oauth", "saml", "magic-link", "two-factor"]>>;
        encryptionAtRest: z.ZodOptional<z.ZodBoolean>;
        encryptionInTransit: z.ZodOptional<z.ZodBoolean>;
        complianceStandards: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        authenticationRequired: boolean;
        requirements?: string[] | undefined;
        authenticationMethod?: "email-password" | "oauth" | "saml" | "magic-link" | "two-factor" | undefined;
        encryptionAtRest?: boolean | undefined;
        encryptionInTransit?: boolean | undefined;
        complianceStandards?: string[] | undefined;
    }, {
        authenticationRequired: boolean;
        requirements?: string[] | undefined;
        authenticationMethod?: "email-password" | "oauth" | "saml" | "magic-link" | "two-factor" | undefined;
        encryptionAtRest?: boolean | undefined;
        encryptionInTransit?: boolean | undefined;
        complianceStandards?: string[] | undefined;
    }>>;
    nfrScalability: z.ZodOptional<z.ZodObject<{
        expectedUsers: z.ZodNumber;
        expectedUsersAtPeak: z.ZodOptional<z.ZodNumber>;
        growthRate: z.ZodOptional<z.ZodString>;
        dataVolume: z.ZodOptional<z.ZodString>;
        requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        expectedUsers: number;
        requirements?: string[] | undefined;
        expectedUsersAtPeak?: number | undefined;
        growthRate?: string | undefined;
        dataVolume?: string | undefined;
    }, {
        expectedUsers: number;
        requirements?: string[] | undefined;
        expectedUsersAtPeak?: number | undefined;
        growthRate?: string | undefined;
        dataVolume?: string | undefined;
    }>>;
    nfrAccessibility: z.ZodOptional<z.ZodObject<{
        wcagLevel: z.ZodOptional<z.ZodEnum<["A", "AA", "AAA"]>>;
        screenReaderSupport: z.ZodOptional<z.ZodBoolean>;
        keyboardNavigation: z.ZodOptional<z.ZodBoolean>;
        requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        requirements?: string[] | undefined;
        wcagLevel?: "A" | "AA" | "AAA" | undefined;
        screenReaderSupport?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
    }, {
        requirements?: string[] | undefined;
        wcagLevel?: "A" | "AA" | "AAA" | undefined;
        screenReaderSupport?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
    }>>;
    personas: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        role: z.ZodString;
        goals: z.ZodArray<z.ZodString, "many">;
        painPoints: z.ZodArray<z.ZodString, "many">;
        technicalSkill: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
        frequency: z.ZodOptional<z.ZodEnum<["daily", "weekly", "monthly", "rarely"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        role: string;
        goals: string[];
        painPoints: string[];
        technicalSkill?: "beginner" | "intermediate" | "advanced" | undefined;
        frequency?: "daily" | "weekly" | "monthly" | "rarely" | undefined;
    }, {
        name: string;
        role: string;
        goals: string[];
        painPoints: string[];
        technicalSkill?: "beginner" | "intermediate" | "advanced" | undefined;
        frequency?: "daily" | "weekly" | "monthly" | "rarely" | undefined;
    }>, "many">>;
    approachPreference: z.ZodOptional<z.ZodEnum<["api-first", "ui-first", "balanced"]>>;
    budgetConstraint: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "unlimited"]>>;
    complexitySlider: z.ZodOptional<z.ZodNumber>;
    scalabilityTier: z.ZodOptional<z.ZodEnum<["small", "medium", "large", "enterprise"]>>;
    architectureStyle: z.ZodOptional<z.ZodEnum<["monolith", "modular", "microservices", "auto"]>>;
}, "strip", z.ZodTypeAny, {
    featurePriorities?: {
        priority: "must" | "should" | "nice";
        feature: string;
        reasoning?: string | undefined;
    }[] | undefined;
    nfrPerformance?: {
        responseTimeMs?: number | undefined;
        throughputRPS?: number | undefined;
        concurrentUsers?: number | undefined;
        requirements?: string[] | undefined;
    } | undefined;
    nfrSecurity?: {
        authenticationRequired: boolean;
        requirements?: string[] | undefined;
        authenticationMethod?: "email-password" | "oauth" | "saml" | "magic-link" | "two-factor" | undefined;
        encryptionAtRest?: boolean | undefined;
        encryptionInTransit?: boolean | undefined;
        complianceStandards?: string[] | undefined;
    } | undefined;
    nfrScalability?: {
        expectedUsers: number;
        requirements?: string[] | undefined;
        expectedUsersAtPeak?: number | undefined;
        growthRate?: string | undefined;
        dataVolume?: string | undefined;
    } | undefined;
    nfrAccessibility?: {
        requirements?: string[] | undefined;
        wcagLevel?: "A" | "AA" | "AAA" | undefined;
        screenReaderSupport?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
    } | undefined;
    personas?: {
        name: string;
        role: string;
        goals: string[];
        painPoints: string[];
        technicalSkill?: "beginner" | "intermediate" | "advanced" | undefined;
        frequency?: "daily" | "weekly" | "monthly" | "rarely" | undefined;
    }[] | undefined;
    approachPreference?: "api-first" | "ui-first" | "balanced" | undefined;
    budgetConstraint?: "high" | "medium" | "low" | "unlimited" | undefined;
    complexitySlider?: number | undefined;
    scalabilityTier?: "medium" | "small" | "large" | "enterprise" | undefined;
    architectureStyle?: "monolith" | "modular" | "microservices" | "auto" | undefined;
}, {
    featurePriorities?: {
        priority: "must" | "should" | "nice";
        feature: string;
        reasoning?: string | undefined;
    }[] | undefined;
    nfrPerformance?: {
        responseTimeMs?: number | undefined;
        throughputRPS?: number | undefined;
        concurrentUsers?: number | undefined;
        requirements?: string[] | undefined;
    } | undefined;
    nfrSecurity?: {
        authenticationRequired: boolean;
        requirements?: string[] | undefined;
        authenticationMethod?: "email-password" | "oauth" | "saml" | "magic-link" | "two-factor" | undefined;
        encryptionAtRest?: boolean | undefined;
        encryptionInTransit?: boolean | undefined;
        complianceStandards?: string[] | undefined;
    } | undefined;
    nfrScalability?: {
        expectedUsers: number;
        requirements?: string[] | undefined;
        expectedUsersAtPeak?: number | undefined;
        growthRate?: string | undefined;
        dataVolume?: string | undefined;
    } | undefined;
    nfrAccessibility?: {
        requirements?: string[] | undefined;
        wcagLevel?: "A" | "AA" | "AAA" | undefined;
        screenReaderSupport?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
    } | undefined;
    personas?: {
        name: string;
        role: string;
        goals: string[];
        painPoints: string[];
        technicalSkill?: "beginner" | "intermediate" | "advanced" | undefined;
        frequency?: "daily" | "weekly" | "monthly" | "rarely" | undefined;
    }[] | undefined;
    approachPreference?: "api-first" | "ui-first" | "balanced" | undefined;
    budgetConstraint?: "high" | "medium" | "low" | "unlimited" | undefined;
    complexitySlider?: number | undefined;
    scalabilityTier?: "medium" | "small" | "large" | "enterprise" | undefined;
    architectureStyle?: "monolith" | "modular" | "microservices" | "auto" | undefined;
}>;
export type InputEnrichment = z.infer<typeof InputEnrichmentSchema>;
export declare const ClarificationQASchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
    timestamp: z.ZodString;
    skipped: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
    timestamp: string;
    skipped?: boolean | undefined;
}, {
    question: string;
    answer: string;
    timestamp: string;
    skipped?: boolean | undefined;
}>;
export type ClarificationQA = z.infer<typeof ClarificationQASchema>;
export declare const ADRSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    status: z.ZodEnum<["proposed", "accepted", "rejected", "deprecated", "superseded"]>;
    context: z.ZodString;
    decision: z.ZodString;
    consequences: z.ZodArray<z.ZodString, "many">;
    alternatives: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pros: z.ZodArray<z.ZodString, "many">;
        cons: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        pros: string[];
        cons: string[];
    }, {
        name: string;
        pros: string[];
        cons: string[];
    }>, "many">>;
    dateCreated: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
    id: number;
    title: string;
    context: string;
    decision: string;
    consequences: string[];
    alternatives?: {
        name: string;
        pros: string[];
        cons: string[];
    }[] | undefined;
    dateCreated?: string | undefined;
}, {
    status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
    id: number;
    title: string;
    context: string;
    decision: string;
    consequences: string[];
    alternatives?: {
        name: string;
        pros: string[];
        cons: string[];
    }[] | undefined;
    dateCreated?: string | undefined;
}>;
export type ADR = z.infer<typeof ADRSchema>;
export declare const DiagramSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["c4-context", "c4-container", "er-diagram", "sequence", "flow"]>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mermaidCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "c4-context" | "c4-container" | "er-diagram" | "sequence" | "flow";
    id: string;
    title: string;
    mermaidCode: string;
    description?: string | undefined;
}, {
    type: "c4-context" | "c4-container" | "er-diagram" | "sequence" | "flow";
    id: string;
    title: string;
    mermaidCode: string;
    description?: string | undefined;
}>;
export type Diagram = z.infer<typeof DiagramSchema>;
export declare const CostItemSchema: z.ZodObject<{
    service: z.ZodString;
    category: z.ZodEnum<["hosting", "database", "storage", "bandwidth", "third-party", "developer", "other"]>;
    monthlyEstimate: z.ZodNumber;
    annualEstimate: z.ZodOptional<z.ZodNumber>;
    tier: z.ZodString;
    assumptions: z.ZodArray<z.ZodString, "many">;
    scalingNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
    service: string;
    monthlyEstimate: number;
    tier: string;
    assumptions: string[];
    annualEstimate?: number | undefined;
    scalingNotes?: string | undefined;
}, {
    category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
    service: string;
    monthlyEstimate: number;
    tier: string;
    assumptions: string[];
    annualEstimate?: number | undefined;
    scalingNotes?: string | undefined;
}>;
export type CostItem = z.infer<typeof CostItemSchema>;
export declare const CostEstimateSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        service: z.ZodString;
        category: z.ZodEnum<["hosting", "database", "storage", "bandwidth", "third-party", "developer", "other"]>;
        monthlyEstimate: z.ZodNumber;
        annualEstimate: z.ZodOptional<z.ZodNumber>;
        tier: z.ZodString;
        assumptions: z.ZodArray<z.ZodString, "many">;
        scalingNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
        service: string;
        monthlyEstimate: number;
        tier: string;
        assumptions: string[];
        annualEstimate?: number | undefined;
        scalingNotes?: string | undefined;
    }, {
        category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
        service: string;
        monthlyEstimate: number;
        tier: string;
        assumptions: string[];
        annualEstimate?: number | undefined;
        scalingNotes?: string | undefined;
    }>, "many">;
    totalMonthly: z.ZodNumber;
    totalAnnual: z.ZodNumber;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
    notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    developmentCost: z.ZodOptional<z.ZodObject<{
        totalHours: z.ZodNumber;
        hourlyRateMin: z.ZodNumber;
        hourlyRateMax: z.ZodNumber;
        totalMin: z.ZodNumber;
        totalMax: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalHours: number;
        hourlyRateMin: number;
        hourlyRateMax: number;
        totalMin: number;
        totalMax: number;
    }, {
        totalHours: number;
        hourlyRateMin: number;
        hourlyRateMax: number;
        totalMin: number;
        totalMax: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    items: {
        category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
        service: string;
        monthlyEstimate: number;
        tier: string;
        assumptions: string[];
        annualEstimate?: number | undefined;
        scalingNotes?: string | undefined;
    }[];
    totalMonthly: number;
    totalAnnual: number;
    confidence: "high" | "medium" | "low";
    notes?: string[] | undefined;
    developmentCost?: {
        totalHours: number;
        hourlyRateMin: number;
        hourlyRateMax: number;
        totalMin: number;
        totalMax: number;
    } | undefined;
}, {
    items: {
        category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
        service: string;
        monthlyEstimate: number;
        tier: string;
        assumptions: string[];
        annualEstimate?: number | undefined;
        scalingNotes?: string | undefined;
    }[];
    totalMonthly: number;
    totalAnnual: number;
    confidence: "high" | "medium" | "low";
    notes?: string[] | undefined;
    developmentCost?: {
        totalHours: number;
        hourlyRateMin: number;
        hourlyRateMax: number;
        totalMin: number;
        totalMax: number;
    } | undefined;
}>;
export type CostEstimate = z.infer<typeof CostEstimateSchema>;
export declare const DependencyRiskSchema: z.ZodObject<{
    packageName: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
    riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
    riskFactors: z.ZodArray<z.ZodString, "many">;
    mitigation: z.ZodString;
    alternatives: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    category: z.ZodOptional<z.ZodEnum<["security", "maintenance", "performance", "compatibility", "licensing"]>>;
}, "strip", z.ZodTypeAny, {
    packageName: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    riskFactors: string[];
    mitigation: string;
    version?: string | undefined;
    category?: "security" | "maintenance" | "performance" | "compatibility" | "licensing" | undefined;
    alternatives?: string[] | undefined;
}, {
    packageName: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    riskFactors: string[];
    mitigation: string;
    version?: string | undefined;
    category?: "security" | "maintenance" | "performance" | "compatibility" | "licensing" | undefined;
    alternatives?: string[] | undefined;
}>;
export type DependencyRisk = z.infer<typeof DependencyRiskSchema>;
export declare const PlanningDetailsSchema: z.ZodObject<{
    adrs: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        title: z.ZodString;
        status: z.ZodEnum<["proposed", "accepted", "rejected", "deprecated", "superseded"]>;
        context: z.ZodString;
        decision: z.ZodString;
        consequences: z.ZodArray<z.ZodString, "many">;
        alternatives: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            pros: z.ZodArray<z.ZodString, "many">;
            cons: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            pros: string[];
            cons: string[];
        }, {
            name: string;
            pros: string[];
            cons: string[];
        }>, "many">>;
        dateCreated: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
        id: number;
        title: string;
        context: string;
        decision: string;
        consequences: string[];
        alternatives?: {
            name: string;
            pros: string[];
            cons: string[];
        }[] | undefined;
        dateCreated?: string | undefined;
    }, {
        status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
        id: number;
        title: string;
        context: string;
        decision: string;
        consequences: string[];
        alternatives?: {
            name: string;
            pros: string[];
            cons: string[];
        }[] | undefined;
        dateCreated?: string | undefined;
    }>, "many">;
    diagrams: z.ZodObject<{
        c4Context: z.ZodOptional<z.ZodString>;
        c4Container: z.ZodOptional<z.ZodString>;
        erDiagram: z.ZodOptional<z.ZodString>;
        sequenceDiagrams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        c4Context?: string | undefined;
        c4Container?: string | undefined;
        erDiagram?: string | undefined;
        sequenceDiagrams?: string[] | undefined;
    }, {
        c4Context?: string | undefined;
        c4Container?: string | undefined;
        erDiagram?: string | undefined;
        sequenceDiagrams?: string[] | undefined;
    }>;
    costEstimate: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            service: z.ZodString;
            category: z.ZodEnum<["hosting", "database", "storage", "bandwidth", "third-party", "developer", "other"]>;
            monthlyEstimate: z.ZodNumber;
            annualEstimate: z.ZodOptional<z.ZodNumber>;
            tier: z.ZodString;
            assumptions: z.ZodArray<z.ZodString, "many">;
            scalingNotes: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
            service: string;
            monthlyEstimate: number;
            tier: string;
            assumptions: string[];
            annualEstimate?: number | undefined;
            scalingNotes?: string | undefined;
        }, {
            category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
            service: string;
            monthlyEstimate: number;
            tier: string;
            assumptions: string[];
            annualEstimate?: number | undefined;
            scalingNotes?: string | undefined;
        }>, "many">;
        totalMonthly: z.ZodNumber;
        totalAnnual: z.ZodNumber;
        confidence: z.ZodEnum<["low", "medium", "high"]>;
        notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        developmentCost: z.ZodOptional<z.ZodObject<{
            totalHours: z.ZodNumber;
            hourlyRateMin: z.ZodNumber;
            hourlyRateMax: z.ZodNumber;
            totalMin: z.ZodNumber;
            totalMax: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            totalHours: number;
            hourlyRateMin: number;
            hourlyRateMax: number;
            totalMin: number;
            totalMax: number;
        }, {
            totalHours: number;
            hourlyRateMin: number;
            hourlyRateMax: number;
            totalMin: number;
            totalMax: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        items: {
            category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
            service: string;
            monthlyEstimate: number;
            tier: string;
            assumptions: string[];
            annualEstimate?: number | undefined;
            scalingNotes?: string | undefined;
        }[];
        totalMonthly: number;
        totalAnnual: number;
        confidence: "high" | "medium" | "low";
        notes?: string[] | undefined;
        developmentCost?: {
            totalHours: number;
            hourlyRateMin: number;
            hourlyRateMax: number;
            totalMin: number;
            totalMax: number;
        } | undefined;
    }, {
        items: {
            category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
            service: string;
            monthlyEstimate: number;
            tier: string;
            assumptions: string[];
            annualEstimate?: number | undefined;
            scalingNotes?: string | undefined;
        }[];
        totalMonthly: number;
        totalAnnual: number;
        confidence: "high" | "medium" | "low";
        notes?: string[] | undefined;
        developmentCost?: {
            totalHours: number;
            hourlyRateMin: number;
            hourlyRateMax: number;
            totalMin: number;
            totalMax: number;
        } | undefined;
    }>;
    techJustification: z.ZodObject<{
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
    dependencyRisks: z.ZodArray<z.ZodObject<{
        packageName: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
        riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
        riskFactors: z.ZodArray<z.ZodString, "many">;
        mitigation: z.ZodString;
        alternatives: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        category: z.ZodOptional<z.ZodEnum<["security", "maintenance", "performance", "compatibility", "licensing"]>>;
    }, "strip", z.ZodTypeAny, {
        packageName: string;
        riskLevel: "critical" | "high" | "medium" | "low";
        riskFactors: string[];
        mitigation: string;
        version?: string | undefined;
        category?: "security" | "maintenance" | "performance" | "compatibility" | "licensing" | undefined;
        alternatives?: string[] | undefined;
    }, {
        packageName: string;
        riskLevel: "critical" | "high" | "medium" | "low";
        riskFactors: string[];
        mitigation: string;
        version?: string | undefined;
        category?: "security" | "maintenance" | "performance" | "compatibility" | "licensing" | undefined;
        alternatives?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    adrs: {
        status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
        id: number;
        title: string;
        context: string;
        decision: string;
        consequences: string[];
        alternatives?: {
            name: string;
            pros: string[];
            cons: string[];
        }[] | undefined;
        dateCreated?: string | undefined;
    }[];
    diagrams: {
        c4Context?: string | undefined;
        c4Container?: string | undefined;
        erDiagram?: string | undefined;
        sequenceDiagrams?: string[] | undefined;
    };
    costEstimate: {
        items: {
            category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
            service: string;
            monthlyEstimate: number;
            tier: string;
            assumptions: string[];
            annualEstimate?: number | undefined;
            scalingNotes?: string | undefined;
        }[];
        totalMonthly: number;
        totalAnnual: number;
        confidence: "high" | "medium" | "low";
        notes?: string[] | undefined;
        developmentCost?: {
            totalHours: number;
            hourlyRateMin: number;
            hourlyRateMax: number;
            totalMin: number;
            totalMax: number;
        } | undefined;
    };
    techJustification: {
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
    dependencyRisks: {
        packageName: string;
        riskLevel: "critical" | "high" | "medium" | "low";
        riskFactors: string[];
        mitigation: string;
        version?: string | undefined;
        category?: "security" | "maintenance" | "performance" | "compatibility" | "licensing" | undefined;
        alternatives?: string[] | undefined;
    }[];
}, {
    adrs: {
        status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
        id: number;
        title: string;
        context: string;
        decision: string;
        consequences: string[];
        alternatives?: {
            name: string;
            pros: string[];
            cons: string[];
        }[] | undefined;
        dateCreated?: string | undefined;
    }[];
    diagrams: {
        c4Context?: string | undefined;
        c4Container?: string | undefined;
        erDiagram?: string | undefined;
        sequenceDiagrams?: string[] | undefined;
    };
    costEstimate: {
        items: {
            category: "database" | "hosting" | "storage" | "bandwidth" | "third-party" | "developer" | "other";
            service: string;
            monthlyEstimate: number;
            tier: string;
            assumptions: string[];
            annualEstimate?: number | undefined;
            scalingNotes?: string | undefined;
        }[];
        totalMonthly: number;
        totalAnnual: number;
        confidence: "high" | "medium" | "low";
        notes?: string[] | undefined;
        developmentCost?: {
            totalHours: number;
            hourlyRateMin: number;
            hourlyRateMax: number;
            totalMin: number;
            totalMax: number;
        } | undefined;
    };
    techJustification: {
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
    dependencyRisks: {
        packageName: string;
        riskLevel: "critical" | "high" | "medium" | "low";
        riskFactors: string[];
        mitigation: string;
        version?: string | undefined;
        category?: "security" | "maintenance" | "performance" | "compatibility" | "licensing" | undefined;
        alternatives?: string[] | undefined;
    }[];
}>;
export type PlanningDetails = z.infer<typeof PlanningDetailsSchema>;
//# sourceMappingURL=project.d.ts.map