#!/bin/bash

# Test script for Task 1.2: AI Research Orchestrator
# This script tests the complete flow: Parse → Research

echo "🧪 Testing APB Task 1.2: AI Research Integration"
echo "================================================"
echo ""

# Check if API key is configured
if grep -q "sk-ant-api-key-placeholder" backend/.env; then
  echo "⚠️  ANTHROPIC_API_KEY is not configured!"
  echo ""
  echo "To enable AI research, please:"
  echo "1. Get your API key from: https://console.anthropic.com/settings/keys"
  echo "2. Edit backend/.env and replace the placeholder with your real key:"
  echo "   ANTHROPIC_API_KEY=\"sk-ant-api03-...your-key-here...\""
  echo "3. Restart the backend server: npm run dev:backend"
  echo ""
  echo "Continuing with parser test only..."
  echo ""
  TEST_RESEARCH=false
else
  echo "✓ API key is configured"
  echo ""
  TEST_RESEARCH=true
fi

# Test 1: Parse the summary
echo "📝 Step 1: Testing Parser..."
PARSE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/analyze/summary \
  -H "Content-Type: application/json" \
  -d @test-parse.json)

if [ $? -eq 0 ]; then
  echo "✓ Parser endpoint responded"

  # Extract summary ID
  SUMMARY_ID=$(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['summaryId'])" 2>/dev/null)
  PARSED_DATA=$(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin)['data']))" 2>/dev/null)

  if [ -n "$SUMMARY_ID" ]; then
    echo "✓ Summary ID: $SUMMARY_ID"
    echo "✓ Completeness: $(echo "$PARSE_RESPONSE" | python3 -c "import sys, json; print(f\"{json.load(sys.stdin)['completeness']['score']*100:.0f}%\")" 2>/dev/null)"
  else
    echo "❌ Failed to extract summary ID"
    exit 1
  fi
else
  echo "❌ Parser endpoint failed"
  exit 1
fi

echo ""

# Test 2: AI Research (only if API key is configured)
if [ "$TEST_RESEARCH" = true ]; then
  echo "🤖 Step 2: Testing AI Research..."

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

  if [ $? -eq 0 ]; then
    # Check if response contains success
    if echo "$RESEARCH_RESPONSE" | grep -q '"success":true'; then
      echo "✓ AI Research endpoint responded"

      RESEARCH_ID=$(echo "$RESEARCH_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['researchId'])" 2>/dev/null)
      FEATURE_COUNT=$(echo "$RESEARCH_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']['requiredFeatures']))" 2>/dev/null)

      if [ -n "$RESEARCH_ID" ]; then
        echo "✓ Research ID: $RESEARCH_ID"
        echo "✓ Features identified: $FEATURE_COUNT"
        echo ""
        echo "🎉 All tests passed! Task 1.2 is complete."
      else
        echo "❌ Failed to extract research ID"
        exit 1
      fi
    else
      echo "❌ AI Research failed:"
      echo "$RESEARCH_RESPONSE" | python3 -m json.tool 2>&1 | head -20
      exit 1
    fi
  else
    echo "❌ AI Research endpoint failed"
    exit 1
  fi
else
  echo "⏭️  Skipping AI Research test (API key not configured)"
  echo ""
  echo "✅ Parser test passed!"
  echo ""
  echo "Next steps:"
  echo "1. Add your Anthropic API key to backend/.env"
  echo "2. Run this script again to test the full flow"
fi

echo ""
echo "================================================"
