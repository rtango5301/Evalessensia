// Dashboard Page - My Agents and Recent Evaluation Runs
// Route: /dashboard

import Link from 'next/link';

// Mock data for agents
const agents = [
  {
    id: '1',
    name: 'Support Bot',
    icon: 'support_agent',
    iconBg: 'bg-[#135bec]/10',
    iconColor: 'text-[#135bec]',
    status: 'Active',
    statusColor: 'bg-emerald-100 text-emerald-800',
    type: 'Customer Service Automation',
    lastRun: '2m ago',
  },
  {
    id: '2',
    name: 'Data Analyst',
    icon: 'analytics',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    status: 'Running',
    statusColor: 'bg-blue-100 text-blue-800 animate-pulse',
    type: 'Financial Report Analysis',
    lastRun: '15m ago',
  },
  {
    id: '3',
    name: 'Browser Agent',
    icon: 'public',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    status: 'Idle',
    statusColor: 'bg-slate-100 text-slate-600',
    type: 'Web Scraping & Summary',
    lastRun: '1h ago',
  },
  {
    id: '4',
    name: 'Content Writer',
    icon: 'edit_note',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    status: 'Failed',
    statusColor: 'bg-red-100 text-red-800',
    type: 'Blog Post Generation',
    lastRun: '3h ago',
  },
];

// Mock data for evaluation runs
const evaluationRuns = [
  {
    id: 'RUN-2024',
    agentName: 'Support Bot',
    agentIcon: 'support_agent',
    iconBg: 'bg-[#135bec]/10',
    iconColor: 'text-[#135bec]',
    date: '2 mins ago',
    accuracy: '98.5%',
    accuracyColor: 'text-slate-900',
    status: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'RUN-2023',
    agentName: 'Data Analyst',
    agentIcon: 'analytics',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    date: '15 mins ago',
    accuracy: '--',
    accuracyColor: 'text-slate-400',
    status: 'Processing',
    statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'RUN-2022',
    agentName: 'Browser Agent',
    agentIcon: 'public',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    date: '1 hr ago',
    accuracy: '92.4%',
    accuracyColor: 'text-slate-900',
    status: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'RUN-2021',
    agentName: 'Content Writer',
    agentIcon: 'edit_note',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    date: '3 hrs ago',
    accuracy: '45.0%',
    accuracyColor: 'text-red-600',
    status: 'Failed',
    statusColor: 'bg-red-100 text-red-800 border-red-200',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* My Agents Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-slate-900 text-lg font-bold">My Agents</h3>
          <Link
            href="/dashboard/agents"
            className="text-[#135bec] text-sm font-bold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Last Run
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8 rounded-lg ${agent.iconBg} flex items-center justify-center ${agent.iconColor}`}
                        >
                          <span className="material-symbols-outlined text-lg">{agent.icon}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{agent.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${agent.statusColor}`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{agent.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 text-right">{agent.lastRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Evaluation Runs Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-slate-900 text-lg font-bold">Recent Evaluation Runs</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Run ID
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {evaluationRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-6 rounded ${run.iconBg} flex items-center justify-center ${run.iconColor}`}
                        >
                          <span className="material-symbols-outlined text-sm">{run.agentIcon}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{run.agentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">#{run.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{run.date}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${run.accuracyColor} text-right`}>
                      {run.accuracy}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${run.statusColor}`}
                      >
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-10"></div>
    </div>
  );
}
