import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// SESSION MANAGEMENT ENDPOINTS
// ============================================

/**
 * POST /api/wizard/start
 * Create a new wizard session
 */
router.post('/start', async (req, res, next) => {
  try {
    const { userId } = req.body; // Optional - null for anonymous sessions

    console.log('[Wizard] Creating new wizard session', userId ? `for user ${userId}` : '(anonymous)');

    const session = await prisma.wizardSession.create({
      data: {
        userId: userId || null,
        status: 'draft',
        currentStep: 1,
        completenessScore: 0.0,
      },
    });

    console.log(`[Wizard] Created session ${session.id}`);

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        currentStep: session.currentStep,
        status: session.status,
        completenessScore: session.completenessScore,
      },
    });
  } catch (error) {
    console.error('[Wizard] Error creating session:', error);
    next(error);
  }
});

/**
 * GET /api/wizard/session/:id
 * Load an existing wizard session
 */
router.get('/session/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(`[Wizard] Loading session ${id}`);

    const session = await prisma.wizardSession.findUnique({
      where: { id },
      include: {
        generatedSpec: true,
        qualityReport: true,
        repoScan: true,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Parse JSON fields
    const sessionData = {
      id: session.id,
      userId: session.userId,
      status: session.status,
      currentStep: session.currentStep,
      completenessScore: session.completenessScore,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,

      // Step 1: Project Basics
      step1: {
        projectName: session.projectName,
        projectType: session.projectType,
        description: session.description,
        timeline: session.timeline,
        teamSize: session.teamSize,
        budgetTier: session.budgetTier,
      },

      // Step 2: Non-Negotiables
      step2: session.nonNegotiables ? JSON.parse(session.nonNegotiables) : null,

      // Step 3: Personas
      step3: session.personas ? JSON.parse(session.personas) : null,

      // Step 4: Features & Scope
      step4: {
        features: session.features ? JSON.parse(session.features) : null,
        inScope: session.inScope ? JSON.parse(session.inScope) : null,
        outOfScope: session.outOfScope ? JSON.parse(session.outOfScope) : null,
      },

      // Step 5: User Flows
      step5: session.userFlows ? JSON.parse(session.userFlows) : null,

      // Step 6: Technical Requirements
      step6: {
        techStack: session.techStack ? JSON.parse(session.techStack) : null,
        performanceReqs: session.performanceReqs ? JSON.parse(session.performanceReqs) : null,
        securityReqs: session.securityReqs ? JSON.parse(session.securityReqs) : null,
        scalabilityReqs: session.scalabilityReqs ? JSON.parse(session.scalabilityReqs) : null,
        accessibilityReq: session.accessibilityReq,
      },

      // Step 7: Data & APIs
      step7: {
        dataModel: session.dataModel ? JSON.parse(session.dataModel) : null,
        externalAPIs: session.externalAPIs ? JSON.parse(session.externalAPIs) : null,
        dataPrivacy: session.dataPrivacy ? JSON.parse(session.dataPrivacy) : null,
      },

      // Related data
      generatedSpec: session.generatedSpec,
      qualityReport: session.qualityReport,
      repoScan: session.repoScan,
    };

    console.log(`[Wizard] Loaded session ${id} - Step ${session.currentStep}, Status: ${session.status}`);

    return res.json({
      success: true,
      data: sessionData,
    });
  } catch (error) {
    console.error('[Wizard] Error loading session:', error);
    next(error);
  }
});

/**
 * PUT /api/wizard/session/:id
 * Update wizard session (auto-save)
 */
router.put('/session/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`[Wizard] Updating session ${id}`);

    // Build update data object
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Current step
    if (updates.currentStep !== undefined) {
      updateData.currentStep = updates.currentStep;
    }

    // Status
    if (updates.status) {
      updateData.status = updates.status;
    }

    // Completeness score
    if (updates.completenessScore !== undefined) {
      updateData.completenessScore = updates.completenessScore;
    }

    // Step 1: Project Basics
    if (updates.step1) {
      if (updates.step1.projectName !== undefined) updateData.projectName = updates.step1.projectName;
      if (updates.step1.projectType !== undefined) updateData.projectType = updates.step1.projectType;
      if (updates.step1.description !== undefined) updateData.description = updates.step1.description;
      if (updates.step1.timeline !== undefined) updateData.timeline = updates.step1.timeline;
      if (updates.step1.teamSize !== undefined) updateData.teamSize = updates.step1.teamSize;
      if (updates.step1.budgetTier !== undefined) updateData.budgetTier = updates.step1.budgetTier;
    }

    // Step 2: Non-Negotiables
    if (updates.step2) {
      updateData.nonNegotiables = JSON.stringify(updates.step2);
    }

    // Step 3: Personas
    if (updates.step3) {
      updateData.personas = JSON.stringify(updates.step3);
    }

    // Step 4: Features & Scope
    if (updates.step4) {
      if (updates.step4.features) updateData.features = JSON.stringify(updates.step4.features);
      if (updates.step4.inScope) updateData.inScope = JSON.stringify(updates.step4.inScope);
      if (updates.step4.outOfScope) updateData.outOfScope = JSON.stringify(updates.step4.outOfScope);
    }

    // Step 5: User Flows
    if (updates.step5) {
      updateData.userFlows = JSON.stringify(updates.step5);
    }

    // Step 6: Technical Requirements
    if (updates.step6) {
      if (updates.step6.techStack) updateData.techStack = JSON.stringify(updates.step6.techStack);
      if (updates.step6.performanceReqs) updateData.performanceReqs = JSON.stringify(updates.step6.performanceReqs);
      if (updates.step6.securityReqs) updateData.securityReqs = JSON.stringify(updates.step6.securityReqs);
      if (updates.step6.scalabilityReqs) updateData.scalabilityReqs = JSON.stringify(updates.step6.scalabilityReqs);
      if (updates.step6.accessibilityReq !== undefined) updateData.accessibilityReq = updates.step6.accessibilityReq;
    }

    // Step 7: Data & APIs
    if (updates.step7) {
      if (updates.step7.dataModel) updateData.dataModel = JSON.stringify(updates.step7.dataModel);
      if (updates.step7.externalAPIs) updateData.externalAPIs = JSON.stringify(updates.step7.externalAPIs);
      if (updates.step7.dataPrivacy) updateData.dataPrivacy = JSON.stringify(updates.step7.dataPrivacy);
    }

    const session = await prisma.wizardSession.update({
      where: { id },
      data: updateData,
    });

    console.log(`[Wizard] Updated session ${id} - Step ${session.currentStep}`);

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        currentStep: session.currentStep,
        status: session.status,
        completenessScore: session.completenessScore,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    console.error('[Wizard] Error updating session:', error);
    next(error);
  }
});

