'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizardStore } from '@/lib/store/wizardStore';

// ============================================
// VALIDATION SCHEMA
// ============================================

const step1Schema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters').max(100, 'Project name too long'),
  projectType: z.enum(['saas', 'marketplace', 'dashboard', 'mobile-app', 'web-app', 'api', 'tool', 'other'], {
    required_error: 'Please select a project type',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  timeline: z.string().min(1, 'Please select a timeline'),
  teamSize: z.string().min(1, 'Please select team size'),
  budgetTier: z.string().min(1, 'Please select budget tier'),
});

type Step1FormData = z.infer<typeof step1Schema>;

// ============================================
// COMPONENT
// ============================================

export default function Step1ProjectBasics() {
  const { step1, updateStep1 } = useWizardStore();

  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      projectName: step1.projectName || '',
      projectType: step1.projectType as any || undefined,
      description: step1.description || '',
      timeline: step1.timeline || '',
      teamSize: step1.teamSize || '',
      budgetTier: step1.budgetTier || '',
    },
    mode: 'onChange',
  });

  // Watch all fields for auto-save
  const watchedFields = watch();

  // Auto-save when fields change
  useEffect(() => {
    const subscription = watch((value) => {
      updateStep1({
        projectName: value.projectName,
        projectType: value.projectType,
        description: value.description,
        timeline: value.timeline,
        teamSize: value.teamSize,
        budgetTier: value.budgetTier,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateStep1]);

  const projectTypes = [
    { value: 'saas', label: 'SaaS Platform', description: 'Multi-tenant software as a service' },
    { value: 'marketplace', label: 'Marketplace', description: 'Two-sided platform connecting buyers and sellers' },
    { value: 'dashboard', label: 'Dashboard / Analytics', description: 'Data visualization and reporting tool' },
    { value: 'mobile-app', label: 'Mobile App', description: 'iOS, Android, or cross-platform mobile application' },
    { value: 'web-app', label: 'Web Application', description: 'Browser-based application' },
    { value: 'api', label: 'API / Backend Service', description: 'RESTful or GraphQL API' },
    { value: 'tool', label: 'Developer Tool', description: 'CLI, library, or framework' },
    { value: 'other', label: 'Other', description: 'Custom or hybrid project type' },
  ];

  const timelines = [
    { value: '2-4 weeks', label: '2-4 weeks', description: 'Quick MVP or prototype' },
    { value: '1-2 months', label: '1-2 months', description: 'Small to medium project' },
    { value: '3-4 months', label: '3-4 months', description: 'Medium complexity project' },
    { value: '5-6 months', label: '5-6 months', description: 'Large project with multiple features' },
    { value: '6+ months', label: '6+ months', description: 'Complex enterprise project' },
    { value: 'flexible', label: 'Flexible / Unknown', description: 'Timeline to be determined' },
  ];

  const teamSizes = [
    { value: 'solo', label: 'Solo (1 person)', description: 'Individual developer' },
    { value: 'small', label: 'Small (2-3 people)', description: 'Small team or startup' },
    { value: 'medium', label: 'Medium (4-10 people)', description: 'Growing team' },
    { value: 'large', label: 'Large (10+ people)', description: 'Established company' },
  ];

  const budgetTiers = [
    { value: 'low', label: 'Low ($0-10k)', description: 'Bootstrap / minimal budget', icon: '💸' },
    { value: 'medium', label: 'Medium ($10k-50k)', description: 'Startup / small business', icon: '💰' },
    { value: 'high', label: 'High ($50k-200k)', description: 'Funded startup / SMB', icon: '💵' },
    { value: 'enterprise', label: 'Enterprise ($200k+)', description: 'Large company / enterprise', icon: '🏦' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Step 1: Project Basics</h2>
        <p className="text-gray-600 mt-2">
          Tell us about your project. This information helps us understand your goals and constraints.
        </p>
      </div>

      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-2">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('projectName')}
          type="text"
          id="projectName"
          placeholder="e.g., TaskFlow SaaS, MyMarketplace, Analytics Dashboard"
          className={`
            w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            ${errors.projectName ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.projectName && (
          <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          A clear, concise name for your project (3-100 characters)
        </p>
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Project Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projectTypes.map((type) => (
            <label
              key={type.value}
              className={`
                relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  watchedFields.projectType === type.value
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                {...register('projectType')}
                type="radio"
                value={type.value}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">{type.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.projectType && (
          <p className="mt-2 text-sm text-red-600">{errors.projectType.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={6}
          placeholder="Describe what your project does, who it's for, and what problem it solves. Be specific about key features and goals."
          className={`
            w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            resize-none
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            Minimum 10 characters. Be as detailed as possible.
          </p>
          <p className="text-xs text-gray-500">
            {watchedFields.description?.length || 0} / 1000
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Expected Timeline <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {timelines.map((timeline) => (
            <label
              key={timeline.value}
              className={`
                relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  watchedFields.timeline === timeline.value
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                {...register('timeline')}
                type="radio"
                value={timeline.value}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">{timeline.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{timeline.description}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.timeline && (
          <p className="mt-2 text-sm text-red-600">{errors.timeline.message}</p>
        )}
      </div>

      {/* Team Size */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Team Size <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teamSizes.map((team) => (
            <label
              key={team.value}
              className={`
                relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  watchedFields.teamSize === team.value
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                {...register('teamSize')}
                type="radio"
                value={team.value}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">{team.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{team.description}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.teamSize && (
          <p className="mt-2 text-sm text-red-600">{errors.teamSize.message}</p>
        )}
      </div>

      {/* Budget Tier */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Budget Tier <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgetTiers.map((budget) => (
            <label
              key={budget.value}
              className={`
                relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  watchedFields.budgetTier === budget.value
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                {...register('budgetTier')}
                type="radio"
                value={budget.value}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{budget.icon}</span>
                  <div className="text-sm font-medium text-gray-900">{budget.label}</div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{budget.description}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.budgetTier && (
          <p className="mt-2 text-sm text-red-600">{errors.budgetTier.message}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Budget affects infrastructure recommendations, third-party service choices, and implementation complexity.
        </p>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Step 1 Completion</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className={watchedFields.projectName ? 'text-green-600' : 'text-gray-400'}>
              {watchedFields.projectName ? '✓' : '○'}
            </span>
            <span className={watchedFields.projectName ? 'text-gray-700' : 'text-gray-500'}>
              Project name
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={watchedFields.projectType ? 'text-green-600' : 'text-gray-400'}>
              {watchedFields.projectType ? '✓' : '○'}
            </span>
            <span className={watchedFields.projectType ? 'text-gray-700' : 'text-gray-500'}>
              Project type
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={watchedFields.description ? 'text-green-600' : 'text-gray-400'}>
              {watchedFields.description ? '✓' : '○'}
            </span>
            <span className={watchedFields.description ? 'text-gray-700' : 'text-gray-500'}>
              Description
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={watchedFields.timeline ? 'text-green-600' : 'text-gray-400'}>
              {watchedFields.timeline ? '✓' : '○'}
            </span>
            <span className={watchedFields.timeline ? 'text-gray-700' : 'text-gray-500'}>
              Timeline
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={watchedFields.teamSize ? 'text-green-600' : 'text-gray-400'}>
              {watchedFields.teamSize ? '✓' : '○'}
            </span>
            <span className={watchedFields.teamSize ? 'text-gray-700' : 'text-gray-500'}>
              Team size
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={watchedFields.budgetTier ? 'text-green-600' : 'text-gray-400'}>
              {watchedFields.budgetTier ? '✓' : '○'}
            </span>
            <span className={watchedFields.budgetTier ? 'text-gray-700' : 'text-gray-500'}>
              Budget tier
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900">Tips for Step 1</h4>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• Be specific in your description - mention key features and user goals</li>
              <li>• Choose a realistic timeline based on project complexity</li>
              <li>• Budget tier influences technology recommendations and architecture choices</li>
              <li>• Your inputs auto-save - you can leave and come back anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
