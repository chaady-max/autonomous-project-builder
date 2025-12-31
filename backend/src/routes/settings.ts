import express from 'express';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/settings/status
 * Check if API key is configured
 */
router.get('/status', async (req, res, next) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isConfigured = apiKey && apiKey !== 'sk-ant-api-key-placeholder' && apiKey.startsWith('sk-ant-');

    res.json({
      success: true,
      apiKeyConfigured: !!isConfigured,
    });
  } catch (error) {
    console.error('[Settings] Error checking status:', error);
    next(error);
  }
});

/**
 * POST /api/settings/api-key
 * Save API key to .env file
 */
router.post('/api-key', async (req, res, next) => {
  try {
    const { apiKey } = req.body;

    // Validate API key format
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'API key is required',
      });
    }

    if (!apiKey.startsWith('sk-ant-')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid API key format. Should start with "sk-ant-"',
      });
    }

    console.log('[Settings] Updating API key in .env file');

    // Update .env file
    const envPath = path.join(__dirname, '../../.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Replace the API key line
    const apiKeyRegex = /ANTHROPIC_API_KEY=.*/;
    if (apiKeyRegex.test(envContent)) {
      envContent = envContent.replace(apiKeyRegex, `ANTHROPIC_API_KEY="${apiKey}"`);
    } else {
      // Add if not present
      envContent += `\nANTHROPIC_API_KEY="${apiKey}"\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');

    // Update the process.env for current session
    process.env.ANTHROPIC_API_KEY = apiKey;

    console.log('[Settings] API key updated successfully');

    res.json({
      success: true,
      message: 'API key saved successfully',
    });
  } catch (error) {
    console.error('[Settings] Error saving API key:', error);
    next(error);
  }
});

/**
 * DELETE /api/settings/api-key
 * Remove API key (reset to placeholder)
 */
router.delete('/api-key', async (req, res, next) => {
  try {
    console.log('[Settings] Removing API key from .env file');

    // Update .env file to placeholder
    const envPath = path.join(__dirname, '../../.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Replace the API key line with placeholder
    const apiKeyRegex = /ANTHROPIC_API_KEY=.*/;
    if (apiKeyRegex.test(envContent)) {
      envContent = envContent.replace(apiKeyRegex, 'ANTHROPIC_API_KEY="sk-ant-api-key-placeholder"');
    } else {
      // Add placeholder if not present
      envContent += '\nANTHROPIC_API_KEY="sk-ant-api-key-placeholder"\n';
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');

    // Update the process.env for current session
    process.env.ANTHROPIC_API_KEY = 'sk-ant-api-key-placeholder';

    console.log('[Settings] API key removed successfully');

    res.json({
      success: true,
      message: 'API key removed successfully',
    });
  } catch (error) {
    console.error('[Settings] Error removing API key:', error);
    next(error);
  }
});

/**
 * POST /api/settings/test-api
 * Test API key with a simple prompt
 */
router.post('/test-api', async (req, res, next) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'sk-ant-api-key-placeholder' || !apiKey.startsWith('sk-ant-')) {
      return res.status(400).json({
        success: false,
        error: 'No valid API key configured',
      });
    }

    console.log('[Settings] Testing API key with simple prompt');

    // Import Anthropic client
    const Anthropic = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey });

    // Simple math test
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'What is 4 + 5? Reply with only the number.',
      }],
    });

    const answer = response.content[0].text.trim();
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // Calculate approximate cost (Sonnet 4: $3/MTok input, $15/MTok output)
    const inputCost = (response.usage.input_tokens / 1_000_000) * 3;
    const outputCost = (response.usage.output_tokens / 1_000_000) * 15;
    const totalCost = inputCost + outputCost;

    console.log('[Settings] API test successful:', { answer, tokensUsed, cost: totalCost });

    res.json({
      success: true,
      answer,
      tokensUsed,
      cost: totalCost.toFixed(6),
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });
  } catch (error: any) {
    console.error('[Settings] Error testing API:', error);

    // Check for specific API errors
    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key. Please check your key and try again.',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test API',
    });
  }
});

/**
 * GET /api/settings/custom-instructions
 * Get custom instructions
 */
router.get('/custom-instructions', async (req, res, next) => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'custom_instructions' },
    });

    res.json({
      success: true,
      instructions: setting?.value || '',
    });
  } catch (error) {
    console.error('[Settings] Error getting custom instructions:', error);
    next(error);
  }
});

/**
 * POST /api/settings/custom-instructions
 * Save custom instructions
 */
router.post('/custom-instructions', async (req, res, next) => {
  try {
    const { instructions } = req.body;

    if (typeof instructions !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Instructions must be a string',
      });
    }

    console.log('[Settings] Saving custom instructions');

    // Upsert the custom instructions
    await prisma.settings.upsert({
      where: { key: 'custom_instructions' },
      update: { value: instructions },
      create: { key: 'custom_instructions', value: instructions },
    });

    console.log('[Settings] Custom instructions saved successfully');

    res.json({
      success: true,
      message: 'Custom instructions saved successfully',
    });
  } catch (error) {
    console.error('[Settings] Error saving custom instructions:', error);
    next(error);
  }
});

export default router;
