'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <main className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via useAuth hook
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Logout */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Autonomous Project Builder
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Decision-Complete Specification System
          </p>
          <p className="text-sm text-gray-600">v0.8.1</p>
        </div>

        {/* Main Options Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Wizard Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🧙‍♂️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Wizard Builder
              </h2>
              <p className="text-sm text-blue-600 font-semibold mb-3">
                ✨ Recommended - v0.8 Feature
              </p>
            </div>
            <p className="text-gray-700 mb-6">
              8-step guided wizard to capture all project decisions upfront. Generates decision-complete specifications with quality validation.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✅ Complete 8-step questionnaire</li>
              <li>✅ Capture all non-negotiables</li>
              <li>✅ 18-section spec generation</li>
              <li>✅ Quality gates & validation</li>
              <li>✅ Download markdown + YAML</li>
            </ul>
            <button
              onClick={() => router.push('/wizard')}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
            >
              Start Wizard →
            </button>
          </div>

          {/* Setup Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-gray-400 transition-all duration-200">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup & Configuration
              </h2>
              <p className="text-sm text-gray-600 font-semibold mb-3">
                Configure API & Settings
              </p>
            </div>
            <p className="text-gray-700 mb-6">
              Configure your Anthropic API key to enable AI-powered project analysis and intelligent recommendations.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>🔑 Add/remove API key</li>
              <li>🧪 Test API connection</li>
              <li>📝 Custom build instructions</li>
              <li>💡 Local mode fallback</li>
              <li>🔒 Secure storage</li>
            </ul>
            <button
              onClick={() => router.push('/setup')}
              className="w-full px-6 py-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
            >
              Open Setup →
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🚀 What's New in v0.8
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>Wizard-based flow:</strong> Replace free-form upload with structured 8-step questionnaire</li>
              <li>• <strong>Decision-complete specs:</strong> Capture ALL decisions upfront to eliminate vagueness</li>
              <li>• <strong>Quality validation:</strong> Automated completeness checks and vague language detection</li>
              <li>• <strong>18-section template:</strong> Comprehensive specifications covering all aspects</li>
              <li>• <strong>Multiple artifacts:</strong> Download markdown spec + decisions.yaml</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
