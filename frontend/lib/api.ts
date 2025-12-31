const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    login: async (password: string) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
      return res.json();
    },
    verify: async (token: string) => {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      return res.json();
    },
    logout: async () => {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    }
  },
  analyze: {
    summary: async (content: string, format: 'yaml' | 'markdown' | 'text') => {
      const res = await fetch(`${API_URL}/api/analyze/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, format })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to analyze summary');
      }
      return res.json();
    },
    research: async (summaryId: string, parsedData: any) => {
      const res = await fetch(`${API_URL}/api/analyze/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId, parsedData })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to run AI research');
      }
      return res.json();
    },
  },
  settings: {
    getStatus: async () => {
      const res = await fetch(`${API_URL}/api/settings/status`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to check settings status');
      }
      return res.json();
    },
    saveApiKey: async (apiKey: string) => {
      const res = await fetch(`${API_URL}/api/settings/api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save API key');
      }
      return res.json();
    },
    removeApiKey: async () => {
      const res = await fetch(`${API_URL}/api/settings/api-key`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to remove API key');
      }
      return res.json();
    },
    testApi: async () => {
      const res = await fetch(`${API_URL}/api/settings/test-api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to test API');
      }
      return res.json();
    },
    getCustomInstructions: async () => {
      const res = await fetch(`${API_URL}/api/settings/custom-instructions`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to get custom instructions');
      }
      return res.json();
    },
    saveCustomInstructions: async (instructions: string) => {
      const res = await fetch(`${API_URL}/api/settings/custom-instructions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save custom instructions');
      }
      return res.json();
    },
  },
  generate: {
    buildSpec: async (researchId: string) => {
      const res = await fetch(`${API_URL}/api/generate/build-spec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchId })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to generate build specification');
      }
      return res.json();
    },
  },
};
