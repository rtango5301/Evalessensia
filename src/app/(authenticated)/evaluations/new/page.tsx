'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast-context';
import {
  MCPMarketplaceModal,
  MCP_SERVERS as MARKETPLACE_SERVERS,
} from '@/components/ui/mcp-marketplace-modal';

// Types
type WizardStep = 'agent' | 'dataset' | 'review';

interface CustomMCPServer {
  name: string;
  description: string;
  url: string;
}

interface AgentConfig {
  evaluationName: string;
  name: string;
  description: string;
  customMcp: CustomMCPServer;
}

interface DatasetSelection {
  type: 'existing' | 'new';
  existingId?: string;
  existingName?: string;
}

// Mock datasets for selection - includes status field
const existingDatasets = [
  { id: 'ds-001', name: 'Customer Support Q&A', size: 150, type: 'uploaded', status: 'ready' },
  {
    id: 'ds-002',
    name: 'Financial Reports Dataset',
    size: 200,
    type: 'generated',
    status: 'ready',
  },
  { id: 'ds-003', name: 'Blog Posts Dataset', size: 75, type: 'uploaded', status: 'processing' },
  { id: 'ds-004', name: 'Code Review Samples', size: 300, type: 'generated', status: 'ready' },
  { id: 'ds-005', name: 'Multi-language Dataset', size: 500, type: 'uploaded', status: 'failed' },
  { id: 'ds-006', name: 'Safety Test Cases', size: 120, type: 'generated', status: 'ready' },
];

