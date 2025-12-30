# Backend Agent Handoff: Phase 1 Tasks

**From:** Planning Agent
**To:** Backend Infrastructure Engineer
**Date:** 2025-12-27
**Phase:** Phase 1 - Analysis Engine (Week 1-2)
**Priority:** P0 (Critical Path)

---

## 🎯 Your Mission

Build the **Analysis Engine backend** that powers the first half of APB. This includes parsing project summaries, orchestrating AI research, generating agent teams, and recommending tools.

**Your tasks form the foundation of the entire system. Frontend depends on your APIs.**

---

## 📋 Tasks Assigned to You

### Task 1.1: Project Summary Parser ⭐ START HERE
**Estimate:** 8 hours
**Dependencies:** None (can start immediately)
**Priority:** P0

**What to Build:**
Create an API endpoint that accepts project summaries in multiple formats (YAML, Markdown, plain text) and extracts structured data.

**API Endpoint:**
```
POST /api/analyze/summary
```

**Request Body:**
```json
{
  "content": "string (project summary text)",
  "format": "yaml" | "markdown" | "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projectName": "string",
    "description": "string",
    "features": ["string"],
    "techStack": {
      "backend": ["string"],
      "frontend": ["string"],
      "database": "string"
    },
    "timeline": "string",
    "teamSize": "string",
    "constraints": ["string"]
  },
  "completeness": {
    "score": 0.85,  // 0-1 scale
    "missing": ["deployment", "authentication"]
  }
}
```

**Implementation Details:**

1. **YAML Parsing:**
   - Use `js-yaml` library
   - Parse structured YAML (like Claude Dashboard project scope)
   - Extract keys: name, description, objectives, tech_stack, timeline, constraints

