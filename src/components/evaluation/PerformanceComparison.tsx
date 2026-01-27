'use client';

import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart } from '@/components/ui/radar-chart';
import type { PerformanceData } from '@/types/evaluation';

interface PerformanceComparisonProps {
  performance: PerformanceData;
}

export function PerformanceComparison({ performance }: PerformanceComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Performance Comparison</CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[var(--text-muted)] rounded opacity-60" />
                <span className="text-[var(--text-muted)]">Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[var(--primary)] rounded" />
                <span className="text-[var(--text-muted)]">Current Run</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Radar Chart */}
            <div className="flex-shrink-0">
              <RadarChart
                labels={performance.labels}
                baselineData={performance.baseline}
                currentData={performance.current}
                size={280}
                showBaseline={true}
              />
            </div>

            {/* Summary Metrics */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {performance.summary.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{item.value}%</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
