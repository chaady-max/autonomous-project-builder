'use client';

import { useState, useEffect } from 'react';
import { useWizardStore, type Step7Data } from '@/lib/store/wizardStore';

export default function Step7DataAPIs() {
  const { step7, updateStep7 } = useWizardStore();

  const [dataModel, setDataModel] = useState(
    step7?.dataModel?.length ? step7.dataModel : [{ entity: '', fields: [''], relationships: [] }]
  );
  const [externalAPIs, setExternalAPIs] = useState(
    step7?.externalAPIs?.length ? step7.externalAPIs : [{ name: '', purpose: '', criticality: 'optional' as const }]
  );
  const [dataPrivacy, setDataPrivacy] = useState(step7?.dataPrivacy || {});

  // Auto-save
  useEffect(() => {
    updateStep7({
      dataModel: dataModel.filter((e) => e.entity.trim().length > 0),
      externalAPIs: externalAPIs.filter((api) => api.name.trim().length > 0),
      dataPrivacy,
    });
  }, [dataModel, externalAPIs, dataPrivacy, updateStep7]);

  const addEntity = () => {
    setDataModel([...dataModel, { entity: '', fields: [''], relationships: [] }]);
  };

  const removeEntity = (index: number) => {
    if (dataModel.length > 1) {
      setDataModel(dataModel.filter((_, idx) => idx !== index));
    }
  };

  const updateEntity = (index: number, field: string, value: any) => {
    const updated = [...dataModel];
    updated[index] = { ...updated[index], [field]: value };
    setDataModel(updated);
  };

  const addField = (entityIndex: number) => {
    const updated = [...dataModel];
    updated[entityIndex].fields.push('');
    setDataModel(updated);
  };

  const removeField = (entityIndex: number, fieldIndex: number) => {
    const updated = [...dataModel];
    if (updated[entityIndex].fields.length > 1) {
      updated[entityIndex].fields = updated[entityIndex].fields.filter((_, idx) => idx !== fieldIndex);
      setDataModel(updated);
    }
  };

  const updateField = (entityIndex: number, fieldIndex: number, value: string) => {
    const updated = [...dataModel];
    updated[entityIndex].fields[fieldIndex] = value;
    setDataModel(updated);
  };

  const addAPI = () => {
    setExternalAPIs([...externalAPIs, { name: '', purpose: '', criticality: 'optional' }]);
  };

  const removeAPI = (index: number) => {
    if (externalAPIs.length > 1) {
      setExternalAPIs(externalAPIs.filter((_, idx) => idx !== index));
    }
  };

  const updateAPI = (index: number, field: string, value: any) => {
    const updated = [...externalAPIs];
    updated[index] = { ...updated[index], [field]: value };
    setExternalAPIs(updated);
  };

  const updatePrivacy = (field: string, value: any) => {
    setDataPrivacy({ ...dataPrivacy, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 7: Data & APIs</h2>
        <p className="text-gray-600 mt-2">
          Define your data model, external API integrations, and data privacy requirements.
        </p>
      </div>

      {/* Data Model */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Model / Entities</h3>
            <p className="text-sm text-gray-600">Define the main entities (tables/collections) in your database</p>
          </div>
          <button
            onClick={addEntity}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Add Entity
          </button>
        </div>

        <div className="space-y-4">
          {dataModel.map((entity, entityIndex) => (
            <div key={entityIndex} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="text"
                  value={entity.entity}
                  onChange={(e) => updateEntity(entityIndex, 'entity', e.target.value)}
                  placeholder="Entity name (e.g., User, Product, Order)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {dataModel.length > 1 && (
                  <button
                    onClick={() => removeEntity(entityIndex)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Fields</label>
                  <button
                    onClick={() => addField(entityIndex)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    + Add Field
                  </button>
                </div>
                <div className="space-y-2">
                  {entity.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={field}
                        onChange={(e) => updateField(entityIndex, fieldIndex, e.target.value)}
                        placeholder="Field name (e.g., email, price, createdAt)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {entity.fields.length > 1 && (
                        <button
                          onClick={() => removeField(entityIndex, fieldIndex)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Relationships (optional)
                </label>
                <input
                  type="text"
                  value={entity.relationships?.join(', ') || ''}
                  onChange={(e) => updateEntity(entityIndex, 'relationships', e.target.value.split(',').map((r) => r.trim()))}
                  placeholder="e.g., User hasMany Orders, Order belongsTo User"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External APIs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">External APIs & Integrations</h3>
            <p className="text-sm text-gray-600">Third-party services you plan to integrate</p>
          </div>
          <button
            onClick={addAPI}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            + Add API
          </button>
        </div>

        <div className="space-y-3">
          {externalAPIs.map((api, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={api.name}
                  onChange={(e) => updateAPI(index, 'name', e.target.value)}
                  placeholder="API name (e.g., Stripe, SendGrid, Twilio)"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={api.purpose}
                  onChange={(e) => updateAPI(index, 'purpose', e.target.value)}
                  placeholder="Purpose (e.g., Payment processing)"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <select
                    value={api.criticality}
                    onChange={(e) => updateAPI(index, 'criticality', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="critical">Critical</option>
                    <option value="important">Important</option>
                    <option value="optional">Optional</option>
                  </select>
                  {externalAPIs.length > 1 && (
                    <button
                      onClick={() => removeAPI(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Privacy */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Privacy & Retention</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Privacy Requirements
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dataPrivacy.gdpr || false}
                  onChange={(e) => updatePrivacy('gdpr', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">GDPR compliance (EU users)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dataPrivacy.hipaa || false}
                  onChange={(e) => updatePrivacy('hipaa', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">HIPAA compliance (healthcare data)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dataPrivacy.ccpa || false}
                  onChange={(e) => updatePrivacy('ccpa', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">CCPA compliance (California users)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Retention Policy
            </label>
            <select
              value={dataPrivacy.retention || ''}
              onChange={(e) => updatePrivacy('retention', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select policy</option>
              <option value="30 days">30 days (short-term)</option>
              <option value="90 days">90 days</option>
              <option value="1 year">1 year</option>
              <option value="3 years">3 years</option>
              <option value="7 years">7 years (legal/financial)</option>
              <option value="Indefinite">Indefinite (until user deletion request)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Backup & Recovery
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dataPrivacy.backups || false}
                  onChange={(e) => updatePrivacy('backups', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Automated daily backups required</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dataPrivacy.disasterRecovery || false}
                  onChange={(e) => updatePrivacy('disasterRecovery', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Disaster recovery plan needed</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">Data Model Best Practices</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• Start with core entities - you can add more later</li>
              <li>• Think about relationships: one-to-many, many-to-many</li>
              <li>• Consider soft deletes for user data (GDPR compliance)</li>
              <li>• External APIs marked as "critical" should have fallback plans</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-purple-600 text-xl">📝</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-purple-900">Example Data Model</h4>
            <div className="mt-2 space-y-2 text-xs text-purple-800">
              <div className="bg-white rounded p-2">
                <strong>User:</strong> id, email, password_hash, name, created_at
                <br />
                Relationships: User hasMany Orders
              </div>
              <div className="bg-white rounded p-2">
                <strong>Order:</strong> id, user_id, total, status, created_at
                <br />
                Relationships: Order belongsTo User, Order hasMany OrderItems
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
