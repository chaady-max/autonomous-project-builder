'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function SetupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isSavingInstructions, setIsSavingInstructions] = useState(false);
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  // Check API key status and load custom instructions on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await api.settings.getStatus();
        setApiKeyConfigured(status.apiKeyConfigured);
      } catch (err) {
        console.error('Failed to check API key status:', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    const loadCustomInstructions = async () => {
      try {
        const result = await api.settings.getCustomInstructions();
        setCustomInstructions(result.instructions || '');
      } catch (err) {
        console.error('Failed to load custom instructions:', err);
      }
    };

    if (isAuthenticated && !isLoading) {
      checkStatus();
      loadCustomInstructions();
    } else if (!isLoading) {
      setIsCheckingStatus(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via useAuth hook
  }

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
      setError('Invalid API key format. Should start with "sk-ant-"');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.settings.saveApiKey(apiKey);
      setSuccess(true);
      setApiKeyConfigured(true);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove the API key? The app will fall back to local analysis mode.')) {
      return;
    }

    setIsRemoving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.settings.removeApiKey();
      setApiKeyConfigured(false);
      setApiKey('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove API key');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await api.settings.testApi();
      setTestResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to test API');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveInstructions = async () => {
    setIsSavingInstructions(true);
    setError(null);
    setInstructionsSaved(false);

    try {
      await api.settings.saveCustomInstructions(customInstructions);
      setInstructionsSaved(true);
      setTimeout(() => setInstructionsSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save custom instructions');
    } finally {
      setIsSavingInstructions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Setup Anthropic API Key
          </h1>
          <p className="text-lg text-gray-700">
            Configure your API key to enable AI-powered project analysis
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          {/* Current Status */}
          {!isCheckingStatus && (
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              apiKeyConfigured
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-300'
            }`}>
              <p className={`font-semibold ${
                apiKeyConfigured ? 'text-green-900' : 'text-gray-700'
              }`}>
                {apiKeyConfigured ? '✅ API Key Configured' : 'ℹ️ No API Key Configured'}
              </p>
              <p className={`text-sm mt-1 ${
                apiKeyConfigured ? 'text-green-800' : 'text-gray-600'
              }`}>
                {apiKeyConfigured
                  ? 'Using Claude AI for project analysis'
                  : 'Using local analysis mode (rule-based)'}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 text-base">How to get your API key:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Visit <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-900">Anthropic Console</a></li>
              <li>Create a new API key</li>
              <li>Copy the key (starts with "sk-ant-")</li>
              <li>Paste it below</li>
            </ol>
          </div>

          {/* API Key Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isSaving || success}
            />
            <p className="text-xs text-gray-600 mt-2">
              Your API key will be stored securely in the backend .env file
            </p>
          </div>

          {/* Test API Section */}
          {apiKeyConfigured && (
            <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Test Your API Key</h3>
                <button
                  onClick={handleTestApi}
                  disabled={isTesting || isSaving || isRemoving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                >
                  {isTesting ? 'Testing...' : 'Test API'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Test your API connection by asking Claude to solve: <strong>4 + 5 = ?</strong>
              </p>

              {testResult && (
                <div className="bg-white border border-gray-300 rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Answer:</p>
                      <p className="font-semibold text-gray-900 text-lg">{testResult.answer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tokens Used:</p>
                      <p className="font-semibold text-gray-900">{testResult.tokensUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost:</p>
                      <p className="font-semibold text-green-700">${testResult.cost}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status:</p>
                      <p className="font-semibold text-green-700">✅ Success</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                    <p>Input tokens: {testResult.inputTokens} | Output tokens: {testResult.outputTokens}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">❌ {error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ API key saved successfully! Redirecting...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || isRemoving || success || !apiKey.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSaving ? 'Saving...' : success ? 'Saved!' : 'Save API Key'}
            </button>
            {apiKeyConfigured && (
              <button
                onClick={handleRemove}
                disabled={isSaving || isRemoving || success}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isRemoving ? 'Removing...' : 'Remove Key'}
              </button>
            )}
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 text-center"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Custom Instructions Card */}
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Custom Build Instructions</h3>
          <p className="text-sm text-gray-700 mb-3">
            Add custom instructions that will be included in all generated build specifications. For example: "Always add version numbers", "Use semantic commit messages", etc.
          </p>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Example: Always add version numbers to the header&#10;Example: Use ESLint with strict TypeScript rules&#10;Example: Include comprehensive error logging"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-3"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSaveInstructions}
              disabled={isSavingInstructions}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              {isSavingInstructions ? 'Saving...' : 'Save Instructions'}
            </button>
            {instructionsSaved && (
              <span className="flex items-center text-green-700 font-medium text-sm">
                ✓ Saved successfully!
              </span>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Why do I need this?</h3>
          <p className="text-sm text-gray-700 mb-3">
            The Autonomous Project Builder uses Claude AI to analyze your project requirements and provide intelligent recommendations including:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-1">
            <li>Feature breakdown with priorities</li>
            <li>Tech stack recommendations</li>
            <li>Architecture pattern suggestions</li>
            <li>Complexity and timeline estimates</li>
          </ul>
          <p className="text-sm text-gray-700 mt-4 pt-3 border-t border-gray-200">
            <strong className="text-gray-900">Cost:</strong> Approximately $0.015 per project analysis (using Claude Sonnet 4)
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-900">
            🔒 <strong>Security Note:</strong> Your API key is stored locally in the backend .env file and never sent to any third party except Anthropic's official API.
          </p>
        </div>
      </div>
    </div>
  );
}
