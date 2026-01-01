'use client';

import { useEffect, useState } from 'react';
import { useWizardStore } from '@/lib/store/wizardStore';
import WizardContainer from '@/components/wizard/WizardContainer';
import Step1ProjectBasics from '@/components/wizard/steps/Step1ProjectBasics';
import Step2NonNegotiables from '@/components/wizard/steps/Step2NonNegotiables';
import Step3Personas from '@/components/wizard/steps/Step3Personas';
import Step4Features from '@/components/wizard/steps/Step4Features';
import Step5UserFlows from '@/components/wizard/steps/Step5UserFlows';
import Step6TechRequirements from '@/components/wizard/steps/Step6TechRequirements';
import Step7DataAPIs from '@/components/wizard/steps/Step7DataAPIs';
import Step8Review from '@/components/wizard/steps/Step8Review';

export default function WizardTestPage() {
  const { sessionId, currentStep, createSession, isLoading, error } = useWizardStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Create session on mount
  useEffect(() => {
    if (!sessionId && !isInitialized) {
      createSession()
        .then(() => {
          console.log('Wizard session created successfully');
          setIsInitialized(true);
        })
        .catch((err) => {
          console.error('Failed to create wizard session:', err);
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, [sessionId, createSession, isInitialized]);

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProjectBasics />;
      case 2:
        return <Step2NonNegotiables />;
      case 3:
        return <Step3Personas />;
      case 4:
        return <Step4Features />;
      case 5:
        return <Step5UserFlows />;
      case 6:
        return <Step6TechRequirements />;
      case 7:
        return <Step7DataAPIs />;
      case 8:
        return <Step8Review />;
      default:
        return null;
    }
  };

  // Show initialization loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing wizard...</p>
        </div>
      </div>
    );
  }

  // Show error if session creation failed
  if (error && !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Failed to Create Session
                </h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setIsInitialized(false);
                    createSession();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WizardContainer>
      {renderStepContent()}
    </WizardContainer>
  );
}
