'use client';

import { useState, useEffect } from 'react';
import { useWizardStore, type NonNegotiablesData } from '@/lib/store/wizardStore';

interface Decision {
  key: keyof NonNegotiablesData;
  title: string;
  question: string;
  icon: string;
  impactYes: string[];
  impactNo: string[];
  criticalLevel: 'high' | 'medium' | 'low';
  warningYes?: string;
  warningNo?: string;
}

const decisions: Decision[] = [
  {
    key: 'e2ee',
    title: 'End-to-End Encryption',
    question: 'Must all user data be end-to-end encrypted?',
    icon: '🔐',
    criticalLevel: 'high',
    impactYes: [
      'Server cannot read message content',
      'Requires client-side key management',
      'Complex key exchange protocols (Signal, Matrix)',
      'No server-side search/indexing of encrypted data',
      'Higher client-side complexity',
    ],
    impactNo: [
      'Server can read/process all data',
      'Simpler architecture',
      'Server-side search, ML, analytics possible',
      'Easier debugging and support',
      'Standard database encryption sufficient',
    ],
    warningYes: '⚠️ E2EE fundamentally changes your architecture. Choose YES only if privacy is non-negotiable.',
  },
  {
    key: 'adminRead',
    title: 'Admin Data Access',
    question: 'Should admins be able to read user data?',
    icon: '👁️',
    criticalLevel: 'high',
    impactYes: [
      'Admins can view all user content',
      'Easier customer support and debugging',
      'Moderation and compliance possible',
      'Cannot coexist with true E2EE',
      'May require user consent/disclosure',
    ],
    impactNo: [
      'Admins have no access to user data',
      'Blind database - privacy focused',
      'Compatible with E2EE',
      'Harder support and debugging',
      'Limited moderation capabilities',
    ],
    warningNo: '⚠️ If you choose NO, you cannot help users recover lost data or moderate content.',
  },
  {
    key: 'phoneIdentity',
    title: 'Phone Number Identity',
    question: 'Is phone number required for user identity?',
    icon: '📱',
    criticalLevel: 'medium',
    impactYes: [
      'Phone verification required for signup',
      'SMS costs for verification codes',
      'Reduces spam and fake accounts',
      'Not anonymous - tied to real identity',
      'May exclude users without phones',
    ],
    impactNo: [
      'Email or username-based auth',
      'Anonymous signup possible',
      'Lower barrier to entry',
      'Higher risk of spam/fake accounts',
      'Need alternative verification methods',
    ],
  },
  {
    key: 'anonymousUsers',
    title: 'Anonymous Users',
    question: 'Should users be able to use the app anonymously?',
    icon: '👤',
    criticalLevel: 'medium',
    impactYes: [
      'No signup required for basic features',
      'Lower friction onboarding',
      'Harder to prevent abuse',
      'Data sync challenges',
      'Limited personalization',
    ],
    impactNo: [
      'All users must create accounts',
      'Better user tracking and analytics',
      'Easier abuse prevention',
      'Full feature access from start',
      'Higher signup friction',
    ],
  },
  {
    key: 'multiRegion',
    title: 'Multi-Region Deployment',
    question: 'Must the app be deployed in multiple regions?',
    icon: '🌍',
    criticalLevel: 'high',
    impactYes: [
      'Lower latency for global users',
      'Data residency compliance (GDPR, etc.)',
      'Higher infrastructure costs',
      'Complex data synchronization',
      'Multi-region database setup',
    ],
    impactNo: [
      'Single-region deployment',
      'Lower operational complexity',
      'Lower infrastructure costs',
      'Higher latency for distant users',
      'May not meet compliance requirements',
    ],
    warningYes: '⚠️ Multi-region adds significant complexity and cost. Only choose YES if legally required or serving global users.',
  },
  {
    key: 'offlineFirst',
    title: 'Offline-First Architecture',
    question: 'Must the app work fully offline?',
    icon: '📡',
    criticalLevel: 'high',
    impactYes: [
      'Full functionality without internet',
      'Local-first data storage',
      'Complex sync and conflict resolution',
      'Larger app bundle size',
      'Technologies: IndexedDB, CRDTs, sync engines',
    ],
    impactNo: [
      'Requires internet connection',
      'Simpler architecture',
      'Real-time server updates',
      'No conflict resolution needed',
      'Standard REST/GraphQL APIs',
    ],
    warningYes: '⚠️ Offline-first is extremely complex. Only needed for mobile apps in low-connectivity areas.',
  },
  {
    key: 'multiTenant',
    title: 'Multi-Tenant Architecture',
    question: 'Is this a B2B SaaS with isolated customer data?',
    icon: '🏢',
    criticalLevel: 'high',
    impactYes: [
      'Each customer has isolated environment',
      'Tenant-level user management',
      'Complex database schema (tenant_id everywhere)',
      'Per-tenant customization/branding',
      'Row-level security policies',
    ],
    impactNo: [
      'Single shared database',
      'All users in one pool',
      'Simpler architecture',
      'Shared features for everyone',
      'Standard SaaS or consumer app',
    ],
    warningYes: '⚠️ Multi-tenancy affects every table, query, and feature. Only choose YES for B2B SaaS.',
  },
  {
    key: 'openSource',
    title: 'Open Source License',
    question: 'Will this project be open-source?',
    icon: '📜',
    criticalLevel: 'low',
    impactYes: [
      'Code publicly visible on GitHub/GitLab',
      'Community contributions possible',
      'Requires choosing license (MIT, GPL, Apache)',
      'Harder to monetize proprietary features',
      'Increased security scrutiny',
    ],
    impactNo: [
      'Closed-source proprietary code',
      'Full control over codebase',
      'Easier to monetize',
      'Less community involvement',
      'Standard commercial development',
    ],
  },
];

