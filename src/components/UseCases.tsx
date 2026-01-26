"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, BarChart3, MessageSquare, PenLine, TrendingUp, Check } from "lucide-react";

const useCases = [
  {
    icon: Globe,
    title: "Browser Agents",
    description: "Eval navigation, form fills, multi-step workflows",
    metric: "98.2% nav accuracy",
  },
  {
    icon: BarChart3,
    title: "Data Analysis",
    description: "Validate SQL, charts, insight relevance",
    metric: "12 regressions caught",
  },
  {
    icon: MessageSquare,
    title: "Customer Support",
    description: "Test response quality, tone, escalation",
    metric: "23% fewer escalations",
  },
  {
    icon: PenLine,
    title: "Content Creation",
    description: "Brand voice, factual accuracy, style",
    metric: "40% brand score lift",
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
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--primary)] font-semibold mb-3">
            Use Cases
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Built for every type of agent
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Hover over each agent type to see specialized evaluation
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
                      ? "border-[var(--primary)] shadow-md shadow-[var(--primary)]/10"
                      : "border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md hover:shadow-[var(--primary)]/10"
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
      <WindowHeader title="Browser Agent Eval" />
      <div className="p-6">
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Task: "Book a flight from NYC to LA on Expedia"
        </p>
        
        <div className="bg-[var(--bg-muted)] rounded-lg p-5 text-center mb-4">
          <div className="text-sm text-[var(--text-muted)] mb-2">[Browser Screenshot]</div>
          <div className="bg-white rounded p-4 text-left text-sm space-y-2">
            <div>● Click: Search button</div>
            <div>● Type: "New York" in From field</div>
            <div>● Click: First result</div>
          </div>
          <p className="mt-3 text-sm text-[var(--text-muted)]">Step 3 of 8 [▶ Replay]</p>
        </div>
        
        <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
          <TestResultRow label="Steps completed" value="8/8 ✓" />
          <TestResultRow label="Navigation accuracy" value="98.2% ✓" />
          <TestResultRow label="Total time" value="12.4s ✓" />
        </div>
      </div>
    </div>
  );
}

function DataAgentScreen() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="Data Agent Eval" />
      <div className="p-6">
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Query: "Show revenue by region for Q4 2024"
        </p>
        
        <div className="bg-[#1e293b] rounded-lg p-4 font-mono text-sm text-[#e2e8f0] mb-4">
          <span className="text-[#60a5fa]">SELECT</span> region,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#60a5fa]">SUM</span>(revenue) <span className="text-[#60a5fa]">as</span> total<br />
          <span className="text-[#60a5fa]">FROM</span> sales<br />
          <span className="text-[#60a5fa]">WHERE</span> quarter = <span className="text-[#4ade80]">'Q4'</span><br />
          &nbsp;&nbsp;<span className="text-[#60a5fa]">AND</span> year = <span className="text-[#fb923c]">2024</span><br />
          <span className="text-[#60a5fa]">GROUP BY</span> region<br />
          <span className="text-[#60a5fa]">ORDER BY</span> total <span className="text-[#60a5fa]">DESC</span>;
        </div>
        
        <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
          <TestResultRow label="SQL Syntax" value="Valid ✓" />
          <TestResultRow label="Query Logic" value="Correct ✓" />
          <TestResultRow label="Chart Type" value="Bar ✓" />
          <TestResultRow label="Data Accuracy" value="100% ✓" />
        </div>
      </div>
    </div>
  );
}

function SupportAgentScreen() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="Support Agent Eval" />
      <div className="p-6">
        <div className="bg-[var(--bg-subtle)] rounded-lg p-3 mb-4">
          <p className="text-sm text-[var(--text-muted)] mb-1">Test Query:</p>
          <p className="text-sm">"I want a refund, this product sucks and I'm really angry"</p>
        </div>
        
        <div className="bg-white border border-[var(--border)] rounded-lg p-3 mb-5">
          <p className="text-sm text-[var(--text-muted)] mb-1">Response:</p>
          <p className="text-sm">
            "I'm sorry to hear you're unhappy with your purchase. I completely understand how 
            frustrating that can be. I'd be happy to help process a refund..."
          </p>
        </div>
        
        <h4 className="text-sm font-semibold mb-3">Quality Metrics</h4>
        <ScoreBar label="Tone" value={94} />
        <ScoreBar label="Helpfulness" value={91} />
        <ScoreBar label="Professional" value={98} />
      </div>
    </div>
  );
}

function ContentAgentScreen() {
  return (
    <div className="bg-white border border-[var(--ui-border)] rounded-xl overflow-hidden shadow-lg">
      <WindowHeader title="Content Agent Eval" />
      <div className="p-6">
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Task: "Write a tweet announcing Smart Sync feature"
        </p>
        
        <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-5">
          <p className="text-[0.95rem]">
            "Introducing Smart Sync - your data, always up to date, everywhere. 
            No more manual exports. Just connect and go. Try it free today. 🚀"
          </p>
          <p className="text-right text-sm text-[var(--text-muted)] mt-2">142/280 chars</p>
        </div>
        
        <h4 className="text-sm font-semibold mb-3">Content Quality</h4>
        <ScoreBar label="Brand Voice" value={82} />
        <ScoreBar label="Factual" value={100} highlight />
        <ScoreBar label="Style Guide" value={94} />
      </div>
    </div>
  );
}

// Helper Components
function TestResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-light)] last:border-b-0 text-sm">
      <span>{label}</span>
      <span className="text-[var(--accent-green)]">{value}</span>
    </div>
  );
}

function ScoreBar({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="w-24 text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex-1 h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: highlight ? "var(--accent-green)" : "var(--primary)" }}
        />
      </div>
      <span className="w-10 text-right text-sm font-semibold">{value}%</span>
    </div>
  );
}
