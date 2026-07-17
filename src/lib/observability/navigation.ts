export interface DashboardNavigationItem {
  href: string;
  label: string;
  icon: string;
}

export const dashboardNavigation: DashboardNavigationItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/tracing', label: 'Tracing', icon: 'account_tree' },
  { href: '/monitoring', label: 'Monitoring', icon: 'monitoring' },
  { href: '/datasets', label: 'Datasets', icon: 'folder_open' },
  { href: '/evaluations', label: 'Evaluations', icon: 'science' },
];

export function observabilityPageTitle(pathname: string): string | null {
  if (pathname.startsWith('/tracing')) return 'Tracing';
  if (pathname.startsWith('/monitoring')) return 'Monitoring';
  return null;
}
