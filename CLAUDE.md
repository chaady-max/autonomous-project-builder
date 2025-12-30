# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Autonomous Project Builder (APB)** transforms project descriptions (YAML/Markdown/Text) into complete build specifications with agent teams, tool recommendations, and implementation plans. The app works with or without Claude API through intelligent local fallback mode.

**Current Version:** v0.2 (displayed in UI header)

**Architecture:** Monorepo with three workspaces (backend, frontend, shared) using npm workspaces.

## Commands

### Development
```bash
# Start both servers (backend on 3001, frontend on 3000)
npm run dev

# Start individually
cd backend && npm run dev    # Express server on port 3001
cd frontend && npm run dev   # Next.js on port 3000
```

### Database Management
```bash
# From project root or backend directory
npx prisma migrate dev       # Create/apply migrations
npx prisma studio            # Visual database browser
npx prisma generate          # Regenerate Prisma Client

# Reset database (if needed)
rm backend/dev.db && npx prisma migrate dev
```

### Build
```bash
npm run build                # Build both projects
cd backend && npm run build  # Backend only (TypeScript → /dist)
cd frontend && npm run build # Frontend only (Next.js)
```

## Architecture

### Monorepo Structure
```
/
├── backend/      # Express API + AI services
├── frontend/     # Next.js UI
└── shared/       # Zod schemas (single source of truth)
```

### Complete User Flow
```
1. Upload/paste project summary (YAML/Markdown/Text)
   ↓
2. POST /api/analyze/summary
   → Parser extracts structured data (ProjectSummary)
   → Returns: parsedData + completeness score
   ↓
3. POST /api/analyze/research (automatic in UI)
   → AIResearcher analyzes with Claude API OR local heuristics
   → Returns: features, tech stack, architecture, complexity
   ↓
4. POST /api/generate/build-spec (user-triggered)
   → AgentFactory generates optimal agent team
   → ToolRecommender suggests MCP servers, npm packages
   → BuildSpecGenerator creates complete markdown document
   → Returns: Complete build specification (10,000+ chars)
   ↓
5. User downloads .md file or copies to clipboard
```

### Key Services (backend/src/services/)

1. **ProjectSummaryParser** - Multi-format parsing (YAML/Markdown/Text)
2. **AIResearcher** - Dual-mode analysis (Claude API or local heuristics)
3. **AgentFactory** - Generates optimal agent team (Planning, Backend, Frontend, Database, DevOps, QA)
4. **ToolRecommender** - Suggests MCP servers, npm packages, dev tools, external services
5. **BuildSpecGenerator** - Creates comprehensive markdown build document

### Database (SQLite + Prisma)

**Models:** Summary → ResearchResult → Agents/ToolRecommendations

**Important:** JSON fields stored as strings in SQLite, manually parsed in application:
```typescript
// Store
await prisma.create({ data: { parsedData: JSON.stringify(data) } });

// Retrieve
const summary = await prisma.findUnique({...});
const data = JSON.parse(summary.parsedData);
```

### Frontend Architecture

**Main Component:** `/frontend/components/upload/UploadForm.tsx`
- Single-page flow: Upload → Analyze → Research → Generate
- Progressive disclosure (results appear as ready)
- react-dropzone for file upload
- No global state manager (React hooks only)

**API Client:** `/frontend/lib/api.ts` - Fetch wrapper for all backend endpoints

## Important Patterns

### 1. Dual-Mode AI Analysis

The app works with OR without Claude API key:
- **Claude API Mode:** Uses Anthropic API for sophisticated analysis
- **Local Mode:** Heuristics-based fallback (production-ready)

Check mode: `backend/.env` → `ANTHROPIC_API_KEY` presence determines mode

### 2. Shared Types with Zod

All types defined in `/shared/types/project.ts`:
```typescript
export const ProjectSummarySchema = z.object({...});
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
```

Benefits: Runtime validation + TypeScript types + single source of truth

### 3. Version Number Management

**Requirement:** Update version in UI header (`frontend/components/upload/UploadForm.tsx`) when adding new features.

Current version displayed in header: `v0.2`

### 4. Service Layer Pattern

Routes are thin orchestration; business logic lives in services:
```typescript
// Route: orchestration only
router.post('/build-spec', async (req, res) => {
  const research = await prisma.researchResult.findUnique(...);
  const agentTeam = agentFactory.generateAgentTeam(...);
  const tools = toolRecommender.recommendTools(...);
  const buildSpec = buildSpecGenerator.generateBuildSpec(...);
  res.json({ data: { agentTeam, tools, buildSpec } });
});

// Service: pure logic
class AgentFactory {
  generateAgentTeam(data, research) { /* complex logic */ }
}
```

