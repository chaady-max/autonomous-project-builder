'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWizardStore, type Feature } from '@/lib/store/wizardStore';

// ============================================
// VALIDATION SCHEMA
// ============================================

const featureSchema = z.object({
  name: z.string().min(3, 'Feature name must be at least 3 characters'),
  scope: z.enum(['mvp', 'post-mvp', 'nice']),
  priority: z.number(),
  description: z.string().optional(),
});

const step4Schema = z.object({
  features: z.array(featureSchema).min(1, 'At least one feature is required'),
  inScope: z.array(z.string()).min(1, 'Define what is in scope'),
  outOfScope: z.array(z.string()).min(1, 'Define what is out of scope'),
});

type Step4FormData = z.infer<typeof step4Schema>;

// ============================================
// SORTABLE FEATURE ITEM
// ============================================

interface SortableFeatureProps {
  feature: Feature;
  index: number;
  onRemove: () => void;
  onUpdate: (field: keyof Feature, value: any) => void;
}

function SortableFeature({ feature, index, onRemove, onUpdate }: SortableFeatureProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: feature.name + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'mvp':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'post-mvp':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'nice':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border-2 border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 pt-1">
          <span className="text-xl">☰</span>
        </button>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <input
              type="text"
              value={feature.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="Feature name (e.g., User authentication, Real-time chat)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button onClick={onRemove} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
              🗑️
            </button>
          </div>
          <input
            type="text"
            value={feature.description || ''}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Brief description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            {['mvp', 'post-mvp', 'nice'].map((scope) => (
              <button
                key={scope}
                onClick={() => onUpdate('scope', scope)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                  feature.scope === scope ? getScopeColor(scope) + ' ring-2 ring-offset-1' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {scope === 'mvp' && '🎯 MVP'}
                {scope === 'post-mvp' && '📅 Post-MVP'}
                {scope === 'nice' && '✨ Nice-to-Have'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Step4Features() {
  const { step4, updateStep4 } = useWizardStore();

  const [features, setFeatures] = useState<Feature[]>(
    step4?.features?.length
      ? step4.features
      : [{ name: '', scope: 'mvp', priority: 0, description: '' }]
  );

  const [inScopeItems, setInScopeItems] = useState<string[]>(step4?.inScope?.length ? step4.inScope : ['']);
  const [outOfScopeItems, setOutOfScopeItems] = useState<string[]>(step4?.outOfScope?.length ? step4.outOfScope : ['']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-save
  useEffect(() => {
    updateStep4({
      features,
      inScope: inScopeItems.filter((item) => item.trim().length > 0),
      outOfScope: outOfScopeItems.filter((item) => item.trim().length > 0),
    });
  }, [features, inScopeItems, outOfScopeItems, updateStep4]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFeatures((items) => {
        const oldIndex = items.findIndex((_, idx) => active.id === items[idx].name + idx);
        const newIndex = items.findIndex((_, idx) => over.id === items[idx].name + idx);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, priority: idx }));
      });
    }
  };

  const addFeature = () => {
    setFeatures([...features, { name: '', scope: 'mvp', priority: features.length, description: '' }]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, idx) => idx !== index));
    }
  };

  const updateFeature = (index: number, field: keyof Feature, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const addInScopeItem = () => {
    setInScopeItems([...inScopeItems, '']);
  };

  const removeInScopeItem = (index: number) => {
    if (inScopeItems.length > 1) {
      setInScopeItems(inScopeItems.filter((_, idx) => idx !== index));
    }
  };

  const updateInScopeItem = (index: number, value: string) => {
    const updated = [...inScopeItems];
    updated[index] = value;
    setInScopeItems(updated);
  };

  const addOutOfScopeItem = () => {
    setOutOfScopeItems([...outOfScopeItems, '']);
  };

  const removeOutOfScopeItem = (index: number) => {
    if (outOfScopeItems.length > 1) {
      setOutOfScopeItems(outOfScopeItems.filter((_, idx) => idx !== index));
    }
  };

  const updateOutOfScopeItem = (index: number, value: string) => {
    const updated = [...outOfScopeItems];
    updated[index] = value;
    setOutOfScopeItems(updated);
  };

  const mvpCount = features.filter((f) => f.scope === 'mvp').length;
  const postMvpCount = features.filter((f) => f.scope === 'post-mvp').length;
  const niceCount = features.filter((f) => f.scope === 'nice').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 4: Features & Scope</h2>
        <p className="text-gray-600 mt-2">
          List all features and prioritize them. Define what's in scope and what's explicitly out of scope.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
            {mvpCount} MVP
          </span>
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
            {postMvpCount} Post-MVP
          </span>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold">
            {niceCount} Nice-to-Have
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">Feature Prioritization Tips</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• <strong>MVP:</strong> Must-have features for initial launch (core value proposition)</li>
              <li>• <strong>Post-MVP:</strong> Important but can wait for v2.0</li>
              <li>• <strong>Nice-to-Have:</strong> Would be great but not essential</li>
              <li>• Drag features to reorder by priority (top = highest priority)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features List with Drag & Drop */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Features</h3>
          <button
            onClick={addFeature}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Add Feature
          </button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={features.map((f, idx) => f.name + idx)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <SortableFeature
                  key={feature.name + index}
                  feature={feature}
                  index={index}
                  onRemove={() => removeFeature(index)}
                  onUpdate={(field, value) => updateFeature(index, field, value)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* In Scope */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">In Scope</h3>
            <p className="text-sm text-gray-600">What this project WILL include</p>
          </div>
          <button
            onClick={addInScopeItem}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-2">
          {inScopeItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateInScopeItem(index, e.target.value)}
                placeholder="e.g., Web and mobile apps, User authentication, Real-time notifications"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {inScopeItems.length > 1 && (
                <button
                  onClick={() => removeInScopeItem(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Out of Scope */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Out of Scope</h3>
            <p className="text-sm text-gray-600">What this project will NOT include (explicitly)</p>
          </div>
          <button
            onClick={addOutOfScopeItem}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-2">
          {outOfScopeItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateOutOfScopeItem(index, e.target.value)}
                placeholder="e.g., Native desktop apps, Video calling, AI-powered features"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {outOfScopeItems.length > 1 && (
                <button
                  onClick={() => removeOutOfScopeItem(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Step 4 Completion</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className={features.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {features.length > 0 ? '✓' : '○'}
            </span>
            <span className={features.length > 0 ? 'text-gray-700' : 'text-gray-500'}>
              {features.length} feature{features.length !== 1 ? 's' : ''} defined
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={inScopeItems.some((i) => i.trim()) ? 'text-green-600' : 'text-gray-400'}>
              {inScopeItems.some((i) => i.trim()) ? '✓' : '○'}
            </span>
            <span className={inScopeItems.some((i) => i.trim()) ? 'text-gray-700' : 'text-gray-500'}>
              In-scope items defined
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={outOfScopeItems.some((i) => i.trim()) ? 'text-green-600' : 'text-gray-400'}>
              {outOfScopeItems.some((i) => i.trim()) ? '✓' : '○'}
            </span>
            <span className={outOfScopeItems.some((i) => i.trim()) ? 'text-gray-700' : 'text-gray-500'}>
              Out-of-scope items defined
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-purple-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-purple-900">Why Define Scope Explicitly?</h4>
            <ul className="mt-2 space-y-1 text-xs text-purple-800">
              <li>• Prevents scope creep during development</li>
              <li>• Sets clear expectations with stakeholders</li>
              <li>• Helps estimate time and cost accurately</li>
              <li>• Out-of-scope items can become future roadmap items</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