/**
 * DELETE /api/wizard/session/:id
 * Delete a draft wizard session
 */
router.delete('/session/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(`[Wizard] Deleting session ${id}`);

    const session = await prisma.wizardSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Only allow deleting draft sessions
    if (session.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Can only delete draft sessions',
      });
    }

    await prisma.wizardSession.delete({
      where: { id },
    });

    console.log(`[Wizard] Deleted session ${id}`);

    return res.json({
      success: true,
      message: 'Session deleted',
    });
  } catch (error) {
    console.error('[Wizard] Error deleting session:', error);
    next(error);
  }
});

// ============================================
// STEP PROGRESS ENDPOINTS
// ============================================

/**
 * PUT /api/wizard/session/:id/step/:stepNum
 * Save data for a specific wizard step
 */
router.put('/session/:id/step/:stepNum', async (req, res, next) => {
  try {
    const { id, stepNum } = req.params;
    const stepData = req.body;
    const step = parseInt(stepNum, 10);

    if (isNaN(step) || step < 1 || step > 8) {
      return res.status(400).json({
        success: false,
        error: 'Invalid step number. Must be 1-8.',
      });
    }

    console.log(`[Wizard] Saving step ${step} data for session ${id}`);

    // Build update based on step
    const updateData: any = {
      currentStep: step,
      updatedAt: new Date(),
    };

    switch (step) {
      case 1:
        if (stepData.projectName !== undefined) updateData.projectName = stepData.projectName;
        if (stepData.projectType !== undefined) updateData.projectType = stepData.projectType;
        if (stepData.description !== undefined) updateData.description = stepData.description;
        if (stepData.timeline !== undefined) updateData.timeline = stepData.timeline;
        if (stepData.teamSize !== undefined) updateData.teamSize = stepData.teamSize;
        if (stepData.budgetTier !== undefined) updateData.budgetTier = stepData.budgetTier;
        break;
      case 2:
        updateData.nonNegotiables = JSON.stringify(stepData);
        break;
      case 3:
        updateData.personas = JSON.stringify(stepData);
        break;
      case 4:
        if (stepData.features) updateData.features = JSON.stringify(stepData.features);
        if (stepData.inScope) updateData.inScope = JSON.stringify(stepData.inScope);
        if (stepData.outOfScope) updateData.outOfScope = JSON.stringify(stepData.outOfScope);
        break;
      case 5:
        updateData.userFlows = JSON.stringify(stepData);
        break;
      case 6:
        if (stepData.techStack) updateData.techStack = JSON.stringify(stepData.techStack);
        if (stepData.performanceReqs) updateData.performanceReqs = JSON.stringify(stepData.performanceReqs);
        if (stepData.securityReqs) updateData.securityReqs = JSON.stringify(stepData.securityReqs);
        if (stepData.scalabilityReqs) updateData.scalabilityReqs = JSON.stringify(stepData.scalabilityReqs);
        if (stepData.accessibilityReq !== undefined) updateData.accessibilityReq = stepData.accessibilityReq;
        break;
      case 7:
        if (stepData.dataModel) updateData.dataModel = JSON.stringify(stepData.dataModel);
        if (stepData.externalAPIs) updateData.externalAPIs = JSON.stringify(stepData.externalAPIs);
        if (stepData.dataPrivacy) updateData.dataPrivacy = JSON.stringify(stepData.dataPrivacy);
        break;
      case 8:
        // Step 8 is review - no new data to save
        break;
    }

    const session = await prisma.wizardSession.update({
      where: { id },
      data: updateData,
    });

    console.log(`[Wizard] Saved step ${step} for session ${id}`);

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        currentStep: session.currentStep,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    console.error('[Wizard] Error saving step data:', error);
    next(error);
  }
});

