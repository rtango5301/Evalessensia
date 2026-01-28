// Evaluation Run Page (Running State + Results)
// TODO: Implement with Google Stitch design
// Route: /dashboard/runs/[runId]
// Shows: Running progress OR completed results with comparison

interface RunPageProps {
  params: Promise<{
    runId: string;
  }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { runId } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Evaluation Run</h1>
        <p className="text-[var(--text-secondary)] mt-2">Run ID: {runId}</p>
        <p className="text-[var(--text-muted)] mt-1">Coming soon...</p>
      </div>
    </div>
  );
}
