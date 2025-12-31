'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import Link from 'next/link';
import ClarificationModal from './ClarificationModal';
import PlanningDetailsPanel from './PlanningDetailsPanel';

export default function UploadForm() {
  const [projectSummary, setProjectSummary] = useState('');
  const [format, setFormat] = useState<'yaml' | 'markdown' | 'text'>('yaml');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [researchResult, setResearchResult] = useState<any>(null);
  const [buildSpec, setBuildSpec] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<'idle' | 'parsing' | 'researching' | 'clarifying' | 'generating' | 'complete'>('idle');
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [showResearchDetails, setShowResearchDetails] = useState(false);

  // v0.7: Clarification flow state
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationAnswered, setClarificationAnswered] = useState(false);

  // Check API key status on mount
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      try {
        const status = await api.settings.getStatus();
        setApiKeyConfigured(status.apiKeyConfigured);
      } catch (err) {
        console.error('Failed to check API key status:', err);
        setApiKeyConfigured(false);
      }
    };
    checkApiKeyStatus();
  }, []);

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    accept: {
      'text/yaml': ['.yaml', '.yml'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (files) => {
      console.log('Files dropped:', files);
      const file = files[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      console.log('Reading file:', file.name, 'Size:', file.size);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File loaded, content length:', content.length);
        setProjectSummary(content);

        // Detect format from file extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'yaml' || ext === 'yml') setFormat('yaml');
        else if (ext === 'md') setFormat('markdown');
        else setFormat('text');
      };
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        setError('Failed to read file. Please try again.');
      };
      reader.readAsText(file);
    },
    onDropRejected: (rejections) => {
      console.error('Files rejected:', rejections);
      setError(`File rejected: ${rejections[0]?.errors[0]?.message || 'Unknown error'}`);
    }
  });

  const handleAnalyze = async () => {
    if (!projectSummary.trim()) {
      setError('Please enter a project summary');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setResearchResult(null);
    setClarificationQuestions([]);
    setClarificationAnswered(false);

    try {
      // Step 1: Parse the summary
      setAnalysisStep('parsing');
      const parseResponse = await api.analyze.summary(projectSummary, format);
      setResult(parseResponse);

      // Step 2: Automatically trigger AI research
      setAnalysisStep('researching');
      const researchResponse = await api.analyze.research(parseResponse.summaryId, parseResponse.data);
      setResearchResult(researchResponse);

      // Step 3: v0.7 - Generate clarification questions
      setAnalysisStep('clarifying');
      const clarifyResponse = await api.analyze.clarify(researchResponse.researchId);
      setClarificationQuestions(clarifyResponse.questions);
      setShowClarificationModal(true);

      setAnalysisStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze project');
      setAnalysisStep('idle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClarificationSubmit = async (answers: { question: string; answer: string; skipped?: boolean }[]) => {
    try {
      setShowClarificationModal(false);
      await api.analyze.clarifyAnswers(researchResult.researchId, answers);
      setClarificationAnswered(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save clarification answers');
    }
  };

  const handleGenerateBuildSpec = async () => {
    if (!researchResult?.researchId) {
      setError('Research must be completed first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setBuildSpec(null);

    try {
      setAnalysisStep('generating');
      const buildSpecResponse = await api.generate.buildSpec(researchResult.researchId);
      setBuildSpec(buildSpecResponse.data);
      setAnalysisStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to generate build specification');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Autonomous Project Builder
            </h1>
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              v0.7
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Transform your project idea into working code
          </p>
        </div>

        {/* API Key Status */}
        {apiKeyConfigured === false && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  <strong>Local Analysis Mode:</strong> Using intelligent heuristics for project analysis. For AI-powered analysis with Claude, configure your API key.
                </p>
                <div className="mt-2">
                  <Link
                    href="/setup"
                    className="text-sm font-medium text-blue-700 hover:text-blue-600 underline"
                  >
                    Upgrade to Claude API →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {apiKeyConfigured === true && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>Claude API Mode:</strong> AI-powered analysis with Claude Sonnet 4 is active!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Upload Project Summary</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <input {...getInputProps()} />
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Drag and drop file here</span> or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported: .yaml, .md, .txt (max 10MB)
              </p>
            </div>
          </div>
          {acceptedFiles.length > 0 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium">
                ✓ Loaded: {acceptedFiles[0].name} ({(acceptedFiles[0].size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}
          {fileRejections.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-medium">
                ✗ Error: {fileRejections[0].errors[0]?.message}
              </p>
            </div>
          )}
        </div>

        {/* Text Editor */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Or paste directly:</h2>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm font-medium bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="yaml">YAML</option>
              <option value="markdown">Markdown</option>
              <option value="text">Plain Text</option>
            </select>
          </div>
          <textarea
            value={projectSummary}
            onChange={(e) => setProjectSummary(e.target.value)}
            placeholder="Paste your project summary here..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-900">
                {analysisStep === 'parsing' && '🔍 Parsing summary...'}
                {analysisStep === 'researching' && '🤖 AI researching requirements...'}
                {analysisStep === 'clarifying' && '❓ Generating clarification questions...'}
                {analysisStep === 'generating' && '⚙️ Generating build specification...'}
              </span>
              <span className="text-sm text-blue-700">
                {analysisStep === 'parsing' && '25%'}
                {analysisStep === 'researching' && '50%'}
                {analysisStep === 'clarifying' && '75%'}
                {analysisStep === 'generating' && '99%'}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: analysisStep === 'parsing' ? '25%' : analysisStep === 'researching' ? '50%' : analysisStep === 'clarifying' ? '75%' : analysisStep === 'generating' ? '99%' : '0%'
                }}
              ></div>
            </div>
          </div>
        )}

        {isGenerating && !isAnalyzing && (
          <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-900">
                ⚙️ Generating build specification...
              </span>
              <span className="text-sm text-purple-700">Processing...</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
              <div className="bg-purple-600 h-3 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !projectSummary.trim()}
          className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isAnalyzing
            ? analysisStep === 'parsing'
              ? '🔍 Parsing summary...'
              : analysisStep === 'researching'
              ? '🤖 AI researching requirements...'
              : 'Analyzing...'
            : 'Analyze Project →'}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-green-50 border-2 border-green-300 rounded-lg shadow-md">
            <h3 className="font-bold text-xl mb-4 text-green-900">✓ Analysis Complete!</h3>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Project Name:</p>
              <p className="text-lg text-gray-900 font-medium">{result.data.projectName}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Description:</p>
              <p className="text-gray-800">{result.data.description}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Features ({result.data.features?.length || 0}):</p>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                {result.data.features?.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Tech Stack:</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-white p-3 rounded border border-green-200">
                  <span className="font-medium text-gray-900 block mb-1">Backend:</span>
                  <span className="text-gray-700">{result.data.techStack?.backend?.join(', ') || 'Not specified'}</span>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <span className="font-medium text-gray-900 block mb-1">Frontend:</span>
                  <span className="text-gray-700">{result.data.techStack?.frontend?.join(', ') || 'Not specified'}</span>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <span className="font-medium text-gray-900 block mb-1">Database:</span>
                  <span className="text-gray-700">{result.data.techStack?.database || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-green-300">
              <p className="text-sm text-gray-800">
                <span className="font-semibold text-gray-900">Completeness:</span> {(result.completeness.score * 100).toFixed(0)}%
              </p>
              {result.completeness.missing.length > 0 && (
                <p className="text-sm text-amber-700 mt-2 font-medium">
                  Missing: {result.completeness.missing.join(', ')}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-green-300">
              <p className="text-xs text-gray-600">Summary ID: {result.summaryId}</p>
            </div>
          </div>
        )}

        {/* AI Research Results */}
        {researchResult && (
          <div className="mt-6 p-6 bg-purple-50 border-2 border-purple-300 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-purple-900">🤖 AI Research Results</h3>
              <button
                onClick={() => setShowResearchDetails(!showResearchDetails)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-all duration-200 text-sm"
              >
                {showResearchDetails ? '▲ Hide Details' : '▼ Show Details'}
              </button>
            </div>

            {/* Summary (always visible) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium mb-1">Features</p>
                <p className="font-semibold text-2xl text-gray-900">{researchResult.data.requiredFeatures?.length || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium mb-1">Estimated Complexity</p>
                <p className="font-semibold text-xl text-gray-900 capitalize">{researchResult.data.estimatedComplexity}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium mb-1">Tech Stack</p>
                <p className="text-sm text-gray-900">{researchResult.data.recommendedTechStack?.backend?.framework}, {researchResult.data.recommendedTechStack?.frontend?.framework}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium mb-1">Estimated Timeline</p>
                <p className="font-semibold text-xl text-gray-900">{researchResult.data.estimatedTimeline}</p>
              </div>
            </div>

            {/* Detailed view (collapsible) */}
            {showResearchDetails && (
              <>
                {/* Required Features */}
                <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Required Features ({researchResult.data.requiredFeatures?.length || 0}):</p>
              <div className="space-y-3">
                {researchResult.data.requiredFeatures?.map((feature: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">{feature.name}</span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        feature.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        feature.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.priority}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-700">
                      <span className="font-medium">Complexity: {feature.complexity}</span>
                      <span>•</span>
                      <span>Est. {feature.estimatedHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Tech Stack */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Recommended Tech Stack:</p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                  <span className="font-medium text-sm text-gray-900 block mb-1">Backend:</span>
                  <span className="text-gray-800 font-semibold">{researchResult.data.recommendedTechStack?.backend?.framework}</span>
                  <p className="text-sm text-gray-700 mt-2">{researchResult.data.recommendedTechStack?.backend?.reasoning}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                  <span className="font-medium text-sm text-gray-900 block mb-1">Frontend:</span>
                  <span className="text-gray-800 font-semibold">{researchResult.data.recommendedTechStack?.frontend?.framework}</span>
                  <p className="text-sm text-gray-700 mt-2">{researchResult.data.recommendedTechStack?.frontend?.reasoning}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                  <span className="font-medium text-sm text-gray-900 block mb-1">Database:</span>
                  <span className="text-gray-800 font-semibold">{researchResult.data.recommendedTechStack?.database?.type}</span>
                  <p className="text-sm text-gray-700 mt-2">{researchResult.data.recommendedTechStack?.database?.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">Architecture Pattern:</p>
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <span className="font-medium text-gray-900 text-lg">{researchResult.data.architecture?.pattern}</span>
                <p className="text-sm text-gray-700 mt-2">{researchResult.data.architecture?.reasoning}</p>
              </div>
            </div>

            {/* Estimates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium mb-1">Estimated Complexity</p>
                <p className="font-semibold text-xl text-gray-900 capitalize">{researchResult.data.estimatedComplexity}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium mb-1">Estimated Timeline</p>
                <p className="font-semibold text-xl text-gray-900">{researchResult.data.estimatedTimeline}</p>
              </div>
            </div>

                <div className="mt-4 pt-4 border-t border-purple-300">
                  <p className="text-xs text-gray-600">Research ID: {researchResult.researchId}</p>
                </div>
              </>
            )}

            {/* Generate Build Spec Button */}
            {!buildSpec && (
              <div className="mt-6 pt-4 border-t border-purple-300">
                <button
                  onClick={handleGenerateBuildSpec}
                  disabled={isGenerating || !clarificationAnswered}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isGenerating ? '⚙️ Generating Build Specification...' : '🚀 Generate Complete Build Specification →'}
                </button>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Creates: Agent team, tool recommendations, and complete build document with planning intelligence
                </p>
                {!clarificationAnswered && researchResult && (
                  <p className="text-xs text-amber-600 mt-2 text-center font-medium">
                    ⏳ Please answer clarification questions first
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Build Specification Results */}
        {buildSpec && (
          <div className="mt-6 space-y-6">
            {/* Agent Team */}
            <div className="p-6 bg-indigo-50 border-2 border-indigo-300 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-4 text-indigo-900">👥 Agent Team ({buildSpec.agentTeam.totalAgents} agents)</h3>

              <div className="mb-4 p-3 bg-white rounded border border-indigo-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Total Estimated Hours:</span> {buildSpec.agentTeam.estimatedTotalHours}h
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-semibold text-gray-900">Execution Sequence:</span> {buildSpec.agentTeam.recommendedSequence.join(' → ')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buildSpec.agentTeam.agents.map((agent: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        agent.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        agent.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {agent.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{agent.role}</p>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p><span className="font-medium">Workload:</span> {agent.workloadPercentage}% ({agent.estimatedHours}h)</p>
                      <p><span className="font-medium">Skills:</span> {agent.skills.slice(0, 3).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Recommendations */}
            <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-4 text-green-900">🛠️ Recommended Tools ({buildSpec.tools.totalRecommendations} total)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MCP Servers */}
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">MCP Servers ({buildSpec.tools.mcpServers.length})</h4>
                  <ul className="text-sm space-y-1">
                    {buildSpec.tools.mcpServers.slice(0, 5).map((tool: any, i: number) => (
                      <li key={i} className="text-gray-700">
                        • {tool.name} <span className="text-xs text-gray-500">({tool.priority})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* NPM Packages */}
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">NPM Packages ({buildSpec.tools.npmPackages.length})</h4>
                  <ul className="text-sm space-y-1">
                    {buildSpec.tools.npmPackages.slice(0, 5).map((tool: any, i: number) => (
                      <li key={i} className="text-gray-700">
                        • {tool.name} <span className="text-xs text-gray-500">({tool.priority})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Complete Build Document */}
            <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-4 text-amber-900">📋 Complete Build Specification</h3>

              <div className="bg-white p-4 rounded border border-amber-200 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  A comprehensive {buildSpec.buildSpec.completeBuildDocument.length.toLocaleString()} character document containing everything needed to build your project.
                </p>
                <p className="text-xs text-gray-600">
                  Includes: Setup instructions, file structure, feature tasks, agent assignments, testing strategy, deployment guide, and complete implementation checklist.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const blob = new Blob([buildSpec.buildSpec.completeBuildDocument], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${result.data.projectName.replace(/\s+/g, '-')}-build-spec.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  📥 Download Build Specification (.md)
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(buildSpec.buildSpec.completeBuildDocument);
                    alert('Build specification copied to clipboard!');
                  }}
                  className="w-full px-6 py-3 bg-white border-2 border-amber-600 text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-200"
                >
                  📋 Copy to Clipboard
                </button>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Ready to build! You can now paste this document into Claude or any AI assistant to build your entire project.
                </p>
              </div>
            </div>

            {/* v0.7: Planning Intelligence Panel */}
            {buildSpec.planningDetails && (
              <PlanningDetailsPanel
                adrs={buildSpec.planningDetails.adrs}
                diagrams={buildSpec.planningDetails.diagrams}
                costEstimate={buildSpec.planningDetails.costEstimate}
                dependencyRisks={buildSpec.planningDetails.dependencyRisks}
              />
            )}
          </div>
        )}
      </div>

      {/* v0.7: Clarification Modal */}
      {showClarificationModal && clarificationQuestions.length > 0 && (
        <ClarificationModal
          questions={clarificationQuestions}
          onSubmit={handleClarificationSubmit}
          onClose={() => {
            setShowClarificationModal(false);
            setClarificationAnswered(true);
          }}
        />
      )}
    </div>
  );
}