2. **Markdown Parsing:**
   - Use `marked` or `remark` library
   - Extract headers (# Project Name, ## Features, etc.)
   - Parse bullet lists under each section

3. **Plain Text Parsing:**
   - Use Claude API with simple prompt:
     - "Extract structured project information from this text"
   - More flexible but slower (fallback option)

4. **Validation:**
   - Check required fields present: name, description
   - Flag missing optional fields (features, tech stack)
   - Return completeness score

5. **Error Handling:**
   - Invalid YAML: Return 400 with parsing error
   - Malformed markdown: Try best-effort extraction
   - Empty content: Return 400 with validation error

**File to Create:**
- `/backend/src/services/parser.ts` - Parser service
- `/backend/src/routes/analyze.ts` - API route
- `/backend/src/types/project.ts` - TypeScript types

**Definition of Done:**
- ✅ Endpoint accepts YAML, Markdown, plain text
- ✅ Extracts structured data (name, features, tech stack, etc.)
- ✅ Validates completeness
- ✅ Returns clear error messages for invalid input
- ✅ TypeScript types defined
- ✅ Unit tests written (parse valid YAML, invalid YAML, markdown)

**Test Cases:**
```bash
# Valid YAML
curl -X POST http://localhost:3001/api/analyze/summary \
  -H "Content-Type: application/json" \
  -d '{
    "content": "PROJECT:\n  name: TaskFlow\n  description: Task management",
    "format": "yaml"
  }'

# Invalid YAML
curl -X POST http://localhost:3001/api/analyze/summary \
  -H "Content-Type: application/json" \
  -d '{
    "content": "invalid: yaml: syntax:",
    "format": "yaml"
  }'
```

---

### Task 1.2: AI Research Orchestrator
**Estimate:** 12 hours
**Dependencies:** Task 1.1 (needs parsed data)
**Priority:** P0

**What to Build:**
Send parsed project summary to Claude API and extract detailed requirements, optimal tech stack, and architecture recommendations.

**API Endpoint:**
```
POST /api/analyze/research
```

**Request Body:**
```json
{
  "summaryId": "uuid (from Task 1.1)",
  "parsedData": {
    "projectName": "TaskFlow",
    "description": "...",
    "features": ["..."]
  }
}
```

**Response:**
```json
{
  "success": true,
  "research": {
    "requiredFeatures": [
      {
        "name": "User Authentication",
        "priority": "critical",
        "complexity": "medium",
        "estimatedHours": 16
      },
      {
        "name": "Task CRUD",
        "priority": "critical",
        "complexity": "low",
        "estimatedHours": 8
      }
    ],
    "recommendedTechStack": {
      "backend": {
        "framework": "Express.js",
        "reasoning": "Fast development, TypeScript support"
      },
      "frontend": {
        "framework": "Next.js 14",
        "reasoning": "Server components, app router, React ecosystem"
      },
      "database": {
        "type": "PostgreSQL",
        "reasoning": "Relational data, strong consistency"
      }
    },
    "architecture": {
      "pattern": "Monolithic (for MVP)",
      "reasoning": "Simpler deployment, faster iteration"
    },
    "estimatedComplexity": "medium",
    "estimatedTimeline": "6-8 weeks"
  }
}
```

**Implementation Details:**

1. **Claude API Integration:**
   - Use `@anthropic-ai/sdk` library
   - Model: `claude-sonnet-4-5-20251101`
   - Streaming: Optional (for progress updates)

2. **Prompt Engineering:**
   ```typescript
   const prompt = `You are an expert software architect.

   Analyze this project and provide detailed recommendations:

   Project: ${parsedData.projectName}
   Description: ${parsedData.description}
   Features: ${parsedData.features.join(', ')}

   Provide:
   1. List of required features (with priority and complexity)
   2. Optimal tech stack (backend, frontend, database) with reasoning
   3. Architecture pattern (monolithic, microservices, serverless) with reasoning
   4. Estimated complexity (low, medium, high)
   5. Estimated timeline

   Format response as JSON.`;
   ```

3. **Response Parsing:**
   - Claude may return JSON or markdown with JSON code blocks
   - Extract JSON using regex or try parsing directly
   - Validate response structure with Zod schema

4. **Database Storage:**
   - Save research results to PostgreSQL
   - Schema:
     ```sql
     CREATE TABLE research_results (
       id UUID PRIMARY KEY,
       summary_id UUID REFERENCES summaries(id),
       required_features JSONB,
       tech_stack JSONB,
       architecture JSONB,
       complexity TEXT,
       timeline TEXT,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```

5. **Error Handling:**
   - Claude API timeout: Retry with exponential backoff
   - Invalid JSON response: Ask Claude to reformat
   - Rate limit: Queue request for later

**Files to Create:**
- `/backend/src/services/researcher.ts` - Claude API service
- `/backend/src/routes/analyze.ts` - Add research endpoint
- `/backend/src/models/ResearchResult.ts` - Database model
- `/backend/prisma/schema.prisma` - Update schema

**Definition of Done:**
- ✅ Claude API integrated (Sonnet 4.5)
- ✅ Prompt generates detailed requirements
- ✅ Response parsed and validated
- ✅ Results stored in database
- ✅ Error handling (retry, timeout)
- ✅ API responds in <2 minutes

**Test Case:**
```bash
curl -X POST http://localhost:3001/api/analyze/research \
  -H "Content-Type: application/json" \
  -d '{
    "summaryId": "abc-123",
    "parsedData": {
      "projectName": "TaskFlow",
      "description": "Team task management",
      "features": ["user auth", "task CRUD", "real-time"]
    }
  }'
```

---

### Task 1.3: Agent Team Generator
**Estimate:** 10 hours
**Dependencies:** Task 1.2 (needs research results)
**Priority:** P0

**What to Build:**
Use the **Agent Factory pattern** (from Claude Dashboard) to generate 3-6 specialized agents based on project requirements.

**API Endpoint:**
```
POST /api/generate/agents
```

**Request Body:**
```json
{
  "researchId": "uuid",
  "projectRequirements": {
    "features": ["..."],
    "techStack": {"..."},
    "complexity": "medium"
  }
}
```

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "id": "uuid",
      "name": "Planning & Architecture Agent",
      "role": "Breaks down features and coordinates work",
      "workloadPercentage": 15,
      "responsibilities": [
        "Feature decomposition",
        "API contract definition",
        "Architecture decisions"
      ],
      "systemPrompt": "You are the Planning Agent for TaskFlow...",
      "successCriteria": [
        "All tasks have Definition of Done",
        "Max 3 sequential handoffs per feature"
      ]
    },
    {
      "id": "uuid",
      "name": "Backend Engineer Agent",
      "role": "Builds APIs, database, server logic",
      "workloadPercentage": 40,
      "responsibilities": ["..."],
      "systemPrompt": "...",
      "successCriteria": ["..."]
    }
    // ... more agents
  ],
  "totalAgents": 4,
  "orchestrationPlan": {
    "phases": [
      {
        "name": "Phase 1: Foundation",
        "agents": ["Backend Agent", "Frontend Agent"],
        "duration": "2 weeks"
      }
    ]
  }
}
```

**Implementation Details:**

1. **Agent Factory Prompt:**
   ```typescript
   const agentFactoryPrompt = `You are an expert AI architect specializing in multi-agent team design.

   PROJECT:
   ${JSON.stringify(projectRequirements, null, 2)}

   Generate an optimal agent team (3-6 agents) for this project.

   For EACH agent, provide:
   1. Name and Role
   2. Primary Responsibilities (2-3 tasks)
   3. Workload Percentage (sum to 100%)
   4. System Prompt (ready-to-use, 500+ words)
   5. Success Criteria (3-5 measurable outcomes)

   Validation Rules:
   - No agent should exceed 40% workload
   - No overlapping responsibilities
   - Every project feature owned by exactly one agent

   Return as JSON array.`;
   ```

2. **Claude API Call:**
   - Use same Claude API service from Task 1.2
   - Model: Sonnet 4.5 (needs strong reasoning)
   - Max tokens: 16000 (system prompts are long)

3. **Agent Validation:**
   - Check workload sums to ~100% (±5%)
   - Verify no overlapping responsibilities
   - Ensure all features covered

4. **Database Storage:**
   - Schema:
     ```sql
     CREATE TABLE agents (
       id UUID PRIMARY KEY,
       research_id UUID REFERENCES research_results(id),
       name TEXT,
       role TEXT,
       workload_percentage INT,
       responsibilities JSONB,
       system_prompt TEXT,
       success_criteria JSONB,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```

5. **Generate Markdown Files:**
   - For each agent, create `/tmp/agents/{agent-name}.md`
   - Include full system prompt (like `/claude-agents/backend-agent.md`)
   - Will be included in final generated repo

**Files to Create:**
- `/backend/src/services/agentFactory.ts` - Agent generation service
- `/backend/src/routes/generate.ts` - Generate endpoints
- `/backend/src/models/Agent.ts` - Database model

**Definition of Done:**
- ✅ Generates 3-6 agents based on project complexity
- ✅ Each agent has complete system prompt
- ✅ Workload balanced (no agent >40%)
- ✅ Agents stored in database
- ✅ Markdown files generated
- ✅ Validation passes

**Test Case:**
```bash
curl -X POST http://localhost:3001/api/generate/agents \
  -H "Content-Type: application/json" \
  -d '{
    "researchId": "abc-123",
    "projectRequirements": {
      "features": ["auth", "crud", "real-time"],
      "techStack": {"backend": "Node.js", "frontend": "Next.js"},
      "complexity": "medium"
    }
  }'
