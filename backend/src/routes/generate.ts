import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AgentFactory } from '../services/agent-factory';
import { ToolRecommender } from '../services/tool-recommender';
import { BuildSpecGenerator } from '../services/build-spec-generator';

const router = express.Router();
const prisma = new PrismaClient();
const agentFactory = new AgentFactory();
const toolRecommender = new ToolRecommender();
const buildSpecGenerator = new BuildSpecGenerator();

/**
 * POST /api/generate/build-spec
 * Generate complete build specification (Tasks 1.3 & 1.4)
 * This creates: Agent team, Tool recommendations, and Complete build document
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

    // Fetch research result from database
    const research = await prisma.researchResult.findUnique({
      where: { id: researchId },
      include: { summary: true }
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
      estimatedComplexity: research.complexity,
      estimatedTimeline: research.timeline
    };

    console.log('[Generate] Generating agent team...');
    const agentTeam = agentFactory.generateAgentTeam(parsedData, researchResult);

    console.log('[Generate] Generating tool recommendations...');
    const tools = toolRecommender.recommendTools(parsedData, researchResult);

    console.log('[Generate] Fetching custom instructions...');
    const customInstructionsSetting = await prisma.settings.findUnique({
      where: { key: 'custom_instructions' },
    });
    const customInstructions = customInstructionsSetting?.value || '';

    console.log('[Generate] Generating complete build specification...');
    const buildSpec = buildSpecGenerator.generateBuildSpec(
      parsedData,
      researchResult,
      agentTeam,
      tools,
      customInstructions
    );

    // Store build spec in database (optional - for now just return it)
    // Could add a BuildSpec table to save these for future reference

    console.log('[Generate] Build specification complete!');

    res.json({
      success: true,
      data: {
        agentTeam,
        tools,
        buildSpec
      }
    });
  } catch (error) {
    console.error('[Generate] Error:', error);
    next(error);
  }
});

export default router;
