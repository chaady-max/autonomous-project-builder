import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface Step1Data {
  projectName?: string;
  projectType?: string;
  description?: string;
  timeline?: string;
  teamSize?: string;
  budgetTier?: string;
}

interface NonNegotiablesData {
  e2ee?: boolean;
  adminRead?: boolean;
  phoneIdentity?: boolean;
  anonymousUsers?: boolean;
  multiRegion?: boolean;
  offlineFirst?: boolean;
  multiTenant?: boolean;
  openSource?: boolean;
}

interface Persona {
  name: string;
  role: string;
  goals: string[];
  techSkill?: 'beginner' | 'intermediate' | 'expert';
  frequency?: 'daily' | 'weekly' | 'monthly';
}

interface Step3Data {
  personas: Persona[];
}

interface Feature {
  name: string;
  scope: 'mvp' | 'post-mvp' | 'nice';
  priority: number;
  description?: string;
}

interface Step4Data {
  features: Feature[];
  inScope: string[];
  outOfScope: string[];
}

interface UserFlow {
  name: string;
  steps: Array<{
    action: string;
    actor: string;
    system_response: string;
  }>;
}

interface Step5Data {
  userFlows: UserFlow[];
}

interface Step6Data {
  techStack?: {
    backend?: string;
    frontend?: string;
    database?: string;
    hosting?: string;
    [key: string]: string | undefined;
  };
  performanceReqs?: {
    pageLoad?: number;
    apiResponse?: number;
    [key: string]: number | undefined;
  };
  securityReqs?: {
    authMethod?: string;
    encryption?: string[];
    compliance?: string[];
    [key: string]: any;
  };
  scalabilityReqs?: {
    expectedUsers?: number;
    peakLoad?: number;
    dataVolume?: string;
    [key: string]: any;
  };
  accessibilityReq?: 'A' | 'AA' | 'AAA';
}

interface Step7Data {
  dataModel?: Array<{
    entity: string;
    fields: string[];
    relationships?: string[];
  }>;
  externalAPIs?: Array<{
    name: string;
    purpose: string;
    criticality: 'critical' | 'important' | 'optional';
  }>;
  dataPrivacy?: {
    gdpr?: boolean;
    hipaa?: boolean;
    retention?: string;
    [key: string]: any;
  };
}

interface QualityReport {
  overallScore: number;
  sectionScores: Record<string, number>;
  errors: Array<{ section: string; field: string; message: string; severity: string }>;
  warnings: Array<{ section: string; field: string; message: string }>;
  suggestions: Array<{ section: string; field: string; message: string }>;
  vagueTermsFound: Array<{ term: string; location: string; suggestion: string }>;
  missingDetails: Array<{ section: string; what_is_missing: string }>;
  passedQualityGate: boolean;
  requiredFixes?: string[];
}

interface GeneratedSpec {
  decisionsYaml: string;
  specMarkdown: string;
  sections: Array<{ number: number; title: string; completeness: number; warnings: string[] }>;
  totalCharacters: number;
  totalSections: number;
}

// ============================================
// WIZARD STORE
// ============================================

interface WizardStore {
  // Session state
  sessionId: string | null;
  currentStep: number;
  completenessScore: number;
  status: 'draft' | 'completed' | 'generating';

  // Step data
  step1: Step1Data;
  step2: NonNegotiablesData | null;
  step3: Step3Data | null;
  step4: Step4Data | null;
  step5: Step5Data | null;
  step6: Step6Data | null;
  step7: Step7Data | null;

  // Generated outputs
  generatedSpec: GeneratedSpec | null;
  qualityReport: QualityReport | null;

