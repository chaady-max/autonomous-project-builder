'use client';

import { useState } from 'react';
import { useWizardStore } from '@/lib/store/wizardStore';

export default function Step8Review() {
  const { step1, step2, step3, step4, step5, step6, step7, completenessScore, sessionId, generateSpec } = useWizardStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);
      await generateSpec();

      // Fetch the artifacts to show download links
      const response = await fetch(`http://localhost:3001/api/wizard/artifacts/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setGenerationResult(data.data);
      }
    } catch (error: any) {
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = completenessScore >= 80;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 8: Review & Generate</h2>
        <p className="text-gray-600 mt-2">
          Review your inputs and generate your decision-complete specification.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg font-semibold ${completenessScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {completenessScore}% Complete
          </div>
          {canGenerate ? (
            <span className="text-sm text-green-600">✓ Ready to generate!</span>
          ) : (
            <span className="text-sm text-yellow-600">Need {80 - completenessScore}% more to generate</span>
          )}
        </div>
      </div>

      {/* Completeness Gate */}
      {!canGenerate && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Minimum Completeness Required</h3>
              <p className="text-sm text-yellow-800 mb-3">
                You need at least 80% completeness to generate a decision-complete specification.
                Go back and fill in more details in previous steps.
              </p>
              <p className="text-xs text-yellow-700">
                <strong>Tip:</strong> The most important steps are Step 1 (Project Basics) and Step 2 (Non-Negotiables).
                Make sure all required fields are filled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Sections */}
      <div className="space-y-4">
        {/* Step 1: Project Basics */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden" open>
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>📋 Step 1: Project Basics</span>
            <span className={step1.projectName ? 'text-green-600' : 'text-gray-400'}>
              {step1.projectName ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 space-y-2 text-sm">
            <div><strong>Project Name:</strong> {step1.projectName || <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Type:</strong> {step1.projectType || <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Description:</strong> {step1.description ? <span className="text-gray-700">{step1.description.substring(0, 200)}{step1.description.length > 200 ? '...' : ''}</span> : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Timeline:</strong> {step1.timeline || <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Team Size:</strong> {step1.teamSize || <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Budget:</strong> {step1.budgetTier || <span className="text-gray-400">Not set</span>}</div>
          </div>
        </details>

        {/* Step 2: Non-Negotiables */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>⚠️ Step 2: Non-Negotiables</span>
            <span className={step2 && Object.values(step2).filter(v => v !== undefined).length >= 4 ? 'text-green-600' : 'text-gray-400'}>
              {step2 && Object.values(step2).filter(v => v !== undefined).length >= 4 ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 grid grid-cols-2 gap-2 text-sm">
            <div><strong>E2E Encryption:</strong> {step2?.e2ee !== undefined ? (step2.e2ee ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Admin Data Access:</strong> {step2?.adminRead !== undefined ? (step2.adminRead ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Phone Identity:</strong> {step2?.phoneIdentity !== undefined ? (step2.phoneIdentity ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Anonymous Users:</strong> {step2?.anonymousUsers !== undefined ? (step2.anonymousUsers ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Multi-Region:</strong> {step2?.multiRegion !== undefined ? (step2.multiRegion ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Offline-First:</strong> {step2?.offlineFirst !== undefined ? (step2.offlineFirst ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Multi-Tenant:</strong> {step2?.multiTenant !== undefined ? (step2.multiTenant ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
            <div><strong>Open Source:</strong> {step2?.openSource !== undefined ? (step2.openSource ? 'YES' : 'NO') : <span className="text-gray-400">Not set</span>}</div>
          </div>
        </details>

        {/* Step 3: Personas */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>👥 Step 3: Personas</span>
            <span className={step3?.personas && step3.personas.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {step3?.personas && step3.personas.length > 0 ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 space-y-2 text-sm">
            {step3?.personas && step3.personas.length > 0 ? (
              step3.personas.map((persona, idx) => (
                <div key={idx} className="bg-gray-50 rounded p-3">
                  <strong>{persona.name || 'Unnamed'}</strong> - {persona.role || 'No role'}
                  <div className="text-xs text-gray-600 mt-1">
                    {persona.goals && persona.goals.length > 0 ? `${persona.goals.length} goal${persona.goals.length > 1 ? 's' : ''}` : 'No goals'}
                    {persona.techSkill && ` • ${persona.techSkill}`}
                    {persona.frequency && ` • ${persona.frequency} user`}
                  </div>
                </div>
              ))
            ) : (
              <span className="text-gray-400">No personas defined</span>
            )}
          </div>
        </details>

        {/* Step 4: Features & Scope */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>✨ Step 4: Features & Scope</span>
            <span className={step4?.features && step4.features.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {step4?.features && step4.features.length > 0 ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 space-y-3 text-sm">
            {step4?.features && step4.features.length > 0 ? (
              <>
                <div>
                  <strong>Features ({step4.features.length}):</strong>
                  <div className="mt-1 space-y-1">
                    {step4.features.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="text-xs bg-gray-50 rounded px-2 py-1">
                        {feature.name || 'Unnamed'} - <span className={feature.scope === 'mvp' ? 'text-green-600' : feature.scope === 'post-mvp' ? 'text-blue-600' : 'text-gray-600'}>{feature.scope}</span>
                      </div>
                    ))}
                    {step4.features.length > 5 && <div className="text-xs text-gray-500">...and {step4.features.length - 5} more</div>}
                  </div>
                </div>
                <div><strong>In Scope:</strong> {step4.inScope?.length || 0} item(s)</div>
                <div><strong>Out of Scope:</strong> {step4.outOfScope?.length || 0} item(s)</div>
              </>
            ) : (
              <span className="text-gray-400">No features defined</span>
            )}
          </div>
        </details>

        {/* Step 5: User Flows */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>🔄 Step 5: User Flows</span>
            <span className={step5?.userFlows && step5.userFlows.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {step5?.userFlows && step5.userFlows.length > 0 ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 text-sm">
            {step5?.userFlows && step5.userFlows.length > 0 ? (
              <div className="space-y-2">
                {step5.userFlows.map((flow, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-2">
                    <strong>{flow.name || 'Unnamed flow'}</strong> - {flow.steps.length} step{flow.steps.length > 1 ? 's' : ''}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">No user flows defined (optional)</span>
            )}
          </div>
        </details>

        {/* Step 6: Technical Requirements */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>⚙️ Step 6: Technical Requirements</span>
            <span className={step6?.techStack && Object.keys(step6.techStack).length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {step6?.techStack && Object.keys(step6.techStack).length > 0 ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 space-y-2 text-sm">
            <div><strong>Backend:</strong> {step6?.techStack?.backend || 'Auto-recommend'}</div>
            <div><strong>Frontend:</strong> {step6?.techStack?.frontend || 'Auto-recommend'}</div>
            <div><strong>Database:</strong> {step6?.techStack?.database || 'Auto-recommend'}</div>
            <div><strong>Hosting:</strong> {step6?.techStack?.hosting || 'Auto-recommend'}</div>
            {step6?.performanceReqs?.pageLoad && <div><strong>Page Load Target:</strong> {step6.performanceReqs.pageLoad}s</div>}
            {step6?.accessibilityReq && <div><strong>Accessibility:</strong> WCAG {step6.accessibilityReq}</div>}
          </div>
        </details>

        {/* Step 7: Data & APIs */}
        <details className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex items-center justify-between">
            <span>🗄️ Step 7: Data & APIs</span>
            <span className={step7?.dataModel && step7.dataModel.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {step7?.dataModel && step7.dataModel.length > 0 ? '✓' : '○'}
            </span>
          </summary>
          <div className="p-5 space-y-2 text-sm">
            <div><strong>Entities:</strong> {step7?.dataModel?.length || 0}</div>
            <div><strong>External APIs:</strong> {step7?.externalAPIs?.length || 0}</div>
            {step7?.dataPrivacy?.gdpr && <div className="text-xs">✓ GDPR compliance required</div>}
            {step7?.dataPrivacy?.retention && <div className="text-xs">Data retention: {step7.dataPrivacy.retention}</div>}
          </div>
        </details>
      </div>

      {/* Generate Button */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-indigo-900 mb-3">Ready to Generate?</h3>
        <p className="text-sm text-indigo-800 mb-4">
          When you click Generate, the system will create a comprehensive, decision-complete specification
          including all 18 required sections, architecture decisions, and quality reports.
        </p>
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className={`
            w-full py-4 rounded-lg font-bold text-lg transition-all
            ${
              canGenerate && !isGenerating
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isGenerating ? '⏳ Generating...' : canGenerate ? '✨ Generate Decision-Complete Specification' : `⚠️ Need ${80 - completenessScore}% More Completion`}
        </button>
        {canGenerate && !isGenerating && (
          <p className="text-xs text-center text-indigo-600 mt-2">
            This will create a 10,000-30,000+ character specification document
          </p>
        )}
      </div>

      {/* Generation Error */}
      {generationError && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl">❌</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Generation Failed</h3>
              <p className="text-sm text-red-800">{generationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generation Success */}
      {generationResult && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎉</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-900 mb-3">Specification Generated Successfully!</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded p-3">
                    <div className="text-green-700 font-semibold">Total Characters</div>
                    <div className="text-2xl font-bold text-green-900">{generationResult.totalCharacters?.toLocaleString()}</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-green-700 font-semibold">Total Sections</div>
                    <div className="text-2xl font-bold text-green-900">{generationResult.totalSections || 18}</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">📥 Download Artifacts</h4>
                  <div className="space-y-2">
                    {generationResult.artifacts?.map((artifact: any) => (
                      <a
                        key={artifact.id}
                        href={`http://localhost:3001${artifact.downloadUrl}`}
                        download
                        className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{artifact.type === 'markdown' ? '📄' : '📋'}</span>
                          <div>
                            <div className="font-semibold text-green-900">{artifact.filename}</div>
                            <div className="text-xs text-green-700">{artifact.type.toUpperCase()} file</div>
                          </div>
                        </div>
                        <div className="text-green-600 group-hover:text-green-800 font-medium">
                          Download →
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-green-700">
                  ✅ All artifacts have been saved to the database and are ready for download
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What You'll Get */}
      {canGenerate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h4 className="text-sm font-bold text-green-900 mb-3">📦 What You'll Receive:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-green-800">
            <div>✓ 18-section markdown specification</div>
            <div>✓ decisions.yaml file</div>
            <div>✓ System architecture diagrams</div>
            <div>✓ Database schema (ER diagram)</div>
            <div>✓ Quality validation report</div>
            <div>✓ Cost estimates</div>
            <div>✓ Dependency risk analysis</div>
            <div>✓ Architecture Decision Records</div>
          </div>
        </div>
      )}
    </div>
  );
}
