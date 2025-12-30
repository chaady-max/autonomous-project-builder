import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

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

export default router;
