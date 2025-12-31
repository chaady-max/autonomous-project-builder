# Autonomous Project Builder v0.7 - Testing Guide

## What's New in v0.7

Version 0.7 introduces **Planning Intelligence** features that dramatically enhance build specification quality:

### 🎯 New Features

1. **Interactive Clarification Loop** - AI asks 3-5 critical questions before generating build spec
2. **Architecture Decision Records (ADRs)** - 5-8 comprehensive ADRs documenting all major decisions
3. **System Diagrams** - C4 Context, C4 Container, ER, and Sequence diagrams (Mermaid.js)
4. **Cost Estimation** - Detailed infrastructure + development cost breakdown
5. **Dependency Risk Analysis** - Security, maintenance, and compatibility assessments

---

## Quick Start: Testing v0.7

### Prerequisites

```bash
# Ensure both servers are running
npm run dev

# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

---

## Option A: Full UI Flow Test (Recommended)

### Step 1: Open the App

Navigate to http://localhost:3000

### Step 2: Paste Sample Project

```yaml
PROJECT:
  name: TaskFlow SaaS
  description: Team task management with real-time collaboration features
  features:
    - User authentication with OAuth
    - Task CRUD operations
    - Real-time updates via WebSocket
    - Email notifications
    - File attachments
    - Team collaboration
    - Comments and activity feed
    - Dashboard analytics
  tech_stack:
    - Backend: Node.js
    - Frontend: Next.js
    - Database: PostgreSQL
  timeline: 8 weeks
```

### Step 3: Click "Analyze Project"

**What happens:**
1. ✅ Summary parsed (25%)
2. ✅ AI research runs (50%)
3. ✅ Clarification questions generated (75%)
4. 🎯 **Modal appears with 3-5 questions**

### Step 4: Answer Clarification Questions

You'll see questions like:
- "What is the expected number of concurrent users at launch and scale?"
- "Do you need multi-tenancy with team isolation?"
- "What level of real-time collaboration features?"
- "Data persistence and backup requirements?"
- "Third-party integrations needed?"

**Tips:**
- Answer thoroughly for best results
- Or click "Skip" for questions you're unsure about
- Progress bar shows X/5 completion

### Step 5: Generate Build Spec

After answering questions:
- Click "Generate Complete Build Specification"
- Wait ~10-30 seconds (depending on API mode)

### Step 6: Explore Planning Intelligence

**You'll see 4 new sections:**

#### 📋 ADRs Tab
- 8 comprehensive architecture decisions
- Click to expand each ADR
- See context, decision, consequences, alternatives

#### 📊 Diagrams Tab
- **C4 Context**: System in its environment
- **C4 Container**: Major components (frontend, backend, DB, WebSocket, auth)
- **ER Diagram**: Database schema with relationships
- **Sequence Diagrams**: Key user flows (login, CRUD operations)

#### 💰 Costs Tab
- Monthly/annual infrastructure costs
- Per-service breakdown with assumptions
- Development cost estimates (hours × hourly rate)
- Confidence level indicator

#### ⚠️ Risks Tab
- Medium/high risk dependencies identified
- Risk factors explained
- Mitigation strategies provided
- Alternative packages suggested

### Step 7: Download Build Spec

Click "Download Build Specification" to get a comprehensive markdown file with:
- All existing sections (agent team, tools, features)
- **PLUS** all planning intelligence embedded

---

## Option B: API-Only Testing

Perfect for automation or if frontend isn't running.

### Test Script

```bash
#!/bin/bash

API_URL="http://localhost:3001"

# 1. Create Summary
SUMMARY_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/summary" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "PROJECT:\n  name: TaskFlow\n  description: Task management app\n  features:\n    - User auth\n    - Task CRUD\n    - Real-time updates\n  tech_stack:\n    - Backend: Node.js\n    - Frontend: Next.js\n    - Database: PostgreSQL",
    "format": "yaml",
    "strictMode": false
  }')

