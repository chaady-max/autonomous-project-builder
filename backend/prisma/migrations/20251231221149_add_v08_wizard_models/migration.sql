-- CreateTable
CREATE TABLE "WizardSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "status" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completenessScore" REAL NOT NULL DEFAULT 0.0,
    "projectName" TEXT,
    "projectType" TEXT,
    "description" TEXT,
    "timeline" TEXT,
    "teamSize" TEXT,
    "budgetTier" TEXT,
    "nonNegotiables" TEXT,
    "personas" TEXT,
    "features" TEXT,
    "inScope" TEXT,
    "outOfScope" TEXT,
    "userFlows" TEXT,
    "techStack" TEXT,
    "performanceReqs" TEXT,
    "securityReqs" TEXT,
    "scalabilityReqs" TEXT,
    "accessibilityReq" TEXT,
    "dataModel" TEXT,
    "externalAPIs" TEXT,
    "dataPrivacy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GeneratedSpec" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "decisionsYaml" TEXT NOT NULL,
    "specMarkdown" TEXT NOT NULL,
    "sections" TEXT NOT NULL,
    "totalCharacters" INTEGER NOT NULL,
    "totalSections" INTEGER NOT NULL DEFAULT 18,
    "avgSectionLength" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GeneratedSpec_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WizardSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Artifact_specId_fkey" FOREIGN KEY ("specId") REFERENCES "GeneratedSpec" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QualityReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "overallScore" REAL NOT NULL,
    "sectionScores" TEXT NOT NULL,
    "errors" TEXT NOT NULL,
    "warnings" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "vagueTermsFound" TEXT NOT NULL,
    "missingDetails" TEXT NOT NULL,
    "passedQualityGate" BOOLEAN NOT NULL DEFAULT false,
    "requiredFixes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QualityReport_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WizardSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepoScanResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "detectedTech" TEXT NOT NULL,
    "existingFeatures" TEXT NOT NULL,
    "fileStructure" TEXT NOT NULL,
    "dependencies" TEXT NOT NULL,
    "migrations" TEXT,
    "gaps" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RepoScanResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WizardSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedSpec_sessionId_key" ON "GeneratedSpec"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "QualityReport_sessionId_key" ON "QualityReport"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "RepoScanResult_sessionId_key" ON "RepoScanResult"("sessionId");