/**
 * GET /api/wizard/session/:id/completeness
 * Calculate completeness score for wizard session
 */
router.get('/session/:id/completeness', async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(`[Wizard] Calculating completeness for session ${id}`);

    const session = await prisma.wizardSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Calculate completeness score (0-100)
    let score = 0;
    let totalFields = 0;
    let completedFields = 0;

    // Step 1: Project Basics (6 fields, weight: 15%)
    const step1Fields = [
      session.projectName,
      session.projectType,
      session.description,
      session.timeline,
      session.teamSize,
      session.budgetTier,
    ];
    const step1Complete = step1Fields.filter(f => f !== null && f !== '').length;
    totalFields += step1Fields.length;
    completedFields += step1Complete;

    // Step 2: Non-Negotiables (weight: 20% - most critical)
    let step2Complete = 0;
    if (session.nonNegotiables) {
      const nonNeg = JSON.parse(session.nonNegotiables);
      const nonNegKeys = ['e2ee', 'adminRead', 'phoneIdentity', 'anonymousUsers', 'multiRegion', 'offlineFirst', 'multiTenant', 'openSource'];
      step2Complete = nonNegKeys.filter(k => nonNeg[k] !== undefined && nonNeg[k] !== null).length;
      totalFields += nonNegKeys.length;
      completedFields += step2Complete;
    } else {
      totalFields += 8;
    }

    // Step 3: Personas (weight: 10%)
    let step3Complete = 0;
    if (session.personas) {
      const personas = JSON.parse(session.personas);
      if (Array.isArray(personas) && personas.length > 0) {
        step3Complete = 1;
      }
    }
    totalFields += 1;
    completedFields += step3Complete;

    // Step 4: Features & Scope (weight: 15%)
    const step4Fields = [session.features, session.inScope, session.outOfScope];
    const step4Complete = step4Fields.filter(f => {
      if (!f) return false;
      const parsed = JSON.parse(f);
      return Array.isArray(parsed) && parsed.length > 0;
    }).length;
    totalFields += step4Fields.length;
    completedFields += step4Complete;

    // Step 5: User Flows (weight: 10%, optional)
    let step5Complete = 0;
    if (session.userFlows) {
      const flows = JSON.parse(session.userFlows);
      if (Array.isArray(flows) && flows.length > 0) {
        step5Complete = 1;
      }
    }
    totalFields += 1;
    completedFields += step5Complete;

    // Step 6: Technical Requirements (weight: 15%)
    const step6Fields = [
      session.techStack,
      session.performanceReqs,
      session.securityReqs,
      session.scalabilityReqs,
      session.accessibilityReq,
    ];
    const step6Complete = step6Fields.filter(f => {
      if (!f) return false;
      if (typeof f === 'string' && f.length > 0) return true;
      try {
        const parsed = JSON.parse(f);
        return Object.keys(parsed).length > 0;
      } catch {
        return false;
      }
    }).length;
    totalFields += step6Fields.length;
    completedFields += step6Complete;

    // Step 7: Data & APIs (weight: 15%)
    const step7Fields = [session.dataModel, session.externalAPIs, session.dataPrivacy];
    const step7Complete = step7Fields.filter(f => {
      if (!f) return false;
      try {
        const parsed = JSON.parse(f);
        if (Array.isArray(parsed)) return parsed.length > 0;
        return Object.keys(parsed).length > 0;
      } catch {
        return false;
      }
    }).length;
    totalFields += step7Fields.length;
    completedFields += step7Complete;

    // Calculate overall score
    score = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

    // Update session with new score
    await prisma.wizardSession.update({
      where: { id },
      data: { completenessScore: score },
    });

    console.log(`[Wizard] Completeness for session ${id}: ${score}% (${completedFields}/${totalFields} fields)`);

    return res.json({
      success: true,
      data: {
        score,
        completedFields,
        totalFields,
        breakdown: {
          step1: { complete: step1Complete, total: 6 },
          step2: { complete: step2Complete, total: 8 },
          step3: { complete: step3Complete, total: 1 },
          step4: { complete: step4Complete, total: 3 },
          step5: { complete: step5Complete, total: 1 },
          step6: { complete: step6Complete, total: 5 },
          step7: { complete: step7Complete, total: 3 },
        },
      },
    });
  } catch (error) {
    console.error('[Wizard] Error calculating completeness:', error);
    next(error);
  }
});

