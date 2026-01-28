// Agents Management Page
// Route: /agents

import Link from 'next/link';

// Mock data for agents
const agents = [
  {
    id: '1',
    name: 'Support Bot v2.4',
    category: 'Customer Service',
    emoji: '🤖',
    emojiBg: 'bg-blue-50',
    status: 'Active',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    accuracy: 94,
    trend: '+2.1%',
    trendUp: true,
    totalRuns: '1.2k',
    lastRun: '2m ago',
  },
  {
    id: '2',
    name: 'Finance Analyzer',
    category: 'Data Processing',
    emoji: '📊',
    emojiBg: 'bg-purple-50',
    status: 'Failing',
    statusColor: 'bg-red-100 text-red-700 border-red-200',
    accuracy: 68,
    trend: '-5.4%',
    trendUp: false,
    totalRuns: '450',
    lastRun: '1h ago',
  },
  {
    id: '3',
    name: 'Content Gen Alpha',
    category: 'Generative Text',
    emoji: '📝',
    emojiBg: 'bg-indigo-50',
    status: 'Active',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    accuracy: 88,
    trend: '0%',
    trendUp: null,
    totalRuns: '89',
    lastRun: '1d ago',
  },
  {
    id: '4',
    name: 'Code Reviewer',
    category: 'Development',
    emoji: '🧑‍💻',
    emojiBg: 'bg-orange-50',
    status: 'Active',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    accuracy: 91,
    trend: '+0.8%',
    trendUp: true,
    totalRuns: '2.4k',
    lastRun: '15m ago',
  },
  {
    id: '5',
    name: 'Legal Assistant',
    category: 'Legal Review',
    emoji: '⚖️',
    emojiBg: 'bg-gray-100',
    status: 'Archived',
    statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    accuracy: null,
    trend: null,
    trendUp: null,
    totalRuns: '120',
    lastRun: '3mo ago',
  },
  {
    id: '6',
    name: 'Chat QA',
    category: 'Support',
    emoji: '💬',
    emojiBg: 'bg-teal-50',
    status: 'Active',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    accuracy: 76,
    trend: '+12%',
    trendUp: true,
    totalRuns: '3.1k',
    lastRun: '5m ago',
  },
];

const statusFilters = ['All Status', 'Active', 'Failing', 'Archived'];

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agents Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor, evaluate, and configure your AI agents.
          </p>
        </div>
        <Link
          href="/agents/new"
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30 w-fit"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Create New Agent
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search & Filters */}
        <div className="flex flex-1 w-full md:w-auto items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 text-slate-900 text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#135bec] focus:bg-white transition-all"
              placeholder="Search by agent name..."
              type="text"
            />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

          {/* Status Chips */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {statusFilters.map((filter, index) => (
              <button
                key={filter}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  index === 0
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center shrink-0">
          <button className="p-1.5 rounded bg-white shadow-sm text-slate-900">
            <span className="material-symbols-outlined text-xl">grid_view</span>
          </button>
          <button className="p-1.5 rounded text-slate-500 hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined text-xl">view_list</span>
          </button>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <article
            key={agent.id}
            className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full ${
              agent.status === 'Archived' ? 'opacity-75' : ''
            } ${agent.status === 'Failing' ? 'hover:border-red-400' : 'hover:border-[#135bec]/50'}`}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full ${agent.emojiBg} flex items-center justify-center text-xl shadow-inner`}
                  >
                    {agent.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-slate-500">{agent.category}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${agent.statusColor}`}
                >
                  {agent.status}
                </span>
              </div>

              {/* Score */}
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-1">
                  <span
                    className={`text-4xl font-bold ${agent.accuracy === null ? 'text-slate-400' : 'text-slate-900'}`}
                  >
                    {agent.accuracy !== null ? `${agent.accuracy}%` : '--'}
                  </span>
                  {agent.trend && (
                    <span
                      className={`flex items-center text-sm font-bold mb-1.5 ${
                        agent.trendUp === true
                          ? 'text-green-600'
                          : agent.trendUp === false
                            ? 'text-red-600'
                            : 'text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {agent.trendUp === true
                          ? 'trending_up'
                          : agent.trendUp === false
                            ? 'trending_down'
                            : 'remove'}
                      </span>
                      {agent.trend}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Accuracy Score
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{agent.totalRuns}</p>
                  <p className="text-slate-500 text-xs">Total Runs</p>
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{agent.lastRun}</p>
                  <p className="text-slate-500 text-xs">Last Run</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              {agent.status === 'Archived' ? (
                <>
                  <button className="flex-1 bg-gray-200 text-slate-500 text-sm font-bold py-2 rounded-lg cursor-not-allowed">
                    Restore
                  </button>
                  <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                    Logs
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 bg-[#135bec] hover:bg-[#135bec]/90 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    Run Eval
                  </button>
                  <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                    Configure
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
