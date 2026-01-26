"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { TestTube2, BarChart3, GitCompare, Package } from "lucide-react";

const features = [
  {
    icon: TestTube2,
    title: "Synthetic Query Generation",
    description: "Auto-generate test cases from domain knowledge. Cover edge cases humans would miss.",
  },
  {
    icon: BarChart3,
    title: "Multi-Metric Evaluation",
    description: "Task Completion, Accuracy, Latency, Cost, Safety, Efficiency.",
  },
  {
    icon: GitCompare,
    title: "A/B Testing",
    description: "Compare agent versions head-to-head. See exactly what changed and why.",
  },
  {
    icon: Package,
    title: "Training Data Export",
    description: "Export passing eval traces as fine-tuning data. Close the feedback loop.",
  },
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" className="py-[100px] px-6 bg-[var(--background)] scroll-mt-20">
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
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Beyond testing. Beyond metrics.
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Generate tests. Measure performance. Compare versions. Export insights.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12">
          {/* Feature Cards */}
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setActiveFeature(index)}
                  onClick={() => setActiveFeature(index)}
                  className={`p-5 border rounded-xl cursor-pointer transition-all bg-white ${
                    activeFeature === index
                      ? "border-[var(--primary)] shadow-md shadow-[var(--primary)]/10 bg-[var(--primary)]/[0.02]"
                      : "border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md hover:shadow-[var(--primary)]/10"
                  }`}
                >
                  <div className="text-2xl mb-3">
                    <Icon className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <h4 className="font-semibold mb-1.5">{feature.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Feature Screens */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeFeature === 0 && <QueryGeneratorFeature />}
                {activeFeature === 1 && <MetricsDashboardFeature />}
                {activeFeature === 2 && <ABTestingFeature />}
                {activeFeature === 3 && <ExportFeature />}
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

function QueryGeneratorFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      {/* Custom Header with LIVE badge */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--ui-header)] border-b border-[var(--ui-border)]">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <span className="flex-1 text-center text-sm text-[var(--text-secondary)] font-medium">
          Query Quality Analytics
        </span>
        <span className="px-2 py-0.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-xs font-semibold rounded">
          LIVE
        </span>
      </div>
      
      <div className="p-5">
        {/* Circular Progress Indicators */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <CircularMetric value={90} label="RELEVANCE" color="var(--primary)" />
          <CircularMetric value={75} label="COMPLEXITY" color="var(--warning)" />
          <CircularMetric value={95} label="SAFETY" color="var(--accent-green)" />
        </div>

        {/* Query Diversity & Generation Quality Row */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Query Diversity */}
          <div className="bg-[var(--bg-subtle)] rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Query Diversity</span>
              <span className="text-xs text-[var(--text-muted)]">Total: 4.2k</span>
            </div>
            <DiversityBar label="Happy Path" percentage={45} color="var(--primary)" />
            <DiversityBar label="Edge Cases" percentage={32} color="var(--warning)" />
            <DiversityBar label="Adversarial" percentage={23} color="var(--text-muted)" />
          </div>

          {/* Generation Quality */}
          <div className="bg-[var(--bg-subtle)] rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Generation Quality</span>
              <span className="text-xs text-[var(--accent-green)]">+12% vs last run</span>
            </div>
            <div className="h-16 flex items-end gap-1.5">
              {[45, 55, 50, 60, 65, 75].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex-1 bg-[var(--primary)] rounded-t"
                  style={{ opacity: 0.4 + (i * 0.12) }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-[var(--text-muted)]">Iteration 1</span>
              <span className="text-[10px] text-[var(--text-muted)]">Iteration 8</span>
            </div>
          </div>
        </div>

        {/* Top Generated Queries Table */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Top Generated Queries</span>
            <span className="text-xs text-[var(--primary)] font-medium cursor-pointer">DETAILED VIEW →</span>
          </div>
          <div className="space-y-2">
            <QueryRow 
              query='"How do I handle nested recursive data types in SDK v3?"' 
              tag="EDGE" 
              tagColor="var(--primary)"
              score="0.98" 
            />
            <QueryRow 
              query='"Explain the rate limiting strategy for batch uploads."' 
              tag="HAPPY" 
              tagColor="var(--accent-green)"
              score="0.94" 
            />
            <QueryRow 
              query='"Attempt to SQL inject via the user profile metadata field."' 
              tag="ADVERS" 
              tagColor="var(--error)"
              score="0.91" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricsDashboardFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="Performance Comparison" />
      <div className="p-5">
        {/* Legend */}
        <div className="flex items-center justify-end gap-5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-sm text-[var(--text-muted)]">Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--primary)]" />
            <span className="text-sm font-medium">Current</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[1fr_1.5fr] gap-4 mb-5">
          {/* Left - Radar Chart */}
          <div className="flex justify-center items-center">
            <SixAxisRadar />
          </div>

          {/* Right - Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3">
            <MetricTile label="TASK COMPLETION" value="94%" />
            <MetricTile label="ACCURACY" value="92%" />
            <MetricTile label="PLAN QUALITY" value="88%" />
            <MetricTile label="TOOL USE" value="91%" />
            <MetricTile label="EFFICIENCY" value="93%" />
            <MetricTile label="SAFETY" value="98%" />
          </div>
        </div>

        {/* Bottom Section - Recent Evaluations */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Recent Evaluations</span>
            <span className="text-xs text-[var(--primary)] font-medium cursor-pointer">VIEW ALL →</span>
          </div>
          <div className="space-y-2">
            <EvalRow name="GPT-4-Turbo Eval" score="94%" status="passed" time="2m ago" />
            <EvalRow name="Claude-3-Sonnet Test" score="88%" status="passed" time="14m ago" />
            <EvalRow name="Llama-3-70b Prod" score="72%" status="failed" time="1h ago" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ABTestingFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="A/B Comparison Scorecard v2.3 vs v2.4" />
      <div className="p-5">
        {/* Comparison Cards */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Baseline v2.3 */}
          <div className="border border-[var(--border-light)] rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold">v2.3</span>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Baseline</span>
              </div>
              <div className="space-y-3">
                <CompareRow label="Task Completion" value="88.5%" />
                <CompareRow label="Accuracy" value="92%" />
                <CompareRow label="Latency" value="1.5s" />
                <CompareRow label="Cost" value="$0.036" />
                <CompareRow label="Safety" value="99.1%" />
                <CompareRow label="Efficiency" value="74%" />
              </div>
            </div>
          </div>

          {/* Winner v2.4 */}
          <div className="border-2 border-[var(--accent-green)] rounded-xl overflow-hidden bg-[var(--accent-green)]/[0.02]">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold">v2.4</span>
                <span className="px-2.5 py-1 bg-[var(--accent-green)] text-white rounded-full text-xs font-semibold">WINNER</span>
              </div>
              <div className="space-y-3">
                <CompareRow label="Task Completion" value="94.2%" change="up" winner />
                <CompareRow label="Accuracy" value="94%" change="up" winner />
                <CompareRow label="Latency" value="1.2s" change="down" winner />
                <CompareRow label="Cost" value="$0.047" change="up" negative />
                <CompareRow label="Safety" value="99.8%" change="up" winner />
                <CompareRow label="Efficiency" value="86%" change="up" winner />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Divergence Chart */}
        <div className="bg-[var(--bg-subtle)] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Performance Divergence (100 Test Cases)</span>
            <div className="flex items-center gap-4">
              <div className="px-2 py-1 bg-gray-800 text-white text-[10px] rounded">Divergence point: +18.4%</div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-gray-400" style={{ borderStyle: 'dashed' }} /> v2.3</span>
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[var(--primary)]" /> v2.4</span>
              </div>
            </div>
          </div>
          <div className="h-24 relative">
            {/* Chart visualization */}
            <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
              {/* Baseline v2.3 line (dashed) */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d="M 0 60 Q 100 55 200 50 T 400 55"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.5"
              />
              {/* Current v2.4 line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                d="M 0 65 Q 80 55 160 45 Q 240 30 300 15 T 400 10"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
              {/* Divergence point */}
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                cx="300"
                cy="15"
                r="5"
                fill="var(--primary)"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, duration: 0.3 }}
                cx="300"
                cy="50"
                r="4"
                fill="var(--text-muted)"
                opacity="0.5"
              />
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)] uppercase">
            <span>Case 1</span>
            <span>Case 25</span>
            <span>Case 50</span>
            <span>Case 75</span>
            <span>Case 100</span>
          </div>
        </div>

        {/* Statistical Significance */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
          <span className="text-sm font-medium">Statistical significance: <span className="text-[var(--accent-green)]">95.2%</span></span>
        </div>
      </div>
    </div>
  );
}

function ExportFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="EXPORT TRAINING DATA" />
      <div className="p-5">
        <div className="grid grid-cols-[1.1fr_1fr] gap-4">
          {/* Left - Configuration */}
          <div>
            {/* 1. Select Source */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1.5">1. Select Source</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-sm appearance-none cursor-pointer">
                  <option>Passed Evaluations - Q3</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">▼</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                Available: <strong className="text-[var(--foreground)]">1,247 traces</strong> | Selected: <strong className="text-[var(--foreground)]">1,103</strong>
              </p>
            </div>

            {/* 2. Filter Criteria */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1.5">2. Filter Criteria</label>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-[11px] font-medium">
                  High Confidence <span className="cursor-pointer">×</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-full text-[11px] font-medium">
                  No PII <span className="cursor-pointer">×</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-dashed border-[var(--border)] text-[var(--text-muted)] rounded-full text-[11px] cursor-pointer">
                  + Add Filter
                </span>
              </div>
            </div>

            {/* 3. Export Format */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1.5">3. Export Format</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2.5 p-2.5 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--bg-subtle)]">
                  <input type="radio" name="exportFormat" className="accent-[var(--primary)]" />
                  <div className="text-sm">JSONL (OpenAI format)</div>
                </label>
                <label className="flex items-center gap-2.5 p-2.5 border-2 border-[var(--primary)] rounded-lg cursor-pointer bg-[var(--primary)]/[0.02]">
                  <input type="radio" name="exportFormat" defaultChecked className="accent-[var(--primary)]" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium">Alpaca format (Parquet)</span>
                    <span className="px-1.5 py-0.5 bg-[var(--primary)] text-white text-[8px] font-semibold rounded">RECOMMENDED</span>
                  </div>
                </label>
                <label className="flex items-center gap-2.5 p-2.5 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--bg-subtle)]">
                  <input type="radio" name="exportFormat" className="accent-[var(--primary)]" />
                  <div className="text-sm">CSV / ShareGPT</div>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button className="w-full py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
              <span>✦</span> Generate Export
            </button>
            <p className="text-[10px] text-[var(--text-muted)] text-center mt-1.5">
              Estimated file size: ~2.4 MB
            </p>
          </div>

          {/* Right - Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                <span className="text-[var(--primary)]">&lt;&gt;</span> LIVE PREVIEW
              </span>
              <span className="text-[11px] text-[var(--primary)] font-medium cursor-pointer">Copy</span>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 font-mono text-[11px] text-gray-300 h-[180px] overflow-hidden">
              <div className="text-gray-500">{"{"}</div>
              <div className="pl-3">
                <span className="text-green-400">"instruction"</span>: <span className="text-amber-300">"How do I track my ord..."</span>,
              </div>
              <div className="pl-3">
                <span className="text-green-400">"input"</span>: <span className="text-amber-300">""</span>,
              </div>
              <div className="pl-3">
                <span className="text-green-400">"output"</span>: <span className="text-amber-300">"I'd be happy to help..."</span>
              </div>
              <div className="text-gray-500">{"},"}</div>
              <div className="text-gray-500">{"{"}</div>
              <div className="pl-3">
                <span className="text-green-400">"instruction"</span>: <span className="text-amber-300">"Summarize the return..."</span>,
              </div>
              <div className="pl-3">
                <span className="text-green-400">"input"</span>: <span className="text-amber-300">"Returns are accepted..."</span>,
              </div>
              <div className="pl-3">
                <span className="text-green-400">"output"</span>: <span className="text-amber-300">"Customers have 30..."</span>
              </div>
              <div className="text-gray-500">{"}"}</div>
            </div>

            {/* Schema Validation */}
            <div className="mt-2.5 p-2.5 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)] flex gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--primary)] text-[10px]">ℹ</span>
              </div>
              <div>
                <div className="text-xs font-medium">Schema Validation</div>
                <div className="text-[11px] text-[var(--text-muted)]">All 1,103 entries validated against Alpaca format.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="w-24 text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex-1 h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="w-10 text-right text-sm font-semibold">{value}</span>
    </div>
  );
}

function MetricCard({ value, label, change, up }: { value: string; label: string; change?: string; up?: boolean }) {
  return (
    <div className="bg-[var(--bg-subtle)] border border-[var(--border-light)] rounded-lg p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mt-1">{label}</div>
      {change && (
        <div className={`text-xs mt-1 ${up ? "text-[var(--accent-green)]" : ""}`}>{change}</div>
      )}
    </div>
  );
}

function ABRow({ label, value, change, positive }: { label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>
        {value}{" "}
        {change && (
          <span className={positive ? "text-[var(--accent-green)] font-semibold" : "text-[var(--error)] font-semibold"}>
            {change}
          </span>
        )}
      </span>
    </div>
  );
}

function PerformanceRadar() {
  const size = 180;
  const center = size / 2;
  const levels = [25, 50, 75, 100];
  const metrics = [
    { label: "ACCURACY", value: 94.2, display: "94.2%" },
    { label: "SAFETY", value: 99.8, display: "99.8%" },
    { label: "LATENCY", value: 70, display: "1.2s" },
    { label: "COST", value: 85, display: "$0.047" },
  ];
  
  const angleStep = (Math.PI * 2) / 4;
  const maxRadius = 70;

  const getPoint = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const currentData = metrics.map(m => m.value);
  const baselineData = [85, 92, 60, 75];

  const createPath = (data: number[]) => {
    return data.map((value, index) => {
      const point = getPoint(value, index);
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    }).join(" ") + " Z";
  };

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid levels */}
      {levels.map((level) => {
        const radius = (level / 100) * maxRadius;
        const points = Array.from({ length: 4 }, (_, j) => {
          const angle = angleStep * j - Math.PI / 2;
          return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.3}
          />
        );
      })}

      {/* Axis lines */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(angle)}
            y2={center + maxRadius * Math.sin(angle)}
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.3}
          />
        );
      })}

      {/* Baseline polygon */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        d={createPath(baselineData)}
        fill="var(--text-muted)"
        fillOpacity="0.05"
        stroke="var(--text-muted)"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="4 4"
      />

      {/* Current polygon */}
      <motion.path
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        d={createPath(currentData)}
        fill="var(--primary)"
        fillOpacity="0.15"
        stroke="var(--primary)"
        strokeWidth="2"
      />

      {/* Data points */}
      {currentData.map((value, index) => {
        const point = getPoint(value, index);
        return (
          <motion.circle
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--primary)"
          />
        );
      })}

      {/* Labels with values */}
      {metrics.map((metric, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = maxRadius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <g key={metric.label}>
            <text
              x={x}
              y={y - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] fill-[var(--text-muted)] uppercase tracking-wide"
            >
              {metric.label}
            </text>
            <text
              x={x}
              y={y + 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold fill-[var(--primary)]"
            >
              {metric.display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RunCard({ grade, gradeColor, name, acc, lat, cost, time }: { 
  grade: string; 
  gradeColor: string; 
  name: string; 
  acc: string; 
  lat: string; 
  cost: string; 
  time: string; 
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)]">
      <div 
        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: gradeColor }}
      >
        {grade}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
          <span>Acc: {acc}</span>
          <span>Lat: {lat}</span>
          <span>Cost: {cost}</span>
        </div>
      </div>
      <span className="text-[10px] text-[var(--text-muted)]">{time}</span>
    </div>
  );
}

function SixAxisRadar() {
  const size = 200;
  const center = size / 2;
  const levels = [25, 50, 75, 100];
  const labels = ["Task Completion", "Accuracy", "Plan Quality", "Tool Use", "Efficiency", "Safety"];
  const currentData = [94, 92, 88, 91, 93, 98];
  const baselineData = [80, 85, 75, 82, 78, 90];
  
  const angleStep = (Math.PI * 2) / 6;
  const maxRadius = 70;

  const getPoint = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const createPath = (data: number[]) => {
    return data.map((value, index) => {
      const point = getPoint(value, index);
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    }).join(" ") + " Z";
  };

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid levels - hexagons */}
      {levels.map((level) => {
        const radius = (level / 100) * maxRadius;
        const points = Array.from({ length: 6 }, (_, j) => {
          const angle = angleStep * j - Math.PI / 2;
          return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.4}
          />
        );
      })}

      {/* Axis lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(angle)}
            y2={center + maxRadius * Math.sin(angle)}
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.4}
          />
        );
      })}

      {/* Baseline polygon */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        d={createPath(baselineData)}
        fill="var(--text-muted)"
        fillOpacity="0.08"
        stroke="var(--text-muted)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Current polygon */}
      <motion.path
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        d={createPath(currentData)}
        fill="var(--primary)"
        fillOpacity="0.15"
        stroke="var(--primary)"
        strokeWidth="2"
      />

      {/* Data points for current */}
      {currentData.map((value, index) => {
        const point = getPoint(value, index);
        return (
          <motion.circle
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--primary)"
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = maxRadius + 20;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] fill-[var(--text-muted)]"
          >
            {label}
          </text>
        );
      })}

      {/* Center 100 label */}
      <text
        x={center + 5}
        y={center - maxRadius + 10}
        className="text-[8px] fill-[var(--text-muted)]"
      >
        100
      </text>
    </svg>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-subtle)] border border-[var(--border-light)] rounded-xl p-4 text-center">
      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mb-2">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function EvalRow({ name, score, status, time }: { name: string; score: string; status: "passed" | "failed"; time: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)]">
      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
        status === "passed" 
          ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]" 
          : "bg-[var(--error)]/10 text-[var(--error)]"
      }`}>
        {status === "passed" ? "PASS" : "FAIL"}
      </span>
      <span className="flex-1 text-sm font-medium truncate">{name}</span>
      <span className={`text-sm font-semibold ${
        parseInt(score) >= 80 ? "text-[var(--accent-green)]" : "text-[var(--error)]"
      }`}>{score}</span>
      <span className="text-xs text-[var(--text-muted)]">{time}</span>
    </div>
  );
}

function CompareRow({ label, value, change, winner, negative }: { 
  label: string; 
  value: string; 
  change?: "up" | "down"; 
  winner?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-semibold ${winner ? "text-[var(--accent-green)]" : negative ? "text-[var(--error)]" : ""}`}>
          {value}
        </span>
        {change && (
          <span className={`text-xs ${negative ? "text-[var(--error)]" : "text-[var(--accent-green)]"}`}>
            {change === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </div>
  );
}

function CircularMetric({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="var(--border-light)"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mt-2">{label}</span>
    </div>
  );
}

function DiversityBar({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="w-20 text-xs text-[var(--text-secondary)]">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold">{percentage}%</span>
    </div>
  );
}

function QueryRow({ query, tag, tagColor, score }: { query: string; tag: string; tagColor: string; score: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <span className="flex-1 text-sm text-[var(--text-secondary)] truncate italic">{query}</span>
      <span 
        className="px-2 py-0.5 text-[10px] font-semibold rounded"
        style={{ background: `color-mix(in srgb, ${tagColor} 15%, transparent)`, color: tagColor }}
      >
        {tag}
      </span>
      <span className="text-sm font-semibold text-[var(--accent-green)] w-10 text-right">{score}</span>
    </div>
  );
}
