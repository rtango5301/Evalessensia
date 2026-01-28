// Dashboard Layout
// TODO: Add dashboard navigation, sidebar if needed
// Wraps: /dashboard, /dashboard/agents/*, /dashboard/runs/*

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* TODO: Add dashboard navigation header */}
      <main>{children}</main>
    </div>
  );
}