// Filter to only show ready datasets
const readyDatasets = existingDatasets.filter((d) => d.status === 'ready');

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
  const { showToast } = useToast();
  const stepParam = searchParams.get('step') as WizardStep | null;
  const preselectedDataset = searchParams.get('dataset');

  const [currentStep, setCurrentStep] = useState<WizardStep>(stepParam || 'agent');

  // Agent config state
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    evaluationName: '',
    name: '',
    description: '',
    customMcp: { name: '', description: '', url: '' },
  });

  // MCP Server selection state
  const [selectedMCPServers, setSelectedMCPServers] = useState<string[]>([]);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);

  // Dataset selection state
  const [datasetSelection, setDatasetSelection] = useState<DatasetSelection>({
    type: 'existing',
    existingId: preselectedDataset || undefined,
    existingName: preselectedDataset
      ? readyDatasets.find((d) => d.id === preselectedDataset)?.name
      : undefined,
  });

  // Update URL when step changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('step', currentStep);
    window.history.replaceState({}, '', url.toString());
  }, [currentStep]);

  const canProceedFromAgent =
    agentConfig.evaluationName && agentConfig.name && agentConfig.description;
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
    showToast('Evaluation started successfully', 'info');
    router.push('/evaluations');
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

            <div className="grid grid-cols-1 gap-6">
              {/* Evaluation Name - NEW FIELD AT TOP */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Evaluation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={agentConfig.evaluationName}
                  onChange={(e) =>
                    setAgentConfig({ ...agentConfig, evaluationName: e.target.value })
                  }
                  placeholder="e.g., Support Bot v2.4 - Safety Test"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
                />
              </div>

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

              {/* Agent Description */}
              <div>
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
            </div>

            {/* MCP Server Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">MCP Servers</label>
                <span className="text-xs text-slate-500">
                  {selectedMCPServers.length} of 3 selected
                </span>
              </div>

              {/* Browse MCP Servers Button */}
              <button
                type="button"
                onClick={() => setIsMcpModalOpen(true)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  'border border-slate-200 bg-white text-slate-700 hover:border-[#135bec] hover:bg-[#135bec]/5 hover:text-[#135bec]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-2'
                )}
              >
                <span className="material-symbols-outlined text-lg">extension</span>
                Browse MCP Servers
              </button>

              {/* Selected Servers Chips */}
              {selectedMCPServers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedMCPServers.map((serverId) => {
                    const server = MARKETPLACE_SERVERS.find((s) => s.id === serverId);
                    if (!server) return null;
                    return (
                      <span
                        key={serverId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 border-[#135bec] bg-[#135bec]/10 text-[#135bec]"
                      >
                        <span className="material-symbols-outlined text-base">{server.icon}</span>
                        {server.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMCPServers(
                              selectedMCPServers.filter((id) => id !== serverId)
                            )
                          }
                          className="ml-0.5 hover:bg-[#135bec]/20 rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec]"
                          aria-label={`Remove ${server.name}`}
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Custom MCP Server */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Custom MCP Server <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                  <div>
                    <label
                      htmlFor="custom-mcp-name"
                      className="block text-sm font-medium text-slate-600 mb-1.5"
                    >
                      MCP Name
                    </label>
                    <input
                      id="custom-mcp-name"
                      type="text"
                      value={agentConfig.customMcp.name}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          customMcp: { ...agentConfig.customMcp, name: e.target.value },
                        })
                      }
                      placeholder="e.g., Internal Pricing API"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="custom-mcp-description"
                      className="block text-sm font-medium text-slate-600 mb-1.5"
                    >
                      MCP Description
                    </label>
                    <input
                      id="custom-mcp-description"
                      type="text"
                      value={agentConfig.customMcp.description}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          customMcp: { ...agentConfig.customMcp, description: e.target.value },
                        })
                      }
                      placeholder="Describe what this MCP server does..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="custom-mcp-url"
                      className="block text-sm font-medium text-slate-600 mb-1.5"
                    >
                      MCP URL
                    </label>
                    <input
                      id="custom-mcp-url"
                      type="text"
                      value={agentConfig.customMcp.url}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          customMcp: { ...agentConfig.customMcp, url: e.target.value },
                        })
                      }
                      placeholder="mcp://your-server-url"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MCP Marketplace Modal */}
            <MCPMarketplaceModal
              isOpen={isMcpModalOpen}
              onClose={() => setIsMcpModalOpen(false)}
              selectedServers={selectedMCPServers}
              onSelectionChange={setSelectedMCPServers}
              maxSelections={3}
            />
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
                <p className="text-sm text-slate-500">Choose a completed dataset for evaluation</p>
              </div>
            </div>

            {/* Available Datasets Section - only ready datasets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700">Available Datasets</h3>
                <span className="text-xs text-slate-500">
                  {readyDatasets.length} datasets ready
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyDatasets.map((dataset) => {
                  const isSelected = datasetSelection.existingId === dataset.id;
                  return (
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
                        'relative flex flex-col gap-3 rounded-xl p-4 text-left transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-2',
                        isSelected
                          ? 'border-2 border-[#135bec] bg-[#135bec]/5'
                          : 'border border-slate-200 bg-white hover:border-[#135bec]/50 hover:bg-[#135bec]/5'
                      )}
                    >
                      {/* Selection indicator */}
                      <div className="absolute right-3 top-3">
                        <div
                          className={cn(
                            'flex size-5 items-center justify-center rounded-full border-2 transition-all',
                            isSelected
                              ? 'border-[#135bec] bg-[#135bec]'
                              : 'border-slate-300 bg-white'
                          )}
                        >
                          {isSelected && (
                            <span className="material-symbols-outlined text-[14px] text-white">
                              check
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100">
                        <span
                          className={cn(
                            'material-symbols-outlined text-2xl transition-colors',
                            isSelected ? 'text-[#135bec]' : 'text-slate-500'
                          )}
                        >
                          {dataset.type === 'uploaded' ? 'upload_file' : 'auto_awesome'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-1 pr-6">
                        <h4 className="font-semibold text-slate-900">{dataset.name}</h4>
                        <p className="text-sm text-slate-500">{dataset.size} queries</p>
                      </div>

                      {/* Type badge */}
                      <div className="mt-auto pt-1">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            dataset.type === 'uploaded'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          )}
                        >
                          {dataset.type === 'uploaded' ? 'Uploaded' : 'Generated'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Small text link to create dataset */}
              <p className="mt-6 text-sm text-slate-500">
                Need a new dataset?{' '}
                <Link
                  href="/datasets"
                  className="text-[#135bec] hover:text-[#135bec]/80 font-medium transition-colors"
                >
                  Go to Datasets
                </Link>
              </p>
            </div>
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
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#135bec]">smart_toy</span>
                    <span className="text-sm font-semibold text-slate-900">
                      Agent Configuration
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep('agent')}
                    className="text-xs font-medium text-[#135bec] hover:text-[#135bec]/80 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Evaluation Name */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Evaluation Name
                    </label>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {agentConfig.evaluationName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Agent Name
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">{agentConfig.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        MCP Servers
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {selectedMCPServers.length > 0
                          ? `${selectedMCPServers.length} selected`
                          : 'None'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Description
                    </label>
                    <p className="text-sm text-slate-700 mt-1 line-clamp-2">
                      {agentConfig.description}
                    </p>
                  </div>
                  {selectedMCPServers.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Selected Servers
                      </label>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedMCPServers.map((serverId) => {
                          const server = MARKETPLACE_SERVERS.find((s) => s.id === serverId);
                          return (
                            <span
                              key={serverId}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#135bec]/10 text-xs font-medium text-[#135bec]"
                            >
                              <span className="material-symbols-outlined text-xs">
                                {server?.icon || 'extension'}
                              </span>
                              {server?.name || serverId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {(agentConfig.customMcp.name ||
                    agentConfig.customMcp.description ||
                    agentConfig.customMcp.url) && (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Custom MCP Server
                      </label>
                      {agentConfig.customMcp.name && (
                        <div>
                          <label className="text-[10px] font-medium text-slate-400 uppercase">
                            Name
                          </label>
                          <p className="text-sm font-medium text-slate-900">
                            {agentConfig.customMcp.name}
                          </p>
                        </div>
                      )}
                      {agentConfig.customMcp.description && (
                        <div>
                          <label className="text-[10px] font-medium text-slate-400 uppercase">
                            Description
                          </label>
                          <p className="text-sm text-slate-700">
                            {agentConfig.customMcp.description}
                          </p>
                        </div>
                      )}
                      {agentConfig.customMcp.url && (
                        <div>
                          <label className="text-[10px] font-medium text-slate-400 uppercase">
                            URL
                          </label>
                          <p className="text-sm font-mono text-slate-700">
                            {agentConfig.customMcp.url}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dataset Summary */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#135bec]">folder_open</span>
                    <span className="text-sm font-semibold text-slate-900">Dataset</span>
                  </div>
                  <button
                    onClick={() => setCurrentStep('dataset')}
                    className="text-xs font-medium text-[#135bec] hover:text-[#135bec]/80 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Name
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {datasetSelection.existingName || 'No dataset selected'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        ID
                      </label>
                      <p className="text-sm font-mono text-slate-700 mt-1">
                        {datasetSelection.existingId || '--'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Queries
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {datasetSelection.existingId
                          ? readyDatasets.find((d) => d.id === datasetSelection.existingId)?.size
                          : '--'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Type
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {datasetSelection.existingId
                          ? readyDatasets.find((d) => d.id === datasetSelection.existingId)
                              ?.type === 'uploaded'
                            ? 'Uploaded'
                            : 'Generated'
                          : '--'}
                      </p>
                    </div>
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
                    {readyDatasets.find((d) => d.id === datasetSelection.existingId)?.size || 0}{' '}
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
