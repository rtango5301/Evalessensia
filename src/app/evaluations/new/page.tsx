'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Types
type WizardStep = 'agent' | 'dataset' | 'review';

interface AgentConfig {
  name: string;
  description: string;
  model: string;
  mcpServer: string;
}

interface DatasetSelection {
  type: 'existing' | 'new';
  existingId?: string;
  existingName?: string;
}

// Mock datasets for selection
const existingDatasets = [
  { id: 'ds-001', name: 'Customer Support Q&A', size: 150, type: 'uploaded' },
  { id: 'ds-002', name: 'Financial Reports Dataset', size: 200, type: 'generated' },
  { id: 'ds-003', name: 'Blog Posts Dataset', size: 75, type: 'uploaded' },
  { id: 'ds-004', name: 'Code Review Samples', size: 300, type: 'generated' },
  { id: 'ds-005', name: 'Multi-language Dataset', size: 500, type: 'uploaded' },
];

const modelOptions = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
];

function WizardStepIndicator({ currentStep }: { currentStep: WizardStep }) {
  const steps: { key: WizardStep; label: string; icon: string }[] = [
    { key: 'agent', label: 'Configure Agent', icon: 'smart_toy' },
    { key: 'dataset', label: 'Select Dataset', icon: 'folder_open' },
    { key: 'review', label: 'Review & Start', icon: 'play_circle' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              index === currentIndex
                ? 'bg-[#135bec] text-white'
                : index < currentIndex
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
            )}
          >
            <span className="material-symbols-outlined text-lg">
              {index < currentIndex ? 'check_circle' : step.icon}
            </span>
            <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-8 h-0.5 mx-2',
                index < currentIndex ? 'bg-emerald-300' : 'bg-slate-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function NewEvaluationWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step') as WizardStep | null;
  const preselectedDataset = searchParams.get('dataset');

  const [currentStep, setCurrentStep] = useState<WizardStep>(stepParam || 'agent');

  // Agent config state
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    model: 'gpt-4-turbo',
    mcpServer: '',
  });

  // Dataset selection state
  const [datasetSelection, setDatasetSelection] = useState<DatasetSelection>({
    type: 'existing',
    existingId: preselectedDataset || undefined,
    existingName: preselectedDataset
      ? existingDatasets.find((d) => d.id === preselectedDataset)?.name
      : undefined,
  });

  // Update URL when step changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('step', currentStep);
    window.history.replaceState({}, '', url.toString());
  }, [currentStep]);

  const canProceedFromAgent = agentConfig.name && agentConfig.description && agentConfig.model;
  const canProceedFromDataset = datasetSelection.type === 'new' || datasetSelection.existingId;

  const handleNext = () => {
    if (currentStep === 'agent' && canProceedFromAgent) {
      setCurrentStep('dataset');
    } else if (currentStep === 'dataset' && canProceedFromDataset) {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'dataset') {
      setCurrentStep('agent');
    } else if (currentStep === 'review') {
      setCurrentStep('dataset');
    }
  };

  const handleStartEvaluation = () => {
    // In a real app, this would create the evaluation and redirect
    router.push('/evaluations/1024');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/evaluations" className="hover:text-[#135bec] transition-colors">
          Evaluations
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-slate-900 font-medium">New Evaluation</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Evaluation</h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure your agent and select a dataset to evaluate.
          </p>
        </div>
        <WizardStepIndicator currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Step 1: Configure Agent */}
        {currentStep === 'agent' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-[#135bec]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#135bec]">smart_toy</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Configure Agent</h2>
                <p className="text-sm text-slate-500">Set up the agent you want to evaluate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Agent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={agentConfig.name}
                  onChange={(e) => setAgentConfig({ ...agentConfig, name: e.target.value })}
                  placeholder="e.g., Support Bot v2.4"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
                />
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  value={agentConfig.model}
                  onChange={(e) => setAgentConfig({ ...agentConfig, model: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
                >
                  {modelOptions.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </option>
                  ))}
                </select>
              </div>

              {/* Agent Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Agent Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={agentConfig.description}
                  onChange={(e) => setAgentConfig({ ...agentConfig, description: e.target.value })}
                  placeholder="Describe what this agent does, its expected behavior, and any specific capabilities..."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* MCP Server */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  MCP Server <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={agentConfig.mcpServer}
                  onChange={(e) => setAgentConfig({ ...agentConfig, mcpServer: e.target.value })}
                  placeholder="e.g., mcp://my-server"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Connect to an MCP server for tool access during evaluation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Dataset */}
        {currentStep === 'dataset' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-[#135bec]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#135bec]">folder_open</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Select Dataset</h2>
                <p className="text-sm text-slate-500">Choose or create a dataset for evaluation</p>
              </div>
            </div>

            {/* Dataset Type Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setDatasetSelection({ type: 'existing', existingId: undefined })}
                className={cn(
                  'flex-1 p-4 rounded-xl border-2 transition-all text-left',
                  datasetSelection.type === 'existing'
                    ? 'border-[#135bec] bg-[#135bec]/5'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={cn(
                      'material-symbols-outlined',
                      datasetSelection.type === 'existing' ? 'text-[#135bec]' : 'text-slate-400'
                    )}
                  >
                    folder
                  </span>
                  <span className="font-medium text-slate-900">Use Existing Dataset</span>
                </div>
                <p className="text-sm text-slate-500">Select from your saved datasets</p>
              </button>

              <button
                onClick={() => setDatasetSelection({ type: 'new' })}
                className={cn(
                  'flex-1 p-4 rounded-xl border-2 transition-all text-left',
                  datasetSelection.type === 'new'
                    ? 'border-[#135bec] bg-[#135bec]/5'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={cn(
                      'material-symbols-outlined',
                      datasetSelection.type === 'new' ? 'text-[#135bec]' : 'text-slate-400'
                    )}
                  >
                    add_circle
                  </span>
                  <span className="font-medium text-slate-900">Create New Dataset</span>
                </div>
                <p className="text-sm text-slate-500">Upload or generate a new dataset</p>
              </button>
            </div>

            {/* Existing Dataset List */}
            {datasetSelection.type === 'existing' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Available Datasets</span>
                </div>
                <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
                  {existingDatasets.map((dataset) => (
                    <button
                      key={dataset.id}
                      onClick={() =>
                        setDatasetSelection({
                          type: 'existing',
                          existingId: dataset.id,
                          existingName: dataset.name,
                        })
                      }
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                        datasetSelection.existingId === dataset.id
                          ? 'bg-[#135bec]/5'
                          : 'hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'material-symbols-outlined',
                            datasetSelection.existingId === dataset.id
                              ? 'text-[#135bec]'
                              : 'text-slate-400'
                          )}
                        >
                          {datasetSelection.existingId === dataset.id
                            ? 'check_circle'
                            : 'radio_button_unchecked'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{dataset.name}</p>
                          <p className="text-xs text-slate-500">
                            {dataset.size} queries &bull;{' '}
                            {dataset.type === 'uploaded' ? 'Uploaded' : 'Generated'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{dataset.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Create New Dataset Info */}
            {datasetSelection.type === 'new' && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-blue-600 text-lg shrink-0">
                    info
                  </span>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Create a New Dataset</p>
                    <p className="text-blue-700 mb-3">
                      You&apos;ll be redirected to create a new dataset. After creation, you can
                      return here to continue your evaluation setup.
                    </p>
                    <Link
                      href="/datasets/new"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      Create Dataset
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Start */}
        {currentStep === 'review' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600">play_circle</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Review & Start</h2>
                <p className="text-sm text-slate-500">Confirm your configuration before starting</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Summary */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-500">Agent Configuration</span>
                  <button
                    onClick={() => setCurrentStep('agent')}
                    className="text-xs text-[#135bec] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400">Name</label>
                    <p className="text-sm font-medium text-slate-900">{agentConfig.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Model</label>
                    <p className="text-sm font-medium text-slate-900">
                      {modelOptions.find((m) => m.id === agentConfig.model)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Description</label>
                    <p className="text-sm text-slate-700 line-clamp-2">{agentConfig.description}</p>
                  </div>
                  {agentConfig.mcpServer && (
                    <div>
                      <label className="text-xs text-slate-400">MCP Server</label>
                      <p className="text-sm font-mono text-slate-700">{agentConfig.mcpServer}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dataset Summary */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-500">Dataset</span>
                  <button
                    onClick={() => setCurrentStep('dataset')}
                    className="text-xs text-[#135bec] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400">Name</label>
                    <p className="text-sm font-medium text-slate-900">
                      {datasetSelection.existingName || 'No dataset selected'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">ID</label>
                    <p className="text-sm font-mono text-slate-700">
                      {datasetSelection.existingId || '--'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Queries</label>
                    <p className="text-sm text-slate-700">
                      {datasetSelection.existingId
                        ? `${existingDatasets.find((d) => d.id === datasetSelection.existingId)?.size} queries`
                        : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">
                  schedule
                </span>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Estimated Duration</p>
                  <p className="text-amber-700">
                    Based on{' '}
                    {existingDatasets.find((d) => d.id === datasetSelection.existingId)?.size || 0}{' '}
                    queries, this evaluation should complete in approximately 5-10 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer with Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 'agent'}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              currentStep === 'agent'
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-200'
            )}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleStartEvaluation}
              disabled={!canProceedFromDataset}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              Start Evaluation
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 'agent' && !canProceedFromAgent) ||
                (currentStep === 'dataset' && !canProceedFromDataset)
              }
              className={cn(
                'flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-sm transition-all',
                (currentStep === 'agent' && canProceedFromAgent) ||
                  (currentStep === 'dataset' && canProceedFromDataset)
                  ? 'bg-[#135bec] text-white hover:bg-[#135bec]/90 shadow-sm shadow-[#135bec]/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              )}
            >
              Next
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewEvaluationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin">
            <span className="material-symbols-outlined text-3xl text-slate-400">refresh</span>
          </div>
        </div>
      }
    >
      <NewEvaluationWizardContent />
    </Suspense>
  );
}
