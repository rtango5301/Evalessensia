'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { AuthenticatedHeader } from './authenticated-header';

interface AuthenticatedShellProps {
  children: ReactNode;
}

export function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  return (
    <div
      className="flex h-screen w-full bg-[#f6f6f8] overflow-hidden"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col h-full overflow-clip relative">
        <AuthenticatedHeader />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-clip p-6 lg:p-10 overscroll-contain">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