/**
 * POST /api/wizard/session/:id/validate
 * Validate current wizard state
 */
router.post('/session/:id/validate', async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(`[Wizard] Validating session ${id}`);

    const session = await prisma.wizardSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    const errors: Array<{ field: string; message: string; severity: 'error' | 'warning' }> = [];

    // Validate Step 1
    if (!session.projectName || session.projectName.trim().length < 3) {
      errors.push({ field: 'projectName', message: 'Project name must be at least 3 characters', severity: 'error' });
    }
    if (!session.projectType) {
      errors.push({ field: 'projectType', message: 'Project type is required', severity: 'error' });
    }
    if (!session.description || session.description.trim().length < 10) {
      errors.push({ field: 'description', message: 'Description must be at least 10 characters', severity: 'error' });
    }

    // Validate Step 2 (Non-Negotiables)
    if (!session.nonNegotiables) {
      errors.push({ field: 'nonNegotiables', message: 'Non-negotiables must be defined', severity: 'error' });
    } else {
      try {
        const nonNeg = JSON.parse(session.nonNegotiables);
        const requiredKeys = ['e2ee', 'adminRead', 'phoneIdentity', 'anonymousUsers'];
        requiredKeys.forEach(key => {
          if (nonNeg[key] === undefined || nonNeg[key] === null) {
            errors.push({ field: `nonNegotiables.${key}`, message: `${key} decision is required`, severity: 'error' });
          }
        });
      } catch (e) {
        errors.push({ field: 'nonNegotiables', message: 'Invalid non-negotiables format', severity: 'error' });
      }
    }

    // Validate Step 3 (Personas)
    if (!session.personas) {
      errors.push({ field: 'personas', message: 'At least one persona is required', severity: 'warning' });
    } else {
      try {
        const personas = JSON.parse(session.personas);
        if (!Array.isArray(personas) || personas.length === 0) {
          errors.push({ field: 'personas', message: 'At least one persona is required', severity: 'warning' });
        }
      } catch (e) {
        errors.push({ field: 'personas', message: 'Invalid personas format', severity: 'error' });
      }
    }

    // Validate Step 4 (Features)
    if (!session.features) {
      errors.push({ field: 'features', message: 'At least one feature is required', severity: 'error' });
    } else {
      try {
        const features = JSON.parse(session.features);
        if (!Array.isArray(features) || features.length === 0) {
          errors.push({ field: 'features', message: 'At least one feature is required', severity: 'error' });
        }
      } catch (e) {
        errors.push({ field: 'features', message: 'Invalid features format', severity: 'error' });
      }
    }

    const isValid = errors.filter(e => e.severity === 'error').length === 0;

    console.log(`[Wizard] Validation for session ${id}: ${isValid ? 'PASS' : 'FAIL'} (${errors.length} issues)`);

    return res.json({
      success: true,
      data: {
        valid: isValid,
        errors: errors.filter(e => e.severity === 'error'),
        warnings: errors.filter(e => e.severity === 'warning'),
      },
    });
  } catch (error) {
    console.error('[Wizard] Error validating session:', error);
    next(error);
  }
});

