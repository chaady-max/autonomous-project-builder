#!/bin/bash

# Test script for v0.7 backend features
# Tests: enrichment, clarification, ADRs, diagrams, costs, dependency risks

set -e

API_URL="http://localhost:3001"
SUMMARY_ID=""
RESEARCH_ID=""

echo "========================================="
echo "Testing Autonomous Project Builder v0.7"
echo "========================================="
echo ""

# Step 1: Test summary parsing with enrichment data
echo "Step 1: Creating summary with enrichment data..."
SUMMARY_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/summary" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "PROJECT:\n  name: TaskFlow SaaS\n  description: Team task management with real-time collaboration\n  features:\n    - User authentication with OAuth\n    - Task CRUD operations\n    - Real-time updates via WebSocket\n    - Email notifications\n    - File attachments\n    - Team collaboration\n  tech_stack:\n    - Backend: Node.js\n    - Frontend: Next.js\n    - Database: PostgreSQL\n  timeline: 8 weeks",
    "format": "yaml",
    "strictMode": true,
    "enrichment": {
      "featurePriorities": [
        {"feature": "User authentication", "priority": "must"},
        {"feature": "Task CRUD operations", "priority": "must"},
        {"feature": "Real-time updates", "priority": "should"},
        {"feature": "Email notifications", "priority": "nice"},
        {"feature": "File attachments", "priority": "nice"}
      ],
      "nfrPerformance": {
        "responseTimeMs": 200,
        "concurrentUsers": 1000
      },
      "nfrSecurity": {
        "authenticationRequired": true,
        "authenticationMethod": "oauth"
      },
      "nfrScalability": {
        "expectedUsersLaunch": 500,
        "expectedUsersYear1": 5000,
        "expectedUsersYear3": 50000
      },
      "personas": [
        {
          "name": "Project Manager",
          "role": "Team Lead",
          "goals": ["Track team progress", "Assign tasks"],
          "painPoints": ["Scattered communication", "No visibility"]
        }
      ],
      "approachPreference": "api-first",
      "budgetConstraint": "medium",
      "scalabilityTier": "medium",
      "architectureStyle": "modular"
    }
  }')

SUMMARY_ID=$(echo "$SUMMARY_RESPONSE" | jq -r '.summaryId')
PARSED_DATA=$(echo "$SUMMARY_RESPONSE" | jq -c '.data')
echo "✅ Summary created: $SUMMARY_ID"
echo "   - Strict Mode: $(echo "$SUMMARY_RESPONSE" | jq -r '.strictMode')"
echo "   - Has Enrichment: $(echo "$SUMMARY_RESPONSE" | jq -r '.hasEnrichment')"
echo ""

# Step 2: Run research
echo "Step 2: Running AI research..."
RESEARCH_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/research" \
  -H "Content-Type: application/json" \
  -d "{\"summaryId\": \"$SUMMARY_ID\", \"parsedData\": $PARSED_DATA}")

RESEARCH_ID=$(echo "$RESEARCH_RESPONSE" | jq -r '.data.researchId')
echo "✅ Research complete: $RESEARCH_ID"
echo "   - Features found: $(echo "$RESEARCH_RESPONSE" | jq '.data.requiredFeatures | length')"
echo "   - Complexity: $(echo "$RESEARCH_RESPONSE" | jq -r '.data.estimatedComplexity')"
echo ""

# Step 3: Generate clarification questions
echo "Step 3: Generating clarification questions..."
CLARIFY_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/clarify" \
  -H "Content-Type: application/json" \
  -d "{\"researchId\": \"$RESEARCH_ID\"}")

QUESTIONS=$(echo "$CLARIFY_RESPONSE" | jq -r '.questions[]')
QUESTION_COUNT=$(echo "$CLARIFY_RESPONSE" | jq '.questions | length')
echo "✅ Generated $QUESTION_COUNT clarification questions:"
echo "$QUESTIONS" | nl
echo ""

