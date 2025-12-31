-- CreateTable
CREATE TABLE "InputEnrichment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summaryId" TEXT NOT NULL,
    "featurePriorities" TEXT,
    "nfrPerformance" TEXT,
    "nfrSecurity" TEXT,
    "nfrScalability" TEXT,
    "nfrAccessibility" TEXT,
    "personas" TEXT,
    "approachPreference" TEXT,
    "budgetConstraint" TEXT,
    "complexitySlider" INTEGER,
    "scalabilityTier" TEXT,
    "architectureStyle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InputEnrichment_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanningDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "researchId" TEXT NOT NULL,
    "adrs" TEXT NOT NULL,
    "c4ContextDiagram" TEXT,
    "c4ContainerDiagram" TEXT,
    "erDiagram" TEXT,
    "sequenceDiagrams" TEXT,
    "costEstimate" TEXT NOT NULL,
    "techJustification" TEXT NOT NULL,
    "dependencyRisks" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlanningDetails_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "ResearchResult" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ResearchResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summaryId" TEXT NOT NULL,
    "requiredFeatures" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "architecture" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "clarificationAsked" BOOLEAN NOT NULL DEFAULT false,
    "clarificationQA" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ResearchResult_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ResearchResult" ("architecture", "complexity", "createdAt", "id", "requiredFeatures", "summaryId", "techStack", "timeline", "updatedAt") SELECT "architecture", "complexity", "createdAt", "id", "requiredFeatures", "summaryId", "techStack", "timeline", "updatedAt" FROM "ResearchResult";
DROP TABLE "ResearchResult";
ALTER TABLE "new_ResearchResult" RENAME TO "ResearchResult";
CREATE UNIQUE INDEX "ResearchResult_summaryId_key" ON "ResearchResult"("summaryId");
CREATE TABLE "new_Summary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "parsedData" TEXT NOT NULL,
    "completeness" TEXT NOT NULL,
    "strictMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Summary" ("completeness", "content", "createdAt", "format", "id", "parsedData", "updatedAt") SELECT "completeness", "content", "createdAt", "format", "id", "parsedData", "updatedAt" FROM "Summary";
DROP TABLE "Summary";
ALTER TABLE "new_Summary" RENAME TO "Summary";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "InputEnrichment_summaryId_key" ON "InputEnrichment"("summaryId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningDetails_researchId_key" ON "PlanningDetails"("researchId");
