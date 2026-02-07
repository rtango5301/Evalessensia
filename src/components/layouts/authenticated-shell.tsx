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
      className="flex min-h-screen w-full bg-[#f6f6f8]"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col min-h-screen relative">
        <AuthenticatedHeader />

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
