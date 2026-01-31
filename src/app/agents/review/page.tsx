// Create New Agent - Step 3: Review
// Route: /agents/review
// Final review before creating the agent

'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

// ============================================================================
// MCP ID TO DISPLAY INFO MAPPING
// ============================================================================
const mcpDisplayInfo: Record<string, { name: string; icon: string }> = {
  // Google Suite
  gmail: { name: 'Gmail', icon: 'mail' },
  'google-calendar': { name: 'Google Calendar', icon: 'calendar_month' },
  'google-docs': { name: 'Google Docs', icon: 'description' },
  'google-drive': { name: 'Google Drive', icon: 'cloud' },
  'google-sheets': { name: 'Google Sheets', icon: 'table_chart' },

  // Communication
  slack: { name: 'Slack', icon: 'chat' },
  discord: { name: 'Discord', icon: 'forum' },
  teams: { name: 'Microsoft Teams', icon: 'groups' },
  telegram: { name: 'Telegram', icon: 'send' },

  // Dev Tools
  github: { name: 'GitHub', icon: 'code' },
  gitlab: { name: 'GitLab', icon: 'merge_type' },
  linear: { name: 'Linear', icon: 'linear_scale' },
  jira: { name: 'Jira', icon: 'bug_report' },
  confluence: { name: 'Confluence', icon: 'article' },

  // Productivity
  notion: { name: 'Notion', icon: 'edit_note' },
  airtable: { name: 'Airtable', icon: 'grid_view' },
  trello: { name: 'Trello', icon: 'view_kanban' },
  asana: { name: 'Asana', icon: 'task_alt' },
  monday: { name: 'Monday.com', icon: 'calendar_view_week' },

  // Database
  postgresql: { name: 'PostgreSQL', icon: 'database' },
  mysql: { name: 'MySQL', icon: 'storage' },
  mongodb: { name: 'MongoDB', icon: 'data_object' },
  supabase: { name: 'Supabase', icon: 'bolt' },
  firebase: { name: 'Firebase', icon: 'local_fire_department' },

  // Cloud
  aws: { name: 'AWS', icon: 'cloud_queue' },
  gcp: { name: 'Google Cloud', icon: 'cloud_circle' },
  vercel: { name: 'Vercel', icon: 'rocket_launch' },

  // Design
  figma: { name: 'Figma', icon: 'palette' },

  // Automation
  playwright: { name: 'Playwright', icon: 'public' },
  puppeteer: { name: 'Puppeteer', icon: 'smart_toy' },

  // File System
  filesystem: { name: 'Local Files', icon: 'folder' },
  s3: { name: 'Amazon S3', icon: 'cloud_upload' },
};

// Agent type display info
const agentTypeInfo: Record<
  string,
  { name: string; icon: string; iconBg: string; iconColor: string }
