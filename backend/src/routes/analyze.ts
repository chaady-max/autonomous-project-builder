import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ProjectSummaryParser } from '../services/parser';
import { AIResearcher } from '../services/researcher';
import { AIClarifier } from '../services/ai-clarifier';
import { ParseSummaryResponseSchema } from '../../../shared/types/project';

const router = express.Router();
const prisma = new PrismaClient();
const parser = new ProjectSummaryParser();

/**
 * POST /api/analyze/summary
 * Parse project summary from various formats (v0.7: with enrichment and strict mode)
 */
router.post('/summary', async (req, res, next) => {
  try {
    const { content, format, enrichment, strictMode } = req.body;

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

    console.log(`[Parser] Parsing ${format} content (${content.length} chars)${strictMode ? ' [STRICT MODE]' : ''}`);

    // Parse with enrichment (v0.7)
    const result = await parser.parseWithEnrichment(
      content,
      format,
      enrichment,
      strictMode || false
    );

    // If strict mode validation failed, return errors
    if (result.strictModeErrors && result.strictModeErrors.length > 0) {
      console.log(`[Parser] Strict mode validation failed: ${result.strictModeErrors.length} errors`);
      return res.status(400).json({
        success: false,
        error: 'Strict mode validation failed',
        validationErrors: result.strictModeErrors,
        data: result.data,
        completeness: result.completeness,
      });
    }

    console.log(`[Parser] Success! Completeness: ${(result.completeness.score * 100).toFixed(0)}%`);

    // Save to database (stringify JSON for SQLite)
    const summary = await prisma.summary.create({
      data: {
        content,
        format,
        parsedData: JSON.stringify(result.data),
        completeness: JSON.stringify(result.completeness),
        strictMode: strictMode || false,
      },
    });

    // Save enrichment data if provided (v0.7)
    if (enrichment) {
      console.log('[Parser] Saving enrichment data...');
      await prisma.inputEnrichment.create({
        data: {
          summaryId: summary.id,
          featurePriorities: enrichment.featurePriorities ? JSON.stringify(enrichment.featurePriorities) : null,
          nfrPerformance: enrichment.nfrPerformance ? JSON.stringify(enrichment.nfrPerformance) : null,
          nfrSecurity: enrichment.nfrSecurity ? JSON.stringify(enrichment.nfrSecurity) : null,
          nfrScalability: enrichment.nfrScalability ? JSON.stringify(enrichment.nfrScalability) : null,
          nfrAccessibility: enrichment.nfrAccessibility ? JSON.stringify(enrichment.nfrAccessibility) : null,
          personas: enrichment.personas ? JSON.stringify(enrichment.personas) : null,
          approachPreference: enrichment.approachPreference || null,
          budgetConstraint: enrichment.budgetConstraint || null,
          complexitySlider: enrichment.complexitySlider || null,
          scalabilityTier: enrichment.scalabilityTier || null,
          architectureStyle: enrichment.architectureStyle || null,
        },
      });
      console.log('[Parser] Enrichment data saved');
    }

    // Validate response schema
    const response = ParseSummaryResponseSchema.parse({
      success: true,
      data: result.data,
      completeness: result.completeness,
    });

    res.json({
      ...response,
      summaryId: summary.id,
      strictMode: strictMode || false,
      hasEnrichment: !!enrichment,
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

/**
 * POST /api/analyze/clarify
 * Generate clarifying questions (v0.7)
 */
router.post('/clarify', async (req, res, next) => {
  try {
    const { researchId } = req.body;

    if (!researchId) {
      return res.status(400).json({
        success: false,
        error: 'researchId is required',
      });
    }

    console.log(`[Clarify] Generating questions for research ${researchId}`);

    // Fetch research result with related data
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

    // Parse data from JSON strings
    const parsedData = JSON.parse(research.summary.parsedData);
    const researchResult = {
      requiredFeatures: JSON.parse(research.requiredFeatures),
      recommendedTechStack: JSON.parse(research.techStack),
      architecture: JSON.parse(research.architecture),
      estimatedComplexity: research.complexity as 'low' | 'medium' | 'high',
      estimatedTimeline: research.timeline,
    };

    // Parse enrichment if exists
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

    // Generate questions
    const clarifier = new AIClarifier();
    const questions = await clarifier.generateQuestions(parsedData, researchResult, enrichment);

    console.log(`[Clarify] Generated ${questions.length} questions`);

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error('[Clarify] Error:', error);
    next(error);
  }
});

/**
 * POST /api/analyze/clarify-answers
 * Submit clarification answers (v0.7)
 */
router.post('/clarify-answers', async (req, res, next) => {
  try {
    const { researchId, answers } = req.body;

    if (!researchId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'researchId and answers array are required',
      });
    }

    console.log(`[Clarify] Saving ${answers.length} answers for research ${researchId}`);

    // Format Q&A pairs with timestamps
    const qa = answers.map(a => ({
      question: a.question,
      answer: a.answer || '',
      timestamp: new Date().toISOString(),
      skipped: a.skipped || false,
    }));

    // Update research result with clarification data
    await prisma.researchResult.update({
      where: { id: researchId },
      data: {
        clarificationAsked: true,
        clarificationQA: JSON.stringify(qa),
      },
    });

    console.log('[Clarify] Answers saved successfully');

    res.json({
      success: true,
      message: 'Clarification answers saved',
    });
  } catch (error) {
    console.error('[Clarify] Error saving answers:', error);
    next(error);
  }
});

export default router;
