'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

// Types
interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  keySuffix: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
}

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API',
    keyPrefix: 'sk-prod',
    keySuffix: 'x8K2',
    createdAt: 'Jan 15, 2026',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'Development Key',
    keyPrefix: 'sk-dev',
    keySuffix: 'm4Pq',
    createdAt: 'Dec 20, 2025',
    lastUsed: '1 day ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Legacy Integration',
    keyPrefix: 'sk-leg',
    keySuffix: 'zR9w',
    createdAt: 'Nov 5, 2025',
    lastUsed: '30 days ago',
    status: 'revoked',
  },
];

type StatusFilter = 'all' | 'active' | 'revoked';

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'revoked', label: 'Revoked' },
];

// Generate a random API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'sk-tensoreval-';
  for (let i = 0; i < 48; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export default function ApiKeysPage() {
  // State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  // Create form state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDescription, setNewKeyDescription] = useState('');
  const [newKeyExpiration, setNewKeyExpiration] = useState('none');

  // Generated key state
  const [generatedKey, setGeneratedKey] = useState('');
  const [showGeneratedKey, setShowGeneratedKey] = useState(true);
  const [keyCopied, setKeyCopied] = useState(false);

  // Revoke state
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);

  // Filtered keys
  const filteredKeys = useMemo(() => {
    return apiKeys.filter((key) => {
      const matchesSearch =
        searchQuery === '' || key.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apiKeys, searchQuery, statusFilter]);

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy masked key to clipboard (just the preview)
  const copyMaskedKey = async (prefix: string, suffix: string) => {
    try {
      await navigator.clipboard.writeText(`${prefix}-****-****-****-${suffix}`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Create new key
  const handleCreateKey = () => {
    const newKey = generateApiKey();
    const keyPrefix = newKey.substring(0, 7);
    const keySuffix = newKey.substring(newKey.length - 4);

    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      keyPrefix,
      keySuffix,
      createdAt: 'Just now',
      lastUsed: null,
      status: 'active',
    };

    setApiKeys([newApiKey, ...apiKeys]);
    setGeneratedKey(newKey);
    setShowCreateModal(false);
    setShowSuccessModal(true);
    setNewKeyName('');
    setNewKeyDescription('');
    setNewKeyExpiration('none');
  };

  // Revoke key
  const handleRevokeKey = () => {
    if (keyToRevoke) {
      setApiKeys(
        apiKeys.map((key) => (key.id === keyToRevoke.id ? { ...key, status: 'revoked' } : key))
      );
      setShowRevokeModal(false);
      setKeyToRevoke(null);
    }
  };

  // Open revoke modal
  const openRevokeModal = (key: ApiKey) => {
    setKeyToRevoke(key);
    setShowRevokeModal(true);
    setShowActionsMenu(null);
  };

  // Check if there are any keys
  const hasKeys = apiKeys.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">API Keys</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage API keys for programmatic access to TensorEval.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30 w-fit"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Create API Key
        </button>
      </div>

      {/* Security Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">shield</span>
        <div>
          <p className="text-sm font-medium text-amber-800">Keep your API keys secure</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Do not share your API keys in publicly accessible areas such as GitHub, client-side
            code, or public repositories. Keys provide full access to your account.
          </p>
        </div>
      </div>

      {hasKeys ? (
        <>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-1 w-full md:w-auto items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by key name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 text-slate-900 text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#135bec] focus:bg-white transition-all"
                />
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              {/* Status Chips */}
              <div className="flex gap-2 overflow-x-auto py-1">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                      statusFilter === filter.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      API Key
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Last Used
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredKeys.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-4xl text-slate-300">
                            search_off
                          </span>
                          <p className="text-slate-500 text-sm">No API keys found</p>
                          <p className="text-slate-400 text-xs">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredKeys.map((apiKey) => (
                      <tr key={apiKey.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                              <span className="material-symbols-outlined text-slate-600 text-lg">
                                key
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {apiKey.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                              {apiKey.keyPrefix}-****-****-****-{apiKey.keySuffix}
                            </code>
                            <button
                              onClick={() => copyMaskedKey(apiKey.keyPrefix, apiKey.keySuffix)}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                              title="Copy key reference"
                            >
                              <span className="material-symbols-outlined text-lg">
                                content_copy
                              </span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{apiKey.createdAt}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {apiKey.lastUsed || 'Never'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                              apiKey.status === 'active'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            )}
                          >
                            {apiKey.status === 'active' && (
                              <span className="size-1.5 rounded-full bg-green-500"></span>
                            )}
                            {apiKey.status === 'active' ? 'Active' : 'Revoked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() =>
                                setShowActionsMenu(showActionsMenu === apiKey.id ? null : apiKey.id)
                              }
                              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                            >
                              <span className="material-symbols-outlined text-xl">more_vert</span>
                            </button>

                            {/* Actions Dropdown */}
                            {showActionsMenu === apiKey.id && (
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg z-10">
                                <button
                                  onClick={() => setShowActionsMenu(null)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                  Rename
                                </button>
                                {apiKey.status === 'active' && (
                                  <button
                                    onClick={() => openRevokeModal(apiKey)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-lg">block</span>
                                    Revoke
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Summary */}
          {filteredKeys.length > 0 && (
            <div className="text-sm text-slate-500">
              Showing {filteredKeys.length} of {apiKeys.length} API keys
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
          <div className="flex flex-col items-center text-center">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-slate-400">key_off</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No API keys yet</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
              Create your first API key to start making programmatic requests to TensorEval.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Create API Key
            </button>
          </div>
        </div>
      )}

      {/* Click outside handler for actions menu */}
      {showActionsMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowActionsMenu(null)} />
      )}

      {/* ============================================= */}
      {/* CREATE KEY MODAL */}
      {/* ============================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Create API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Key Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={newKeyDescription}
                  onChange={(e) => setNewKeyDescription(e.target.value)}
                  placeholder="What will this key be used for?"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Expiration</label>
                <select
                  value={newKeyExpiration}
                  onChange={(e) => setNewKeyExpiration(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:bg-white transition-all"
                >
                  <option value="none">No expiration</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* SUCCESS MODAL (One-time key display) */}
      {/* ============================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 text-center">
              <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-green-600">
                  check_circle
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                API Key Created Successfully
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Make sure to copy your API key now. You won&apos;t be able to see it again!
              </p>

              {/* Key Display */}
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <code
                    className={cn(
                      'text-sm font-mono flex-1 text-left break-all',
                      showGeneratedKey ? 'text-green-400' : 'text-slate-400'
                    )}
                  >
                    {showGeneratedKey ? generatedKey : '*'.repeat(generatedKey.length)}
                  </code>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowGeneratedKey(!showGeneratedKey)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title={showGeneratedKey ? 'Hide key' : 'Show key'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showGeneratedKey ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(generatedKey)}
                      className={cn(
                        'transition-colors',
                        keyCopied ? 'text-green-400' : 'text-slate-400 hover:text-white'
                      )}
                      title="Copy key"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {keyCopied ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Warning */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left mb-6">
                <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">
                  warning
                </span>
                <p className="text-sm text-amber-700">
                  This is the only time you&apos;ll see this key. Store it securely in a password
                  manager or secret vault.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setGeneratedKey('');
                  setShowGeneratedKey(true);
                  setKeyCopied(false);
                }}
                className="w-full px-4 py-2.5 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* REVOKE CONFIRMATION MODAL */}
      {/* ============================================= */}
      {showRevokeModal && keyToRevoke && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-red-600">warning</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Revoke API Key?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. Any applications using this key will no longer be able
                to access the API.
              </p>

              {/* Key Details */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg bg-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600">key</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{keyToRevoke.name}</p>
                    <code className="text-xs font-mono text-slate-500">
                      {keyToRevoke.keyPrefix}-****-{keyToRevoke.keySuffix}
                    </code>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Created</p>
                    <p className="font-medium text-slate-700">{keyToRevoke.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Last Used</p>
                    <p className="font-medium text-slate-700">{keyToRevoke.lastUsed || 'Never'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowRevokeModal(false);
                    setKeyToRevoke(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeKey}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-all"
                >
                  <span className="material-symbols-outlined text-lg">block</span>
                  Revoke Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
