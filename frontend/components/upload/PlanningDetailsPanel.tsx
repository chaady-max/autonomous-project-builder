'use client';

import { useState } from 'react';
import ADRList from './ADRList';
import MermaidDiagram from './MermaidDiagram';
import CostTable from './CostTable';
import RiskBadges from './RiskBadges';
import { ADR, CostEstimate, DependencyRisk } from '../../../shared/types/project';

interface PlanningDetailsPanelProps {
  adrs: ADR[];
  diagrams: {
    c4Context?: string;
    c4Container?: string;
    erDiagram?: string;
    sequenceDiagrams?: string[];
  };
  costEstimate: CostEstimate;
  dependencyRisks: DependencyRisk[];
}

type Tab = 'adrs' | 'diagrams' | 'costs' | 'risks';

export default function PlanningDetailsPanel({
  adrs,
  diagrams,
  costEstimate,
  dependencyRisks,
}: PlanningDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('adrs');

  const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: 'adrs', label: 'ADRs', icon: '📋', count: adrs.length },
    { id: 'diagrams', label: 'Diagrams', icon: '📊', count: Object.values(diagrams).filter(Boolean).length },
    { id: 'costs', label: 'Costs', icon: '💰' },
    { id: 'risks', label: 'Risks', icon: '⚠️', count: dependencyRisks.length },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Planning Intelligence</h2>
        <p className="text-sm text-purple-100 mt-1">
          Architecture decisions, system diagrams, cost estimates, and dependency analysis
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 text-sm font-medium transition-colors relative
                ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <span className="inline-flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* ADRs Tab */}
        {activeTab === 'adrs' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Architecture Decision Records</h3>
              <p className="text-sm text-gray-600">
                Comprehensive documentation of all major architectural decisions made for this project
              </p>
            </div>
            <ADRList adrs={adrs} />
          </div>
        )}

        {/* Diagrams Tab */}
        {activeTab === 'diagrams' && (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">System Architecture Diagrams</h3>
              <p className="text-sm text-gray-600">
                Visual representations of system context, containers, database schema, and key flows
              </p>
            </div>

            {diagrams.c4Context && (
              <MermaidDiagram
                chart={diagrams.c4Context}
                title="C4 Context Diagram - System in Environment"
              />
            )}

            {diagrams.c4Container && (
              <MermaidDiagram
                chart={diagrams.c4Container}
                title="C4 Container Diagram - Major Components"
              />
            )}

            {diagrams.erDiagram && (
              <MermaidDiagram
                chart={diagrams.erDiagram}
                title="Database Schema (ER Diagram)"
              />
            )}

            {diagrams.sequenceDiagrams && diagrams.sequenceDiagrams.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Key User Flows</h4>
                {diagrams.sequenceDiagrams.map((diagram, idx) => (
                  <MermaidDiagram
                    key={idx}
                    chart={diagram}
                    title={`Flow ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Costs Tab */}
        {activeTab === 'costs' && (
          <div>
            <CostTable costEstimate={costEstimate} />
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div>
            <RiskBadges risks={dependencyRisks} />
          </div>
        )}
      </div>
    </div>
  );
}
