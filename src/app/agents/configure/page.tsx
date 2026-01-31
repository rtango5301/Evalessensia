// Create New Agent - Step 2: Configuration
// Route: /agents/configure
// Two main sections: 1) MCP Servers, 2) Query Configuration

'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useRef } from 'react';

// ============================================================================
// MCP MARKETPLACE DATA (32+ integrations)
// ============================================================================
const mcpMarketplace = [
  // Google Suite
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send, read, and search emails',
    icon: 'mail',
    category: 'Google Suite',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Create events, manage calendars',
    icon: 'calendar_month',
    category: 'Google Suite',
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Create and edit documents',
    icon: 'description',
    category: 'Google Suite',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Upload, download, manage files',
    icon: 'cloud',
    category: 'Google Suite',
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Create and edit spreadsheets',
    icon: 'table_chart',
    category: 'Google Suite',
  },

  // Communication
  {
    id: 'slack',
    name: 'Slack',
    description: 'Post messages, manage channels',
    icon: 'chat',
    category: 'Communication',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send messages, manage servers',
    icon: 'forum',
    category: 'Communication',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Chat, meetings, collaboration',
    icon: 'groups',
    category: 'Communication',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Send messages, manage bots',
    icon: 'send',
    category: 'Communication',
  },

  // Dev Tools
  {
    id: 'github',
    name: 'GitHub',
    description: 'Manage repos, issues, pull requests',
    icon: 'code',
    category: 'Dev Tools',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Manage repos, issues, merge requests',
    icon: 'merge_type',
    category: 'Dev Tools',
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Create issues, manage cycles',
    icon: 'linear_scale',
    category: 'Dev Tools',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Create issues, manage sprints',
    icon: 'bug_report',
    category: 'Dev Tools',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    description: 'Create and manage documentation',
    icon: 'article',
    category: 'Dev Tools',
  },

  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create pages, manage databases',
    icon: 'edit_note',
    category: 'Productivity',
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Manage bases, tables, records',
    icon: 'grid_view',
    category: 'Productivity',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Manage boards, lists, cards',
    icon: 'view_kanban',
    category: 'Productivity',
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Create tasks, manage projects',
    icon: 'task_alt',
    category: 'Productivity',
  },
  {
    id: 'monday',
    name: 'Monday.com',
    description: 'Manage workspaces, boards',
    icon: 'calendar_view_week',
    category: 'Productivity',
  },

  // Data/Database
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Query and manage databases',
    icon: 'database',
    category: 'Database',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Query and manage databases',
    icon: 'storage',
    category: 'Database',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Query document databases',
    icon: 'data_object',
    category: 'Database',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Database, auth, storage',
    icon: 'bolt',
    category: 'Database',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Realtime DB, auth, hosting',
    icon: 'local_fire_department',
    category: 'Database',
  },

  // Cloud
  {
    id: 'aws',
    name: 'AWS',
    description: 'EC2, S3, Lambda, and more',
    icon: 'cloud_queue',
    category: 'Cloud',
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    description: 'Compute, storage, AI services',
    icon: 'cloud_circle',
    category: 'Cloud',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deploy and manage projects',
    icon: 'rocket_launch',
    category: 'Cloud',
  },

  // Design
  {
    id: 'figma',
    name: 'Figma',
    description: 'Access and manage design files',
    icon: 'palette',
    category: 'Design',
  },

  // Browser/Automation
  {
    id: 'playwright',
    name: 'Playwright',
    description: 'Browser automation, web scraping',
    icon: 'public',
    category: 'Automation',
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: 'Headless browser automation',
    icon: 'smart_toy',
    category: 'Automation',
  },

  // File System
  {
    id: 'filesystem',
    name: 'Local Files',
    description: 'Read and write local files',
    icon: 'folder',
    category: 'File System',
  },
  {
    id: 's3',
    name: 'Amazon S3',
    description: 'Cloud file storage',
    icon: 'cloud_upload',
    category: 'File System',
  },
];

// Query category options
const queryCategories = [
  {
    id: 'happy_path',
    name: 'Happy Path',
    description: 'Standard user queries with clear intent',
    icon: 'sentiment_satisfied',
    color: 'text-green-600',
  },
  {
    id: 'edge_cases',
    name: 'Edge Cases',
    description: 'Ambiguous or incomplete inputs',
    icon: 'warning',
    color: 'text-amber-500',
  },
  {
    id: 'adversarial',
    name: 'Adversarial',
    description: 'Injection attempts, jailbreaks',
    icon: 'gpp_bad',
    color: 'text-red-500',
  },
  {
    id: 'domain_specific',
    name: 'Domain-Specific',
    description: 'Based on configured MCPs',
    icon: 'tune',
    color: 'text-blue-600',
  },
];

