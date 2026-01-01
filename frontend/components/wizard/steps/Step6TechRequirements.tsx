'use client';

import { useState, useEffect } from 'react';
import { useWizardStore, type Step6Data } from '@/lib/store/wizardStore';

export default function Step6TechRequirements() {
  const { step6, updateStep6 } = useWizardStore();

  const [techStack, setTechStack] = useState(step6?.techStack || {});
  const [performanceReqs, setPerformanceReqs] = useState(step6?.performanceReqs || {});
  const [securityReqs, setSecurityReqs] = useState(step6?.securityReqs || {});
  const [scalabilityReqs, setScalabilityReqs] = useState(step6?.scalabilityReqs || {});
  const [accessibilityReq, setAccessibilityReq] = useState<'A' | 'AA' | 'AAA' | undefined>(step6?.accessibilityReq);

  // Auto-save
  useEffect(() => {
    updateStep6({
      techStack,
      performanceReqs,
      securityReqs,
      scalabilityReqs,
      accessibilityReq,
    });
  }, [techStack, performanceReqs, securityReqs, scalabilityReqs, accessibilityReq, updateStep6]);

  const updateTechStack = (key: string, value: string) => {
    setTechStack({ ...techStack, [key]: value });
  };

  const updatePerformance = (key: string, value: number) => {
    setPerformanceReqs({ ...performanceReqs, [key]: value });
  };

  const updateSecurity = (key: string, value: any) => {
    setSecurityReqs({ ...securityReqs, [key]: value });
  };

  const updateScalability = (key: string, value: any) => {
    setScalabilityReqs({ ...scalabilityReqs, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 6: Technical Requirements</h2>
        <p className="text-gray-600 mt-2">
          Define your tech stack preferences and non-functional requirements (performance, security, scalability).
        </p>
      </div>

      {/* Tech Stack */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Backend Framework
            </label>
            <select
              value={techStack.backend || ''}
              onChange={(e) => updateTechStack('backend', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Auto-recommend</option>
              <option value="Node.js + Express">Node.js + Express</option>
              <option value="Node.js + NestJS">Node.js + NestJS</option>
              <option value="Python + Django">Python + Django</option>
              <option value="Python + FastAPI">Python + FastAPI</option>
              <option value="Ruby on Rails">Ruby on Rails</option>
              <option value="Go">Go</option>
              <option value="Java + Spring Boot">Java + Spring Boot</option>
              <option value=".NET">ASP.NET Core</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Frontend Framework
            </label>
            <select
              value={techStack.frontend || ''}
              onChange={(e) => updateTechStack('frontend', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Auto-recommend</option>
              <option value="Next.js">Next.js (React)</option>
              <option value="React">React (CRA/Vite)</option>
              <option value="Vue.js">Vue.js</option>
              <option value="Angular">Angular</option>
              <option value="Svelte">Svelte/SvelteKit</option>
              <option value="Flutter">Flutter (Mobile)</option>
              <option value="React Native">React Native (Mobile)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Database
            </label>
            <select
              value={techStack.database || ''}
              onChange={(e) => updateTechStack('database', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Auto-recommend</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL/MariaDB</option>
              <option value="MongoDB">MongoDB</option>
              <option value="SQLite">SQLite</option>
              <option value="Redis">Redis (Cache/Session)</option>
              <option value="Firebase">Firebase/Firestore</option>
              <option value="Supabase">Supabase</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hosting Platform
            </label>
            <select
              value={techStack.hosting || ''}
              onChange={(e) => updateTechStack('hosting', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Auto-recommend</option>
              <option value="Vercel">Vercel</option>
              <option value="Netlify">Netlify</option>
              <option value="AWS">AWS (EC2/ECS/Lambda)</option>
              <option value="Google Cloud">Google Cloud</option>
              <option value="Azure">Microsoft Azure</option>
              <option value="Heroku">Heroku</option>
              <option value="DigitalOcean">DigitalOcean</option>
              <option value="Render">Render</option>
              <option value="Railway">Railway</option>
            </select>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Select "Auto-recommend" to let the system choose based on your project requirements
        </p>
      </div>

      {/* Performance Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Page Load Time Target (seconds)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="10"
              value={performanceReqs.pageLoad || ''}
              onChange={(e) => updatePerformance('pageLoad', parseFloat(e.target.value))}
              placeholder="e.g., 2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Good: &lt;3s, Excellent: &lt;1s</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              API Response Time Target (ms)
            </label>
            <input
              type="number"
              step="10"
              min="50"
              max="5000"
              value={performanceReqs.apiResponse || ''}
              onChange={(e) => updatePerformance('apiResponse', parseFloat(e.target.value))}
              placeholder="e.g., 200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Good: &lt;500ms, Excellent: &lt;200ms</p>
          </div>
        </div>
      </div>

      {/* Security Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Requirements</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Authentication Method
            </label>
            <select
              value={securityReqs.authMethod || ''}
              onChange={(e) => updateSecurity('authMethod', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select method</option>
              <option value="JWT">JWT (JSON Web Tokens)</option>
              <option value="Session">Session-based (Cookies)</option>
              <option value="OAuth">OAuth 2.0 / OpenID Connect</option>
              <option value="Auth0">Auth0 / Clerk / Supabase Auth</option>
              <option value="Firebase">Firebase Authentication</option>
              <option value="Passwordless">Passwordless (Magic Links)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Encryption Requirements
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityReqs.encryption?.includes('HTTPS') || false}
                  onChange={(e) => {
                    const current = securityReqs.encryption || [];
                    updateSecurity(
                      'encryption',
                      e.target.checked
                        ? [...current, 'HTTPS']
                        : current.filter((v: string) => v !== 'HTTPS')
                    );
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">HTTPS/TLS (in transit)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityReqs.encryption?.includes('Database') || false}
                  onChange={(e) => {
                    const current = securityReqs.encryption || [];
                    updateSecurity(
                      'encryption',
                      e.target.checked
                        ? [...current, 'Database']
                        : current.filter((v: string) => v !== 'Database')
                    );
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Database encryption (at rest)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityReqs.encryption?.includes('E2EE') || false}
                  onChange={(e) => {
                    const current = securityReqs.encryption || [];
                    updateSecurity(
                      'encryption',
                      e.target.checked
                        ? [...current, 'E2EE']
                        : current.filter((v: string) => v !== 'E2EE')
                    );
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">End-to-end encryption (E2EE)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Compliance Requirements
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityReqs.compliance?.includes('GDPR') || false}
                  onChange={(e) => {
                    const current = securityReqs.compliance || [];
                    updateSecurity(
                      'compliance',
                      e.target.checked
                        ? [...current, 'GDPR']
                        : current.filter((v: string) => v !== 'GDPR')
                    );
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">GDPR (EU data protection)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityReqs.compliance?.includes('HIPAA') || false}
                  onChange={(e) => {
                    const current = securityReqs.compliance || [];
                    updateSecurity(
                      'compliance',
                      e.target.checked
                        ? [...current, 'HIPAA']
                        : current.filter((v: string) => v !== 'HIPAA')
                    );
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">HIPAA (healthcare data)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityReqs.compliance?.includes('SOC2') || false}
                  onChange={(e) => {
                    const current = securityReqs.compliance || [];
                    updateSecurity(
                      'compliance',
                      e.target.checked
                        ? [...current, 'SOC2']
                        : current.filter((v: string) => v !== 'SOC2')
                    );
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">SOC 2 compliance</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Scalability Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scalability Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected Concurrent Users
            </label>
            <input
              type="number"
              min="1"
              value={scalabilityReqs.expectedUsers || ''}
              onChange={(e) => updateScalability('expectedUsers', parseInt(e.target.value))}
              placeholder="e.g., 1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Peak Load (requests/second)
            </label>
            <input
              type="number"
              min="1"
              value={scalabilityReqs.peakLoad || ''}
              onChange={(e) => updateScalability('peakLoad', parseInt(e.target.value))}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Volume Estimate
            </label>
            <select
              value={scalabilityReqs.dataVolume || ''}
              onChange={(e) => updateScalability('dataVolume', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select estimate</option>
              <option value="Small (&lt;1GB)">Small (&lt;1GB)</option>
              <option value="Medium (1-10GB)">Medium (1-10GB)</option>
              <option value="Large (10-100GB)">Large (10-100GB)</option>
              <option value="Very Large (100GB-1TB)">Very Large (100GB-1TB)</option>
              <option value="Enterprise (&gt;1TB)">Enterprise (&gt;1TB)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility (WCAG)</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'A', label: 'Level A', description: 'Basic accessibility' },
            { value: 'AA', label: 'Level AA', description: 'Industry standard (recommended)' },
            { value: 'AAA', label: 'Level AAA', description: 'Highest accessibility' },
          ].map((level) => (
            <label
              key={level.value}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${
                  accessibilityReq === level.value
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                type="radio"
                value={level.value}
                checked={accessibilityReq === level.value}
                onChange={(e) => setAccessibilityReq(e.target.value as 'A' | 'AA' | 'AAA')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{level.label}</div>
                <div className="text-xs text-gray-500 mt-1">{level.description}</div>
              </div>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          WCAG AA is recommended for most projects and required by many regulations
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">Technical Requirements Impact</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• Tech stack choices affect development speed, hiring, and maintenance costs</li>
              <li>• Performance targets influence architecture decisions (caching, CDN, database optimization)</li>
              <li>• Security/compliance requirements may require specific infrastructure and certifications</li>
              <li>• Scalability estimates help size infrastructure appropriately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
