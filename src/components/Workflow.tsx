'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

const workflowSteps = [
  {
    number: '01',
    title: 'Configure Agent',
    description: 'Add agent URL, MCP endpoints, and description',
  },
  {
    number: '02',
    title: 'Generate Queries',
    description: 'AI creates synthetic test cases from your domain',
  },
  {
    number: '03',
    title: 'Run Evaluation',
    description: 'TensorEval scrapes and tests your agent',
  },
  {
    number: '04',
    title: 'View Metrics',
    description: 'Accuracy, Latency, Cost, Safety, Efficiency',
  },
  {
    number: '05',
    title: 'A/B Comparison',
    description: 'Compare with previous version side-by-side',
  },
  {
    number: '06',
    title: 'Ship with Confidence',
    description: 'All checks passed, ready to deploy',
  },
];

export function Workflow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="workflow" className="py-[100px] px-6 bg-[var(--bg-subtle)] scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-base uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-4">
            Workflow
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Evaluate, compare, deploy
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            See how TensorEval automates your agent testing workflow
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12">
          {/* Steps List */}
          <div className="flex flex-col gap-2">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all border ${
                  activeStep === index
                    ? 'bg-white border-[var(--primary)] shadow-sm'
                    : 'border-transparent hover:bg-white hover:border-[var(--border)] hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                    activeStep === index
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {step.number}
                </div>
                <div>
                  <h4 className="font-semibold text-[0.95rem] mb-1">{step.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Screen Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg min-h-[500px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeStep === 0 && <ConfigureScreen />}
                {activeStep === 1 && <QueryGeneratorScreen />}
                {activeStep === 2 && <RunningScreen />}
                {activeStep === 3 && <MetricsScreen />}
                {activeStep === 4 && <ABComparisonScreen />}
                {activeStep === 5 && <ShipScreen />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WindowHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[var(--ui-header)] border-b border-[var(--ui-border)]">
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
      </div>
      <span className="flex-1 text-center text-sm text-[var(--text-secondary)] font-medium">
        {title}
      </span>
    </div>
  );
}

function ConfigureScreen() {
  return (
    <>
      <WindowHeader title="Configure New Agent" />
      <div className="p-5 grid grid-cols-[1.1fr_0.9fr] gap-5">
        {/* Left - Form Fields */}
        <div className="space-y-4">
          <FormField label="Agent Name" value="Support Bot v2.4" />
          <FormField label="Agent URL" value="https://api.acme.com/agent/support" />
          <FormField label="MCP Server URLs" value="https://mcp.acme.com/tools" optional />
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Agent Description
            </label>
            <div className="w-full p-2.5 border border-[var(--border)] rounded-md bg-[var(--bg-subtle)] text-sm min-h-[70px] text-[var(--text-secondary)]">
              Customer support agent for AcmeCorp. Handles order inquiries, refunds, shipping
              questions. Should be helpful but never reveal internal processes.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Test Count" value="50" />
            <FormField label="Timeout" value="30s" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#f9fafb' }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 bg-white border border-[var(--border)] rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-semibold flex items-center gap-1 shadow-lg shadow-[var(--primary)]/25 transition-all"
            >
              Start Evaluation
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* Right - Integration Map */}
        <div className="bg-[var(--bg-subtle)] rounded-xl p-4 flex flex-col">
          <div className="mb-3">
            <h4 className="font-semibold text-sm">Integration Map</h4>
            <p className="text-xs text-[var(--text-muted)]">Select source to bridge connection</p>
          </div>

          {/* Connection Visualization */}
          <div className="flex-1 flex items-center justify-center relative py-4">
            {/* TensorEval Node */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </motion.div>
              <span className="text-[9px] font-semibold text-[var(--primary)] mt-2 uppercase tracking-wide">
                TensorEval
              </span>

              {/* Floating icons around TensorEval */}
              <motion.div
                animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="absolute -left-1 top-1/2 -translate-y-6 w-4 h-4 bg-gray-200 rounded-full"
              />
              <motion.div
                animate={{ y: [0, 3, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="absolute left-2 top-1/2 translate-y-4 w-6 h-6 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center"
              >
                <span className="text-[var(--primary)] text-xs">⚡</span>
              </motion.div>
            </div>

            {/* Connection Line */}
            <div className="mx-4 flex items-center">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 border-t-2 border-dashed border-gray-300"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mx-1"
              >
                <span className="text-[10px] text-gray-400">↻</span>
              </motion.div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="w-8 border-t-2 border-dashed border-gray-300"
              />
            </div>

            {/* Your Agent Node */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="w-14 h-14 border-2 border-dashed border-[var(--primary)] rounded-xl flex items-center justify-center bg-white"
              >
                <span className="text-[var(--primary)] text-xl">🤖</span>
              </motion.div>
              <span className="text-[9px] font-semibold text-[var(--primary)] mt-2 uppercase tracking-wide">
                Your Agent
              </span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between py-2 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[var(--accent-green)]"
              />
              <span className="text-xs font-medium">
                API Connection
                <br />
                <span className="text-[var(--accent-green)]">Active</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <span>⚡</span>
              <span>
                <strong className="text-[var(--foreground)]">42ms</strong> latency
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[var(--primary)]/5 rounded-lg p-2.5 mt-2">
            <div className="flex gap-2">
              <span className="text-[var(--primary)] text-sm">ℹ</span>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                The connection map visualizes how TensorEval interacts with your agent via the
                specified API endpoint. Ensure CORS is enabled if using browser-based testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QueryGeneratorScreen() {
  const [activeTab, setActiveTab] = useState<'standard' | 'edge' | 'adversarial'>('edge');

  const tabs = [
    { id: 'standard' as const, label: 'Standard', count: 12 },
    { id: 'edge' as const, label: 'Edge Cases', count: 18 },
    { id: 'adversarial' as const, label: 'Adversarial', count: 17 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-1">Synthetic Query Generation</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          47 queries generated across your domain sources.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-[var(--border-light)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm transition-colors ${
              activeTab === tab.id
                ? 'font-medium text-[var(--primary)] border-b-2 border-[var(--primary)] -mb-[1px]'
                : 'text-[var(--text-secondary)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}{' '}
            <span
              className={`ml-1 px-1.5 py-0.5 text-xs rounded ${
                activeTab === tab.id
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Query Cards */}
      <div className="space-y-3 mb-5">
        <QueryCard
          category="SUBSCRIPTION"
          categoryColor="var(--primary)"
          stars={3}
          query='"What happens if I cancel my subscription 2 minutes before renewal?"'
          latency="450ms"
          source="API Docs"
        />
        <QueryCard
          category="REFUNDS"
          categoryColor="var(--warning)"
          stars={4}
          query='"Can I get a refund for an order from 2019 that was paid with a voucher which has since expired?"'
          latency="1.2s"
          source="Historical Logs"
        />
        <QueryCard
          category="API ERROR"
          categoryColor="var(--error)"
          stars={5}
          query={`"Send a request with a Content-Type header of 'image/png' but body content in XML format."`}
          latency="320ms"
          source="API Docs"
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4">
        <motion.button
          whileHover={{ scale: 1.05, color: 'var(--primary)' }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-[var(--text-secondary)] flex items-center gap-1 transition-colors"
        >
          <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
            +
          </motion.span>{' '}
          Add Custom Query
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[var(--primary)]/30 transition-all"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ▶
          </motion.span>
          Run Evaluation
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
            →
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}

function RunningScreen() {
  const testCases = [
    { id: 'ID-101', status: 'success', name: 'Tool Retrieval Test' },
    { id: 'ID-102', status: 'running', name: 'Multimodal Input Parsing' },
    { id: 'ID-103', status: 'running', name: 'SQL Injection Probe' },
    { id: 'ID-104', status: 'retrying', name: 'Token Limit Stress' },
    { id: 'ID-105', status: 'success', name: 'Context Window Test' },
    { id: 'ID-106', status: 'success', name: 'Adversarial Logic' },
    { id: 'ID-107', status: 'running', name: 'Rate Limit Recovery' },
    { id: 'ID-108', status: 'success', name: 'JSON Schema Valid' },
    { id: 'ID-109', status: 'queued', name: 'Pending execution...' },
    { id: 'ID-110', status: 'queued', name: 'Pending execution...' },
    { id: 'ID-111', status: 'queued', name: 'Pending execution...' },
    { id: 'ID-112', status: 'queued', name: 'Pending execution...' },
  ];

  return (
    <>
      <WindowHeader title="Evaluation Running" />
      <div className="p-5">
        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full mx-auto mb-2"
          />
          <h3 className="text-lg font-bold mb-1">Running Parallel Tests</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Processing 47 synthetic test cases against agent v2.4-alpha
          </p>
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {testCases.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
            >
              <TestCard
                id={test.id}
                status={test.status as 'success' | 'running' | 'retrying' | 'queued'}
                name={test.name}
              />
            </motion.div>
          ))}
        </div>

        {/* Overall Progress Section */}
        <div className="border-t border-[var(--border-light)] pt-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Overall Progress
              </p>
              <p className="text-xl font-bold">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[var(--accent-green)] inline-block"
                >
                  22
                </motion.span>{' '}
                of 47 tests complete
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Estimated Remaining
              </p>
              <motion.p
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xl font-bold text-[var(--accent-green)]"
              >
                2m 34s
              </motion.p>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex mb-3 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '38%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-[var(--accent-green)] h-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '9%' }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="bg-[var(--primary)] h-full relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '2%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="bg-amber-400 h-full"
            />
            <div className="bg-gray-200 h-full flex-1" />
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-5 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" /> 18 Success
            </span>
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[var(--primary)]"
              />{' '}
              4 Executing
            </span>
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-amber-400"
              />{' '}
              1 Retrying
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-300" /> 24 Queued
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function MetricsScreen() {
  const metrics = [
    {
      icon: '✓',
      iconBg: 'var(--primary)',
      name: 'Task Completion',
      desc: 'Percentage of successful task resolutions',
      value: '98.2%',
      status: 'EXCELLENT',
      statusColor: 'var(--accent-green)',
      trendColor: '#22c55e',
    },
    {
      icon: '📊',
      iconBg: 'var(--primary)',
      name: 'Accuracy',
      desc: 'Precision vs ground truth data',
      value: '94.2%',
      change: '+2.1%',
      status: 'PASSED',
      statusColor: 'var(--accent-green)',
      trendColor: '#8b5cf6',
    },
    {
      icon: '⏱',
      iconBg: '#f97316',
      name: 'Latency',
      desc: 'Avg response time per query',
      value: '1.2s',
      change: '-0.3s',
      status: 'EXCELLENT',
      statusColor: 'var(--accent-green)',
      trendColor: '#f97316',
    },
    {
      icon: '💰',
      iconBg: 'var(--accent-green)',
      name: 'Cost',
      desc: 'Tokens & infrastructure per run',
      value: '$0.047',
      status: 'OPTIMIZED',
      statusColor: '#6b7280',
      trendColor: '#22c55e',
    },
    {
      icon: '🛡',
      iconBg: '#ef4444',
      name: 'Safety',
      desc: 'Jailbreak & PII leak protection',
      value: '100%',
      status: 'SECURE',
      statusColor: 'var(--accent-green)',
      trendColor: '#ef4444',
      flat: true,
    },
    {
      icon: '⚡',
      iconBg: 'var(--primary)',
      name: 'Efficiency',
      desc: 'Token-to-answer compression',
      value: '89%',
      status: 'STABLE',
      statusColor: '#6b7280',
      trendColor: '#6366f1',
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold">Support Bot v2.4</h3>
            <span className="px-2 py-0.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded text-[10px] font-semibold uppercase">
              Passed
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Run #2847 completed • Feb 24, 2024</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-white border border-[var(--border)] rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          >
            <motion.span whileHover={{ y: [0, -2, 0] }} transition={{ duration: 0.3 }}>
              📥
            </motion.span>{' '}
            Export PDF Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)' }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-md shadow-[var(--primary)]/25 transition-all"
          >
            Compare Versions
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              →
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1.3fr_0.8fr_0.6fr_1fr] gap-2 px-3 py-2 text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-light)]">
        <span>Metric</span>
        <span>Current Score</span>
        <span>Status</span>
        <span className="text-right">Trend (Last 10 Runs)</span>
      </div>

      {/* Metrics Rows */}
      <div className="divide-y divide-[var(--border-light)]">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="grid grid-cols-[1.3fr_0.8fr_0.6fr_1fr] gap-2 px-3 py-2.5 items-center"
          >
            {/* Metric Info */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: metric.iconBg }}
              >
                {metric.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{metric.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{metric.desc}</div>
              </div>
            </div>

            {/* Score */}
            <div>
              <span className="text-lg font-bold">{metric.value}</span>
              {metric.change && (
                <span
                  className={`text-[10px] ml-1 ${metric.change.startsWith('+') ? 'text-[var(--accent-green)]' : 'text-[var(--primary)]'}`}
                >
                  {metric.change.startsWith('-') ? '↓' : '↑'} {metric.change}
                </span>
              )}
            </div>

            {/* Status */}
            <span
              className="px-2 py-1 rounded text-[9px] font-semibold uppercase text-center"
              style={{
                color: metric.statusColor,
                backgroundColor: `color-mix(in srgb, ${metric.statusColor} 10%, transparent)`,
              }}
            >
              {metric.status}
            </span>

            {/* Trend Chart */}
            <div className="flex justify-end">
              <TrendLine color={metric.trendColor} flat={metric.flat} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--border-light)]">
        <div className="flex gap-4 text-[10px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"
            />{' '}
            47/47 queries safe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" /> 0 jailbreak
            successes
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" /> 0 PII leaks
          </span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">Last synced: 2 minutes ago</span>
      </div>
    </div>
  );
}

function ABComparisonScreen() {
  const baselineMetrics = [
    { label: 'Task Completion', value: '88.5%' },
    { label: 'Accuracy', value: '92%' },
    { label: 'Latency', value: '1.5s' },
    { label: 'Cost', value: '$0.036' },
    { label: 'Safety', value: '99.1%' },
    { label: 'Efficiency', value: '74%' },
  ];

  const candidateMetrics = [
    { label: 'Task Completion', value: '94.2%', change: '↑', positive: true },
    { label: 'Accuracy', value: '94%', change: '↑', positive: true },
    { label: 'Latency', value: '1.2s', change: '↓', positive: true },
    { label: 'Cost', value: '$0.047', change: '↑', positive: false },
    { label: 'Safety', value: '99.8%', change: '↑', positive: true },
    { label: 'Efficiency', value: '86%', change: '↑', positive: true },
  ];

  return (
    <>
      <WindowHeader title="A/B Comparison Scorecard v2.3 vs v2.4" />
      <div className="p-5">
        {/* Comparison Cards */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Baseline v2.3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="border border-[var(--border-light)] rounded-lg p-4 bg-white transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">v2.3</span>
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide px-2 py-0.5 bg-gray-100 rounded">
                Baseline
              </span>
            </div>
            <div className="space-y-2.5">
              {baselineMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-[var(--text-secondary)]">{metric.label}</span>
                  <span className="font-semibold">{metric.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Winner v2.4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="border-2 border-[var(--accent-green)] rounded-lg p-4 bg-[var(--accent-green)]/5 transition-shadow hover:shadow-lg hover:shadow-[var(--accent-green)]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">v2.4</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="px-2.5 py-1 bg-[var(--accent-green)] text-white rounded text-xs font-semibold shadow-md shadow-[var(--accent-green)]/30"
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  🏆
                </motion.span>{' '}
                WINNER
              </motion.span>
            </div>
            <div className="space-y-2.5">
              {candidateMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-[var(--text-secondary)]">{metric.label}</span>
                  <span
                    className={`font-semibold ${metric.positive ? 'text-[var(--accent-green)]' : 'text-[var(--error)]'}`}
                  >
                    {metric.value}{' '}
                    <motion.span
                      animate={{ y: metric.positive ? [0, -2, 0] : [0, 2, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {metric.change}
                    </motion.span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Divergence Chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Performance Divergence (100 Test Cases)
            </span>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-gray-100 text-[10px] font-medium rounded">
                Divergence point: +18.4%
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                <span className="w-3 h-0.5 bg-gray-300 rounded" /> v2.3
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                <span className="w-3 h-0.5 bg-[var(--primary)] rounded" /> v2.4
              </span>
            </div>
          </div>

          {/* Chart SVG */}
          <div className="h-[100px] relative">
            <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
              {/* v2.3 line (gray) */}
              <path
                d="M 0 60 Q 50 55, 100 50 T 200 45 T 300 48 T 400 40"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="2"
              />
              {/* v2.4 line (blue) */}
              <path
                d="M 0 65 Q 50 50, 100 40 T 200 25 T 300 15 T 400 12"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
              {/* Divergence point marker on v2.4 */}
              <circle cx="280" cy="18" r="5" fill="var(--primary)" />
              {/* Divergence point marker on v2.3 */}
              <circle cx="280" cy="46" r="4" fill="#d1d5db" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[9px] text-[var(--text-muted)] mt-1">
              <span>CASE 1</span>
              <span>CASE 25</span>
              <span>CASE 50</span>
              <span>CASE 75</span>
              <span>CASE 100</span>
            </div>
          </div>
        </div>

        {/* Statistical Significance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 pt-2"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-[var(--accent-green)] shadow-md shadow-[var(--accent-green)]/40"
          />
          <span className="text-sm font-medium">
            Statistical significance:
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[var(--accent-green)] font-bold ml-1"
            >
              95.2%
            </motion.span>
          </span>
        </motion.div>
      </div>
    </>
  );
}

function ShipScreen() {
  const metrics = [
    { label: 'Task Completion', value: '98.5%', prefix: '' },
    { label: 'Accuracy', value: '94.2%', prefix: '' },
    { label: 'Latency', value: '1.2', prefix: '', suffix: 's' },
    { label: 'Cost', value: '0.042', prefix: '$' },
    { label: 'Safety', value: '100%', prefix: '' },
    { label: 'Efficiency', value: '15.2%', prefix: '+' },
  ];

  return (
    <>
      <WindowHeader title="Ready to Ship" />
      <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white">
        {/* Success Icon */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="relative w-16 h-16 mx-auto mb-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[var(--accent-green)]/20 rounded-full"
            />
            <div className="absolute inset-1 bg-[var(--accent-green)]/10 rounded-full" />
            <div className="absolute inset-2 bg-[var(--accent-green)] rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold mb-1"
          >
            All Checks Passed
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-[var(--text-secondary)]"
          >
            Your agent is ready for production deployment
          </motion.p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              className="bg-white border border-[var(--border-light)] rounded-xl p-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  {metric.label}
                </span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1, type: 'spring' }}
                  className="w-4 h-4 bg-[var(--accent-green)]/10 rounded-full flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-[var(--accent-green)]" />
                </motion.div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold">
                  <span className="text-sm font-normal text-[var(--text-muted)]">
                    {metric.prefix}
                  </span>
                  {metric.value}
                  {metric.suffix && (
                    <span className="text-sm font-normal text-[var(--text-muted)]">
                      {metric.suffix}
                    </span>
                  )}
                </span>
                <MiniTrendLine />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mb-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-white border border-[var(--border)] rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-shadow"
          >
            View Full Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)' }}
            className="px-5 py-2.5 bg-[var(--accent-green)] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🚀
            </motion.span>
            Deploy to Production
          </motion.button>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-between items-center text-[10px] text-[var(--text-muted)] pt-3 border-t border-[var(--border-light)]"
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"
              />
              Environment: <strong className="text-[var(--foreground)]">Production-ready</strong>
            </span>
            <span className="flex items-center gap-1">⏱ Last run: 2 mins ago</span>
          </div>
          <span>
            Agent Version: <strong className="text-[var(--foreground)]">v3.4.2-stable</strong>
          </span>
        </motion.div>
      </div>
    </>
  );
}

// Helper Components
function FormField({
  label,
  value,
  optional,
}: {
  label: string;
  value: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
        {label}{' '}
        {optional && <span className="font-normal text-[var(--text-muted)]">(optional)</span>}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg-subtle)] text-sm"
      />
    </div>
  );
}

function QueryCard({
  category,
  categoryColor,
  stars,
  query,
  latency,
  source,
}: {
  category: string;
  categoryColor: string;
  stars: number;
  query: string;
  latency: string;
  source: string;
}) {
  return (
    <div className="border border-[var(--border-light)] rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
            style={{
              color: categoryColor,
              backgroundColor: `color-mix(in srgb, ${categoryColor} 10%, transparent)`,
            }}
          >
            {category}
          </span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}>
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      </div>
      <p className="text-sm text-[var(--foreground)] mb-3">{query}</p>
      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <span>⏱</span> Latency: {latency}
        </span>
        <span className="flex items-center gap-1">
          <span>📄</span> Source: {source}
        </span>
      </div>
    </div>
  );
}

function TestCard({
  id,
  status,
  name,
}: {
  id: string;
  status: 'success' | 'running' | 'retrying' | 'queued';
  name: string;
}) {
  const statusConfig = {
    success: {
      label: 'SUCCESS',
      color: 'var(--accent-green)',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      icon: '✓',
    },
    running: {
      label: 'RUNNING',
      color: 'var(--primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      icon: '↻',
    },
    retrying: {
      label: 'RETRYING',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: '↻',
    },
    queued: { label: 'QUEUED', color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.1)', icon: '○' },
  };

  const config = statusConfig[status];
  const isQueued = status === 'queued';

  return (
    <div
      className={`border rounded-lg p-2.5 bg-white ${status === 'running' ? 'border-[var(--primary)]/30' : 'border-[var(--border-light)]'}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{id}</span>
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1"
          style={{ color: config.color, backgroundColor: config.bgColor }}
        >
          <span className="text-[8px]">{config.icon}</span> {config.label}
        </span>
      </div>
      <div
        className="h-1 rounded-full mb-1.5"
        style={{ backgroundColor: status === 'queued' ? '#e5e7eb' : config.color }}
      />
      <p
        className={`text-[11px] ${isQueued ? 'italic text-[var(--text-muted)]' : 'text-[var(--foreground)]'}`}
      >
        {name}
      </p>
    </div>
  );
}

function TrendLine({ color, flat }: { color: string; flat?: boolean }) {
  // Generate random-ish points for the trend line
  const points = flat
    ? '0,15 20,15 40,15 60,15 80,15 100,15'
    : '0,25 15,22 30,18 50,20 65,12 80,8 100,5';

  return (
    <div className="w-20 h-6 relative overflow-hidden">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 100 30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
}

function MiniTrendLine() {
  return (
    <motion.div
      className="w-12 h-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg className="w-full h-full" viewBox="0 0 50 20">
        <motion.path
          d="M 0 15 Q 10 12, 20 10 T 35 6 T 50 4"
          fill="none"
          stroke="var(--accent-green)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
}
