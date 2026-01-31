'use client';

import { cn } from '@/lib/utils';
import { SlideOverPanel } from '@/components/ui/slide-over-panel';
import { Button } from '@/components/ui/button';

/**
 * EvaluationResult interface matching the structure from evaluations/[id]/page.tsx
 * Note: The interface in the requirements differs slightly from the actual page implementation.
 * This component supports both variations.
 */
interface EvaluationResult {
  id: number;
  query: string;
  expectedOutput: string; // Displayed as "Metric Reasoning"
  actualOutput: string; // Displayed as "Agent Response"
  latency: number;
  score: number;
  status: 'passed' | 'failed' | 'warning';
}

interface DebugViewPanelProps {
  /** The evaluation result to display */
  result: EvaluationResult | null;
  /** Whether the panel is open */
  isOpen: boolean;
  /** Callback when the panel should close */
  onClose: () => void;
}

/**
 * Status badge styling based on result status
 */
function getStatusStyles(status: EvaluationResult['status']) {
  switch (status) {
    case 'passed':
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'PASSED',
        icon: 'check_circle',
      };
    case 'failed':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'FAILED',
        icon: 'cancel',
      };
    case 'warning':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'WARNING',
        icon: 'warning',
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        label: 'UNKNOWN',
        icon: 'help',
      };
  }
}

/**
 * Get score color based on percentage value
 */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

/**
 * Get progress bar color based on score
 */
function getProgressBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

/**
 * DebugViewPanel - Detailed view of a single evaluation result.
 *
 * Displays comprehensive information about an evaluation query including:
 * - Query ID and status badge
 * - Full query text
 * - Agent response (actualOutput)
 * - Metric reasoning (expectedOutput)
 * - Performance metrics (latency and score)
 */
export function DebugViewPanel({ result, isOpen, onClose }: DebugViewPanelProps) {
  // Early return if no result - panel still mounts for animation
  if (!result) {
    return (
      <SlideOverPanel isOpen={isOpen} onClose={onClose} title="Debug View" width="lg">
        <div className="flex items-center justify-center h-64 text-slate-500">
          No result selected
        </div>
      </SlideOverPanel>
    );
  }

  const statusStyles = getStatusStyles(result.status);

  return (
    <SlideOverPanel
      isOpen={isOpen}
      onClose={onClose}
      title={`Query #${result.id}`}
      description="Detailed evaluation result"
      width="lg"
    >
      <div className="flex flex-col">
        {/* Header with Status Badge */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Status</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                  statusStyles.bg,
                  statusStyles.text,
                  statusStyles.border
                )}
              >
                <span className="material-symbols-outlined text-sm">{statusStyles.icon}</span>
                {statusStyles.label}
              </span>
            </div>
            <span className="text-sm font-mono text-slate-400">ID: {result.id}</span>
          </div>
        </div>

        {/* Query Section */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#135bec] text-lg">help_outline</span>
            Query
          </h3>
          <div className="bg-slate-100 rounded-lg p-4">
            <p className="text-sm font-mono text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
              {result.query}
            </p>
          </div>
        </div>

        {/* Agent Response Section */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#135bec] text-lg">smart_toy</span>
            Agent Response
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
              {result.actualOutput}
            </p>
          </div>
        </div>

        {/* Metric Reasoning Section */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#135bec] text-lg">psychology</span>
            Metric Reasoning
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
              {result.expectedOutput}
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#135bec] text-lg">analytics</span>
            Metrics
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Latency Metric */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Latency
                </span>
                <span className="material-symbols-outlined text-slate-400 text-lg">speed</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {result.latency}
                <span className="text-sm font-normal text-slate-500 ml-1">ms</span>
              </div>
            </div>

            {/* Score Metric */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Score
                </span>
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  trending_up
                </span>
              </div>
              <div className={cn('text-2xl font-bold', getScoreColor(result.score))}>
                {result.score}
                <span className="text-sm font-normal text-slate-500 ml-1">%</span>
              </div>
              {/* Visual Score Bar */}
              <div className="mt-3">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500 ease-out',
                      getProgressBarColor(result.score)
                    )}
                    style={{ width: `${Math.min(result.score, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </SlideOverPanel>
  );
}

export type { EvaluationResult, DebugViewPanelProps };