```

---

### Task 1.4: Plugin/Tool Recommender
**Estimate:** 8 hours
**Dependencies:** Task 1.2 (needs tech stack)
**Priority:** P0

**What to Build:**
Recommend npm packages, libraries, and Claude Code plugins based on project requirements.

**API Endpoint:**
```
POST /api/recommend/tools
```

**Request Body:**
```json
{
  "researchId": "uuid",
  "techStack": {
    "backend": "Express.js",
    "frontend": "Next.js",
    "database": "PostgreSQL"
  },
  "features": ["auth", "real-time", "file-upload"]
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": {
    "backend": [
      {
        "name": "express",
        "version": "^4.18.2",
        "category": "framework",
        "reasoning": "Core HTTP server framework"
      },
      {
        "name": "passport",
        "version": "^0.7.0",
        "category": "authentication",
        "reasoning": "Flexible auth middleware for email + OAuth"
      },
      {
        "name": "prisma",
        "version": "^5.7.0",
        "category": "database",
        "reasoning": "TypeScript ORM for PostgreSQL"
      },
      {
        "name": "socket.io",
        "version": "^4.6.1",
        "category": "real-time",
        "reasoning": "WebSocket library for real-time features"
      }
    ],
    "frontend": [
      {
        "name": "next",
        "version": "^14.0.4",
        "category": "framework",
        "reasoning": "React framework with app router"
      },
      {
        "name": "tailwindcss",
        "version": "^3.4.1",
        "category": "styling",
        "reasoning": "Utility-first CSS framework"
      }
    ],
    "devDependencies": [
      {
        "name": "typescript",
        "version": "^5.3.3",
        "category": "tooling",
        "reasoning": "Type safety"
      }
    ],
    "claudeCodePlugins": [
      {
        "name": "mcp-server-postgres",
        "reasoning": "Database management during development"
      }
    ],
    "packageJson": {
      "backend": { /* full package.json */ },
      "frontend": { /* full package.json */ }
    }
  }
}
```

**Implementation Details:**

1. **Recommendation Logic:**
   - **Option A (Claude API):**
     ```typescript
     const prompt = `Recommend npm packages for this project:

     Tech Stack: ${techStack}
     Features: ${features.join(', ')}

     For each package, provide:
     - name, version (latest stable)
     - category (framework, auth, database, etc.)
     - reasoning (why this package)

     Return as JSON.`;
     ```

   - **Option B (Rule-based):**
     ```typescript
     const recommendations = {
       'auth': ['passport', 'next-auth', 'lucia-auth'],
       'real-time': ['socket.io', 'ws', 'pusher'],
       'file-upload': ['multer', 'formidable', 'uploadthing']
     };
     // Map features to packages
     ```

   - **Recommendation:** Use Claude API for flexibility, fallback to rule-based

2. **Version Resolution:**
   - Use `npm view <package> version` to get latest stable
   - Or query npm registry API: `https://registry.npmjs.org/<package>`

