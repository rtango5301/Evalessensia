'use client';

import { useTestUrl } from '@/hooks/use-test-url';
import { cn } from '@/lib/utils';

interface TestConnectionButtonProps {
  url: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * Test Connection Button
 * Displays URL reachability status with visual feedback
 */
export function TestConnectionButton({
  url,
  disabled = false,
  label = 'Test Connection',
  className,
}: TestConnectionButtonProps) {
  const { isLoading, result, testUrl, reset } = useTestUrl();

  // Safely trim the URL
  const trimmedUrl = url?.trim() || '';
  const isDisabled = disabled || !trimmedUrl;

  const handleClick = async () => {
    if (!trimmedUrl || isLoading) return;
    await testUrl(trimmedUrl);
  };

  const handleReset = () => {
    reset();
  };

  // Idle state
  if (result.status === 'idle') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
          'border border-slate-200 bg-white text-slate-600',
          'hover:border-[#135bec] hover:text-[#135bec] hover:bg-[#135bec]/5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:bg-white',
          className
        )}
      >
        <span className="material-symbols-outlined text-sm">wifi</span>
        {label}
      </button>
    );
  }

  // Loading state
  if (result.status === 'loading') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md',
          'border border-slate-200 bg-slate-50 text-slate-500',
          className
        )}
      >
        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
        Testing...
      </span>
    );
  }

  // Success state
  if (result.status === 'success') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md',
          'border border-emerald-200 bg-emerald-50 text-emerald-700',
          className
        )}
      >
        <span className="material-symbols-outlined text-sm">check_circle</span>
        Reachable
        {result.responseTime !== undefined && (
          <span className="text-emerald-600 font-normal">{result.responseTime}ms</span>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="ml-0.5 p-0.5 rounded hover:bg-emerald-200/50 transition-colors"
          aria-label="Reset"
        >
          <span className="material-symbols-outlined text-xs">close</span>
        </button>
      </span>
    );
  }

  // Error state
  const getErrorLabel = () => {
    switch (result.errorCode) {
      case 'INVALID_URL':
        return 'Invalid URL';
      case 'SERVER_ERROR':
        return 'Server Error';
      case 'TIMEOUT':
        return 'Timed Out';
      default:
        return 'Unreachable';
    }
  };
  const errorLabel = getErrorLabel();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md',
        'border border-red-200 bg-red-50 text-red-700',
        className
      )}
      title={result.errorMessage}
    >
      <span className="material-symbols-outlined text-sm">cancel</span>
      {errorLabel}
      <button
        type="button"
        onClick={handleReset}
        className="ml-0.5 p-0.5 rounded hover:bg-red-200/50 transition-colors"
        aria-label="Reset"
      >
        <span className="material-symbols-outlined text-xs">close</span>
      </button>
    </span>
  );
}
