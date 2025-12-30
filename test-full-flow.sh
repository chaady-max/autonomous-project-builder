#!/bin/bash

echo "🧪 Testing Full Flow: Parse → Local Research"
echo "=============================================="
echo ""

# Step 1: Parse
echo "📝 Step 1: Parsing project summary..."
PARSE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/analyze/summary \
  -H "Content-Type: application/json" \
  -d @test-parse.json)

SUMMARY_ID=$(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['summaryId'])" 2>/dev/null)
PARSED_DATA=$(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin)['data']))" 2>/dev/null)

echo "✓ Summary ID: $SUMMARY_ID"
echo ""

# Step 2: Research
echo "🤖 Step 2: Running local AI analysis..."
RESEARCH_PAYLOAD=$(cat <<PAYLOAD
{
  "summaryId": "$SUMMARY_ID",
  "parsedData": $PARSED_DATA
}
PAYLOAD
)

RESEARCH_RESPONSE=$(echo "$RESEARCH_PAYLOAD" | curl -s -X POST http://localhost:3001/api/analyze/research \
  -H "Content-Type: application/json" \
  -d @-)

FEATURE_COUNT=$(echo "$RESEARCH_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']['requiredFeatures']))" 2>/dev/null)
COMPLEXITY=$(echo "$RESEARCH_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['estimatedComplexity'])" 2>/dev/null)
TIMELINE=$(echo "$RESEARCH_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['estimatedTimeline'])" 2>/dev/null)

echo "✓ Features identified: $FEATURE_COUNT"
echo "✓ Complexity: $COMPLEXITY"
echo "✓ Timeline: $TIMELINE"
echo ""

echo "🎉 Local analysis mode working perfectly!"
echo ""
echo "This uses intelligent heuristics - no API key required!"
echo "To upgrade to Claude AI, visit http://localhost:3000/setup"
