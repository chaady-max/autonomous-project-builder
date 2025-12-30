const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
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
