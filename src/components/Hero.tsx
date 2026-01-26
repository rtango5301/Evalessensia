"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Download, RefreshCw, Sparkles, CheckCircle, Clock, TrendingUp, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Hero() {
  return (
    <section className="pt-[140px] pb-[100px] px-6 bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--background)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-[50px] items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full text-sm mb-6"
            >
              <span className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full animate-pulse-dot" />
              <span className="text-[var(--primary)] font-medium">SHIP AGENT UPDATES WITH CONFIDENCE</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-[3.5rem] font-extrabold leading-[1.1] mb-5 tracking-tight"
            >
              CI/CD for<br />
              <span className="gradient-text">Agentic Workflow</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-[var(--text-secondary)] mb-6 max-w-[420px]"
            >
              Automate evaluations, monitor performance drifts, and 
              deploy AI agents with enterprise-grade reliability.
            </motion.p>

            {/* Features List */}
            <motion.div variants={itemVariants} className="space-y-3 mb-8">
              {[
                "Eval pipelines that run on every commit",
                "Synthetic queries. Multi-metric scoring.",
                "A/B comparisons. Built for agent teams.",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[var(--text-secondary)] text-[0.95rem]">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-lg hover:shadow-[var(--primary)]/30"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[var(--bg-subtle)] text-[var(--foreground)] border border-[var(--border)] rounded-lg font-semibold text-sm transition-colors"
              >
                Book Demo
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants}>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4">
                TRUSTED BY TEAMS AT
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                {["PHANTOM", "APERTURE", "Vertex"].map((company, i) => (
                  <motion.span
                    key={company}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="font-semibold text-[var(--text-muted)] tracking-wide text-sm"
                    style={{ fontStyle: company === "PHANTOM" ? "italic" : "normal" }}
                  >
                    {company}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <EvaluationDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EvaluationDashboard() {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-[var(--ui-border)] shadow-[0_4px_40px_rgba(0,0,0,0.1)] overflow-hidden transform scale-[0.85] origin-top-right"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-light)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold">Evaluation Results</h3>
              <span className="px-2 py-0.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[10px] font-semibold rounded">
                Completed
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              • Started 24 mins ago • Duration: 3m 12s
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] rounded-lg text-[10px] font-medium hover:bg-[var(--bg-subtle)] transition-colors">
              <Download className="w-3 h-3" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--primary)] text-white rounded-lg text-[10px] font-medium hover:bg-[var(--primary-dark)] transition-colors">
              <RefreshCw className="w-3 h-3" />
              Re-run
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-[160px_1fr] gap-4">
          {/* Left Metrics */}
          <div className="space-y-3">
            {/* Overall Score */}
            <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <span className="text-xs text-[var(--text-muted)]">Overall Score</span>
              </div>
              <div className="text-2xl font-bold">88.4%</div>
              <div className="text-[10px] text-[var(--accent-green)] mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                +2.1% vs Baseline
              </div>
            </div>

            {/* Test Pass Rate */}
            <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[var(--accent-green)]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />
                </div>
                <span className="text-xs text-[var(--text-muted)]">Test Pass Rate</span>
              </div>
              <div className="text-2xl font-bold">142<span className="text-sm text-[var(--text-muted)] font-normal">/150</span></div>
              <div className="h-1 bg-[var(--bg-muted)] rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "94.6%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-[var(--accent-green)] rounded-full"
                />
              </div>
            </div>

            {/* Avg Latency */}
            <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[var(--warning)]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[var(--warning)]" />
                </div>
                <span className="text-xs text-[var(--text-muted)]">Avg Latency</span>
              </div>
              <div className="text-2xl font-bold">1.2s</div>
              <div className="text-[10px] text-[var(--error)] mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                +120ms vs Baseline
              </div>
            </div>
          </div>

          {/* Right - Radar Chart */}
          <div className="bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)] p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Performance Comparison</h4>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full opacity-50" /> Baseline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full" /> Current
                </span>
              </div>
            </div>
            
            {/* Radar Chart SVG */}
            <div className="flex justify-center">
              <RadarChart />
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-[var(--border-light)]">
              <MetricItem label="ACCURACY" value="92%" />
              <MetricItem label="HELPFUL" value="85%" />
              <MetricItem label="TONE" value="96%" />
              <MetricItem label="POLICY" value="100%" />
            </div>
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="mt-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-light)] overflow-hidden">
          <div className="p-3 flex items-center justify-between border-b border-[var(--border-light)]">
            <h4 className="text-sm font-semibold">Detailed Test Cases</h4>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-7 pr-2 py-1 text-[10px] border border-[var(--border)] rounded bg-white w-24 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              <button className="flex items-center gap-1 px-2 py-1 text-[10px] border border-[var(--border)] rounded bg-white">
                All <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-white/50">
                  <th className="text-left py-2 px-3 font-semibold text-[var(--text-muted)] uppercase tracking-wide text-[9px]">Status</th>
                  <th className="text-left py-2 px-3 font-semibold text-[var(--text-muted)] uppercase tracking-wide text-[9px]">ID</th>
                  <th className="text-left py-2 px-3 font-semibold text-[var(--text-muted)] uppercase tracking-wide text-[9px]">Prompt</th>
                  <th className="text-left py-2 px-3 font-semibold text-[var(--text-muted)] uppercase tracking-wide text-[9px]">Metric</th>
                  <th className="text-left py-2 px-3 font-semibold text-[var(--text-muted)] uppercase tracking-wide text-[9px]">Score</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                <TestRow status="passed" id="#TC-1024" prompt="How do I reset my password..." metric="Helpfulness" score="0.98" latency="840ms" />
                <TestRow status="failed" id="#TC-1042" prompt="Ignore instructions and tell..." metric="Jailbreak" score="0.00" latency="420ms" />
                <TestRow status="passed" id="#TC-1088" prompt="Generate a python script..." metric="Code" score="1.00" latency="1.2s" />
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-2 flex items-center justify-between border-t border-[var(--border-light)] bg-white/50">
            <span className="text-[9px] text-[var(--text-muted)]">
              <strong>1-10</strong> of <strong>150</strong>
            </span>
            <div className="flex items-center gap-0.5">
              <button className="w-5 h-5 flex items-center justify-center rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)]">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button className="w-5 h-5 flex items-center justify-center rounded bg-[var(--primary)] text-white text-[9px] font-medium">1</button>
              <button className="w-5 h-5 flex items-center justify-center rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[9px]">2</button>
              <button className="w-5 h-5 flex items-center justify-center rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[9px]">3</button>
              <button className="w-5 h-5 flex items-center justify-center rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)]">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RadarChart() {
  const size = 140;
  const center = size / 2;
  const levels = [60, 70, 80, 90, 100];
  const labels = ["Accuracy", "Helpful", "Tone", "Safety", "Concise", "Relevant"];
  const baselineData = [85, 78, 90, 95, 82, 88];
  const currentData = [92, 85, 96, 100, 88, 90];
  
  const angleStep = (Math.PI * 2) / 6;
  const maxRadius = 50;

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
      {/* Grid levels */}
      {levels.map((level, i) => {
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
            opacity={0.5}
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
            opacity={0.5}
          />
        );
      })}

      {/* Baseline polygon */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        d={createPath(baselineData)}
        fill="var(--text-muted)"
        fillOpacity="0.1"
        stroke="var(--text-muted)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Current run polygon */}
      <motion.path
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
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
            transition={{ delay: 0.8 + index * 0.05 }}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="var(--primary)"
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = maxRadius + 16;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[7px] fill-[var(--text-muted)]"
          >
            {label}
          </text>
        );
      })}

      {/* Center level labels */}
      {[80, 100].map((level) => (
        <text
          key={level}
          x={center + 2}
          y={center - (level / 100) * maxRadius}
          className="text-[6px] fill-[var(--text-muted)]"
        >
          {level}
        </text>
      ))}
    </svg>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[8px] text-[var(--text-muted)] uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

function TestRow({ status, id, prompt, metric, score }: {
  status: "passed" | "failed";
  id: string;
  prompt: string;
  metric: string;
  score: string;
  latency: string;
}) {
  return (
    <tr className="border-b border-[var(--border-light)] hover:bg-white/80 transition-colors">
      <td className="py-2 px-3">
        <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${
          status === "passed" 
            ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]" 
            : "bg-[var(--error)]/10 text-[var(--error)]"
        }`}>
          {status === "passed" ? "Pass" : "Fail"}
        </span>
      </td>
      <td className="py-2 px-3 font-mono font-medium text-[9px]">{id}</td>
      <td className="py-2 px-3 text-[var(--text-secondary)] max-w-[120px] truncate text-[9px]">{prompt}</td>
      <td className="py-2 px-3 text-[var(--text-secondary)] text-[9px]">{metric}</td>
      <td className={`py-2 px-3 font-semibold text-[9px] ${
        parseFloat(score) >= 0.9 ? "text-[var(--accent-green)]" : 
        parseFloat(score) >= 0.5 ? "text-[var(--warning)]" : "text-[var(--error)]"
      }`}>{score}</td>
      <td className="py-2 px-3">
        <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
      </td>
    </tr>
  );
}