  // Auto-save state
  lastSaved: Date | null;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions - Session management
  createSession: (userId?: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  saveSession: () => Promise<void>;
  deleteSession: () => Promise<void>;

  // Actions - Step management
  setCurrentStep: (step: number) => void;
  updateStep1: (data: Partial<Step1Data>) => void;
  updateStep2: (data: NonNegotiablesData) => void;
  updateStep3: (data: Step3Data) => void;
  updateStep4: (data: Step4Data) => void;
  updateStep5: (data: Step5Data) => void;
  updateStep6: (data: Step6Data) => void;
  updateStep7: (data: Step7Data) => void;

  // Actions - Progress tracking
  calculateCompleteness: () => Promise<void>;
  validateCurrentStep: () => Promise<boolean>;

  // Actions - Generation
  generateSpec: () => Promise<void>;
  fetchQualityReport: () => Promise<void>;

  // Actions - Utility
  resetWizard: () => void;
  setError: (error: string | null) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: null,
      currentStep: 1,
      completenessScore: 0,
      status: 'draft',
      step1: {},
      step2: null,
      step3: null,
      step4: null,
      step5: null,
      step6: null,
      step7: null,
      generatedSpec: null,
      qualityReport: null,
      lastSaved: null,
      isSaving: false,
      isLoading: false,
      error: null,

      // Create new wizard session
      createSession: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/wizard/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId || null }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create session');
          }

          const result = await response.json();
          set({
            sessionId: result.data.sessionId,
            currentStep: result.data.currentStep,
            status: result.data.status,
            completenessScore: result.data.completenessScore,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Load existing wizard session
      loadSession: async (sessionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/wizard/session/${sessionId}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to load session');
          }

          const result = await response.json();
          const data = result.data;

          set({
            sessionId: data.id,
            currentStep: data.currentStep,
            status: data.status,
            completenessScore: data.completenessScore,
            step1: data.step1,
            step2: data.step2,
            step3: data.step3,
            step4: data.step4,
            step5: data.step5,
            step6: data.step6,
            step7: data.step7,
            generatedSpec: data.generatedSpec,
            qualityReport: data.qualityReport,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Save wizard session (auto-save)
      saveSession: async () => {
        const state = get();
        if (!state.sessionId) {
          console.warn('No session ID, skipping save');
          return;
        }

        set({ isSaving: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/wizard/session/${state.sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              currentStep: state.currentStep,
              status: state.status,
              completenessScore: state.completenessScore,
              step1: state.step1,
              step2: state.step2,
              step3: state.step3,
              step4: state.step4,
              step5: state.step5,
              step6: state.step6,
              step7: state.step7,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save session');
          }

          set({ isSaving: false, lastSaved: new Date() });
        } catch (error: any) {
          set({ error: error.message, isSaving: false });
          console.error('Failed to save session:', error);
        }
      },

      // Delete wizard session
      deleteSession: async () => {
        const state = get();
        if (!state.sessionId) {
          throw new Error('No session to delete');
        }

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/wizard/session/${state.sessionId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete session');
          }

          get().resetWizard();
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Set current wizard step
      setCurrentStep: (step: number) => {
        if (step < 1 || step > 8) {
          console.warn('Invalid step number:', step);
          return;
        }
        set({ currentStep: step });
        // Auto-save when changing steps
        setTimeout(() => get().saveSession(), 500);
      },

      // Update step data
      updateStep1: (data: Partial<Step1Data>) => {
        set((state) => ({
          step1: { ...state.step1, ...data },
        }));
        // Auto-save after 2 seconds of inactivity
        setTimeout(() => get().saveSession(), 2000);
      },

      updateStep2: (data: NonNegotiablesData) => {
        set({ step2: data });
        setTimeout(() => get().saveSession(), 2000);
      },

      updateStep3: (data: Step3Data) => {
        set({ step3: data });
        setTimeout(() => get().saveSession(), 2000);
      },

      updateStep4: (data: Step4Data) => {
        set({ step4: data });
        setTimeout(() => get().saveSession(), 2000);
      },

      updateStep5: (data: Step5Data) => {
        set({ step5: data });
        setTimeout(() => get().saveSession(), 2000);
      },

      updateStep6: (data: Step6Data) => {
        set({ step6: data });
        setTimeout(() => get().saveSession(), 2000);
      },

      updateStep7: (data: Step7Data) => {
        set({ step7: data });
        setTimeout(() => get().saveSession(), 2000);
      },

      // Calculate completeness score
      calculateCompleteness: async () => {
        const state = get();
        if (!state.sessionId) {
          console.warn('No session ID, skipping completeness calculation');
          return;
        }

        try {
          const response = await fetch(`${API_URL}/api/wizard/session/${state.sessionId}/completeness`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to calculate completeness');
          }

          const result = await response.json();
          set({ completenessScore: result.data.score });
        } catch (error: any) {
          console.error('Failed to calculate completeness:', error);
          set({ error: error.message });
        }
      },

      // Validate current step
      validateCurrentStep: async () => {
        const state = get();
        if (!state.sessionId) {
          return false;
        }

        try {
          const response = await fetch(`${API_URL}/api/wizard/session/${state.sessionId}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            return false;
          }

          const result = await response.json();
          return result.data.valid;
        } catch (error: any) {
          console.error('Validation failed:', error);
          return false;
        }
      },

      // Generate specification
      generateSpec: async () => {
        const state = get();
        if (!state.sessionId) {
          throw new Error('No session ID');
        }

        if (state.completenessScore < 80) {
          throw new Error(`Completeness score too low: ${state.completenessScore}%. Minimum required: 80%`);
        }

        set({ status: 'generating', error: null });
        try {
          const response = await fetch(`${API_URL}/api/wizard/generate/${state.sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate spec');
          }

          const result = await response.json();
          set({
            generatedSpec: result.data.spec,
            status: 'completed',
          });

          // Fetch quality report
          await get().fetchQualityReport();
        } catch (error: any) {
          set({ error: error.message, status: 'draft' });
          throw error;
        }
      },

      // Fetch quality report
      fetchQualityReport: async () => {
        const state = get();
        if (!state.sessionId) {
          return;
        }

        try {
          const response = await fetch(`${API_URL}/api/wizard/quality/${state.sessionId}`);

          if (!response.ok) {
            console.warn('Quality report not available yet');
            return;
          }

          const result = await response.json();
          set({ qualityReport: result.data });
        } catch (error: any) {
          console.error('Failed to fetch quality report:', error);
        }
      },

      // Reset wizard to initial state
      resetWizard: () => {
        set({
          sessionId: null,
          currentStep: 1,
          completenessScore: 0,
          status: 'draft',
          step1: {},
          step2: null,
          step3: null,
          step4: null,
          step5: null,
          step6: null,
          step7: null,
          generatedSpec: null,
          qualityReport: null,
          lastSaved: null,
          isSaving: false,
          isLoading: false,
          error: null,
        });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'wizard-storage', // localStorage key
      partialize: (state) => ({
        // Only persist essential data, not temporary states
        sessionId: state.sessionId,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Export types for use in components
export type {
  Step1Data,
  NonNegotiablesData,
  Persona,
  Step3Data,
  Feature,
  Step4Data,
  UserFlow,
  Step5Data,
  Step6Data,
  Step7Data,
  QualityReport,
  GeneratedSpec,
};
