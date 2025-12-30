#!/bin/bash

echo "🧪 Testing Complete Flow: Parse → Research → Generate Build Spec"
echo "=================================================================="
echo ""

# Step 1: Parse
echo "📝 Step 1: Parsing project summary..."
PARSE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/analyze/summary \
  -H "Content-Type: application/json" \
  -d @test-parse.json)

SUMMARY_ID=$(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['summaryId'])" 2>/dev/null)
PARSED_DATA=$(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin)['data']))" 2>/dev/null)

if [ -z "$SUMMARY_ID" ]; then
  echo "❌ Failed to parse summary"
  exit 1
fi

echo "✓ Summary ID: $SUMMARY_ID"
echo ""

# Step 2: Research
echo "🤖 Step 2: Running AI research..."
RESEARCH_PAYLOAD=$(cat <<EOF
{
  "summaryId": "$SUMMARY_ID",
  "parsedData": $PARSED_DATA
}
EOF
)

RESEARCH_RESPONSE=$(echo "$RESEARCH_PAYLOAD" | curl -s -X POST http://localhost:3001/api/analyze/research \
  -H "Content-Type: application/json" \
  -d @-)

RESEARCH_ID=$(echo "$RESEARCH_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['researchId'])" 2>/dev/null)

if [ -z "$RESEARCH_ID" ]; then
  echo "❌ Failed to run research"
  exit 1
fi

echo "✓ Research ID: $RESEARCH_ID"
echo ""

# Step 3: Generate Build Spec
echo "🚀 Step 3: Generating build specification..."
BUILD_SPEC_RESPONSE=$(curl -s -X POST http://localhost:3001/api/generate/build-spec \
  -H "Content-Type: application/json" \
  -d "{\"researchId\":\"$RESEARCH_ID\"}")

# Check if successful
if echo "$BUILD_SPEC_RESPONSE" | grep -q '"success":true'; then
  echo "✓ Build specification generated successfully!"
  echo ""

  # Extract stats
  AGENT_COUNT=$(echo "$BUILD_SPEC_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['agentTeam']['totalAgents'])" 2>/dev/null)
  TOTAL_HOURS=$(echo "$BUILD_SPEC_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['agentTeam']['estimatedTotalHours'])" 2>/dev/null)
  TOOL_COUNT=$(echo "$BUILD_SPEC_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tools']['totalRecommendations'])" 2>/dev/null)
  DOC_LENGTH=$(echo "$BUILD_SPEC_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']['buildSpec']['completeBuildDocument']))" 2>/dev/null)

  echo "📊 Build Specification Stats:"
  echo "   • Agents: $AGENT_COUNT"
  echo "   • Total Hours: ${TOTAL_HOURS}h"
  echo "   • Tools Recommended: $TOOL_COUNT"
  echo "   • Document Size: $(echo "$DOC_LENGTH" | python3 -c "import sys; print(f'{int(sys.stdin.read()):,}')") characters"
  echo ""

  # Save build spec to file
  echo "$BUILD_SPEC_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['buildSpec']['completeBuildDocument'])" > build-spec-output.md
  echo "💾 Complete build specification saved to: build-spec-output.md"
  echo ""

  echo "🎉 SUCCESS! Complete flow working perfectly!"
  echo ""
  echo "Next steps:"
  echo "1. View the complete build spec: cat build-spec-output.md"
  echo "2. Or test in the UI: http://localhost:3000"
  echo "3. Upload project summary → Analyze → Generate Build Spec → Download"
else
  echo "❌ Failed to generate build specification"
  echo "$BUILD_SPEC_RESPONSE" | python3 -m json.tool
  exit 1
fi

echo ""
echo "=================================================================="
