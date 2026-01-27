import Link from 'next/link';

export function DashboardFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--text-muted)]">
        <p>&copy; 2024 TensorEval Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
            Documentation
          </Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
