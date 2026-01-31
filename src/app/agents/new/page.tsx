// Create New Agent - Step 1: Agent Type
// Route: /agents/new

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const agentTypes = [
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Conversational AI for customer support, FAQs, and help desk.',
    icon: 'chat',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'data',
    name: 'Data Agent',
    description: 'Analyze, process, and transform structured and unstructured data.',
    icon: 'analytics',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'browser',
    name: 'Browser Agent',
    description: 'Automate web browsing, scraping, and form submissions.',
    icon: 'public',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 'content',
    name: 'Content Agent',
    description: 'Generate, edit, and optimize written content at scale.',
    icon: 'edit_note',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    id: 'custom',
    name: 'Custom Agent',
    description: 'Build a custom agent with your own tools and capabilities.',
    icon: 'build',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];

export default function NewAgentPage() {
  const router = useRouter();
  const [agentName, setAgentName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Check if description is required (only for custom agents)
  const isDescriptionRequired = selectedType === 'custom';
  const isDescriptionValid = !isDescriptionRequired || description.trim() !== '';
  const canContinue = selectedType && isDescriptionValid;

  const handleContinue = () => {
    if (canContinue) {
      // Pass data via URL params (in production, you'd use state management or API)
      const params = new URLSearchParams({
        name: agentName,
        type: selectedType,
        description: description,
      });
      router.push(`/agents/configure?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/agents" className="hover:text-[#135bec] transition-colors">
            Agents
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-slate-900 font-medium">Create New Agent</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Agent</h1>
        <p className="text-slate-500 text-sm">Configure your AI agent in just a few steps.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-[#135bec] text-white text-sm font-bold">
            1
          </div>
          <span className="text-sm font-medium text-slate-900">Agent Type</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-slate-200 text-slate-500 text-sm font-bold">
            2
          </div>
          <span className="text-sm text-slate-500">Configuration</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-slate-200 text-slate-500 text-sm font-bold">
            3
          </div>
          <span className="text-sm text-slate-500">Review</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {/* Agent Name */}
        <div className="mb-6">
          <label htmlFor="agent-name" className="block text-sm font-bold text-slate-900 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            id="agent-name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all"
            placeholder="e.g., Support Bot, Data Analyst..."
          />
        </div>

        {/* Agent Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-900 mb-3">Select Agent Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  selectedType === type.id
                    ? 'border-[#135bec] bg-[#135bec]/5'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`size-10 rounded-lg ${type.iconBg} flex items-center justify-center ${type.iconColor} shrink-0`}
                >
                  <span className="material-symbols-outlined">{type.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{type.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {type.description}
                  </p>
                </div>
                {selectedType === type.id && (
                  <span className="material-symbols-outlined text-[#135bec] ml-auto shrink-0">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-bold text-slate-900 mb-2">
            Description{' '}
            {isDescriptionRequired ? (
              <span className="text-red-500 font-normal">(Required)</span>
            ) : (
              <span className="text-slate-400 font-normal">(Optional)</span>
            )}
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all resize-none ${
              isDescriptionRequired && description.trim() === ''
                ? 'border-red-300 bg-red-50/50'
                : 'border-slate-200'
            }`}
            placeholder={
              isDescriptionRequired
                ? 'Describe what your custom agent will do...'
                : 'Briefly describe what this agent will do...'
            }
          />
          {isDescriptionRequired && description.trim() === '' && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              Description is required for custom agents
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Link
            href="/agents"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              canContinue
                ? 'bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm shadow-[#135bec]/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
