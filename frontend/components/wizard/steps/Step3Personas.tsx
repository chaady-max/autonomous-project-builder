'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizardStore, type Persona } from '@/lib/store/wizardStore';

// ============================================
// VALIDATION SCHEMA
// ============================================

const personaSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role is required'),
  goals: z.array(z.string().min(1)).min(1, 'At least one goal is required'),
  techSkill: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

const step3Schema = z.object({
  personas: z.array(personaSchema).min(1, 'At least one persona is required'),
});

type Step3FormData = z.infer<typeof step3Schema>;

// ============================================
// COMPONENT
// ============================================

export default function Step3Personas() {
  const { step3, updateStep3 } = useWizardStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      personas: step3?.personas?.length
        ? step3.personas
        : [
            {
              name: '',
              role: '',
              goals: [''],
              techSkill: undefined,
              frequency: undefined,
            },
          ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'personas',
  });

  const watchedPersonas = watch('personas');

  // Auto-save when personas change
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.personas) {
        updateStep3({ personas: value.personas as Persona[] });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateStep3]);

  const addPersona = () => {
    append({
      name: '',
      role: '',
      goals: [''],
      techSkill: undefined,
      frequency: undefined,
    });
  };

  const removePersona = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addGoal = (personaIndex: number) => {
    const currentGoals = watchedPersonas[personaIndex]?.goals || [];
    const updatedPersonas = [...watchedPersonas];
    updatedPersonas[personaIndex] = {
      ...updatedPersonas[personaIndex],
      goals: [...currentGoals, ''],
    };
    updateStep3({ personas: updatedPersonas as Persona[] });
  };

  const removeGoal = (personaIndex: number, goalIndex: number) => {
    const currentGoals = watchedPersonas[personaIndex]?.goals || [];
    if (currentGoals.length > 1) {
      const updatedPersonas = [...watchedPersonas];
      updatedPersonas[personaIndex] = {
        ...updatedPersonas[personaIndex],
        goals: currentGoals.filter((_, idx) => idx !== goalIndex),
      };
      updateStep3({ personas: updatedPersonas as Persona[] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 3: User Personas</h2>
        <p className="text-gray-600 mt-2">
          Define who will use your product. Personas help understand user needs, behaviors, and goals.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
          <span className="font-semibold">{fields.length} persona{fields.length !== 1 ? 's' : ''} defined</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">What makes a good persona?</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• <strong>Specific:</strong> "Marketing Manager" not "User"</li>
              <li>• <strong>Goal-oriented:</strong> What do they want to accomplish?</li>
              <li>• <strong>Representative:</strong> Based on real user research if possible</li>
              <li>• <strong>2-5 personas:</strong> Cover main user types without over-complicating</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Persona Cards */}
      <div className="space-y-6">
        {fields.map((field, personaIndex) => {
          const personaErrors = errors.personas?.[personaIndex];
          const persona = watchedPersonas[personaIndex];

          return (
            <div
              key={field.id}
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <h3 className="text-white font-semibold">
                    Persona {personaIndex + 1}
                    {persona?.name && `: ${persona.name}`}
                  </h3>
                </div>
                {fields.length > 1 && (
                  <button
                    onClick={() => removePersona(personaIndex)}
                    className="text-white hover:text-red-200 transition-colors"
                    title="Remove persona"
                  >
                    <span className="text-xl">🗑️</span>
                  </button>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-5">
                {/* Name and Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`personas.${personaIndex}.name`)}
                      type="text"
                      placeholder="e.g., Sarah Chen, Alex Kumar"
                      className={`
                        w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        ${personaErrors?.name ? 'border-red-500' : 'border-gray-300'}
                      `}
                    />
                    {personaErrors?.name && (
                      <p className="mt-1 text-sm text-red-600">{personaErrors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role / Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`personas.${personaIndex}.role`)}
                      type="text"
                      placeholder="e.g., Marketing Manager, Software Developer"
                      className={`
                        w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        ${personaErrors?.role ? 'border-red-500' : 'border-gray-300'}
                      `}
                    />
                    {personaErrors?.role && (
                      <p className="mt-1 text-sm text-red-600">{personaErrors.role.message}</p>
                    )}
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Goals & Motivations <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={() => addGoal(personaIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      + Add Goal
                    </button>
                  </div>
                  <div className="space-y-2">
                    {persona?.goals?.map((goal, goalIndex) => (
                      <div key={goalIndex} className="flex gap-2">
                        <input
                          {...register(`personas.${personaIndex}.goals.${goalIndex}`)}
                          type="text"
                          placeholder="e.g., Track team performance metrics in real-time"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {persona.goals.length > 1 && (
                          <button
                            onClick={() => removeGoal(personaIndex, goalIndex)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {personaErrors?.goals && (
                    <p className="mt-1 text-sm text-red-600">
                      {Array.isArray(personaErrors.goals)
                        ? 'All goals must be filled'
                        : personaErrors.goals.message}
                    </p>
                  )}
                </div>

                {/* Technical Skill Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Technical Skill Level
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Non-technical user' },
                      { value: 'intermediate', label: 'Intermediate', icon: '📈', description: 'Some tech knowledge' },
                      { value: 'expert', label: 'Expert', icon: '⚡', description: 'Technical/power user' },
                    ].map((skill) => (
                      <label
                        key={skill.value}
                        className={`
                          flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all
                          ${
                            persona?.techSkill === skill.value
                              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          {...register(`personas.${personaIndex}.techSkill`)}
                          type="radio"
                          value={skill.value}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-1">{skill.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{skill.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{skill.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Usage Frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Usage Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'daily', label: 'Daily', icon: '📅', description: 'Primary tool' },
                      { value: 'weekly', label: 'Weekly', icon: '📆', description: 'Regular use' },
                      { value: 'monthly', label: 'Monthly', icon: '📊', description: 'Occasional use' },
                    ].map((freq) => (
                      <label
                        key={freq.value}
                        className={`
                          p-3 border-2 rounded-lg cursor-pointer transition-all
                          ${
                            persona?.frequency === freq.value
                              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          {...register(`personas.${personaIndex}.frequency`)}
                          type="radio"
                          value={freq.value}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-xl mb-1">{freq.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{freq.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{freq.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Persona Button */}
      <button
        onClick={addPersona}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
      >
        + Add Another Persona
      </button>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Step 3 Completion</h3>
        <div className="space-y-1">
          {fields.map((_, index) => {
            const persona = watchedPersonas[index];
            const hasName = persona?.name && persona.name.length >= 2;
            const hasRole = persona?.role && persona.role.length >= 2;
            const hasGoals = persona?.goals?.some((g) => g && g.length > 0);

            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className={hasName && hasRole && hasGoals ? 'text-green-600' : 'text-gray-400'}>
                  {hasName && hasRole && hasGoals ? '✓' : '○'}
                </span>
                <span className={hasName && hasRole && hasGoals ? 'text-gray-700' : 'text-gray-500'}>
                  Persona {index + 1}: {persona?.name || 'Unnamed'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-purple-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-purple-900">Example Personas</h4>
            <div className="mt-2 space-y-2 text-xs text-purple-800">
              <div className="bg-white rounded p-2">
                <strong>Sarah Chen - Marketing Manager</strong>
                <br />
                Goals: Track campaign performance, generate reports for executives, collaborate with team
                <br />
                Tech Skill: Intermediate | Frequency: Daily
              </div>
              <div className="bg-white rounded p-2">
                <strong>Alex Kumar - Software Developer</strong>
                <br />
                Goals: Automate deployment workflows, monitor system health, integrate with existing tools
                <br />
                Tech Skill: Expert | Frequency: Daily
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