// ============================================
// OPTIONAL FEATURES ENDPOINTS
// ============================================

/**
 * POST /api/wizard/scan-repo
 * Upload and scan repository (v0.8 optional feature)
 * TODO: Implement repository scanner service
 */
router.post('/scan-repo', async (req, res, next) => {
  try {
    console.log('[Wizard] Repository scanning not yet implemented');

    return res.status(501).json({
      success: false,
      error: 'Repository scanning feature coming in Phase 5',
    });
  } catch (error) {
    console.error('[Wizard] Error scanning repository:', error);
    next(error);
  }
});

/**
 * POST /api/wizard/analyze-flow
 * Analyze user flow diagram (v0.8 optional feature)
 * TODO: Implement flow analyzer service
 */
router.post('/analyze-flow', async (req, res, next) => {
  try {
    console.log('[Wizard] Flow analysis not yet implemented');

    return res.status(501).json({
      success: false,
      error: 'Flow analysis feature coming in Phase 5',
    });
  } catch (error) {
    console.error('[Wizard] Error analyzing flow:', error);
    next(error);
  }
});

// ============================================
// GENERATION ENDPOINTS
// ============================================

/**
 * POST /api/wizard/generate/:sessionId
 * Generate complete specification from wizard data
 */
router.post('/generate/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    console.log(`[Wizard] Generating spec for session ${sessionId}`);

    const session = await prisma.wizardSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Check completeness score
    if (session.completenessScore < 80) {
      return res.status(400).json({
        success: false,
        error: `Completeness score too low: ${session.completenessScore}%. Minimum required: 80%`,
      });
    }

    // Update status to generating
    await prisma.wizardSession.update({
      where: { id: sessionId },
      data: { status: 'generating' },
    });

    console.log('[Wizard] Starting spec generation...');

    // Import services
    const { SpecTemplateEngine } = await import('../../services/v0.8/spec-template-engine');
    const { DecisionsYAMLGenerator } = await import('../../services/v0.8/decisions-yaml-generator');
    const { QualityValidator } = await import('../../services/v0.8/quality-validator');

    // Generate spec markdown
    const specEngine = new SpecTemplateEngine();
    const specMarkdown = await specEngine.generate(session);

    console.log(`[Wizard] Generated spec: ${specMarkdown.length} characters`);

    // Generate decisions YAML
    const yamlGenerator = new DecisionsYAMLGenerator();
    const decisionsYaml = yamlGenerator.generate(session);

    console.log(`[Wizard] Generated decisions.yaml: ${decisionsYaml.length} characters`);

    // Validate quality
    const validator = new QualityValidator();
    const qualityReport = validator.validate(specMarkdown, decisionsYaml);

    console.log(`[Wizard] Quality score: ${qualityReport.overallScore}%`);

    // Save generated spec to database
    const generatedSpec = await prisma.generatedSpec.create({
      data: {
        sessionId,
        decisionsYaml,
        specMarkdown,
        sections: JSON.stringify([]), // Section metadata (can be enhanced later)
        totalCharacters: specMarkdown.length,
        totalSections: 18,
        avgSectionLength: Math.round(specMarkdown.length / 18),
      },
    });

    // Save quality report
    await prisma.qualityReport.create({
      data: {
        sessionId,
        overallScore: qualityReport.overallScore,
        sectionScores: JSON.stringify(qualityReport.sectionScores),
        errors: JSON.stringify(qualityReport.errors),
        warnings: JSON.stringify(qualityReport.warnings),
        suggestions: JSON.stringify(qualityReport.suggestions),
        vagueTermsFound: JSON.stringify(qualityReport.vagueTermsFound),
        missingDetails: JSON.stringify(qualityReport.missingDetails),
        passedQualityGate: qualityReport.passedQualityGate,
        requiredFixes: qualityReport.requiredFixes.length > 0 ? JSON.stringify(qualityReport.requiredFixes) : null,
      },
    });

    // Create artifacts
    await prisma.artifact.create({
      data: {
        specId: generatedSpec.id,
        type: 'markdown',
        content: specMarkdown,
        filename: `${session.projectName || 'project'}-spec.md`,
      },
    });

    await prisma.artifact.create({
      data: {
        specId: generatedSpec.id,
        type: 'yaml',
        content: decisionsYaml,
        filename: 'decisions.yaml',
      },
    });

    // Update session status to completed
    await prisma.wizardSession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });

    console.log(`[Wizard] Spec generation complete! Spec ID: ${generatedSpec.id}`);

    return res.json({
      success: true,
      data: {
        specId: generatedSpec.id,
        totalCharacters: generatedSpec.totalCharacters,
        totalSections: generatedSpec.totalSections,
        qualityScore: qualityReport.overallScore,
        passedQualityGate: qualityReport.passedQualityGate,
        artifactsUrl: `/api/wizard/artifacts/${sessionId}`,
      },
    });
  } catch (error) {
    console.error('[Wizard] Error generating spec:', error);
    // Update status back to draft on error
    try {
      await prisma.wizardSession.update({
        where: { id: req.params.sessionId },
        data: { status: 'draft' },
      });
    } catch (e) {
      // Ignore update error
    }
    next(error);
  }
});

