'use client';

import React from 'react';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { createProject, deleteProject, latencySeconds, listProjects } from '@/lib/observability/client';
import type { Project } from '@/lib/observability/types';

export default function TracingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await listProjects());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createProject(name.trim(), description.trim());
      setName('');
      setDescription('');
      setShowCreate(false);
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to create project');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete ${project.name} and all of its traces?`)) return;
    try {
      await deleteProject(project.id);
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to delete project');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tracing</h1>
          <p className="mt-1 text-sm text-slate-500">Inspect agent runs, execution trees, and runtime details.</p>
        </div>
        <button
          onClick={() => setShowCreate((visible) => !visible)}
          className="flex w-fit items-center gap-2 rounded-lg bg-[#135bec] px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#135bec]/30 transition-all hover:bg-[#135bec]/90"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Project
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="material-symbols-outlined">error</span>
          <span className="flex-1">{error}</span>
          <button onClick={() => void refresh()} className="font-bold">Retry</button>
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Create project</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#135bec]"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Description
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={2000}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#135bec]"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button disabled={saving} className="rounded-lg bg-[#135bec] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Creating…' : 'Create Project'}</button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-900">Connect the observability SDK</p>
            <p className="mt-1 text-sm text-blue-700">Use your existing Evalessensia API key and set the project name in your agent environment.</p>
          </div>
          <Link href="/dashboard/settings" className="w-fit rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#135bec] hover:bg-blue-50">Manage API Keys</Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-bold text-slate-900">Projects</h2>
        </div>
        {loading ? (
          <div className="space-y-3 p-6 animate-pulse">{[1, 2, 3].map((item) => <div key={item} className="h-14 rounded-lg bg-slate-100" />)}</div>
        ) : projects.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">account_tree</span>
            <p className="mt-2 text-sm font-medium text-slate-600">No tracing projects yet</p>
            <p className="mt-1 text-xs text-slate-400">Create one here or send your first SDK trace.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr><th className="px-6 py-3">Project</th><th className="px-6 py-3">Recent activity</th><th className="px-6 py-3">Traces</th><th className="px-6 py-3">Error rate</th><th className="px-6 py-3">Avg latency</th><th className="px-6 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-900">{project.name}</p><p className="mt-0.5 text-xs text-slate-500">{project.description || 'No description'}</p></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{project.recent_run ? new Date(project.recent_run).toLocaleString() : '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{project.trace_count}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{(project.error_rate * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{latencySeconds(project.avg_latency_ms)}</td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><Link href={`/tracing/projects/${project.id}`} className="rounded-lg px-3 py-2 text-sm font-bold text-[#135bec] hover:bg-blue-50">View traces</Link><button onClick={() => void handleDelete(project)} aria-label={`Delete ${project.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><span className="material-symbols-outlined text-lg">delete</span></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