SUMMARY_ID=$(echo "$SUMMARY_RESPONSE" | jq -r '.summaryId')
PARSED_DATA=$(echo "$SUMMARY_RESPONSE" | jq -c '.data')

echo "✅ Summary created: $SUMMARY_ID"

# 2. Run Research
RESEARCH_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/research" \
  -H "Content-Type: application/json" \
  -d "{\"summaryId\": \"$SUMMARY_ID\", \"parsedData\": $PARSED_DATA}")

RESEARCH_ID=$(echo "$RESEARCH_RESPONSE" | jq -r '.researchId')
echo "✅ Research complete: $RESEARCH_ID"

# 3. Get Clarification Questions (NEW in v0.7)
CLARIFY_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/clarify" \
  -H "Content-Type: application/json" \
  -d "{\"researchId\": \"$RESEARCH_ID\"}")

echo "❓ Clarification Questions:"
echo "$CLARIFY_RESPONSE" | jq -r '.questions[]' | nl

# 4. Submit Answers (NEW in v0.7)
curl -s -X POST "$API_URL/api/analyze/clarify-answers" \
  -H "Content-Type: application/json" \
  -d "{
    \"researchId\": \"$RESEARCH_ID\",
    \"answers\": [
      {\"question\": \"Q1\", \"answer\": \"500 users initially, 5000 in year 1\"},
      {\"question\": \"Q2\", \"answer\": \"Multi-tenancy required\"},
      {\"question\": \"Q3\", \"answer\": \"Live task updates essential\"}
    ]
  }"

echo "✅ Answers saved"

# 5. Generate Build Spec with Planning Intelligence
BUILD_SPEC_RESPONSE=$(curl -s -X POST "$API_URL/api/generate/build-spec" \
  -H "Content-Type: application/json" \
  -d "{\"researchId\": \"$RESEARCH_ID\"}")

# 6. Extract Planning Details (NEW in v0.7)
PLANNING=$(echo "$BUILD_SPEC_RESPONSE" | jq '.data.planningDetails')

echo ""
echo "📋 ADRs Generated: $(echo "$PLANNING" | jq '.adrs | length')"
echo "📊 Diagrams: C4 Context, C4 Container, ER, Sequences"
echo "💰 Monthly Cost: \$$(echo "$PLANNING" | jq -r '.costEstimate.totalMonthly')"
echo "⚠️ Dependency Risks: $(echo "$PLANNING" | jq '.dependencyRisks | length') packages"
```

Save as `test-v0.7-api.sh`, then run:
```bash
chmod +x test-v0.7-api.sh
./test-v0.7-api.sh
```

---

## Verification Checklist

### Backend ✅
- [ ] `/api/analyze/clarify` returns 3-5 questions
- [ ] `/api/analyze/clarify-answers` saves successfully
- [ ] Build spec includes `planningDetails` object
- [ ] ADRs array has 5-8 records
- [ ] Diagrams include c4Context, c4Container, erDiagram
- [ ] Cost estimate has totalMonthly, totalAnnual, items array
- [ ] Dependency risks analyzed (may be 0 for simple projects)

### Frontend ✅
- [ ] Version shows "v0.7" in header
- [ ] Clarification modal appears after research
- [ ] Modal has progress bar (1/5, 2/5, etc.)
- [ ] Can skip questions or answer them
- [ ] Build spec button disabled until clarification answered
- [ ] Planning Details Panel appears with 4 tabs
- [ ] ADRs expand/collapse correctly
- [ ] Mermaid diagrams render (no errors)
- [ ] Cost table shows all services
- [ ] Risk badges color-coded correctly

### Build Spec Output ✅
- [ ] Contains "Architecture Decision Records (ADRs)" section
- [ ] Contains "System Architecture Diagrams" section
- [ ] Contains "Cost Estimation" section
- [ ] Contains "Dependency Risk Analysis" section
- [ ] Mermaid code blocks present (```mermaid)
- [ ] Total character count significantly increased vs v0.6

