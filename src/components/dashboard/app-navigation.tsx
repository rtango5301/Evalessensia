'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, User } from 'lucide-react';

import { cn } from '@/lib/utils';

const navTabs = [
  { href: '/projects', label: 'Projects' },
  { href: '/evaluations', label: 'Evaluations' },
  { href: '/playground', label: 'Playground' },
  { href: '/settings', label: 'Settings' },
];

export function AppNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/evaluations') {
      return pathname.startsWith('/evaluations');
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[var(--foreground)] no-underline"
          >
            <div className="w-7 h-7 bg-[#1a1f2e] rounded-lg flex items-center justify-center text-white">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-base">TensorEval</span>
          </Link>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1">
            {navTabs.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    active
                      ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                      : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--bg-subtle)]'
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Avatar */}
        <button className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
