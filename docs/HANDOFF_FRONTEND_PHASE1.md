# Frontend Agent Handoff: Phase 1 Tasks

**From:** Planning Agent
**To:** Frontend Visualization Specialist
**Date:** 2025-12-27
**Phase:** Phase 1 - Analysis Engine (Week 1-2)
**Priority:** P0 (Critical Path)

---

## 🎯 Your Mission

Build the **Analysis UI** for Autonomous Project Builder. Users will upload project summaries and see AI-powered analysis results including generated agent teams and tool recommendations.

**Your work is the first thing users interact with. Make it beautiful, intuitive, and fast.**

---

## 📋 Tasks Assigned to You

### Task 1.5: Project Summary Upload UI ⭐ START HERE
**Estimate:** 6 hours
**Dependencies:** Backend Task 1.1 (parser API)
**Priority:** P0

**What to Build:**
Create an upload interface where users can submit project summaries via file upload or direct text input.

**Component:** `UploadForm`

**Features:**
1. **Drag-and-Drop File Upload**
   - Accept `.yaml`, `.md`, `.txt` files
   - Max size: 10MB
   - Show file preview after drop

2. **Text Editor (Alternative to Upload)**
   - Monaco Editor or simple textarea
   - Syntax highlighting for YAML/Markdown
   - Format selector dropdown (YAML | Markdown | Text)

3. **Validation & Feedback**
   - Show parsing errors inline
   - Display completeness score (from backend)
   - Flag missing required fields

4. **Loading State**
   - Show spinner while parsing
   - Disable submit during processing

**UI Design:**

```
┌─────────────────────────────────────────────────────┐
│  Autonomous Project Builder                         │
│  Transform your idea into a working MVP             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                      │
│   Upload Your Project Summary                       │
│                                                      │
│   ┌───────────────────────────────────────────┐   │
│   │                                            │   │
│   │   📄 Drag & drop file here                │   │
│   │      or click to browse                    │   │
│   │                                            │   │
│   │   Supported: .yaml, .md, .txt (max 10MB)  │   │
│   │                                            │   │
│   └───────────────────────────────────────────┘   │
│                                                      │
│   OR paste directly:                                │
│                                                      │
│   Format: [YAML ▼] [Markdown] [Plain Text]         │
│                                                      │
│   ┌───────────────────────────────────────────┐   │
│   │ PROJECT:                                   │   │
│   │   name: My SaaS App                       │   │
│   │   description: ...                        │   │
│   │   features:                               │   │
│   │     - User authentication                 │   │
│   │                                            │   │
│   └───────────────────────────────────────────┘   │
│                                                      │
│   [✓] I want example templates                     │
│                                                      │
│          [Analyze Project →]                        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

1. **File Upload (react-dropzone):**
```typescript
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
  accept: {
    'text/yaml': ['.yaml', '.yml'],
    'text/markdown': ['.md'],
    'text/plain': ['.txt']
  },
  maxSize: 10 * 1024 * 1024, // 10MB
  onDrop: (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result as string;
      setProjectSummary(content);
      // Detect format from file extension
      const format = file.name.endsWith('.yaml') || file.name.endsWith('.yml')
        ? 'yaml'
        : file.name.endsWith('.md')
          ? 'markdown'
          : 'text';
      setFormat(format);
    };
    reader.readAsText(file);
  }
});
```

2. **Text Editor (textarea with syntax highlighting):**
```typescript
<div>
  <label>Format:</label>
  <select value={format} onChange={(e) => setFormat(e.target.value)}>
    <option value="yaml">YAML</option>
    <option value="markdown">Markdown</option>
    <option value="text">Plain Text</option>
  </select>

  <textarea
    value={projectSummary}
    onChange={(e) => setProjectSummary(e.target.value)}
    placeholder="Paste your project summary here..."
    rows={15}
    className="font-mono"
  />
</div>
```

3. **Submit to Backend:**
```typescript
const handleAnalyze = async () => {
  setIsAnalyzing(true);
  setError(null);

  try {
    const response = await fetch('http://localhost:3001/api/analyze/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: projectSummary,
        format: format
      })
    });

    if (!response.ok) {
      throw new Error('Failed to parse summary');
    }

    const data = await response.json();

    // Show validation feedback
    if (data.completeness.score < 0.5) {
      setWarning(`Missing: ${data.completeness.missing.join(', ')}`);
    }

    // Store parsed data for next step
    setParsedData(data.data);

    // Trigger research (Task 1.2)
    handleResearch(data.data);

  } catch (err) {
    setError(err.message);
  } finally {
    setIsAnalyzing(false);
  }
};
```

4. **Error Handling:**
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 p-4 rounded">
    <p className="text-red-700">❌ {error}</p>
  </div>
)}

{warning && (
  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
    <p className="text-yellow-700">⚠️ {warning}</p>
    <p className="text-sm">Consider adding: {warning}</p>
  </div>
)}
```

