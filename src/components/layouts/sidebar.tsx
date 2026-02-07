'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/datasets', label: 'Datasets', icon: 'folder_open' },
  { href: '/evaluations', label: 'Evaluations', icon: 'science' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-slate-200 bg-white h-screen sticky top-0 flex-shrink-0">
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex flex-col mb-8 px-2 mt-2">
          <Link href="/dashboard" className="flex items-center">
            <Logo variant="dashboard" size="md" />
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/datasets'
                ? pathname.startsWith('/datasets')
                : item.href === '/evaluations'
                  ? pathname.startsWith('/evaluations')
                  : pathname === item.href || pathname.startsWith('/dashboard');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                  isActive ? 'bg-[#135bec]/10 text-[#135bec]' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <span className={cn('material-symbols-outlined', isActive && 'filled')}>
                  {item.icon}
                </span>
                <p
                  className={cn(
                    'text-sm leading-normal',
                    isActive ? 'font-bold' : 'font-medium group-hover:text-slate-900'
                  )}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
