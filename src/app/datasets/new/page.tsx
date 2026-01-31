'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Schema preview mock data
const schemaPreview = [
  { field: 'query', type: 'string', example: 'How do I reset my password?' },
  { field: 'category', type: 'string', example: 'account' },
  { field: 'rubric', type: 'string', example: 'Response should include step-by-step instructions' },
];

export default function NewDatasetPage() {
  const router = useRouter();

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadDatasetName, setUploadDatasetName] = useState('');

  // Generate state
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [mcpServer, setMcpServer] = useState('');
  const [queryCount, setQueryCount] = useState(50);

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.csv') || file.name.endsWith('.json'))) {
        setUploadFile(file);
        if (!uploadDatasetName) {
          setUploadDatasetName(file.name.replace(/\.(csv|json)$/, ''));
        }
      }
    },
    [uploadDatasetName]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadDatasetName) {
        setUploadDatasetName(file.name.replace(/\.(csv|json)$/, ''));
      }
    }
  };

  const handleUploadSubmit = () => {
    if (uploadFile && uploadDatasetName) {
      // In a real app, this would upload the file and create the dataset
      router.push('/datasets');
    }
  };

  const handleGenerateSubmit = () => {
    if (agentName && agentDescription) {
      // In a real app, this would trigger the AI generation
      router.push('/datasets');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/datasets" className="hover:text-[#135bec] transition-colors">
          Datasets
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-slate-900 font-medium">Create New</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Dataset</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload an existing dataset or generate one using AI.
        </p>
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: Upload Dataset */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">upload_file</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upload Dataset</h2>
                <p className="text-sm text-slate-500">Upload a CSV or JSON file</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Dataset Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Dataset Name
              </label>
              <input
                type="text"
                value={uploadDatasetName}
                onChange={(e) => setUploadDatasetName(e.target.value)}
                placeholder="Enter dataset name..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
              />
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                isDragging
                  ? 'border-[#135bec] bg-[#135bec]/5'
                  : uploadFile
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
              )}
            >
              {uploadFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600 text-2xl">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{uploadFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="text-sm text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">
                      cloud_upload
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Drag and drop your file here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">or</p>
                  </div>
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-[#135bec] hover:underline">
                      Browse files
                    </span>
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-400">Supports CSV and JSON files</p>
                </div>
              )}
            </div>

            {/* Schema Preview */}
            {uploadFile && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Schema Preview
                </label>
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                          Field
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                          Type
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                          Example
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {schemaPreview.map((row) => (
                        <tr key={row.field}>
                          <td className="px-3 py-2 font-mono text-slate-700">{row.field}</td>
                          <td className="px-3 py-2 text-slate-500">{row.type}</td>
                          <td className="px-3 py-2 text-slate-500 truncate max-w-[150px]">
                            {row.example}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleUploadSubmit}
              disabled={!uploadFile || !uploadDatasetName}
              className={cn(
                'w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2',
                uploadFile && uploadDatasetName
                  ? 'bg-[#135bec] text-white hover:bg-[#135bec]/90 shadow-sm shadow-[#135bec]/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              <span className="material-symbols-outlined text-lg">upload</span>
              Upload Dataset
            </button>
          </div>
        </div>

        {/* Panel B: Generate Dataset */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600">auto_awesome</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Generate Dataset</h2>
                <p className="text-sm text-slate-500">Use AI to create test cases</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g., Customer Support Bot"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
              />
            </div>

            {/* Agent Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Agent Description
              </label>
              <textarea
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe what the agent does, its capabilities, and expected behavior..."
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* MCP Server (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                MCP Server <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={mcpServer}
                onChange={(e) => setMcpServer(e.target.value)}
                placeholder="e.g., mcp://my-server"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Connect to an MCP server for context-aware test generation
              </p>
            </div>

            {/* Query Count */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Number of Queries
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={queryCount}
                  onChange={(e) => setQueryCount(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#135bec]"
                />
                <div className="w-20 px-3 py-2 bg-slate-100 rounded-lg text-center">
                  <span className="text-sm font-bold text-slate-900">{queryCount}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                More queries = better coverage but longer generation time
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-purple-600 text-lg shrink-0">
                  info
                </span>
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">AI-Powered Generation</p>
                  <p className="text-purple-700">
                    We&apos;ll analyze your agent description and generate diverse, realistic test
                    cases including edge cases and adversarial prompts.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerateSubmit}
              disabled={!agentName || !agentDescription}
              className={cn(
                'w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2',
                agentName && agentDescription
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-600/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              Generate Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