**Files to Create:**
- `/frontend/src/components/upload/UploadForm.tsx` - Main upload component
- `/frontend/src/components/upload/FileDropzone.tsx` - Drag-and-drop zone
- `/frontend/src/components/upload/TextEditor.tsx` - Text input area
- `/frontend/src/hooks/useProjectAnalysis.ts` - API call hook

**Definition of Done:**
- ✅ File upload works (drag-and-drop + click)
- ✅ Text editor accepts YAML/Markdown/Text
- ✅ Format selector working
- ✅ Calls backend `/api/analyze/summary` on submit
- ✅ Shows validation errors/warnings
- ✅ Loading state during analysis
- ✅ Responsive design (works on 768px+ screens)

**Test Cases:**
1. Drag a `.yaml` file → Shows file name and preview
2. Paste YAML in editor → Select YAML format → Click "Analyze"
3. Submit invalid YAML → See error message
4. Submit valid YAML with missing fields → See warning

---

### Task 1.6: Analysis Dashboard
**Estimate:** 10 hours
**Dependencies:** Backend Tasks 1.2, 1.3, 1.4 (research, agents, tools APIs)
**Priority:** P0

**What to Build:**
Display analysis results in an interactive dashboard showing:
1. Project features and requirements
2. Generated agent team (cards)
3. Recommended tools and packages
4. "Approve & Build" button to proceed

**Component:** `AnalysisDashboard`

**UI Design:**

```
┌─────────────────────────────────────────────────────┐
│  Analysis Complete! ✓                                │
│  Project: TaskFlow SaaS                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📊 Project Overview                                 │
│                                                      │
│  Complexity: Medium                                  │
│  Estimated Timeline: 6-8 weeks                       │
│  Required Features: 8                                │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ ✓ User Authentication (Critical, 16h)       │   │
│  │ ✓ Task CRUD (Critical, 8h)                  │   │
│  │ ✓ Real-time Updates (High, 12h)            │   │
│  │ ✓ Team Collaboration (Medium, 10h)         │   │
│  │ ... (4 more)                                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🤖 Generated Agent Team (4 agents)                  │
│                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│  │ Planning     │ │ Backend      │ │ Frontend    ││
│  │ Agent        │ │ Engineer     │ │ Specialist  ││
│  │              │ │              │ │             ││
│  │ 15% workload │ │ 40% workload │ │ 35% workload││
│  │              │ │              │ │             ││
│  │ • Planning   │ │ • API design │ │ • UI/UX     ││
│  │ • Coordin.   │ │ • Database   │ │ • Components││
│  │              │ │ • WebSocket  │ │ • Real-time ││
│  └──────────────┘ └──────────────┘ └─────────────┘│
│                                                      │
│  [View Full Details →]                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🔧 Recommended Tech Stack & Tools                   │
│                                                      │
│  Backend (12 packages):                              │
│  • express ^4.18.2 - HTTP server                    │
│  • prisma ^5.7.0 - Database ORM                     │
│  • passport ^0.7.0 - Authentication                 │
│  • socket.io ^4.6.1 - Real-time                     │
│  ... (8 more) [View All]                            │
│                                                      │
│  Frontend (8 packages):                              │
│  • next ^14.0.4 - React framework                   │
│  • tailwindcss ^3.4.1 - Styling                     │
│  ... (6 more) [View All]                            │
│                                                      │
│  [📄 Download package.json files]                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                      │
│   [← Edit Summary]   [Approve & Build →]            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

1. **Fetch Analysis Data:**
```typescript
const AnalysisDashboard = ({ summaryId }) => {
  const [research, setResearch] = useState(null);
  const [agents, setAgents] = useState([]);
  const [tools, setTools] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      // These run in parallel after upload
      const [researchRes, agentsRes, toolsRes] = await Promise.all([
        fetch(`http://localhost:3001/api/analyze/research/${summaryId}`),
        fetch(`http://localhost:3001/api/generate/agents/${summaryId}`),
        fetch(`http://localhost:3001/api/recommend/tools/${summaryId}`)
      ]);

      setResearch(await researchRes.json());
      setAgents(await agentsRes.json());
      setTools(await toolsRes.json());
      setLoading(false);
    };

    fetchAnalysis();
  }, [summaryId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ProjectOverview research={research} />
      <AgentTeam agents={agents.agents} />
      <ToolRecommendations tools={tools.recommendations} />
      <ActionButtons onApprove={handleBuild} />
    </div>
  );
};
```

2. **Project Overview Component:**
```typescript
const ProjectOverview = ({ research }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">📊 Project Overview</h2>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <Stat label="Complexity" value={research.estimatedComplexity} />
      <Stat label="Timeline" value={research.estimatedTimeline} />
      <Stat label="Features" value={research.requiredFeatures.length} />
    </div>

    <h3 className="font-semibold mb-2">Required Features:</h3>
    <ul className="space-y-2">
      {research.requiredFeatures.map(feature => (
        <li key={feature.name} className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span className="font-medium">{feature.name}</span>
          <span className="text-sm text-gray-500">
            ({feature.priority}, {feature.estimatedHours}h)
          </span>
        </li>
      ))}
    </ul>
  </div>
);
```

3. **Agent Team Cards:**
```typescript
const AgentTeam = ({ agents }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">
      🤖 Generated Agent Team ({agents.length} agents)
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  </div>
);