/**
 * GET /api/wizard/quality/:sessionId
 * Get quality report for generated spec
 * TODO: Implement QualityValidator service
 */
router.get('/quality/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    console.log(`[Wizard] Getting quality report for session ${sessionId}`);

    const qualityReport = await prisma.qualityReport.findUnique({
      where: { sessionId },
    });

    if (!qualityReport) {
      return res.status(404).json({
        success: false,
        error: 'Quality report not found. Generate spec first.',
      });
    }

    // Parse JSON fields
    const reportData = {
      id: qualityReport.id,
      sessionId: qualityReport.sessionId,
      overallScore: qualityReport.overallScore,
      sectionScores: JSON.parse(qualityReport.sectionScores),
      errors: JSON.parse(qualityReport.errors),
      warnings: JSON.parse(qualityReport.warnings),
      suggestions: JSON.parse(qualityReport.suggestions),
      vagueTermsFound: JSON.parse(qualityReport.vagueTermsFound),
      missingDetails: JSON.parse(qualityReport.missingDetails),
      passedQualityGate: qualityReport.passedQualityGate,
      requiredFixes: qualityReport.requiredFixes ? JSON.parse(qualityReport.requiredFixes) : null,
      createdAt: qualityReport.createdAt,
    };

    return res.json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error('[Wizard] Error getting quality report:', error);
    next(error);
  }
});

/**
 * GET /api/wizard/artifacts/:sessionId
 * List all artifacts for a session
 */
router.get('/artifacts/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    console.log(`[Wizard] Listing artifacts for session ${sessionId}`);

    const generatedSpec = await prisma.generatedSpec.findUnique({
      where: { sessionId },
      include: {
        artifacts: true,
      },
    });

    if (!generatedSpec) {
      return res.status(404).json({
        success: false,
        error: 'No generated spec found for this session',
      });
    }

    const artifacts = generatedSpec.artifacts.map(artifact => ({
      id: artifact.id,
      type: artifact.type,
      filename: artifact.filename,
      createdAt: artifact.createdAt,
      downloadUrl: `/api/wizard/download/${artifact.id}`,
    }));

    return res.json({
      success: true,
      data: {
        specId: generatedSpec.id,
        totalSections: generatedSpec.totalSections,
        totalCharacters: generatedSpec.totalCharacters,
        artifacts,
      },
    });
  } catch (error) {
    console.error('[Wizard] Error listing artifacts:', error);
    next(error);
  }
});

/**
 * GET /api/wizard/download/:artifactId
 * Download a specific artifact
 */
router.get('/download/:artifactId', async (req, res, next) => {
  try {
    const { artifactId } = req.params;

    console.log(`[Wizard] Downloading artifact ${artifactId}`);

    const artifact = await prisma.artifact.findUnique({
      where: { id: artifactId },
    });

    if (!artifact) {
      return res.status(404).json({
        success: false,
        error: 'Artifact not found',
      });
    }

    // Set content type based on artifact type
    let contentType = 'text/plain';
    switch (artifact.type) {
      case 'markdown':
        contentType = 'text/markdown';
        break;
      case 'yaml':
        contentType = 'application/x-yaml';
        break;
      case 'openapi':
        contentType = 'application/json';
        break;
      case 'diagrams':
        contentType = 'text/plain';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${artifact.filename}"`);

    return res.send(artifact.content);
  } catch (error) {
    console.error('[Wizard] Error downloading artifact:', error);
    next(error);
  }
});

export default router;
