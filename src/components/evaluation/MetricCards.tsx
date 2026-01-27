'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';
import type { EvaluationMetrics } from '@/types/evaluation';

interface MetricCardsProps {
  metrics: EvaluationMetrics;
}

function DeltaIndicator({
  delta,
  suffix = '',
  positive = true,
}: {
  delta: number;
  suffix?: string;
  positive?: boolean;
}) {
  const isPositive = delta > 0;
  const isGood = positive ? isPositive : !isPositive;

  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${
        isGood ? 'text-[var(--accent-green)]' : 'text-[var(--error)]'
      }`}
    >
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}
      {delta.toFixed(1)}
      {suffix}
    </span>
  );
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const passRate = (metrics.testsPassed / metrics.testsTotal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="h-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CircularProgress
                value={metrics.overallScore}
                size={100}
                strokeWidth={8}
                showValue={false}
              />
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {metrics.overallScore.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <DeltaIndicator delta={metrics.scoreDelta} suffix="%" />
                  <span className="text-xs text-[var(--text-muted)]">vs Baseline (+1.2)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Pass Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="h-full">
          <CardContent className="pt-6">
            <p className="text-sm text-[var(--text-muted)] mb-2">Test Pass Rate</p>
            <p className="text-3xl font-bold text-[var(--foreground)] mb-3">
              {metrics.testsPassed}
              <span className="text-lg font-normal text-[var(--text-muted)]">
                /{metrics.testsTotal}
              </span>
            </p>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${passRate}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-[var(--accent-green)] rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avg Latency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="h-full">
          <CardContent className="pt-6">
            <p className="text-sm text-[var(--text-muted)] mb-2">Avg Latency</p>
            <p className="text-3xl font-bold text-[var(--foreground)]">
              {metrics.avgLatency.toFixed(1)}s
            </p>
            <div className="flex items-center gap-1 mt-1">
              <DeltaIndicator delta={metrics.latencyDelta * 1000} suffix="ms" positive={false} />
              <span className="text-xs text-[var(--text-muted)]">vs Baseline</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
