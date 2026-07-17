'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { dashboardNavigation } from '@/lib/observability/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-slate-200 bg-white h-screen sticky top-0 flex-shrink-0">
      <div className="flex flex-col h-full p-4">
        {/* Logo – opens landing page in new tab */}
        <div className="flex flex-col mb-8 px-2 mt-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <Logo variant="dashboard" size="md" />
            <span className="material-symbols-outlined text-base text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              open_in_new
            </span>
          </a>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {dashboardNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
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