3. **Generate package.json:**
   - Combine all recommendations
   - Add scripts (dev, build, start)
   - Add standard configs (tsconfig.json, .eslintrc)

4. **Database Storage:**
   - Schema:
     ```sql
     CREATE TABLE tool_recommendations (
       id UUID PRIMARY KEY,
       research_id UUID REFERENCES research_results(id),
       recommendations JSONB,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```

**Files to Create:**
- `/backend/src/services/toolRecommender.ts` - Recommendation service
- `/backend/src/routes/recommend.ts` - Recommend endpoints
- `/backend/src/models/ToolRecommendation.ts` - Database model

**Definition of Done:**
- ✅ Recommends packages based on features
- ✅ Includes version numbers (latest stable)
- ✅ Provides reasoning for each package
- ✅ Generates complete package.json files
- ✅ Suggests Claude Code plugins
- ✅ Results stored in database

**Test Case:**
```bash
curl -X POST http://localhost:3001/api/recommend/tools \
  -H "Content-Type: application/json" \
  -d '{
    "researchId": "abc-123",
    "techStack": {"backend": "Express.js", "frontend": "Next.js"},
    "features": ["auth", "real-time"]
  }'
```

---

## 🏗️ Project Setup (Do This First!)

### 1. Initialize Backend Project

```bash
cd /Users/max/AutonomousProjectBuilder
mkdir -p backend/src/{routes,services,models,types,utils}

cd backend
npm init -y

# Install dependencies
npm install express cors dotenv zod
npm install @anthropic-ai/sdk
npm install @prisma/client
npm install js-yaml marked

# Install dev dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D tsx nodemon
npm install -D prisma

# Initialize TypeScript
npx tsc --init
# Update tsconfig.json: target: ES2022, module: commonjs, outDir: ./dist

# Initialize Prisma
npx prisma init
```

### 2. Set Up Database (PostgreSQL)

**Option A: Local PostgreSQL**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb apb_development
```

**Option B: Railway (Cloud)**
```bash
# Sign up at railway.app
# Create new project → PostgreSQL
# Copy DATABASE_URL to .env
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Summary {
  id            String   @id @default(uuid())
  content       String
  format        String
  parsedData    Json
  completeness  Json
  createdAt     DateTime @default(now())

  research ResearchResult?
}

