'use client';

import { CostEstimate } from '../../../shared/types/project';

interface CostTableProps {
  costEstimate: CostEstimate;
}

export default function CostTable({ costEstimate }: CostTableProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hosting':
        return '🖥️';
      case 'database':
        return '💾';
      case 'storage':
        return '📦';
      case 'bandwidth':
        return '🌐';
      case 'third-party':
        return '🔌';
      default:
        return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Confidence Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cost Breakdown</h3>
        <span className={`text-sm font-medium ${getConfidenceColor(costEstimate.confidence)}`}>
          Confidence: {costEstimate.confidence.toUpperCase()}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">Monthly Cost</p>
          <p className="text-2xl font-bold text-blue-900">${costEstimate.totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium mb-1">Annual Cost</p>
          <p className="text-2xl font-bold text-purple-900">${costEstimate.totalAnnual.toFixed(2)}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assumptions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {costEstimate.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.service}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <span>{getCategoryIcon(item.category)}</span>
                    <span>{item.category}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  ${item.monthlyEstimate.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100">
                    {item.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  <ul className="list-disc list-inside">
                    {item.assumptions.slice(0, 2).map((assumption, i) => (
                      <li key={i}>{assumption}</li>
                    ))}
                  </ul>
                  {item.scalingNotes && (
                    <p className="mt-1 text-blue-600 italic">💡 {item.scalingNotes}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Development Costs */}
      {costEstimate.developmentCost && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-200">
          <h4 className="text-sm font-semibold text-indigo-900 mb-3">Development Costs</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-indigo-700 font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-indigo-900">
                {costEstimate.developmentCost.totalHours}h
              </p>
            </div>
            <div>
              <p className="text-indigo-700 font-medium">Hourly Rate</p>
              <p className="text-xl font-bold text-indigo-900">
                ${costEstimate.developmentCost.hourlyRateMin} - $
                {costEstimate.developmentCost.hourlyRateMax}
              </p>
            </div>
            <div>
              <p className="text-indigo-700 font-medium">Estimated Range</p>
              <p className="text-xl font-bold text-indigo-900">
                ${costEstimate.developmentCost.totalMin.toLocaleString()} - $
                {costEstimate.developmentCost.totalMax.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {costEstimate.notes && costEstimate.notes.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">📝 Important Notes</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
            {costEstimate.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
