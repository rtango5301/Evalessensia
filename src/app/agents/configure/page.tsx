// Create New Agent - Step 2: Configuration
// Route: /agents/configure
// TODO: Implement with Stitch design

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConfigureContent() {
  const searchParams = useSearchParams();
  const agentName = searchParams.get('name') || 'New Agent';
  const agentType = searchParams.get('type') || 'custom';

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/agents" className="hover:text-[#135bec] transition-colors">
            Agents
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-slate-900 font-medium">Configure Agent</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configure Agent</h1>
        <p className="text-slate-500 text-sm">
          Set up {agentName} ({agentType})
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
            2
          </div>
          <span className="text-sm font-medium text-slate-900">Configuration</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-slate-200 text-slate-500 text-sm font-bold">
            3
          </div>
          <span className="text-sm text-slate-500">Review</span>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">tune</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Configuration Step</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          This page will contain the agent configuration options including model selection, system
          prompts, and tool configurations.
        </p>
        <p className="text-xs text-slate-400 mb-6">Awaiting Stitch design implementation</p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Link
            href="/agents/new"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-lg"
          >
            ← Back
          </Link>
          <Link
            href={`/agents/review?name=${encodeURIComponent(agentName)}&type=${agentType}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm shadow-[#135bec]/30 transition-all"
          >
            Continue
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin size-8 border-2 border-slate-200 border-t-[#135bec] rounded-full"></div>
        </div>
      }
    >
      <ConfigureContent />
    </Suspense>
  );
}