// Custom MCP type
interface CustomMCP {
  id: string;
  name: string;
  url: string;
  description: string;
  isCustom: true;
}

interface MarketplaceMCP {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isCustom?: false;
}

type AddedMCP = CustomMCP | MarketplaceMCP;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentName = searchParams.get('name') || 'New Agent';
  const agentType = searchParams.get('type') || 'custom';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MCP State
  const [addedMcps, setAddedMcps] = useState<AddedMCP[]>([]);
  const [showMarketplace, setShowMarketplace] = useState(true);
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [showCustomMcpDialog, setShowCustomMcpDialog] = useState(false);
  const [customMcpName, setCustomMcpName] = useState('');
  const [customMcpUrl, setCustomMcpUrl] = useState('');
  const [customMcpDescription, setCustomMcpDescription] = useState('');

  // Query Config State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiQueryCount, setAiQueryCount] = useState(50);
  const [aiQueryTypes, setAiQueryTypes] = useState<string[]>(['happy_path', 'edge_cases']);
  const [aiContext, setAiContext] = useState('');
  const [aiQueriesGenerated, setAiQueriesGenerated] = useState(false);

  // Filter marketplace MCPs
  const filteredMcps = mcpMarketplace.filter(
    (mcp) =>
      mcp.name.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
      mcp.description.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
      mcp.category.toLowerCase().includes(marketplaceSearch.toLowerCase())
  );

  // Add MCP from marketplace
  const addMarketplaceMcp = (mcp: (typeof mcpMarketplace)[0]) => {
    if (!addedMcps.find((m) => m.id === mcp.id)) {
      setAddedMcps([...addedMcps, { ...mcp, isCustom: false }]);
    }
  };

  // Add custom MCP
  const addCustomMcp = () => {
    if (customMcpName && customMcpUrl) {
      const newMcp: CustomMCP = {
        id: `custom-${Date.now()}`,
        name: customMcpName,
        url: customMcpUrl,
        description: customMcpDescription || 'Custom MCP server',
        isCustom: true,
      };
      setAddedMcps([...addedMcps, newMcp]);
      setShowCustomMcpDialog(false);
      setCustomMcpName('');
      setCustomMcpUrl('');
      setCustomMcpDescription('');
    }
  };

  // Remove MCP
  const removeMcp = (mcpId: string) => {
    setAddedMcps(addedMcps.filter((m) => m.id !== mcpId));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.jsonl') || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
    }
  };

  // Toggle AI query type
  const toggleAiQueryType = (typeId: string) => {
    setAiQueryTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  // Generate AI queries
  const generateAiQueries = () => {
    setAiQueriesGenerated(true);
  };

  // Increment/decrement AI query count
  const incrementQueryCount = () => {
    setAiQueryCount((prev) => Math.min(prev + 10, 500));
  };

  const decrementQueryCount = () => {
    setAiQueryCount((prev) => Math.max(prev - 10, 10));
  };

  // Handle continue
  const handleContinue = () => {
    const params = new URLSearchParams({
      name: agentName,
      type: agentType,
      mcps: addedMcps.map((m) => m.id).join(','),
      queryMethod: uploadedFile ? 'upload' : aiQueriesGenerated ? 'ai' : 'none',
      aiQueryCount: aiQueryCount.toString(),
      aiQueryTypes: aiQueryTypes.join(','),
    });
    router.push(`/agents/review?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/agents" className="hover:text-[#135bec] transition-colors">
            Agents
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-slate-900 font-medium">Configure Agent</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configure Agent</h1>
        <p className="text-slate-500 text-sm">
          Set up MCP connections and evaluation parameters for {agentName}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-[#135bec] text-white text-sm font-bold">
            <span className="material-symbols-outlined text-lg">check</span>
          </div>
          <span className="text-sm font-medium text-[#135bec]">Agent Type</span>
        </div>
        <div className="flex-1 h-px bg-[#135bec] mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-[#135bec] text-white text-sm font-bold">
            2
          </div>
          <span className="text-sm font-medium text-slate-900">Configuration</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-full bg-slate-200 text-slate-500 text-sm font-bold">
            3
          </div>
          <span className="text-sm text-slate-500">Review</span>
        </div>
      </div>

      {/* ============================================= */}
      {/* SECTION 1: MCP Servers */}
      {/* ============================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-lg bg-[#135bec]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#135bec]">dns</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">MCP Servers</h2>
            <p className="text-sm text-slate-500">
              Connect your agent to MCP servers for tools, APIs, and integrations
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowCustomMcpDialog(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-[#135bec] text-[#135bec] font-medium text-sm hover:bg-[#135bec]/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Custom MCP
          </button>
          <button
            type="button"
            onClick={() => setShowMarketplace(!showMarketplace)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#135bec] text-white font-medium text-sm hover:bg-[#135bec]/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">store</span>
            {showMarketplace ? 'Hide Marketplace' : 'Browse Marketplace'}
          </button>
        </div>

        {/* Added MCPs */}
        {addedMcps.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-700">Added MCPs</span>
              <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                {addedMcps.length} configured
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {addedMcps.map((mcp) => (
                <div
                  key={mcp.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-sm"
                >
                  {mcp.isCustom ? (
                    <span className="material-symbols-outlined text-base text-purple-600">
                      link
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-base text-[#135bec]">
                      {(mcp as MarketplaceMCP).icon}
                    </span>
                  )}
                  <span className="font-medium text-slate-700">{mcp.name}</span>
                  <button
                    type="button"
                    onClick={() => removeMcp(mcp.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MCP Marketplace */}
        {showMarketplace && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">MCP Marketplace</h3>
                <p className="text-xs text-slate-500">{mcpMarketplace.length} servers available</p>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={marketplaceSearch}
                  onChange={(e) => setMarketplaceSearch(e.target.value)}
                  placeholder="Search MCPs..."
                  className="pl-9 pr-4 py-2 w-56 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredMcps.map((mcp) => {
                  const isAdded = addedMcps.some((m) => m.id === mcp.id);
                  return (
                    <button
                      key={mcp.id}
                      type="button"
                      onClick={() => !isAdded && addMarketplaceMcp(mcp)}
                      disabled={isAdded}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                        isAdded
                          ? 'border-green-200 bg-green-50 cursor-default'
                          : 'border-slate-200 hover:border-[#135bec] hover:bg-[#135bec]/5 cursor-pointer'
                      }`}
                    >
                      <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-600 text-lg">
                          {mcp.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{mcp.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{mcp.description}</p>
                      </div>
                      {isAdded ? (
                        <span className="material-symbols-outlined text-green-600 text-lg shrink-0">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 text-lg shrink-0">
                          add
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================= */}
      {/* SECTION 2: Query Configuration */}
      {/* ============================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-purple-600">quiz</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Query Configuration</h2>
            <p className="text-sm text-slate-500">Define test queries for agent evaluation</p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────── */}
        {/* UPPER HALF: Upload Query Dataset */}
        {/* ─────────────────────────────────────────────── */}
        <div
          className={`relative p-8 rounded-xl border-2 border-dashed transition-all mb-6 ${
            uploadedFile
              ? 'border-green-400 bg-green-50/50'
              : 'border-slate-300 hover:border-[#135bec]/50 hover:bg-slate-50'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jsonl,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center text-center">
            <div
              className={`size-16 rounded-full flex items-center justify-center mb-4 ${
                uploadedFile ? 'bg-green-100' : 'bg-slate-100'
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl ${
                  uploadedFile ? 'text-green-600' : 'text-slate-400'
                }`}
              >
                {uploadedFile ? 'check_circle' : 'upload_file'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Upload Query Dataset</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-md">
              Drag and drop a JSONL or CSV file with test queries, or click to browse
            </p>

            {uploadedFile ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-green-200 shadow-sm">
                <span className="material-symbols-outlined text-green-600">description</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-green-700">{uploadedFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#135bec] border-2 border-[#135bec] rounded-lg hover:bg-[#135bec]/5 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">folder_open</span>
                Browse Files
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Or Generate with AI
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* ─────────────────────────────────────────────── */}
        {/* LOWER HALF: AI-Generated Queries (Inline) */}
        {/* ─────────────────────────────────────────────── */}
        <div
          className={`rounded-xl border-2 transition-all overflow-hidden ${
            aiQueriesGenerated ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200">
            <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-[#135bec] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">AI-Generated Queries</h3>
              <p className="text-xs text-slate-500">
                Let AI create diverse test queries based on your agent configuration
              </p>
            </div>
            {aiQueriesGenerated && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full">
                <span className="material-symbols-outlined text-purple-600 text-sm">
                  check_circle
                </span>
                <span className="text-xs font-bold text-purple-700">Configured</span>
              </div>
            )}
          </div>

          {/* Configuration Content */}
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Total Queries with Stepper */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Total Queries</label>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={decrementQueryCount}
                    disabled={aiQueryCount <= 10}
                    className="flex items-center justify-center size-12 rounded-lg border-2 border-slate-200 bg-white hover:border-[#135bec] hover:bg-[#135bec]/5 text-slate-600 hover:text-[#135bec] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-xl">remove</span>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={aiQueryCount}
                      onChange={(e) =>
                        setAiQueryCount(Math.max(10, Math.min(500, parseInt(e.target.value) || 10)))
                      }
                      min="10"
                      max="500"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 text-2xl font-bold text-center focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={incrementQueryCount}
                    disabled={aiQueryCount >= 500}
                    className="flex items-center justify-center size-12 rounded-lg border-2 border-slate-200 bg-white hover:border-[#135bec] hover:bg-[#135bec]/5 text-slate-600 hover:text-[#135bec] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Range: 10-500 queries. Recommended: 50 for quick tests, 100+ for thorough
                  coverage.
                </p>
              </div>

              {/* Right: Query Types */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Query Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {queryCategories.map((category) => {
                    const isSelected = aiQueryTypes.includes(category.id);
                    return (
                      <label
                        key={category.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#135bec] bg-[#135bec]/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAiQueryType(category.id)}
                          className="sr-only"
                        />
                        <div
                          className={`size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                            isSelected ? 'border-[#135bec] bg-[#135bec]' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && (
                            <span className="material-symbols-outlined text-white text-xs">
                              check
                            </span>
                          )}
                        </div>
                        <span className={`material-symbols-outlined text-lg ${category.color}`}>
                          {category.icon}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Context Textarea */}
            <div className="mt-5">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Additional Context{' '}
                <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                placeholder="Describe your agent's use case to help AI generate more relevant test queries... (e.g., 'This agent handles customer support for an e-commerce platform')"
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] transition-all resize-none"
              />
            </div>

            {/* Generate Button */}
            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {aiQueryTypes.length === 0 ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">warning</span>
                    Select at least one query type
                  </span>
                ) : (
                  <span>
                    Will generate <span className="font-bold text-slate-700">{aiQueryCount}</span>{' '}
                    queries across{' '}
                    <span className="font-bold text-slate-700">{aiQueryTypes.length}</span> type
                    {aiQueryTypes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={generateAiQueries}
                disabled={aiQueryTypes.length === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  aiQueriesGenerated
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-gradient-to-r from-purple-500 to-[#135bec] text-white hover:opacity-90 shadow-sm'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-lg">
                  {aiQueriesGenerated ? 'refresh' : 'auto_awesome'}
                </span>
                {aiQueriesGenerated ? 'Regenerate Queries' : 'Generate Queries'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between py-4">
        <Link
          href={`/agents/new?name=${encodeURIComponent(agentName)}&type=${agentType}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </Link>
        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm shadow-[#135bec]/30 transition-all"
        >
          Continue to Review
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>

      {/* ============================================= */}
      {/* CUSTOM MCP DIALOG */}
      {/* ============================================= */}
      {showCustomMcpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Add Custom MCP Server</h3>
              <button
                type="button"
                onClick={() => setShowCustomMcpDialog(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  MCP Server Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customMcpName}
                  onChange={(e) => setCustomMcpName(e.target.value)}
                  placeholder="e.g., My Company API"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  MCP Server URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={customMcpUrl}
                  onChange={(e) => setCustomMcpUrl(e.target.value)}
                  placeholder="https://mcp.example.com/sse"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={customMcpDescription}
                  onChange={(e) => setCustomMcpDescription(e.target.value)}
                  placeholder="Brief description of what this MCP provides..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowCustomMcpDialog(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addCustomMcp}
                disabled={!customMcpName || !customMcpUrl}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">check</span>
                Add MCP Server
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin size-8 border-2 border-slate-200 border-t-[#135bec] rounded-full"></div>
        </div>
      }
    >
      <ConfigureContent />
    </Suspense>
  );
}