const AgentCard = ({ agent }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition">
    <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
    <p className="text-sm text-gray-600 mb-3">{agent.role}</p>

    <div className="mb-3">
      <div className="text-sm font-medium mb-1">
        Workload: {agent.workloadPercentage}%
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${agent.workloadPercentage}%` }}
        />
      </div>
    </div>

    <div>
      <div className="text-sm font-medium mb-1">Responsibilities:</div>
      <ul className="text-sm text-gray-700 space-y-1">
        {agent.responsibilities.slice(0, 3).map((resp, i) => (
          <li key={i}>• {resp}</li>
        ))}
      </ul>
    </div>

    <button className="mt-3 text-blue-500 text-sm hover:underline">
      View Full Details →
    </button>
  </div>
);
```

4. **Tool Recommendations:**
```typescript
const ToolRecommendations = ({ tools }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        🔧 Recommended Tech Stack & Tools
      </h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          Backend ({tools.backend.length} packages):
        </h3>
        <ul className="space-y-1">
          {tools.backend.slice(0, showAll ? undefined : 4).map(pkg => (
            <li key={pkg.name} className="flex items-start gap-2">
              <span className="font-mono text-sm">{pkg.name}</span>
              <span className="text-gray-500 text-sm">{pkg.version}</span>
              <span className="text-sm">- {pkg.reasoning}</span>
            </li>
          ))}
        </ul>
        {tools.backend.length > 4 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-500 text-sm mt-2 hover:underline"
          >
            ... ({tools.backend.length - 4} more) [View All]
          </button>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">
          Frontend ({tools.frontend.length} packages):
        </h3>
        <ul className="space-y-1">
          {tools.frontend.slice(0, 4).map(pkg => (
            <li key={pkg.name} className="flex items-start gap-2">
              <span className="font-mono text-sm">{pkg.name}</span>
              <span className="text-gray-500 text-sm">{pkg.version}</span>
              <span className="text-sm">- {pkg.reasoning}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
        📄 Download package.json files
      </button>
    </div>
  );
};
```

5. **Action Buttons:**
```typescript
const ActionButtons = ({ onApprove }) => (
  <div className="flex justify-between items-center">
    <button className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50">
      ← Edit Summary
    </button>

    <button
      onClick={onApprove}
      className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
    >
      Approve & Build →
    </button>
  </div>
);
```

**Files to Create:**
- `/frontend/src/components/analysis/AnalysisDashboard.tsx` - Main dashboard
- `/frontend/src/components/analysis/ProjectOverview.tsx` - Feature list
- `/frontend/src/components/analysis/AgentTeam.tsx` - Agent cards
- `/frontend/src/components/analysis/AgentCard.tsx` - Single agent display
- `/frontend/src/components/analysis/ToolRecommendations.tsx` - Package list
- `/frontend/src/components/analysis/ActionButtons.tsx` - Approve/Edit buttons
- `/frontend/src/hooks/useAnalysis.ts` - Fetch analysis data

**Definition of Done:**
- ✅ Displays project features and complexity
- ✅ Shows all generated agents with workload
- ✅ Lists recommended tools with reasoning
- ✅ "Approve & Build" button triggers next phase
- ✅ "Edit Summary" goes back to upload
- ✅ Responsive design (768px+)
- ✅ Loading states while fetching data

---

## 🏗️ Project Setup (Do This First!)

### 1. Initialize Frontend Project

```bash
cd /Users/max/AutonomousProjectBuilder

# Create Next.js 14 app
npx create-next-app@latest frontend --typescript --tailwind --app --no-src
cd frontend

# Install dependencies
npm install react-dropzone
npm install @monaco-editor/react  # (optional, for code editor)
npm install clsx  # utility for conditional classes

# Install dev dependencies
npm install -D @types/react-dropzone
```

### 2. Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Home (upload page)
│   ├── analysis/
│   │   └── page.tsx          # Analysis results page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── upload/
│   │   ├── UploadForm.tsx
│   │   ├── FileDropzone.tsx
│   │   └── TextEditor.tsx
│   ├── analysis/
│   │   ├── AnalysisDashboard.tsx
│   │   ├── ProjectOverview.tsx
│   │   ├── AgentTeam.tsx
│   │   ├── AgentCard.tsx
│   │   └── ToolRecommendations.tsx
│   └── ui/
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── hooks/
│   ├── useProjectAnalysis.ts
│   └── useAnalysis.ts
├── lib/
│   └── api.ts                # API client
└── types/
    └── project.ts            # TypeScript types
```

### 3. API Client Setup

Create `/frontend/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  analyze: {
    summary: async (content: string, format: string) => {
      const res = await fetch(`${API_URL}/api/analyze/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, format })
      });
      if (!res.ok) throw new Error('Failed to analyze summary');
      return res.json();
    },

    research: async (summaryId: string, parsedData: any) => {
      const res = await fetch(`${API_URL}/api/analyze/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId, parsedData })
      });
      if (!res.ok) throw new Error('Failed to get research');
      return res.json();
    }
  },

  generate: {
    agents: async (researchId: string, requirements: any) => {
      const res = await fetch(`${API_URL}/api/generate/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchId, projectRequirements: requirements })
      });
      if (!res.ok) throw new Error('Failed to generate agents');
      return res.json();
    }
  },

  recommend: {
    tools: async (researchId: string, techStack: any, features: string[]) => {
      const res = await fetch(`${API_URL}/api/recommend/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchId, techStack, features })
      });
      if (!res.ok) throw new Error('Failed to get tool recommendations');
      return res.json();
    }
  }
};
```

### 4. Environment Variables

Create `/frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Test Frontend

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🎯 Success Criteria (Phase 1)