> = {
  chat: {
    name: 'Chat Agent',
    icon: 'chat',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  data: {
    name: 'Data Agent',
    icon: 'analytics',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  browser: {
    name: 'Browser Agent',
    icon: 'public',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  content: {
    name: 'Content Agent',
    icon: 'edit_note',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  custom: {
    name: 'Custom Agent',
    icon: 'build',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
};

// Query type display info
const queryTypeInfo: Record<string, { name: string; color: string }> = {
  happy_path: { name: 'Happy Path', color: 'bg-green-100 text-green-700' },
  edge_cases: { name: 'Edge Cases', color: 'bg-amber-100 text-amber-700' },
  adversarial: { name: 'Adversarial', color: 'bg-red-100 text-red-700' },
  domain_specific: { name: 'Domain-Specific', color: 'bg-blue-100 text-blue-700' },
};

// Creation steps
const creationSteps = [
  { id: 1, label: 'Validating configuration', duration: 800 },
  { id: 2, label: 'Setting up MCP connections', duration: 1000 },
  { id: 3, label: 'Generating test queries', duration: 1200, aiOnly: true },
  { id: 4, label: 'Initializing agent', duration: 800 },
];

// Warning type
interface ValidationWarning {
  type: 'warning' | 'error';
  message: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get params from URL
  const agentName = searchParams.get('name') || '';
  const agentType = searchParams.get('type') || 'custom';
  const mcpsParam = searchParams.get('mcps') || '';
  const queryMethod = (searchParams.get('queryMethod') as 'upload' | 'ai' | 'none') || 'none';
  const aiQueryCount = parseInt(searchParams.get('aiQueryCount') || '50', 10);
  const aiQueryTypesParam = searchParams.get('aiQueryTypes') || '';

  // Parse MCPs and query types
  const mcpIds = mcpsParam ? mcpsParam.split(',').filter(Boolean) : [];
  const aiQueryTypes = aiQueryTypesParam ? aiQueryTypesParam.split(',').filter(Boolean) : [];

  // Validation warnings
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  // Creation animation state
  const [isCreating, setIsCreating] = useState(false);
  const [creationStep, setCreationStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate on mount
  useEffect(() => {
    const newWarnings: ValidationWarning[] = [];

    if (!agentName.trim()) {
      newWarnings.push({ type: 'error', message: 'Agent name is required' });
    }

    if (mcpIds.length === 0) {
      newWarnings.push({
        type: 'warning',
        message: 'No MCP servers configured. Your agent may have limited capabilities.',
      });
    }

    if (queryMethod === 'none') {
      newWarnings.push({
        type: 'error',
        message: 'No query configuration specified. Please configure test queries.',
      });
    }

    setWarnings(newWarnings);
  }, [agentName, mcpIds.length, queryMethod]);

  // Check if there are any errors (blocks creation)
  const hasErrors = warnings.some((w) => w.type === 'error');

  // Get agent type display info
  const typeInfo = agentTypeInfo[agentType] || agentTypeInfo.custom;

  // Get today's date formatted
  const createdDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate estimated run summary
  const totalTests = queryMethod === 'ai' ? aiQueryCount : queryMethod === 'upload' ? 100 : 0;
  const estTime = Math.ceil(totalTests * 0.5); // ~0.5 seconds per test
  const estCost = (totalTests * 0.002).toFixed(2); // ~$0.002 per test

  // Get MCP display info
  const getMcpInfo = (id: string) => {
    if (id.startsWith('custom-')) {
      return { name: id.replace('custom-', 'Custom: '), icon: 'link' };
    }
    return mcpDisplayInfo[id] || { name: id, icon: 'extension' };
  };

  // Build back URL with preserved params
  const backUrl = `/agents/configure?name=${encodeURIComponent(agentName)}&type=${agentType}`;

  // Handle create agent
  const handleCreateAgent = async () => {
    if (hasErrors) return;

    setIsCreating(true);
    setCreationStep(0);

    // Filter steps based on query method
    const steps = creationSteps.filter((step) => !step.aiOnly || queryMethod === 'ai');

    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      setCreationStep(i + 1);
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
    }

    // Show success
    setShowSuccess(true);
  };

  // Get progress percentage
  const getProgressPercent = () => {
    const steps = creationSteps.filter((step) => !step.aiOnly || queryMethod === 'ai');
    return (creationStep / steps.length) * 100;
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/agents" className="hover:text-[#135bec] transition-colors">
            Agents
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-slate-900 font-medium">Review Agent</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Agent</h1>
        <p className="text-slate-500 text-sm">
          Review your configuration before creating the agent
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-[#135bec] text-white text-sm font-bold">
            <span className="material-symbols-outlined text-lg">check</span>
          </div>
          <span className="text-sm font-medium text-[#135bec]">Agent Type</span>
        </div>
        <div className="flex-1 h-px bg-[#135bec] mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-[#135bec] text-white text-sm font-bold">
            <span className="material-symbols-outlined text-lg">check</span>
          </div>
          <span className="text-sm font-medium text-[#135bec]">Configuration</span>
        </div>
        <div className="flex-1 h-px bg-[#135bec] mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-[#135bec] text-white text-sm font-bold">
            3
          </div>
          <span className="text-sm font-medium text-slate-900">Review</span>
        </div>
      </div>

      {/* Validation Warnings */}
      {warnings.length > 0 && (
        <div className="flex flex-col gap-3">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                warning.type === 'error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  warning.type === 'error' ? 'text-red-500' : 'text-amber-500'
                }`}
              >
                {warning.type === 'error' ? 'error' : 'warning'}
              </span>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    warning.type === 'error' ? 'text-red-700' : 'text-amber-700'
                  }`}
                >
                  {warning.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================= */}
      {/* SECTION A: Agent Details */}
      {/* ============================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-[#135bec]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#135bec]">smart_toy</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Agent Details</h2>
          </div>
          <Link
            href="/agents/new"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#135bec] hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Agent Name */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Agent Name
            </p>
            <p className="text-base font-bold text-slate-900">{agentName || '(Not specified)'}</p>
          </div>

          {/* Agent Type */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Agent Type
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`size-6 rounded-md ${typeInfo.iconBg} flex items-center justify-center`}
              >
                <span className={`material-symbols-outlined text-base ${typeInfo.iconColor}`}>
                  {typeInfo.icon}
                </span>
              </div>
              <p className="text-base font-bold text-slate-900">{typeInfo.name}</p>
            </div>
          </div>

          {/* Created Date */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Created Date
            </p>
            <p className="text-base font-bold text-slate-900">{createdDate}</p>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* SECTION B: MCP Servers */}
      {/* ============================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-[#135bec]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#135bec]">dns</span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">MCP Servers</h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                ({mcpIds.length} configured)
              </span>
            </div>
          </div>
          <Link
            href={backUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#135bec] hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </Link>
        </div>

        {mcpIds.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {mcpIds.map((id) => {
              const info = getMcpInfo(id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm"
                >
                  <span className="material-symbols-outlined text-base text-[#135bec]">
                    {info.icon}
                  </span>
                  <span className="font-medium text-slate-700">{info.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <span className="material-symbols-outlined text-amber-500">warning</span>
            <p className="text-sm text-amber-700">
              No MCP servers configured. Your agent will have limited capabilities.
            </p>
          </div>
        )}
      </div>

      {/* ============================================= */}
      {/* SECTION C: Query Configuration */}
      {/* ============================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600">quiz</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Query Configuration</h2>
          </div>
          <Link
            href={backUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#135bec] hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </Link>
        </div>

        {queryMethod === 'ai' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-gradient-to-br from-purple-500 to-[#135bec] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-base">auto_awesome</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">AI-Generated</p>
                <p className="text-xs text-slate-500">{aiQueryCount} test queries</p>
              </div>
            </div>

            {aiQueryTypes.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Query Types</p>
                <div className="flex flex-wrap gap-2">
                  {aiQueryTypes.map((type) => {
                    const info = queryTypeInfo[type] || {
                      name: type,
                      color: 'bg-slate-100 text-slate-700',
                    };
                    return (
                      <span
                        key={type}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.color}`}
                      >
                        {info.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {queryMethod === 'upload' && (
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-base">
                upload_file
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Uploaded Dataset</p>
              <p className="text-xs text-slate-500">Custom test queries from file</p>
            </div>
          </div>
        )}

        {queryMethod === 'none' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-700">
              No query configuration specified. Please go back and configure test queries.
            </p>
          </div>
        )}
      </div>

      {/* ============================================= */}
      {/* SECTION D: Estimated Run Summary */}
      {/* ============================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600">summarize</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Estimated Run Summary</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Tests */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-1">Total Tests</p>
            <p className="text-2xl font-bold text-slate-900">{totalTests}</p>
          </div>

          {/* Est. Time */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-1">Est. Time</p>
            <p className="text-2xl font-bold text-slate-900">
              {estTime < 60 ? `${estTime}s` : `${Math.ceil(estTime / 60)}m`}
            </p>
          </div>

          {/* Est. Cost */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-1">Est. Cost</p>
            <p className="text-2xl font-bold text-slate-900">${estCost}</p>
          </div>

          {/* Status */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span
                className={`size-2.5 rounded-full ${hasErrors ? 'bg-red-500' : 'bg-green-500'}`}
              ></span>
              <p className={`text-base font-bold ${hasErrors ? 'text-red-600' : 'text-green-600'}`}>
                {hasErrors ? 'Invalid' : 'Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between py-4">
        <Link
          href={backUrl}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </Link>
        <button
          type="button"
          onClick={handleCreateAgent}
          disabled={hasErrors || isCreating}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
            hasErrors || isCreating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm shadow-[#135bec]/30'
          }`}
        >
          {isCreating ? (
            <>
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Creating...
            </>
          ) : (
            <>
              Create Agent
              <span className="material-symbols-outlined text-lg">check</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================= */}
      {/* CREATION ANIMATION OVERLAY */}
      {/* ============================================= */}
      {isCreating && !showSuccess && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="size-16 rounded-full bg-[#135bec]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#135bec] text-3xl animate-pulse">
                  smart_toy
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Creating Your Agent</h3>
              <p className="text-sm text-slate-500 mt-1">
                Please wait while we set everything up...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-[#135bec] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercent()}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {creationSteps
                .filter((step) => !step.aiOnly || queryMethod === 'ai')
                .map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = creationStep === stepNumber;
                  const isComplete = creationStep > stepNumber;
                  const isPending = creationStep < stepNumber;

                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`size-6 rounded-full flex items-center justify-center transition-all ${
                          isComplete ? 'bg-green-500' : isActive ? 'bg-[#135bec]' : 'bg-slate-200'
                        }`}
                      >
                        {isComplete ? (
                          <span className="material-symbols-outlined text-white text-sm">
                            check
                          </span>
                        ) : isActive ? (
                          <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <span className="size-2 rounded-full bg-slate-400"></span>
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          isComplete
                            ? 'text-green-600 font-medium'
                            : isActive
                              ? 'text-[#135bec] font-medium'
                              : isPending
                                ? 'text-slate-400'
                                : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* SUCCESS MODAL */}
      {/* ============================================= */}
      {showSuccess && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 ease-out animate-[scaleIn_0.3s_ease-out_forwards]">
            <style jsx>{`
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>

            <div className="flex flex-col items-center text-center">
              {/* Celebration Icon */}
              <div className="relative mb-6">
                <div className="size-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="material-symbols-outlined text-white text-4xl">check</span>
                </div>
                <div className="absolute -top-1 -right-1 size-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-yellow-800 text-sm">
                    celebration
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Agent Created Successfully!
              </h3>
              <p className="text-slate-500 mb-1">Your new agent is ready to go</p>
              <p className="text-lg font-bold text-[#135bec] mb-8">{agentName}</p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={() => router.push('/evaluations')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm shadow-[#135bec]/30 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                  Run First Evaluation
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/agents')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">smart_toy</span>
                    View Agent Details
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">dashboard</span>
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin size-8 border-2 border-slate-200 border-t-[#135bec] rounded-full"></div>
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
