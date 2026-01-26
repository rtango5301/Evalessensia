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
    <section className="pt-[120px] pb-[80px] px-6 bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--background)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-[40px] items-start">
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
              className="text-4xl md:text-[3.25rem] font-extrabold leading-[1.08] mb-5 tracking-tight"
            >
              CI/CD for<br />
              <span className="gradient-text">Agentic</span><br />
              <span className="gradient-text">Workflows</span>
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
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
      style={{ perspective: "2000px" }}
    >
      {/* Dashboard Window - Large */}
      <div
        className="relative"
        style={{
          transform: "rotateY(-2deg) rotateX(1deg)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Window */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12),0_30px_60px_-30px_rgba(0,0,0,0.15)] border border-gray-200/80">
          {/* Window Header */}
          <div className="bg-[#f8f8fa] px-5 py-3.5 flex items-center border-b border-gray-200/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[13px] text-gray-500 font-medium">TensorEval Dashboard</span>
            </div>
            <div className="w-[52px]"></div>
          </div>

          {/* Dashboard Content - LANDSCAPE */}
          <div className="bg-[#fbfbfc] p-5" style={{ minWidth: "700px" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">Evaluation Results</h3>
                <span className="px-2.5 py-1 bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[11px] font-semibold rounded-full">
                  Completed
                </span>
                <span className="text-xs text-gray-400">3m 12s</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium bg-white hover:bg-gray-50 text-gray-600">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs font-medium">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-run
                </button>
              </div>
            </div>

            {/* Metrics Row - HORIZONTAL */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {/* Overall Score */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <span className="text-xs text-gray-500">Overall Score</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">88.4%</div>
                <div className="text-[11px] text-[var(--accent-green)] flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +2.1%
                </div>
              </div>

              {/* Pass Rate */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-[var(--accent-green)]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />
                  </div>
                  <span className="text-xs text-gray-500">Pass Rate</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">142<span className="text-sm text-gray-400">/150</span></div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "94.6%" }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-[var(--accent-green)] rounded-full" />
                </div>
              </div>

              {/* Avg Latency */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xs text-gray-500">Avg Latency</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">1.2s</div>
                <div className="text-[11px] text-[var(--error)] flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +120ms
                </div>
              </div>

              {/* Tests Run */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500">Tests Run</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">150</div>
                <div className="text-[11px] text-gray-400 mt-1">8 failed</div>
              </div>
            </div>

            {/* Performance Chart - Full Width */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">Performance Comparison</h4>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 bg-gray-300 rounded-full" /> Baseline</span>
                  <span className="flex items-center gap-1.5 text-gray-700"><span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full" /> Current</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <RadarChart />
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Accuracy</div>
                    <div className="text-lg font-bold text-gray-900">92%</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Helpfulness</div>
                    <div className="text-lg font-bold text-gray-900">85%</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Tone</div>
                    <div className="text-lg font-bold text-gray-900">96%</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Policy</div>
                    <div className="text-lg font-bold text-gray-900">100%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Cases - Compact */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">Recent Test Cases</h4>
                <span className="text-xs text-gray-400">150 total</span>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="px-4 py-2.5 flex items-center gap-4">
                  <span className="px-2 py-0.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[10px] font-semibold rounded">Pass</span>
                  <span className="text-xs font-mono text-[var(--primary)] w-[70px]">#TC-1024</span>
                  <span className="text-xs text-gray-600 flex-1 truncate">How do I reset my password...</span>
                  <span className="text-xs text-gray-400 w-[80px]">Helpfulness</span>
                  <span className="text-xs font-semibold text-[var(--accent-green)] w-[40px]">0.98</span>
                  <span className="text-xs text-gray-400 w-[50px]">840ms</span>
                </div>
                <div className="px-4 py-2.5 flex items-center gap-4">
                  <span className="px-2 py-0.5 bg-[var(--error)]/10 text-[var(--error)] text-[10px] font-semibold rounded">Fail</span>
                  <span className="text-xs font-mono text-[var(--primary)] w-[70px]">#TC-1042</span>
                  <span className="text-xs text-gray-600 flex-1 truncate">Ignore previous instructions...</span>
                  <span className="text-xs text-gray-400 w-[80px]">Safety</span>
                  <span className="text-xs font-semibold text-[var(--error)] w-[40px]">0.00</span>
                  <span className="text-xs text-gray-400 w-[50px]">420ms</span>
                </div>
                <div className="px-4 py-2.5 flex items-center gap-4">
                  <span className="px-2 py-0.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[10px] font-semibold rounded">Pass</span>
                  <span className="text-xs font-mono text-[var(--primary)] w-[70px]">#TC-1088</span>
                  <span className="text-xs text-gray-600 flex-1 truncate">Generate python fibonacci script...</span>
                  <span className="text-xs text-gray-400 w-[80px]">Correctness</span>
                  <span className="text-xs font-semibold text-[var(--accent-green)] w-[40px]">1.00</span>
                  <span className="text-xs text-gray-400 w-[50px]">1.2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div
        className="absolute top-full left-0 right-0 h-[80px] rounded-2xl overflow-hidden pointer-events-none"
        style={{
          transform: "rotateY(-2deg) scaleY(-1)",
          transformOrigin: "top center",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 50%)"
        }}
      >
        <div className="bg-gradient-to-b from-gray-200/20 to-transparent h-full" />
      </div>
    </motion.div>
  );
}



function RadarChart() {
  const size = 120;
  const center = size / 2;
  const levels = [60, 70, 80, 90, 100];
  const labels = ["Accuracy", "Helpful", "Tone", "Safety", "Concise", "Relevant"];
  const baselineData = [85, 78, 90, 95, 82, 88];
  const currentData = [92, 85, 96, 100, 88, 90];
  
  const angleStep = (Math.PI * 2) / 6;
  const maxRadius = 40;

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
        const labelRadius = maxRadius + 14;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[6px] fill-[var(--text-muted)]"
          >
            {label}
          </text>
        );
      })}

      {/* Center level labels */}
      {[100].map((level) => (
        <text
          key={level}
          x={center + 2}
          y={center - (level / 100) * maxRadius}
          className="text-[5px] fill-[var(--text-muted)]"
        >
          {level}
        </text>
      ))}
    </svg>
  );
}