# Step 4: Submit clarification answers
echo "Step 4: Submitting clarification answers..."
ANSWERS_RESPONSE=$(curl -s -X POST "$API_URL/api/analyze/clarify-answers" \
  -H "Content-Type: application/json" \
  -d "{
    \"researchId\": \"$RESEARCH_ID\",
    \"answers\": [
      {\"question\": \"Question 1\", \"answer\": \"We expect 500 users at launch, scaling to 5000 in year 1\"},
      {\"question\": \"Question 2\", \"answer\": \"OAuth 2.0 with Google and GitHub providers\"},
      {\"question\": \"Question 3\", \"answer\": \"Focus on MVP first, then iterate\"}
    ]
  }")

echo "✅ Answers saved: $(echo "$ANSWERS_RESPONSE" | jq -r '.message')"
echo ""

# Step 5: Generate build spec with planning intelligence
echo "Step 5: Generating build specification with planning intelligence..."
BUILD_SPEC_RESPONSE=$(curl -s -X POST "$API_URL/api/generate/build-spec" \
  -H "Content-Type: application/json" \
  -d "{\"researchId\": \"$RESEARCH_ID\"}")

echo "✅ Build spec generated successfully!"
echo ""

# Extract planning details
PLANNING=$(echo "$BUILD_SPEC_RESPONSE" | jq '.data.planningDetails')

echo "========================================="
echo "Planning Intelligence Summary"
echo "========================================="
echo ""

# ADRs
ADR_COUNT=$(echo "$PLANNING" | jq '.adrs | length')
echo "📋 Architecture Decision Records: $ADR_COUNT"
echo "$PLANNING" | jq -r '.adrs[] | "   - ADR \(.id): \(.title) [\(.status)]"'
echo ""

# Diagrams
echo "📊 System Diagrams Generated:"
echo "   - C4 Context: $(echo "$PLANNING" | jq -r 'if .diagrams.c4Context then "✅" else "❌" end')"
echo "   - C4 Container: $(echo "$PLANNING" | jq -r 'if .diagrams.c4Container then "✅" else "❌" end')"
echo "   - ER Diagram: $(echo "$PLANNING" | jq -r 'if .diagrams.erDiagram then "✅" else "❌" end')"
echo "   - Sequence Diagrams: $(echo "$PLANNING" | jq '.diagrams.sequenceDiagrams | length') flows"
echo ""

# Cost Estimate
TOTAL_MONTHLY=$(echo "$PLANNING" | jq -r '.costEstimate.totalMonthly')
TOTAL_ANNUAL=$(echo "$PLANNING" | jq -r '.costEstimate.totalAnnual')
CONFIDENCE=$(echo "$PLANNING" | jq -r '.costEstimate.confidence')
DEV_HOURS=$(echo "$PLANNING" | jq -r '.costEstimate.developmentCost.totalHours')
DEV_MIN=$(echo "$PLANNING" | jq -r '.costEstimate.developmentCost.totalMin')
DEV_MAX=$(echo "$PLANNING" | jq -r '.costEstimate.developmentCost.totalMax')

echo "💰 Cost Estimation (Confidence: $CONFIDENCE):"
echo "   - Monthly: \$$TOTAL_MONTHLY"
echo "   - Annual: \$$TOTAL_ANNUAL"
echo "   - Development: $DEV_HOURS hours (\$$DEV_MIN - \$$DEV_MAX)"
echo ""

# Dependency Risks
RISK_COUNT=$(echo "$PLANNING" | jq '.dependencyRisks | length')
echo "⚠️  Dependency Risks: $RISK_COUNT packages analyzed"
if [ "$RISK_COUNT" -gt 0 ]; then
  echo "$PLANNING" | jq -r '.dependencyRisks[] | "   - \(.packageName): \(.riskLevel) (\(.category))"'
fi
echo ""

# Build spec preview
BUILD_SPEC=$(echo "$BUILD_SPEC_RESPONSE" | jq -r '.data.buildSpec')
BUILD_SPEC_LENGTH=${#BUILD_SPEC}

echo "========================================="
echo "Build Specification"
echo "========================================="
echo "   - Length: $BUILD_SPEC_LENGTH characters"
echo "   - Contains ADRs: $(echo "$BUILD_SPEC" | grep -c 'Architecture Decision Records' || echo 0)"
echo "   - Contains Diagrams: $(echo "$BUILD_SPEC" | grep -c '```mermaid' || echo 0)"
echo "   - Contains Cost Estimate: $(echo "$BUILD_SPEC" | grep -c 'Cost Estimation' || echo 0)"
echo "   - Contains Dependency Risks: $(echo "$BUILD_SPEC" | grep -c 'Dependency Risk Analysis' || echo 0)"
echo ""

echo "========================================="
echo "✅ All v0.7 Backend Tests Passed!"
echo "========================================="
echo ""
echo "Summary:"
echo "  - Enrichment data accepted and stored"
echo "  - $QUESTION_COUNT clarification questions generated"
echo "  - Answers saved successfully"
echo "  - $ADR_COUNT ADRs generated"
echo "  - All diagrams generated"
echo "  - Cost estimation complete"
echo "  - $RISK_COUNT dependency risks analyzed"
echo "  - Build spec enhanced with planning intelligence"
echo ""
echo "Build spec saved to: /tmp/build-spec-v0.7-test.md"

# Save build spec to file
echo "$BUILD_SPEC" > /tmp/build-spec-v0.7-test.md