Your work is complete when:

1. ✅ **Task 1.5:** Upload UI works (file + text input)
2. ✅ **Task 1.6:** Analysis dashboard displays all results
3. ✅ **End-to-End Flow:**
   - User uploads summary → Sees loading state
   - Analysis completes → Dashboard appears
   - Agent cards, tools, features all visible
   - "Approve & Build" button ready (no action yet, Phase 2)
4. ✅ **Responsive design** (works on 768px+ screens)
5. ✅ **No console errors** in browser
6. ✅ **TypeScript compiles** without errors

---

## 📞 Communication

### Daily Updates
```
Agent: Frontend Visualization Specialist
✓ Completed: Task 1.5 (Upload UI with drag-and-drop)
→ Next: Task 1.6 (Analysis dashboard)
🚨 Blockers: Waiting for Backend /api/generate/agents endpoint
```

### Handoff from Backend Agent
Backend will tell you when APIs are ready:
```
Backend Agent → Frontend Agent:
Analysis endpoints ready:
- POST /api/analyze/summary
- POST /api/analyze/research
- POST /api/generate/agents
- POST /api/recommend/tools

Example responses: [See backend handoff doc]
```

### Escalate to Planning Agent
If blocked:
```
🚨 Blocker: /api/generate/agents returns 500 error
Impact: Can't display agent cards (Task 1.6)
Proposed Solution: Use mock data for now, integrate real API when fixed
Needs Decision From: Planning Agent
```

---

## 📚 Resources

### Documentation
- **Next.js 14:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **react-dropzone:** https://react-dropzone.js.org/
- **Monaco Editor:** https://microsoft.github.io/monaco-editor/

### Design Inspiration
- **Vercel:** https://vercel.com (clean, modern)
- **Linear:** https://linear.app (cards, minimal)
- **Notion:** https://notion.so (drag-and-drop)

### Internal Docs
- **Project Plan:** `/Users/max/AutonomousProjectBuilder/docs/PROJECT_PLAN.md`
- **Backend Handoff:** `/Users/max/AutonomousProjectBuilder/docs/HANDOFF_BACKEND_PHASE1.md`

---

## 🚀 Ready to Start?

**Your first action:** Set up Next.js project (follow "Project Setup" above).

**Then:** Start with Task 1.5 (Upload UI). Get file upload and text editor working first.

**Estimated completion:** End of Week 2 (both tasks done, ready for Phase 2).

**Make it beautiful! First impressions matter. Users should feel excited to use APB.**

---

**Handoff Date:** 2025-12-27
**From:** Planning Agent
**Status:** Ready to Start
**Next Check-in:** End of Week 1 (Task 1.5 complete)
