import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ProjectSummaryParser } from '../services/parser';
import { AIResearcher } from '../services/researcher';
import { ParseSummaryResponseSchema } from '../../../shared/types/project';

const router = express.Router();
const prisma = new PrismaClient();
const parser = new ProjectSummaryParser();

/**
 * POST /api/analyze/summary
 * Parse project summary from various formats
 */
router.post('/summary', async (req, res, next) => {
  try {
    const { content, format } = req.body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "content" field',
      });
    }

    if (!['yaml', 'markdown', 'text'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format. Must be "yaml", "markdown", or "text"',
      });
    }

    console.log(`[Parser] Parsing ${format} content (${content.length} chars)`);

    // Parse the summary
    const { data, completeness } = await parser.parse(content, format);

    console.log(`[Parser] Success! Completeness: ${(completeness.score * 100).toFixed(0)}%`);

    // Save to database (stringify JSON for SQLite)
    const summary = await prisma.summary.create({
      data: {
        content,
        format,
        parsedData: JSON.stringify(data),
        completeness: JSON.stringify(completeness),
      },
    });

    // Validate response schema
    const response = ParseSummaryResponseSchema.parse({
      success: true,
      data,
      completeness,
    });

    res.json({
      ...response,
      summaryId: summary.id,
    });
  } catch (error) {
    console.error('[Parser] Error:', error);
    next(error);
  }
});

/**
 * GET /api/analyze/summary/:id
 * Retrieve a parsed summary by ID
 */
router.get('/summary/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const summary = await prisma.summary.findUnique({
      where: { id },
    });

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found',
      });
    }

    res.json({
      success: true,
      data: JSON.parse(summary.parsedData),
      completeness: JSON.parse(summary.completeness),
      summaryId: summary.id,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analyze/research
 * Analyze project requirements with Claude API (Task 1.2)
 */
router.post('/research', async (req, res, next) => {
  try {
    const { summaryId, parsedData } = req.body;

    // Validate input
    if (!summaryId || !parsedData) {
      return res.status(400).json({
        success: false,
        error: 'Missing summaryId or parsedData',
      });
    }

    console.log(`[Research] Starting AI analysis for summary ${summaryId}`);

    // Create fresh researcher instance to check current API key
    const researcher = new AIResearcher();

    // Call Claude API to analyze the project
    const researchResult = await researcher.analyzeProject(parsedData);

    console.log('[Research] AI analysis complete, saving to database');

    // Save research results to database
    const research = await prisma.researchResult.create({
      data: {
        summaryId,
        requiredFeatures: JSON.stringify(researchResult.requiredFeatures),
        techStack: JSON.stringify(researchResult.recommendedTechStack),
        architecture: JSON.stringify(researchResult.architecture),
        complexity: researchResult.estimatedComplexity,
        timeline: researchResult.estimatedTimeline,
      },
    });

    console.log(`[Research] Saved research result ${research.id}`);

    res.json({
      success: true,
      data: researchResult,
      researchId: research.id,
    });
  } catch (error) {
    console.error('[Research] Error:', error);
    next(error);
  }
});

export default router;
