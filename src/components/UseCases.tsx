'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Globe, BarChart3, MessageSquare, PenLine, TrendingUp, Check } from 'lucide-react';

const useCases = [
  {
    icon: Globe,
    title: 'Browser Agents',
    description: 'Eval navigation, form fills, multi-step workflows',
    metric: '98.2% nav accuracy',
  },
  {
    icon: BarChart3,
    title: 'Data Analysis Agent',
    description: 'Validate SQL, charts, insight relevance',
    metric: '12 regressions caught',
  },
  {
    icon: MessageSquare,
    title: 'Customer Support Agent',
    description: 'Test response quality, tone, escalation',
    metric: '23% fewer escalations',
  },
  {
    icon: PenLine,
    title: 'Content Creation Agent',
    description: 'Brand voice, factual accuracy, style',
    metric: '40% brand score lift',
  },
];

export function UseCases() {
  const [activeCase, setActiveCase] = useState(0);

  return (
    <section id="use-cases" className="py-[100px] px-6 bg-[var(--bg-subtle)] scroll-mt-20">
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
            Use Cases
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Evaluate Any Agent, Any Workflow
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            See how TensorEval adapts to different agent architectures
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12">
          {/* Use Case Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setActiveCase(index)}
                  onClick={() => setActiveCase(index)}
                  className={`p-5 border rounded-xl cursor-pointer transition-all bg-white ${
                    activeCase === index
                      ? 'border-[var(--primary)] shadow-md shadow-[var(--primary)]/10'
                      : 'border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md hover:shadow-[var(--primary)]/10'
                  }`}
                >
                  <div className="text-3xl mb-3">
                    <Icon className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h4 className="font-semibold text-[0.95rem] mb-1.5">{useCase.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{useCase.description}</p>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--accent-green)] font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {useCase.metric}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Use Case Screens */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeCase === 0 && <BrowserAgentScreen />}
                {activeCase === 1 && <DataAgentScreen />}
                {activeCase === 2 && <SupportAgentScreen />}
                {activeCase === 3 && <ContentAgentScreen />}
              </motion.div>
            </AnimatePresence>
          </div>
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

function BrowserAgentScreen() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      {/* Browser Header with URL */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--ui-header)] border-b border-[var(--ui-border)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] text-[var(--text-muted)]">
            🔒 tensoreval.ai/runner/browser-v1
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Target Task Header */}
        <div className="flex items-center justify-between mb-4 p-2.5 bg-gray-50 rounded-lg">
          <div>
            <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Target Task
            </p>
            <p className="text-sm font-medium">"Book a flight from NYC to LA for next Friday"</p>
          </div>
          <motion.button
            whileHover={{ boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)' }}
            whileTap={{ opacity: 0.9 }}
            className="px-3 py-1.5 bg-[var(--accent-green)] text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-md shadow-[var(--accent-green)]/30 transition-shadow"
          >
            <motion.span
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ▶
            </motion.span>
            Trigger Evaluation
          </motion.button>
        </div>

        {/* Airline Website Mockup - Compact */}
        <div className="border border-[var(--border-light)] rounded-lg overflow-hidden mb-4 relative">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--primary)]">AIRLINE</span>
              <div className="flex gap-2 text-[9px] text-[var(--text-muted)]">
                <span>BOOK</span>
                <span>CHECK-IN</span>
                <span>MY TRIPS</span>
              </div>
            </div>
            <span className="text-[9px] text-[var(--text-muted)]">Log In</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50">
            <div className="flex-1 px-2 py-1 bg-white rounded border text-[9px]">
              New York (JFK)
            </div>
            <div className="flex-1 px-2 py-1 bg-white rounded border text-[9px]">
              Los Angeles (LAX)
            </div>
            <div className="px-2 py-1 bg-white rounded border text-[9px]">Oct 27</div>
            <button className="px-2 py-1 bg-[#0ea5e9] text-white rounded text-[9px] font-semibold">
              SEARCH
            </button>
          </div>

          <div className="p-2 bg-white relative">
            <p className="text-[9px] font-semibold text-[var(--text-muted)] mb-1.5">
              9 FLIGHTS FOUND
            </p>
            <div className="flex items-center justify-between p-1.5 border border-[var(--primary)]/30 rounded bg-[var(--primary)]/5 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-[8px] font-bold">
                  AL
                </div>
                <div>
                  <p className="text-[10px] font-semibold">07:30 – 10:45</p>
                  <p className="text-[8px] text-[var(--text-muted)]">JFK - LAX • Nonstop</p>
                </div>
              </div>
              <p className="font-bold text-xs">$342.10</p>
            </div>

            {/* Evaluating Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg px-3 py-1.5 flex items-center gap-1.5 z-10"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-[var(--primary)] text-sm"
              >
                ↻
              </motion.span>
              <span className="text-[10px] font-medium">Evaluating Agent Actions...</span>
            </motion.div>

            <div className="flex items-center justify-between p-1.5 border border-gray-100 rounded opacity-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">
                  UA
                </div>
                <div>
                  <p className="text-[10px] font-semibold">09:15 – 12:35</p>
                  <p className="text-[8px] text-[var(--text-muted)]">EWR - LAX</p>
                </div>
              </div>
              <p className="font-bold text-xs">$385.00</p>
            </div>
          </div>

          {/* Live DOM Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-1 left-1 bg-white/95 backdrop-blur rounded shadow-md p-1.5 border text-[8px]"
          >
            <p className="font-semibold text-[var(--text-muted)] uppercase mb-1">Live DOM</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[var(--accent-green)]">
                <Check className="w-2.5 h-2.5" /> Click: Search
              </div>
              <div className="flex items-center gap-1 text-[var(--accent-green)]">
                <Check className="w-2.5 h-2.5" /> Type: "NYC"
              </div>
              <div className="flex items-center gap-1 text-[var(--primary)]">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ◎
                </motion.span>{' '}
                Analyzing...
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pipeline */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Evaluation Pipeline
            </p>
            <span className="text-[9px] text-[var(--text-muted)]">Stage 2/3</span>
          </div>
          <div className="flex gap-0.5 mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className="h-1 bg-[var(--accent-green)] rounded-full flex-1"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-1 bg-[var(--primary)] rounded-full flex-1 relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
            <div className="h-1 bg-gray-200 rounded-full flex-1" />
          </div>
          <div className="flex justify-between text-[8px] text-[var(--text-muted)]">
            <span className="text-[var(--accent-green)]">Capture</span>
            <span className="text-[var(--primary)]">Analyze</span>
            <span>Score</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Task Completion', value: '8/8', extra: '✓', color: 'var(--accent-green)' },
            { label: 'Accuracy', value: '98.2%', color: 'var(--foreground)' },
            { label: 'Latency', value: '12.4s', color: 'var(--foreground)' },
            { label: 'Cost', value: '$0.04', color: 'var(--foreground)' },
            { label: 'Safety', value: 'Pass', extra: '●', color: 'var(--accent-green)' },
            { label: 'Efficiency', value: 'High', color: 'var(--primary)' },
          ].map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="bg-gray-50 rounded-lg p-2 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <p className="text-[8px] font-semibold text-[var(--text-muted)] uppercase mb-0.5">
                {metric.label}
              </p>
              <p className="text-base font-bold" style={{ color: metric.color }}>
                {metric.value}
                {metric.extra && (
                  <span className="text-[var(--accent-green)] text-xs ml-0.5">{metric.extra}</span>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataAgentScreen() {
  const sqlLines = [
    {
      num: 1,
      code: (
        <>
          <span className="text-[#c678dd]">SELECT</span>
        </>
      ),
    },
    { num: 2, code: <> u.user_id,</> },
    {
      num: 3,
      code: (
        <>
          {' '}
          <span className="text-[#61afef]">SUM</span>(o.order_total){' '}
          <span className="text-[#c678dd]">as</span> ltv
        </>
      ),
    },
    {
      num: 4,
      code: (
        <>
          <span className="text-[#c678dd]">FROM</span> users u
        </>
      ),
    },
    {
      num: 5,
      code: (
        <>
          <span className="text-[#c678dd]">JOIN</span> orders o{' '}
          <span className="text-[#c678dd]">ON</span> u.id = o.user_id
        </>
      ),
    },
    {
      num: 6,
      code: (
        <>
          <span className="text-[#c678dd]">WHERE</span> u.signup_date{' '}
          <span className="text-[#c678dd]">BETWEEN</span>{' '}
          <span className="text-[#98c379]">'2024-01-01'</span>
        </>
      ),
    },
    {
      num: 7,
      code: (
        <>
          {' '}
          <span className="text-[#c678dd]">AND</span>{' '}
          <span className="text-[#98c379]">'2024-01-31'</span>
        </>
      ),
    },
    {
      num: 8,
      code: (
        <>
          <span className="text-[#c678dd]">GROUP BY</span> <span className="text-[#d19a66]">1</span>
        </>
      ),
    },
    {
      num: 9,
      code: (
        <>
          <span className="text-[#c678dd]">ORDER BY</span> ltv{' '}
          <span className="text-[#c678dd]">DESC</span>;
        </>
      ),
    },
    { num: 10, code: <></> },
  ];

  const metrics = [
    { label: 'Task Completion', value: '100%', color: 'var(--accent-green)', check: true },
    { label: 'Accuracy', value: '99.1%', color: 'var(--accent-green)', check: true },
    { label: 'Latency', value: '2.4s', color: 'var(--foreground)' },
    { label: 'Cost', value: '$0.05', color: 'var(--foreground)' },
    { label: 'Safety', value: 'No PII', color: 'var(--accent-green)' },
    { label: 'Efficiency', value: 'HIGH', color: 'var(--primary)' },
  ];

  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="DATA ANALYST EVAL" />
      <div className="p-5">
        {/* Input Query */}
        <div className="mb-4">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Input Query
          </p>
          <p className="text-sm font-medium">
            "Calculate the LTV of users who signed up in Jan 2024"
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 mb-3">
          {/* Generated Script */}
          <div>
            <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Generated Script
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#282c34] rounded-lg p-2.5 font-mono text-[9px] text-[#abb2bf] overflow-hidden"
            >
              {sqlLines.map((line, idx) => (
                <motion.div
                  key={line.num}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex"
                >
                  <span className="text-[#636d83] w-4 mr-2 text-right select-none">{line.num}</span>
                  <span className="flex-1">{line.code}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Evaluation Metrics */}
          <div>
            <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Evaluation Metrics
            </p>
            <div className="space-y-1.5">
              {metrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-colors"
                >
                  <span className="text-[10px] text-[var(--text-secondary)]">{metric.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: metric.color }}>
                    {metric.value}
                    {metric.check && <span className="text-[var(--accent-green)] ml-1">✓</span>}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Result Preview Chart */}
        <div className="mb-3">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Result Preview: Cumulative LTV (Jan 2024)
          </p>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
            <div className="h-12 relative">
              <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                <motion.path
                  d="M 0 35 Q 30 32, 60 28 T 120 20 T 160 12 T 200 8"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <motion.circle
                  cx="160"
                  cy="12"
                  r="3"
                  fill="var(--primary)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                />
              </svg>
              <div className="absolute bottom-0 left-0 text-[7px] text-[var(--text-muted)]">
                LTV ($)
              </div>
            </div>
            <div className="flex justify-between text-[7px] text-[var(--text-muted)] mt-1">
              <span>Jan 01</span>
              <span>Jan 08</span>
              <span>Jan 15</span>
              <span>Jan 22</span>
              <span>Jan 31</span>
            </div>
            <p className="text-center text-[7px] text-[var(--text-muted)] mt-1">DATE</p>
          </div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--primary)]/5 rounded-lg p-2.5 border border-[var(--primary)]/20"
        >
          <div className="flex items-start gap-2">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[var(--primary)] text-sm"
            >
              ✓
            </motion.span>
            <div>
              <p className="text-[9px] font-semibold text-[var(--primary)] uppercase mb-0.5">
                Summary
              </p>
              <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed">
                The agent correctly identified the users and orders tables, applied the right date
                filter for January 2024, and calculated a descending LTV ranking as requested.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SupportAgentScreen() {
  const scorecard = [
    {
      metric: 'Accuracy',
      desc: 'Policy adherence',
      control: '92%',
      candidate: '98%',
      delta: '+6.5%',
      positive: true,
    },
    {
      metric: 'Latency',
      desc: 'Time to first token',
      control: '1.2s',
      candidate: '0.8s',
      delta: '-33.3%',
      positive: true,
    },
    {
      metric: 'Cost',
      desc: 'Per 1k requests',
      control: '$0.15',
      candidate: '$0.18',
      delta: '+20.0%',
      positive: false,
    },
    {
      metric: 'Safety',
      desc: 'Bias & toxicity filter',
      control: '99.1%',
      candidate: '99.3%',
      delta: '+0.2%',
      positive: true,
    },
    {
      metric: 'Efficiency Score',
      desc: 'Aggregate weighted score',
      control: '84/100',
      candidate: '94/100',
      delta: 'Significant Gain',
      positive: true,
      highlight: true,
    },
  ];

  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--ui-header)] border-b border-[var(--ui-border)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="text-[10px] font-medium text-[var(--text-secondary)]">
          A/B EVALUATION DASHBOARD
        </span>
        <span className="text-[9px] font-mono text-[var(--text-muted)] bg-gray-100 px-1.5 py-0.5 rounded">
          ID: #BCH-4820
        </span>
      </div>

      <div className="p-5">
        {/* Input Query */}
        <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Input Query
          </p>
          <p className="text-[10px] text-[var(--foreground)]">
            "I want a refund, this product sucks and I'm really angry. I've tried reaching out three
            times and no one responds. This is unacceptable."
          </p>
        </div>

        {/* A/B Comparison Cards */}
        <div className="grid grid-cols-2 gap-2 mb-3 relative">
          {/* Control */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-gray-200 rounded-lg p-2.5"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-wide">
                Agent Version
              </p>
              <span className="text-[7px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold uppercase">
                Control
              </span>
            </div>
            <p className="text-[11px] font-bold mb-1.5">Stable v1.0.4</p>
            <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Output Response
            </p>
            <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed">
              "I'm sorry to hear you're unhappy with your purchase. I completely understand how
              frustrating that can be. I'd be happy to help process a refund for you."
            </p>
          </motion.div>

          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[8px] font-bold text-gray-500 z-10">
            VS
          </div>

          {/* Candidate (Winner) */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-2 border-[var(--accent-green)] rounded-lg p-2.5 bg-[var(--accent-green)]/5 relative"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -top-1.5 right-2 text-[7px] bg-[var(--accent-green)] text-white px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5"
            >
              <span>🏆</span> WINNER
            </motion.span>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[8px] text-[var(--accent-green)] uppercase tracking-wide">
                Agent Version
              </p>
              <span className="text-[7px] bg-[var(--primary)]/10 text-[var(--primary)] px-1.5 py-0.5 rounded font-semibold uppercase">
                Candidate
              </span>
            </div>
            <p className="text-[11px] font-bold text-[var(--accent-green)] mb-1.5">
              Experimental v1.1.0-rc
            </p>
            <p className="text-[8px] text-[var(--accent-green)] uppercase tracking-wide mb-1">
              Output Response
            </p>
            <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed">
              "I am so incredibly sorry for the frustration this has caused. I have already
              authorized a full refund and added a $20 credit to your account."
            </p>
          </motion.div>
        </div>

        {/* Comparative Scorecard */}
        <div className="mb-3">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Comparative Scorecard
          </p>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4 gap-2 px-2 py-1.5 bg-gray-50 text-[8px] font-semibold text-[var(--text-muted)]">
              <span>Metric</span>
              <span className="text-center">v1.0.4 (Control)</span>
              <span className="text-center">v1.1.0-rc (Candidate)</span>
              <span className="text-right">Delta</span>
            </div>
            {/* Data Rows */}
            {scorecard.map((row, idx) => (
              <motion.div
                key={row.metric}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="grid grid-cols-4 gap-2 px-2 py-1.5 border-t border-gray-100 items-center"
              >
                <div>
                  <p
                    className={`text-[9px] font-medium ${row.highlight ? 'text-[var(--accent-green)]' : ''}`}
                  >
                    {row.metric}
                  </p>
                  <p className="text-[7px] text-[var(--text-muted)]">{row.desc}</p>
                </div>
                <span className="text-[9px] text-center">{row.control}</span>
                <span
                  className={`text-[9px] text-center font-semibold ${row.highlight ? 'text-[var(--primary)]' : ''}`}
                >
                  {row.candidate}
                </span>
                <span
                  className={`text-[8px] text-right font-semibold ${row.positive ? 'text-[var(--accent-green)]' : 'text-[var(--error)]'} ${row.highlight ? 'bg-[var(--accent-green)]/10 px-1 py-0.5 rounded' : ''}`}
                >
                  {row.delta}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-[8px] text-[var(--text-muted)]">
            <span>⏱ Ran 2 mins ago</span>
            <span>👤 Triggered by CI/CD</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              whileTap={{ opacity: 0.9 }}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[9px] font-medium transition-colors"
            >
              Reject Changes
            </motion.button>
            <motion.button
              whileHover={{ boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)' }}
              whileTap={{ opacity: 0.9 }}
              className="px-2.5 py-1 bg-[var(--accent-green)] text-white rounded text-[9px] font-semibold shadow-md shadow-[var(--accent-green)]/30 transition-shadow"
            >
              <span className="flex items-center gap-1">Promote to Production (v1.1.0-rc)</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAgentScreen() {
  const metrics = [
    {
      label: 'Task Completion',
      v1: 95,
      v2: 100,
      value: '100%',
      delta: '+5%',
      positive: true,
      color1: 'var(--primary)',
      color2: 'var(--primary)',
    },
    {
      label: 'Accuracy',
      v1: 100,
      v2: 98,
      value: '98%',
      delta: '-2%',
      positive: false,
      color1: 'var(--accent-green)',
      color2: 'var(--accent-green)',
    },
    {
      label: 'Latency',
      v1: 60,
      v2: 40,
      value: '1.2s',
      delta: '-0.8s',
      positive: true,
      color1: '#f59e0b',
      color2: 'var(--accent-green)',
    },
    {
      label: 'Cost (per 1k tokens)',
      v1: 80,
      v2: 20,
      value: '$0.005',
      delta: '75% cheaper',
      positive: true,
      color1: 'var(--primary)',
      color2: 'var(--primary)',
    },
    {
      label: 'Safety',
      v1: 100,
      v2: 100,
      value: '100%',
      delta: 'Stable',
      positive: true,
      color1: 'var(--accent-green)',
      color2: 'var(--accent-green)',
    },
    {
      label: 'Efficiency',
      v1: 65,
      v2: 92,
      value: '92%',
      delta: '+27%',
      positive: true,
      color1: 'var(--primary)',
      color2: 'var(--primary)',
    },
  ];

  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--ui-header)] border-b border-[var(--ui-border)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="flex-1 text-center text-[10px] font-medium text-[var(--text-secondary)] tracking-wide">
          CONTENT AGENT EVAL DASHBOARD
        </span>
      </div>

      <div className="p-5">
        {/* Task */}
        <div className="mb-3">
          <span className="text-[9px] text-[var(--text-muted)] uppercase font-semibold tracking-wider">
            Task:{' '}
          </span>
          <span className="text-sm font-medium">"Write a tweet announcing Smart Sync feature"</span>
        </div>

        {/* A/B Comparison Cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* V1 - Creative */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-2.5"
          >
            <span className="inline-block text-[8px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded mb-2 uppercase tracking-wide">
              Agent: Creative-V1
            </span>
            <p className="text-[9px] text-[var(--foreground)] leading-relaxed mb-2">
              "Introducing Smart Sync - your data, always up to date, everywhere. No more manual
              exports. Just connect and go. Try it free today. 🚀"
            </p>
            <p className="text-[8px] text-[var(--text-muted)] text-right">142/280 chars</p>
          </motion.div>

          {/* V2 - Balanced (New/Better) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-[var(--accent-green)] rounded-lg p-2.5 bg-[var(--accent-green)]/5"
          >
            <span className="inline-block text-[8px] font-semibold bg-[var(--accent-green)] text-white px-1.5 py-0.5 rounded mb-2 uppercase tracking-wide">
              Agent: Balanced-V2 (NEW)
            </span>
            <p className="text-[9px] text-[var(--foreground)] leading-relaxed mb-2">
              "Sync your world effortlessly. Smart Sync bridges the gap between your apps, ensuring
              data flows where you need it, when you need it. ✨ #Efficiency #SmartSync"
            </p>
            <p className="text-[8px] text-[var(--text-muted)] text-right">168/280 chars</p>
          </motion.div>
        </div>

        {/* Comparative Scorecard */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">📊</span>
            <span className="text-[11px] font-semibold">Comparative Scorecard</span>
          </div>

          <div className="space-y-2">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="grid grid-cols-[100px_1fr_70px] gap-2 items-center"
              >
                <span className="text-[9px] text-[var(--text-secondary)]">{metric.label}</span>
                <div className="flex gap-1 items-center">
                  {/* V1 Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.v1}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.05 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: metric.color1, maxWidth: '45%' }}
                  />
                  {/* V2 Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.v2}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.05 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: metric.color2, maxWidth: '45%' }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold">{metric.value}</span>
                  <p
                    className={`text-[8px] ${metric.positive ? 'text-[var(--accent-green)]' : 'text-[var(--error)]'}`}
                  >
                    {metric.delta}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
