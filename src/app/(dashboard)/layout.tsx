import { AppNavigation } from '@/components/dashboard/app-navigation';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-subtle)]">
      <AppNavigation />
      <main className="flex-1">{children}</main>
      <DashboardFooter />
    </div>
  );
}
