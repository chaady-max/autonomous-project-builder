'use client';

import { useEffect } from 'react';
import { useWizardStore } from '@/lib/store/wizardStore';

interface WizardContainerProps {
  children?: React.ReactNode;
}

export default function WizardContainer({ children }: WizardContainerProps) {
  const {
    sessionId,
    currentStep,
    completenessScore,
    status,
    lastSaved,
    isSaving,
    isLoading,
    error,
    setCurrentStep,
    calculateCompleteness,
  } = useWizardStore();

  // Calculate completeness when step changes
  useEffect(() => {
    if (sessionId) {
      calculateCompleteness();
    }
  }, [currentStep, sessionId, calculateCompleteness]);

  const steps = [
    { number: 1, title: 'Project Basics', icon: '📋' },
    { number: 2, title: 'Non-Negotiables', icon: '⚠️' },
    { number: 3, title: 'Personas', icon: '👥' },
    { number: 4, title: 'Features & Scope', icon: '✨' },
    { number: 5, title: 'User Flows', icon: '🔄' },
    { number: 6, title: 'Technical Reqs', icon: '⚙️' },
    { number: 7, title: 'Data & APIs', icon: '🗄️' },
    { number: 8, title: 'Review', icon: '✅' },
  ];

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCompletenessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletenessBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wizard session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                v0.8 Decision-Complete Wizard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Complete all steps to generate your project specification
              </p>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-4">
              {/* Completeness Score */}
              {sessionId && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Completeness</div>
                  <div className={`text-2xl font-bold ${getCompletenessColor(completenessScore)}`}>
                    {completenessScore}%
                  </div>
                </div>
              )}

              {/* Save Status */}
              <div className="flex items-center gap-2">
                {isSaving && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>Saving...</span>
                  </div>
                )}
                {!isSaving && lastSaved && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <span>✓</span>
                    <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completeness Progress Bar */}
          {sessionId && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getCompletenessBarColor(completenessScore)}`}
                  style={{ width: `${completenessScore}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                const isAccessible = step.number <= currentStep + 1;

                return (
                  <li key={step.number} className="relative flex-1">
                    {/* Connector line */}
                    {idx !== steps.length - 1 && (
                      <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5">
                        <div
                          className={`h-full ${
                            isCompleted ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        ></div>
                      </div>
                    )}

                    {/* Step button */}
                    <button
                      onClick={() => handleStepClick(step.number)}
                      disabled={!isAccessible}
                      className={`relative flex flex-col items-center group ${
                        isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      {/* Circle */}
                      <div
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-full text-lg
                          transition-all duration-200
                          ${
                            isCurrent
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                              : isCompleted
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }
                          ${isAccessible && !isCurrent ? 'group-hover:bg-indigo-500 group-hover:text-white' : ''}
                        `}
                      >
                        {isCompleted ? '✓' : step.icon}
                      </div>

                      {/* Label */}
                      <div className="mt-2 text-center">
                        <div
                          className={`text-xs font-medium ${
                            isCurrent ? 'text-indigo-600' : 'text-gray-600'
                          }`}
                        >
                          Step {step.number}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isCurrent ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          {children}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                px-6 py-2 rounded-lg font-medium transition-colors
                ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              ← Back
            </button>

            {/* Step indicator */}
            <div className="text-sm text-gray-600">
              Step {currentStep} of 8
            </div>

            {/* Next/Finish Button */}
            {currentStep < 8 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => {
                  // Will be implemented in Phase 3 (spec generation)
                  console.log('Generate spec');
                }}
                disabled={completenessScore < 80}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-colors
                  ${
                    completenessScore >= 80
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {completenessScore >= 80 ? '✓ Generate Specification' : '⚠️ Complete 80% to Generate'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-24"></div>
    </div>
  );
}
