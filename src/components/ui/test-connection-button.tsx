'use client';

import { useEffect, useRef } from 'react';
import { useTestUrl } from '@/hooks/use-test-url';
import { useTestMcpUrl } from '@/hooks/use-test-mcp-url';
import { cn } from '@/lib/utils';

interface TestConnectionButtonProps {
  url: string;
  disabled?: boolean;
  label?: string;
  successLabel?: string;
  validateAgent?: boolean;
  mode?: 'reachability' | 'mcp';
  className?: string;
  onResult?: (status: 'idle' | 'loading' | 'success' | 'error') => void;
}

/**
 * Test Connection Button
 * Displays URL reachability or MCP validation status with visual feedback and inline retry.
 * Uses `mode` prop to select between reachability check and MCP protocol validation.
 */
export function TestConnectionButton(props: TestConnectionButtonProps) {
  const { mode = 'reachability' } = props;
  if (mode === 'mcp') {
    return <McpTestConnectionButton {...props} />;
  }
  return <ReachabilityTestConnectionButton {...props} />;
}

// ─── Shared UI helpers ──────────────────────────────────────────────────────

function IdleButton({
  onClick,
  disabled,
  label,
  className,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
        'border border-slate-200 bg-white text-slate-600 shadow-sm',
        'hover:border-[#135bec] hover:text-[#135bec] hover:bg-[#135bec]/5 hover:shadow-md',
        'active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:bg-white disabled:hover:shadow-sm disabled:active:scale-100',
        className
      )}
    >
      <span className="material-symbols-outlined text-sm">wifi</span>
      {label}
    </button>
  );
}

function LoadingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md',
        'border border-[#135bec]/30 bg-[#135bec]/5 text-[#135bec]',
        className
      )}
    >
      <span className="flex items-center gap-0.5">
        <span className="h-1 w-1 rounded-full bg-[#135bec] animate-[pulse-dot_1.4s_ease-in-out_infinite]" />
        <span className="h-1 w-1 rounded-full bg-[#135bec] animate-[pulse-dot_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="h-1 w-1 rounded-full bg-[#135bec] animate-[pulse-dot_1.4s_ease-in-out_0.4s_infinite]" />
      </span>
      Testing connection...
    </span>
  );
}

function RetryButton({
  onClick,
  disabled,
  showLabel,
}: {
  onClick: () => void;
  disabled?: boolean;
  showLabel?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all duration-200',
        'border border-slate-200 bg-white text-slate-600 shadow-sm',
        'hover:border-[#135bec] hover:text-[#135bec] hover:bg-[#135bec]/5 hover:shadow-md',
        'active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-1'
      )}
      title="Retry connection test"
    >
      <span className="material-symbols-outlined text-sm">refresh</span>
      {showLabel && 'Retry'}
    </button>
  );
}

// ─── Reachability mode (existing behavior) ──────────────────────────────────

function ReachabilityTestConnectionButton({
  url,
  disabled = false,
  label = 'Test Connection',
  successLabel = 'Reachable',
  validateAgent = false,
  className,
  onResult,
}: TestConnectionButtonProps) {
  const { isLoading, result, testUrl, reset } = useTestUrl();
  const prevUrlRef = useRef(url);

  // Reset when URL changes
  useEffect(() => {
    if (url !== prevUrlRef.current) {
      prevUrlRef.current = url;
      if (result.status !== 'idle') reset();
    }
  }, [url, result.status, reset]);

  // Notify parent of result changes
  useEffect(() => {
    onResult?.(result.status);
  }, [result.status, onResult]);

  const trimmedUrl = url?.trim() || '';
  const isDisabled = disabled || !trimmedUrl;
  const testOptions = validateAgent ? { validateAgent: true } : undefined;

  const handleClick = async () => {
    if (!trimmedUrl || isLoading) return;
    await testUrl(trimmedUrl, testOptions);
  };

  const handleRetry = async () => {
    reset();
    if (!trimmedUrl || isLoading) return;
    await new Promise((r) => setTimeout(r, 100));
    await testUrl(trimmedUrl, testOptions);
  };

  if (result.status === 'idle') {
    return (
      <IdleButton onClick={handleClick} disabled={isDisabled} label={label} className={className} />
    );
  }

  if (result.status === 'loading') {
    return <LoadingBadge className={className} />;
  }

  if (result.status === 'success') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
            'border border-emerald-200 bg-emerald-50 text-emerald-700'
          )}
        >
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {successLabel}
          {result.responseTime !== undefined && (
            <span className="text-emerald-500 font-normal">{result.responseTime}ms</span>
          )}
        </span>
        <RetryButton onClick={handleRetry} />
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
      case 'NOT_AGENT_URL':
        return 'Not an Agent URL';
      default:
        return 'Unreachable';
    }
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
          'border border-red-200 bg-red-50 text-red-700'
        )}
        title={result.errorMessage}
      >
        <span className="material-symbols-outlined text-sm">cancel</span>
        {getErrorLabel()}
      </span>
      <RetryButton onClick={handleRetry} disabled={isLoading} showLabel />
    </span>
  );
}

