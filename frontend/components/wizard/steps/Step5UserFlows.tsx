'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizardStore, type UserFlow } from '@/lib/store/wizardStore';

// ============================================
// VALIDATION SCHEMA
// ============================================

const flowStepSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  actor: z.string().min(1, 'Actor is required'),
  system_response: z.string().min(1, 'System response is required'),
});

const userFlowSchema = z.object({
  name: z.string().min(3, 'Flow name must be at least 3 characters'),
  steps: z.array(flowStepSchema).min(1, 'At least one step is required'),
});

const step5Schema = z.object({
  userFlows: z.array(userFlowSchema).min(0, 'User flows are optional'),
});

type Step5FormData = z.infer<typeof step5Schema>;

// ============================================
// COMPONENT
// ============================================

export default function Step5UserFlows() {
  const { step5, updateStep5 } = useWizardStore();

  const [flows, setFlows] = useState<UserFlow[]>(
    step5?.userFlows?.length
      ? step5.userFlows
      : []
  );

  // Auto-save
  useEffect(() => {
    updateStep5({ userFlows: flows });
  }, [flows, updateStep5]);

  const addFlow = () => {
    setFlows([
      ...flows,
      {
        name: '',
        steps: [{ action: '', actor: '', system_response: '' }],
      },
    ]);
  };

  const removeFlow = (flowIndex: number) => {
    setFlows(flows.filter((_, idx) => idx !== flowIndex));
  };

  const updateFlowName = (flowIndex: number, name: string) => {
    const updated = [...flows];
    updated[flowIndex] = { ...updated[flowIndex], name };
    setFlows(updated);
  };

  const addFlowStep = (flowIndex: number) => {
    const updated = [...flows];
    updated[flowIndex].steps.push({ action: '', actor: '', system_response: '' });
    setFlows(updated);
  };

  const removeFlowStep = (flowIndex: number, stepIndex: number) => {
    const updated = [...flows];
    if (updated[flowIndex].steps.length > 1) {
      updated[flowIndex].steps = updated[flowIndex].steps.filter((_, idx) => idx !== stepIndex);
      setFlows(updated);
    }
  };

  const updateFlowStep = (flowIndex: number, stepIndex: number, field: keyof typeof flows[0]['steps'][0], value: string) => {
    const updated = [...flows];
    updated[flowIndex].steps[stepIndex] = {
      ...updated[flowIndex].steps[stepIndex],
      [field]: value,
    };
    setFlows(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 5: User Flows</h2>
        <p className="text-gray-600 mt-2">
          Define key user journeys through your application. Document the happy path and critical edge cases.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
          <span className="font-semibold">{flows.length} flow{flows.length !== 1 ? 's' : ''} defined</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">What are User Flows?</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• <strong>Step-by-step paths</strong> users take to accomplish a goal</li>
              <li>• <strong>Actor:</strong> Who is performing the action (user, admin, system)</li>
              <li>• <strong>Action:</strong> What the actor does</li>
              <li>• <strong>System Response:</strong> How the system reacts</li>
              <li>• Focus on 2-5 critical flows (signup, core feature use, checkout, etc.)</li>
              <li>• This step is optional but highly recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Optional Skip */}
      {flows.length === 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900">This Step is Optional</h4>
              <p className="mt-1 text-xs text-yellow-800">
                User flows help clarify requirements, but you can skip this step and click Next to continue.
                You can also add flows later if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Flows */}
      {flows.length > 0 && (
        <div className="space-y-6">
          {flows.map((flow, flowIndex) => (
            <div key={flowIndex} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              {/* Flow Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">🔄</span>
                  <input
                    type="text"
                    value={flow.name}
                    onChange={(e) => updateFlowName(flowIndex, e.target.value)}
                    placeholder="Flow name (e.g., User Signup Flow, Checkout Process)"
                    className="flex-1 bg-white/20 text-white placeholder-white/70 px-3 py-1.5 rounded border-2 border-white/30 focus:border-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeFlow(flowIndex)}
                  className="text-white hover:text-red-200 transition-colors"
                  title="Remove flow"
                >
                  <span className="text-xl">🗑️</span>
                </button>
              </div>

              {/* Flow Steps */}
              <div className="p-5 space-y-4">
                {flow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        {/* Actor */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Actor (Who?)
                          </label>
                          <input
                            type="text"
                            value={step.actor}
                            onChange={(e) => updateFlowStep(flowIndex, stepIndex, 'actor', e.target.value)}
                            placeholder="e.g., User, Admin, System"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        {/* Action */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Action (What do they do?)
                          </label>
                          <input
                            type="text"
                            value={step.action}
                            onChange={(e) => updateFlowStep(flowIndex, stepIndex, 'action', e.target.value)}
                            placeholder="e.g., Clicks 'Sign Up' button, Enters email and password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        {/* System Response */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            System Response (What happens?)
                          </label>
                          <input
                            type="text"
                            value={step.system_response}
                            onChange={(e) => updateFlowStep(flowIndex, stepIndex, 'system_response', e.target.value)}
                            placeholder="e.g., Validates inputs, Creates account, Sends welcome email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Remove Step Button */}
                      {flow.steps.length > 1 && (
                        <button
                          onClick={() => removeFlowStep(flowIndex, stepIndex)}
                          className="flex-shrink-0 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Step Button */}
                <button
                  onClick={() => addFlowStep(flowIndex)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium text-sm"
                >
                  + Add Step to This Flow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Flow Button */}
      <button
        onClick={addFlow}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium"
      >
        + Add User Flow
      </button>

      {/* Example Flows */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-purple-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-purple-900">Example: User Signup Flow</h4>
            <div className="mt-2 space-y-2 text-xs text-purple-800">
              <div className="bg-white rounded p-2">
                <strong>Step 1:</strong> User → Clicks "Sign Up" → System shows signup form
              </div>
              <div className="bg-white rounded p-2">
                <strong>Step 2:</strong> User → Enters email & password → System validates inputs
              </div>
              <div className="bg-white rounded p-2">
                <strong>Step 3:</strong> User → Clicks "Create Account" → System creates account, sends verification email
              </div>
              <div className="bg-white rounded p-2">
                <strong>Step 4:</strong> User → Clicks link in email → System verifies email, redirects to dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Step 5 Status</h3>
        <div className="space-y-1">
          {flows.length === 0 ? (
            <p className="text-xs text-gray-500">No flows defined (optional step)</p>
          ) : (
            flows.map((flow, idx) => {
              const hasName = flow.name && flow.name.length >= 3;
              const hasCompleteSteps = flow.steps.every(
                (s) => s.action && s.actor && s.system_response
              );

              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className={hasName && hasCompleteSteps ? 'text-green-600' : 'text-gray-400'}>
                    {hasName && hasCompleteSteps ? '✓' : '○'}
                  </span>
                  <span className={hasName && hasCompleteSteps ? 'text-gray-700' : 'text-gray-500'}>
                    Flow {idx + 1}: {flow.name || 'Unnamed'} ({flow.steps.length} step{flow.steps.length !== 1 ? 's' : ''})
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">✅</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-900">Benefits of Defining Flows</h4>
            <ul className="mt-2 space-y-1 text-xs text-green-800">
              <li>• Clarifies requirements before development starts</li>
              <li>• Helps identify missing features or edge cases</li>
              <li>• Becomes foundation for user stories and test cases</li>
              <li>• Aligns team on expected user experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