export default function Step2NonNegotiables() {
  const { step2, updateStep2 } = useWizardStore();

  // Initialize local state from store
  const [localDecisions, setLocalDecisions] = useState<NonNegotiablesData>(
    step2 || {
      e2ee: undefined,
      adminRead: undefined,
      phoneIdentity: undefined,
      anonymousUsers: undefined,
      multiRegion: undefined,
      offlineFirst: undefined,
      multiTenant: undefined,
      openSource: undefined,
    }
  );

  // Update store when local state changes
  useEffect(() => {
    updateStep2(localDecisions);
  }, [localDecisions, updateStep2]);

  const handleToggle = (key: keyof NonNegotiablesData, value: boolean) => {
    setLocalDecisions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getCriticalColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-blue-300 bg-blue-50';
    }
  };

  const getCriticalBadge = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const completedCount = Object.values(localDecisions).filter((v) => v !== undefined).length;
  const totalCount = decisions.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Step 2: Non-Negotiables ⭐
        </h2>
        <p className="text-gray-600 mt-2">
          These 8 decisions fundamentally shape your entire architecture.{' '}
          <span className="font-semibold text-red-600">
            They cannot be changed later without major rework.
          </span>
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
          <span className="font-semibold">{completedCount} of {totalCount} decided</span>
        </div>
      </div>

      {/* Critical Warning Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">Why This Step Is Critical</h3>
            <ul className="space-y-1 text-sm text-red-800">
              <li>• Each YES/NO choice locks in architectural decisions</li>
              <li>• Changing these later requires rewriting significant portions of code</li>
              <li>• They directly affect tech stack, database design, security model, and costs</li>
              <li>• Take time to read the impact of each choice carefully</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Cards */}
      <div className="space-y-6">
        {decisions.map((decision) => {
          const value = localDecisions[decision.key];
          const isDecided = value !== undefined;

          return (
            <div
              key={decision.key}
              className={`
                border-2 rounded-lg overflow-hidden transition-all duration-200
                ${isDecided ? 'ring-2 ring-indigo-200' : ''}
                ${getCriticalColor(decision.criticalLevel)}
              `}
            >
              {/* Card Header */}
              <div className="p-5 bg-white border-b-2 border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{decision.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {decision.title}
                      </h3>
                      <p className="text-gray-700 mt-1 font-medium">
                        {decision.question}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${getCriticalBadge(
                          decision.criticalLevel
                        )}`}
                      >
                        {decision.criticalLevel.toUpperCase()} IMPACT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="p-5 bg-white border-b border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggle(decision.key, true)}
                    className={`
                      flex-1 px-6 py-4 rounded-lg border-2 font-semibold text-sm
                      transition-all duration-200
                      ${
                        value === true
                          ? 'bg-green-600 text-white border-green-700 ring-4 ring-green-100'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:bg-green-50'
                      }
                    `}
                  >
                    ✓ YES
                  </button>
                  <button
                    onClick={() => handleToggle(decision.key, false)}
                    className={`
                      flex-1 px-6 py-4 rounded-lg border-2 font-semibold text-sm
                      transition-all duration-200
                      ${
                        value === false
                          ? 'bg-gray-600 text-white border-gray-700 ring-4 ring-gray-100'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    ✗ NO
                  </button>
                </div>
              </div>

              {/* Impact Explanation */}
              {isDecided && (
                <div className="p-5 bg-gradient-to-br from-gray-50 to-white">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">
                    {value ? '✓ Impact of YES:' : '✗ Impact of NO:'}
                  </h4>
                  <ul className="space-y-2">
                    {(value ? decision.impactYes : decision.impactNo).map((impact, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-600 mt-0.5">•</span>
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Warning Message */}
                  {((value && decision.warningYes) || (!value && decision.warningNo)) && (
                    <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <p className="text-sm text-yellow-800 font-medium">
                        {value ? decision.warningYes : decision.warningNo}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Summary */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Decision Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {decisions.map((decision) => {
            const value = localDecisions[decision.key];
            return (
              <div
                key={decision.key}
                className={`
                  p-3 rounded-lg border text-center text-xs
                  ${
                    value === true
                      ? 'bg-green-50 border-green-300'
                      : value === false
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-white border-gray-200'
                  }
                `}
              >
                <div className="text-lg mb-1">{decision.icon}</div>
                <div className="font-medium text-gray-900 mb-1">{decision.title}</div>
                <div className={`font-bold ${value === true ? 'text-green-700' : value === false ? 'text-gray-600' : 'text-gray-400'}`}>
                  {value === true ? 'YES' : value === false ? 'NO' : 'Undecided'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">Tips for Step 2</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• Read both YES and NO impacts before deciding</li>
              <li>• High-impact decisions (red) should be discussed with stakeholders</li>
              <li>• When unsure, choose the simpler option (usually NO)</li>
              <li>• You can change your answers within this wizard, but not after generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