## API Endpoints

### Analyze
- `POST /api/analyze/summary` - Parse project summary
- `GET /api/analyze/summary/:id` - Retrieve parsed summary
- `POST /api/analyze/research` - Analyze project (AI or local mode)

### Generate
- `POST /api/generate/build-spec` - Generate complete build specification

### Settings
- `GET /api/settings/status` - Check if Claude API key configured
- `POST /api/settings/api-key` - Save API key via web UI

### Health
- `GET /health` - Server status

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL="file:./dev.db"           # SQLite (no setup required)
ANTHROPIC_API_KEY="sk-ant-..."        # Optional - local mode works without
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Testing

### Manual Testing
1. Start: `npm run dev`
2. Open: http://localhost:3000
3. Upload example YAML:
```yaml
PROJECT:
  name: TaskFlow SaaS
  description: Team task management with real-time collaboration
  features:
    - User authentication
    - Task CRUD
    - Real-time updates
  tech_stack:
    - Backend: Node.js
    - Frontend: Next.js
    - Database: PostgreSQL
  timeline: 8 weeks
```
4. Verify: Parse → Research → Agent Team → Tools → Build Spec

### API Testing
```bash
# Test summary parsing
curl -X POST http://localhost:3001/api/analyze/summary \
  -H "Content-Type: application/json" \
  -d '{"content":"PROJECT:\n  name: My App","format":"yaml"}' | jq .

# Check backend health
curl http://localhost:3001/health
```

## Debugging

### Port Already in Use
```bash
# Kill existing processes (aggressive)
pkill -9 node
sleep 2

# Or check/kill specific ports
lsof -i:3000,3001
kill -9 <PID>
```

### Browser Issues
1. Test backend first with curl
2. If curl works but browser doesn't → browser cache issue
3. Hard refresh (Cmd+Shift+R) or try incognito mode
4. Full cache clear: Cmd+Shift+Delete

### Database Issues
```bash
# Reset database
rm backend/dev.db
npx prisma migrate dev

# View data
npx prisma studio
```

### Next.js Build Issues
```bash
# Clear build cache
cd frontend
rm -rf .next node_modules/.cache .swc
npm install
npm run dev
```

## Project Status

**Phase 1 (Analysis Engine) - COMPLETE ✅**
- Multi-format parser
- Dual-mode AI research
- Agent team generator
- Tool recommender
- Build specification generator
- Upload UI
- API key setup page

**Phase 2 (Code Generation Engine) - PLANNED**
- Repository scaffolder
- Agent executor (generate actual code)
- Code validator
- Build packager (zip download)

## Architecture Decisions

**Why SQLite?** Zero setup, works immediately, great for MVP. Can migrate to PostgreSQL later.

**Why Local Mode?** Provides value without API key, lowers barrier to entry, production-ready fallback.

**Why Monorepo?** Shared types, coordinated development. Already implemented and working well.

**Why Express (not Next.js API)?** Separate backend can scale independently, clearer separation of concerns.

## Important Files

### Configuration
- `/backend/prisma/schema.prisma` - Database schema
- `/backend/.env` - Backend environment variables
- `/frontend/.env.local` - Frontend environment variables

### Core Backend Services
- `/backend/src/services/parser.ts` - Multi-format parsing
- `/backend/src/services/researcher.ts` - AI/local analysis
- `/backend/src/services/agent-factory.ts` - Agent team generation
- `/backend/src/services/tool-recommender.ts` - Tool recommendations
- `/backend/src/services/build-spec-generator.ts` - Complete build doc

### Core Frontend
- `/frontend/components/upload/UploadForm.tsx` - Main UI component
- `/frontend/lib/api.ts` - API client

### Shared
- `/shared/types/project.ts` - All Zod schemas and types

### Documentation
- `/README.md` - Project vision and architecture overview
- `/QUICKSTART.md` - How to run the app, what's working
- `/docs/PROJECT_PLAN.md` - Detailed implementation plan

## Key Insights

1. **The Output Matters Most:** Everything leads to generating the complete build specification markdown document (often 10,000+ characters). This is the crown jewel.

2. **Dual-Mode is Production-Ready:** The local analysis mode isn't a fallback—it's a fully functional production mode. Don't assume Claude API is required.

3. **Agent Team is Intelligent:** AgentFactory calculates workload percentages, estimates hours, determines execution sequence, and assigns responsibilities based on tech stack.

4. **Types are Shared:** Zod schemas in `/shared` provide runtime validation + TypeScript types + single source of truth for backend and frontend.

5. **Services are Independent:** Each service can be tested in isolation. Routes only orchestrate.

6. **Progressive Enhancement UI:** Results display as they become available, not at the end. Better UX.
