'use client';

import { motion } from 'framer-motion';
import { Download, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { EvaluationRun } from '@/types/evaluation';

interface EvaluationHeaderProps {
  run: EvaluationRun;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} min ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export function EvaluationHeader({ run }: EvaluationHeaderProps) {
  const breadcrumbItems = [
    { label: run.projectName, href: '/projects' },
    { label: `Run #${run.id}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Evaluation Results</h1>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              run.status === 'completed'
                ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                : run.status === 'running'
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'bg-[var(--error)]/10 text-[var(--error)]'
            }`}
          >
            {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button size="sm">
            <RotateCcw className="w-4 h-4" />
            Re-run Evaluation
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
        <span>Started {formatDate(run.startedAt)}</span>
        <span className="text-[var(--border)]">•</span>
        <span>Duration: {formatDuration(run.duration)}</span>
      </div>
    </motion.div>
  );
}
