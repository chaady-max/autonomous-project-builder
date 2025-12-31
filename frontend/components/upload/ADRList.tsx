'use client';

import { useState } from 'react';
import { ADR } from '../../../shared/types/project';

interface ADRListProps {
  adrs: ADR[];
}

export default function ADRList({ adrs }: ADRListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleADR = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'proposed':
        return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-3">
      {adrs.map((adr) => (
        <div
          key={adr.id}
          className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <button
            onClick={() => toggleADR(adr.id)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-500">ADR {adr.id}</span>
              <h3 className="font-semibold text-left">{adr.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(adr.status)}`}>
                {adr.status}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedId === adr.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Content */}
          {expandedId === adr.id && (
            <div className="px-4 py-4 border-t bg-gray-50">
              {/* Context */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Context</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{adr.context}</p>
              </div>

              {/* Decision */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Decision</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{adr.decision}</p>
              </div>

              {/* Consequences */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Consequences</h4>
                <ul className="list-disc list-inside space-y-1">
                  {adr.consequences.map((consequence, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      {consequence}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alternatives */}
              {adr.alternatives && adr.alternatives.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Alternatives Considered</h4>
                  <div className="space-y-3">
                    {adr.alternatives.map((alt, idx) => (
                      <div key={idx} className="bg-white rounded p-3 border">
                        <h5 className="font-medium text-sm mb-2">{alt.name}</h5>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-green-700 font-medium mb-1">Pros:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {alt.pros.map((pro, i) => (
                                <li key={i} className="text-gray-600">{pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-red-700 font-medium mb-1">Cons:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {alt.cons.map((con, i) => (
                                <li key={i} className="text-gray-600">{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              {adr.dateCreated && (
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(adr.dateCreated).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
