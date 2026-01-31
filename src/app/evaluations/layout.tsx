'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/datasets', label: 'Datasets', icon: 'folder_open' },
  { href: '/evaluations', label: 'Evaluations', icon: 'science' },
];

const secondaryNavItems = [{ href: '/dashboard/api-keys', label: 'API Keys', icon: 'key' }];

export default function EvaluationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Load Google Material Symbols and Space Grotesk */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="flex h-screen w-full bg-[#f6f6f8] overflow-hidden font-[Space_Grotesk,sans-serif]">
        {/* Sidebar */}
        <aside className="hidden md:flex w-56 flex-col border-r border-slate-200 bg-white h-full flex-shrink-0">
          <div className="flex flex-col h-full p-4">
            {/* Logo */}
            <div className="flex flex-col mb-8 px-2 mt-2">
              <Link
                href="/dashboard"
                className="text-slate-900 text-xl font-bold leading-normal tracking-tight flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#135bec] text-3xl">hub</span>
                TensorEval
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
                      : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                      isActive
                        ? 'bg-[#135bec]/10 text-[#135bec]'
                        : 'text-slate-600 hover:bg-slate-100'
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

              <div className="my-2 border-t border-slate-200"></div>

              {secondaryNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                      isActive
                        ? 'bg-[#135bec]/10 text-[#135bec]'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <p className="text-sm font-medium leading-normal group-hover:text-slate-900">
                      {item.label}
                    </p>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col h-full overflow-clip relative">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2 h-14 shrink-0 z-20">
            <div className="flex items-center gap-4">
              <button className="md:hidden text-slate-500 hover:text-slate-700">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h2 className="text-slate-900 text-base font-bold leading-tight">Evaluations</h2>
            </div>

            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="hidden sm:flex items-center relative w-64 lg:w-96">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg">
                  search
                </span>
                <input
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-md text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-[#135bec] focus:outline-none transition-all"
                  placeholder="Search evaluations..."
                  type="text"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-center size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                </Link>
                <button className="flex items-center justify-center size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative">
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="flex items-center justify-center size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">help</span>
                </button>
                <ProfileDropdown
                  user={{
                    name: 'Alex Morgan',
                    role: 'Admin',
                  }}
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto overflow-x-clip p-6 lg:p-10 overscroll-contain">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