model ResearchResult {
  id                String   @id @default(uuid())
  summaryId         String   @unique
  summary           Summary  @relation(fields: [summaryId], references: [id])
  requiredFeatures  Json
  techStack         Json
  architecture      Json
  complexity        String
  timeline          String
  createdAt         DateTime @default(now())

  agents            Agent[]
  tools             ToolRecommendation?
}

model Agent {
  id                  String   @id @default(uuid())
  researchId          String
  research            ResearchResult @relation(fields: [researchId], references: [id])
  name                String
  role                String
  workloadPercentage  Int
  responsibilities    Json
  systemPrompt        String   @db.Text
  successCriteria     Json
  createdAt           DateTime @default(now())
}

model ToolRecommendation {
  id               String   @id @default(uuid())
  researchId       String   @unique
  research         ResearchResult @relation(fields: [researchId], references: [id])
  recommendations  Json
  createdAt        DateTime @default(now())
}
```

Run migration:
```bash
npx prisma migrate dev --name init
```

### 3. Create `.env`

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/apb_development"
ANTHROPIC_API_KEY="sk-ant-..."
PORT=3001
NODE_ENV=development
```

### 4. Create Basic Server

`backend/src/index.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'APB Backend' });
});

// Routes
app.use('/api/analyze', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
```

`backend/package.json` scripts:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

Test server:
```bash
npm run dev
curl http://localhost:3001/health
```

---

## 🎯 Success Criteria (Phase 1)

Your work is complete when:

1. ✅ **Task 1.1:** Parser endpoint works (YAML, Markdown, text)
2. ✅ **Task 1.2:** Research endpoint returns detailed requirements in <2 minutes
3. ✅ **Task 1.3:** Agent generator creates 3-6 specialized agents
4. ✅ **Task 1.4:** Tool recommender returns accurate package list
5. ✅ **All endpoints tested** with curl or Postman
6. ✅ **Database schema created** (Prisma migrations)
7. ✅ **TypeScript compiles** with no errors
8. ✅ **Code documented** (inline comments for complex logic)

---

## 📞 Communication

### Daily Updates
Post in this format:
```
Agent: Backend Infrastructure Engineer
✓ Completed: Task 1.1 (Parser endpoint working)
→ Next: Task 1.2 (Claude API integration)
🚨 Blockers: Need ANTHROPIC_API_KEY env variable
```

### Handoff to Frontend Agent
When Task 1.1 and 1.2 are done:
```
Frontend Agent, the analysis endpoints are ready:
- POST /api/analyze/summary (parses project summaries)
- POST /api/analyze/research (returns AI research)

Example usage: [Include curl commands]

Ready for you to build the upload UI (Task 1.5) and analysis dashboard (Task 1.6).
```

### Escalate to Planning Agent
If you encounter blockers:
```
🚨 Blocker: Claude API returning invalid JSON
Impact: Task 1.2 blocked
Proposed Solution: Add retry logic with reformat request
Needs Decision From: Planning Agent
```

---

## 📚 Resources

### Documentation
- **Anthropic Claude API:** https://docs.anthropic.com/claude/reference/
- **Prisma:** https://www.prisma.io/docs
- **Express:** https://expressjs.com
- **js-yaml:** https://github.com/nodeca/js-yaml

### Internal Docs
- **Agent Factory Pattern:** `/Users/max/ClaudeDashboard/claude-agents/`
- **Project Plan:** `/Users/max/AutonomousProjectBuilder/docs/PROJECT_PLAN.md`

---

## 🚀 Ready to Start?

**Your first action:** Set up the backend project structure (follow "Project Setup" above).

**Then:** Start with Task 1.1 (Parser). It's the foundation for everything else.

**Estimated completion:** End of Week 2 (all 4 tasks done).

**Good luck! You're building the backbone of an autonomous AI builder. Let's make it amazing.**

---

**Handoff Date:** 2025-12-27
**From:** Planning Agent
**Status:** Ready to Start
**Next Check-in:** End of Week 1 (Tasks 1.1 and 1.2 complete)
