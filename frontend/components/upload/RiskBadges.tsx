'use client';

import { DependencyRisk } from '../../../shared/types/project';

interface RiskBadgesProps {
  risks: DependencyRisk[];
}

export default function RiskBadges({ risks }: RiskBadgesProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskEmoji = (level: string) => {
    switch (level) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'security':
        return '🔒';
      case 'maintenance':
        return '🔧';
      case 'performance':
        return '⚡';
      case 'compatibility':
        return '🔄';
      case 'licensing':
        return '📜';
      default:
        return '📦';
    }
  };

  if (risks.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg p-6 border border-green-200 text-center">
        <p className="text-green-800 font-medium">✅ No significant dependency risks identified</p>
        <p className="text-sm text-green-600 mt-1">All recommended packages are stable and well-maintained</p>
      </div>
    );
  }

  const groupedRisks = risks.reduce((acc, risk) => {
    const level = risk.riskLevel;
    if (!acc[level]) acc[level] = [];
    acc[level].push(risk);
    return acc;
  }, {} as Record<string, DependencyRisk[]>);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 pb-3 border-b">
        <h3 className="text-lg font-semibold">Dependency Risks</h3>
        <div className="flex gap-2 text-sm">
          {Object.entries(groupedRisks).map(([level, items]) => (
            <span key={level} className={`px-2 py-1 rounded border ${getRiskColor(level)}`}>
              {getRiskEmoji(level)} {items.length} {level}
            </span>
          ))}
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-3">
        {risks.map((risk, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 border-l-4 ${getRiskColor(risk.riskLevel)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-sm font-mono font-semibold">{risk.packageName}</code>
                  <span className="text-xs">
                    {getCategoryEmoji(risk.category || 'maintenance')} {risk.category || 'maintenance'}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(risk.riskLevel)}`}>
                  {getRiskEmoji(risk.riskLevel)} {risk.riskLevel.toUpperCase()} RISK
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Risk Factors:</p>
              <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-600">
                {risk.riskFactors.map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>

            {/* Mitigation */}
            <div className="mb-3 bg-white bg-opacity-60 rounded p-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">✅ Mitigation Strategy:</p>
              <p className="text-sm text-gray-700">{risk.mitigation}</p>
            </div>

            {/* Alternatives */}
            {risk.alternatives && risk.alternatives.length > 0 && (
              <div className="bg-white bg-opacity-60 rounded p-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">🔄 Alternatives:</p>
                <div className="flex flex-wrap gap-2">
                  {risk.alternatives.map((alt, i) => (
                    <code key={i} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                      {alt}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 rounded p-3 border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Note:</strong> These risk assessments are based on common patterns and known issues.
          Always review the latest package documentation and security advisories before deployment.
        </p>
      </div>
    </div>
  );
}
