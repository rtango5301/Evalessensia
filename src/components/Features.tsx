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
    description: "Accuracy, latency, cost, safety — all in one pipeline run.",
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
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--primary)] font-semibold mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Everything you need to eval agents
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Hover over each feature to see it in action
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
      <WindowHeader title="Query Generator" />
      <div className="p-6">
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[var(--text-secondary)]">Coverage Progress</span>
            <span className="text-sm font-semibold">78%</span>
          </div>
          <div className="h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1 }}
              className="h-full bg-[var(--primary)] rounded-full"
            />
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-2">47 queries generated</p>
        </div>

        <h4 className="text-sm font-medium mb-3">Categories:</h4>
        <ScoreBar label="Happy Path" value={12} max={47} color="var(--accent-green)" />
        <ScoreBar label="Edge Cases" value={18} max={47} color="var(--warning)" />
        <ScoreBar label="Adversarial" value={17} max={47} color="var(--error)" />
      </div>
    </div>
  );
}

function MetricsDashboardFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="Metrics Dashboard" />
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard value="94.2%" label="Accuracy" change="▲ +2.1%" up />
          <MetricCard value="1.2s" label="Latency" change="▼ -0.3s" up />
          <MetricCard value="$0.047" label="Cost" />
        </div>

        <div className="bg-[var(--bg-subtle)] rounded-lg p-5">
          <p className="text-sm text-[var(--text-muted)] mb-3">Accuracy over time</p>
          <div className="h-24 flex items-end gap-2">
            {[60, 75, 65, 80, 85, 94].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-1 bg-[var(--primary)] rounded-t"
                style={{ opacity: 0.3 + (i * 0.14) }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ABTestingFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="A/B Comparison" />
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
            <div className="p-3 bg-[var(--bg-subtle)] font-semibold text-sm">v2.3</div>
            <div className="p-4 space-y-2">
              <ABRow label="Accuracy" value="92%" />
              <ABRow label="Latency" value="1.5s" />
              <ABRow label="Cost" value="$0.036" />
            </div>
          </div>
          <div className="border-2 border-[var(--accent-green)] rounded-lg overflow-hidden">
            <div className="p-3 bg-[var(--accent-green)]/10 font-semibold text-sm flex items-center gap-2">
              v2.4 <span className="px-2 py-0.5 bg-[var(--accent-green)] text-white rounded text-xs">WINNER</span>
            </div>
            <div className="p-4 space-y-2">
              <ABRow label="Accuracy" value="94%" change="▲" positive />
              <ABRow label="Latency" value="1.2s" change="▼" positive />
              <ABRow label="Cost" value="$0.047" change="▲" />
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-[var(--accent-green)]">Statistical significance: 95.2%</p>
      </div>
    </div>
  );
}

function ExportFeature() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="Export Training Data" />
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Source</label>
          <select className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md bg-[var(--bg-subtle)] text-sm">
            <option>All eval runs (last 30 days)</option>
          </select>
        </div>
        
        <p className="text-sm mb-4">
          Available: <strong>1,247 traces</strong> | Selected: <strong>1,103</strong> (passed evals)
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <div className="space-y-2">
            {["JSONL (OpenAI format)", "Alpaca format", "ShareGPT format"].map((format, i) => (
              <label key={format} className="flex items-center gap-2 text-sm">
                <input type="radio" name="format" defaultChecked={i === 1} className="accent-[var(--primary)]" />
                {format}
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-[var(--bg-subtle)] rounded-md p-3 font-mono text-xs text-[var(--text-secondary)]">
          {`{"instruction": "How do I track my order?",`}<br />
          {`  "input": "",`}<br />
          {`  "output": "I'd be happy to help..."}`}
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