---

## Common Issues & Solutions

### Issue: Clarification modal doesn't appear
**Solution:** Check browser console for errors. Ensure backend returned questions array.

### Issue: Mermaid diagrams show error
**Solution:** This is expected if diagram syntax is invalid. Backend generates syntactically correct diagrams, but edge cases may occur. Check browser console.

### Issue: Build spec button stays disabled
**Solution:** You must answer (or skip) clarification questions. Close modal or submit answers.

### Issue: Planning panel doesn't show
**Solution:** Only appears if `buildSpec.planningDetails` exists. Check API response includes planning data.

### Issue: "Cannot read property 'adrs' of undefined"
**Solution:** Backend may be running old code. Restart: `pkill -9 node && npm run dev`

---

## Performance Notes

### Local Mode (No API Key)
- Clarification: ~1-2 seconds (rule-based)
- ADRs: ~2-3 seconds (template-based)
- Diagrams: Instant (generated from data)
- Cost estimation: Instant (heuristic-based)
- **Total: ~3-5 seconds**

### Claude API Mode (API Key Configured)
- Clarification: ~5-10 seconds (AI-generated questions)
- ADRs: ~15-20 seconds (comprehensive AI-generated)
- Diagrams: ~2-3 seconds (AI-enhanced)
- Cost estimation: Instant (same as local)
- **Total: ~20-30 seconds**

---

## Example Output Sizes

**v0.6 Build Spec:** ~15,000-25,000 characters
**v0.7 Build Spec:** ~50,000-80,000 characters

**New sections add:**
- ADRs: ~15,000 characters
- Diagrams: ~5,000 characters
- Cost estimation: ~3,000 characters
- Dependency risks: ~2,000-5,000 characters

---

## What to Test For

### Quality Improvements
1. **More Specific Requirements** - Clarification answers make research more targeted
2. **Better Architecture** - ADRs justify every major decision
3. **Visual Understanding** - Diagrams make system architecture clear
4. **Realistic Planning** - Cost estimates help budget appropriately
5. **Risk Awareness** - Dependency analysis prevents surprises

### Edge Cases
- **No questions generated**: If input is already comprehensive, may generate fewer questions
- **Zero dependency risks**: Small projects with stable packages may have no risks
- **Empty diagrams**: Very simple projects may not need all diagram types
- **Low confidence costs**: Without scalability data, confidence will be "low"

---

## Next Steps After Testing

1. ✅ **Verify all features work** - Use this guide
2. 📝 **Document any bugs** - Open GitHub issues if found
3. 🚀 **Try with real projects** - Test with your own ideas
4. 💡 **Suggest improvements** - What else would help?
5. 📊 **Compare v0.6 vs v0.7** - See the quality difference

---

## FAQ

**Q: Do I need a Claude API key for v0.7?**
A: No! All features work in local mode. API key gives better quality (AI-generated vs rule-based).

**Q: Can I skip clarification questions entirely?**
A: Yes, click "Skip" for all questions or close the modal. Build spec will still generate.

**Q: Are the cost estimates accurate?**
A: They're ballpark estimates based on common pricing. Always verify with actual provider pricing.

**Q: Can I edit the generated diagrams?**
A: Not in UI yet. Copy the Mermaid code from the build spec markdown and edit in a Mermaid editor.

**Q: What if I don't like the ADR decisions?**
A: ADRs are recommendations based on best practices. You can override them in implementation.

---

## Support

- **Backend Issues**: Check backend logs in terminal
- **Frontend Issues**: Check browser console (F12)
- **API Errors**: Test individual endpoints with curl
- **General Help**: Review IMPROVEMENTS.md for technical details

---

**Ready to test? Start with the Full UI Flow above! 🚀**
