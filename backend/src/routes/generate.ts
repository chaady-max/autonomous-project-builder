import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AgentFactory } from '../services/agent-factory';
import { ToolRecommender } from '../services/tool-recommender';
import { BuildSpecGenerator } from '../services/build-spec-generator';
import { ADRGenerator } from '../services/adr-generator';
import { DiagramGenerator } from '../services/diagram-generator';
import { CostEstimator } from '../services/cost-estimator';
import { DependencyAnalyzer } from '../services/dependency-analyzer';

const router = express.Router();
const prisma = new PrismaClient();
const agentFactory = new AgentFactory();
const toolRecommender = new ToolRecommender();
const buildSpecGenerator = new BuildSpecGenerator();
const adrGenerator = new ADRGenerator();
const diagramGenerator = new DiagramGenerator();
const costEstimator = new CostEstimator();
const dependencyAnalyzer = new DependencyAnalyzer();

/**
 * POST /api/generate/build-spec
 * Generate complete build specification (v0.7: with planning intelligence)
 * This creates: Agent team, Tool recommendations, ADRs, Diagrams, Cost estimates, and Complete build document
 */
router.post('/build-spec', async (req, res, next) => {
  try {
    const { researchId } = req.body;

    if (!researchId) {
      return res.status(400).json({
        success: false,
        error: 'researchId is required',
      });
    }

    console.log(`[Generate] Creating build spec for research ${researchId}`);

    // Fetch research result with all related data (v0.7: includes enrichment)
    const research = await prisma.researchResult.findUnique({
      where: { id: researchId },
      include: {
        summary: {
          include: {
            enrichment: true,
          },
        },
      },
    });

    if (!research) {
      return res.status(404).json({
        success: false,
        error: 'Research result not found',
      });
    }

    // Parse the JSON data
    const parsedData = JSON.parse(research.summary.parsedData);
    const researchResult = {
      requiredFeatures: JSON.parse(research.requiredFeatures),
      recommendedTechStack: JSON.parse(research.techStack),
      architecture: JSON.parse(research.architecture),
      estimatedComplexity: research.complexity as 'low' | 'medium' | 'high',
      estimatedTimeline: research.timeline
    };

    // Parse enrichment data if exists (v0.7)
    let enrichment = undefined;
    if (research.summary.enrichment) {
      const e = research.summary.enrichment;
      enrichment = {
        featurePriorities: e.featurePriorities ? JSON.parse(e.featurePriorities) : undefined,
        nfrPerformance: e.nfrPerformance ? JSON.parse(e.nfrPerformance) : undefined,
        nfrSecurity: e.nfrSecurity ? JSON.parse(e.nfrSecurity) : undefined,
        nfrScalability: e.nfrScalability ? JSON.parse(e.nfrScalability) : undefined,
        nfrAccessibility: e.nfrAccessibility ? JSON.parse(e.nfrAccessibility) : undefined,
        personas: e.personas ? JSON.parse(e.personas) : undefined,
        approachPreference: e.approachPreference || undefined,
        budgetConstraint: e.budgetConstraint || undefined,
        complexitySlider: e.complexitySlider || undefined,
        scalabilityTier: e.scalabilityTier || undefined,
        architectureStyle: e.architectureStyle || undefined,
      };
    }

    // Parse clarification Q&A if exists (v0.7)
    const clarificationQA = research.clarificationQA ? JSON.parse(research.clarificationQA) : undefined;

    console.log('[Generate] Generating agent team...');
    const agentTeam = agentFactory.generateAgentTeam(parsedData, researchResult);

    console.log('[Generate] Generating tool recommendations...');
    const tools = toolRecommender.recommendTools(parsedData, researchResult);

    console.log('[Generate] Fetching custom instructions...');
    const customInstructionsSetting = await prisma.settings.findUnique({
      where: { key: 'custom_instructions' },
    });
    const customInstructions = customInstructionsSetting?.value || '';

    // ============ NEW: Generate Planning Intelligence (v0.7) ============

    console.log('[Generate] Generating Architecture Decision Records...');
    const adrs = await adrGenerator.generateADRs(parsedData, researchResult, enrichment, clarificationQA);

    console.log('[Generate] Generating system diagrams...');
    const diagrams = {
      c4Context: diagramGenerator.generateC4Context(parsedData, researchResult, enrichment),
      c4Container: diagramGenerator.generateC4Container(parsedData, researchResult, enrichment),
      erDiagram: diagramGenerator.generateERDiagram(parsedData, researchResult),
      sequenceDiagrams: diagramGenerator.generateSequenceDiagrams(parsedData, researchResult),
    };

    console.log('[Generate] Estimating project costs...');
    const costEstimate = costEstimator.estimateCosts(parsedData, researchResult, agentTeam, enrichment);

    console.log('[Generate] Analyzing dependency risks...');
    const dependencyRisks = await dependencyAnalyzer.analyzeDependencies(tools);

    console.log('[Generate] Saving planning details to database...');
    const planningDetails = await prisma.planningDetails.create({
      data: {
        researchId: research.id,
        adrs: JSON.stringify(adrs),
        c4ContextDiagram: diagrams.c4Context,
        c4ContainerDiagram: diagrams.c4Container,
        erDiagram: diagrams.erDiagram,
        sequenceDiagrams: JSON.stringify(diagrams.sequenceDiagrams),
        costEstimate: JSON.stringify(costEstimate),
        techJustification: JSON.stringify(researchResult.recommendedTechStack),
        dependencyRisks: JSON.stringify(dependencyRisks),
      },
    });

    console.log(`[Generate] Planning details saved (ID: ${planningDetails.id})`);

    // ======================================================================

    console.log('[Generate] Generating complete build specification...');
    const buildSpec = buildSpecGenerator.generateBuildSpec(
      parsedData,
      researchResult,
      agentTeam,
      tools,
      customInstructions,
      { adrs, diagrams, costEstimate, dependencyRisks } // v0.7: Pass planning intelligence
    );

    console.log('[Generate] Build specification complete!');

    res.json({
      success: true,
      data: {
        agentTeam,
        tools,
        buildSpec,
        planningDetails: {
          adrs,
          diagrams,
          costEstimate,
          dependencyRisks,
        },
      }
    });
  } catch (error) {
    console.error('[Generate] Error:', error);
    next(error);
  }
});

export default router;