// ─── MCP mode ───────────────────────────────────────────────────────────────

function McpTestConnectionButton({
  url,
  disabled = false,
  label = 'Test MCP Connection',
  className,
}: TestConnectionButtonProps) {
  const { isLoading, result, testUrl, reset } = useTestMcpUrl();
  const prevUrlRef = useRef(url);

  // Reset when URL changes
  useEffect(() => {
    if (url !== prevUrlRef.current) {
      prevUrlRef.current = url;
      if (result.status !== 'idle') reset();
    }
  }, [url, result.status, reset]);

  const trimmedUrl = url?.trim() || '';
  const isDisabled = disabled || !trimmedUrl;

  const handleClick = async () => {
    if (!trimmedUrl || isLoading) return;
    await testUrl(trimmedUrl);
  };

  const handleRetry = async () => {
    reset();
    if (!trimmedUrl || isLoading) return;
    await new Promise((r) => setTimeout(r, 100));
    await testUrl(trimmedUrl);
  };

  // Idle
  if (result.status === 'idle') {
    return (
      <IdleButton onClick={handleClick} disabled={isDisabled} label={label} className={className} />
    );
  }

  // Loading
  if (result.status === 'loading') {
    return <LoadingBadge className={className} />;
  }

  // MCP Valid (green)
  if (result.status === 'mcp_valid') {
    const serverName = result.serverInfo?.name || 'MCP Server';
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
            'border border-emerald-200 bg-emerald-50 text-emerald-700'
          )}
        >
          <span className="material-symbols-outlined text-sm">check_circle</span>
          MCP Server &middot; {serverName}
          {result.responseTime !== undefined && (
            <span className="text-emerald-500 font-normal">{result.responseTime}ms</span>
          )}
        </span>
        <RetryButton onClick={handleRetry} />
      </span>
    );
  }

  // Reachable but not MCP (amber)
  if (result.status === 'reachable_not_mcp') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
            'border border-amber-200 bg-amber-50 text-amber-700'
          )}
          title={result.errorMessage}
        >
          <span className="material-symbols-outlined text-sm">warning</span>
          Not MCP Server
        </span>
        <RetryButton onClick={handleRetry} showLabel />
      </span>
    );
  }

  // Error / unreachable states (red)
  const getMcpErrorLabel = () => {
    switch (result.errorCode) {
      case 'INVALID_URL':
        return 'Invalid URL';
      case 'TIMEOUT':
        return 'Timed Out';
      case 'SSRF_BLOCKED':
        return 'Blocked URL';
      case 'RATE_LIMITED':
        return 'Rate Limited';
      case 'SERVER_ERROR':
        return 'Server Error';
      case 'NOT_MCP_SERVER':
        return 'Not MCP Server';
      default:
        return 'Unreachable';
    }
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
          'border border-red-200 bg-red-50 text-red-700'
        )}
        title={result.errorMessage}
      >
        <span className="material-symbols-outlined text-sm">cancel</span>
        {getMcpErrorLabel()}
      </span>
      <RetryButton onClick={handleRetry} disabled={isLoading} showLabel />
    </span>
  );
}
