'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { McpValidationResponse } from '@/app/api/test-mcp-connection/route';

export type TestMcpStatus =
  | 'idle'
  | 'loading'
  | 'mcp_valid'
  | 'reachable_not_mcp'
  | 'unreachable'
  | 'error';

export type TestMcpErrorCode =
  | 'INVALID_URL'
  | 'NOT_MCP_SERVER'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'SSRF_BLOCKED'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR';

export interface McpToolInfo {
  name: string;
  description?: string;
}

export interface TestMcpResult {
  status: TestMcpStatus;
  responseTime?: number;
  serverInfo?: { name: string; version?: string };
  protocolVersion?: string;
  tools?: McpToolInfo[];
  errorCode?: TestMcpErrorCode;
  errorMessage?: string;
}

interface UseTestMcpUrlReturn {
  isLoading: boolean;
  result: TestMcpResult;
  testUrl: (url: string) => Promise<void>;
  reset: () => void;
}

const AUTO_RESET_MS = 15_000;

export function useTestMcpUrl(): UseTestMcpUrlReturn {
  const [result, setResult] = useState<TestMcpResult>({ status: 'idle' });
  const autoResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (autoResetTimerRef.current) {
      clearTimeout(autoResetTimerRef.current);
      autoResetTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setResult({ status: 'idle' });
  }, []);

  const scheduleAutoReset = useCallback(() => {
    autoResetTimerRef.current = setTimeout(() => {
      setResult({ status: 'idle' });
    }, AUTO_RESET_MS);
  }, []);

  const testUrl = useCallback(
    async (url: string) => {
      // Clear pending timers / requests
      if (autoResetTimerRef.current) {
        clearTimeout(autoResetTimerRef.current);
        autoResetTimerRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Quick client-side URL check
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          setResult({
            status: 'error',
            errorCode: 'INVALID_URL',
            errorMessage: 'URL must start with http:// or https://',
          });
          scheduleAutoReset();
          return;
        }
      } catch {
        setResult({
          status: 'error',
          errorCode: 'INVALID_URL',
          errorMessage: 'Invalid URL format',
        });
        scheduleAutoReset();
        return;
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setResult({ status: 'loading' });

      try {
        const response = await fetch('/api/test-mcp-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
          signal: abortController.signal,
        });

        if (response.status === 401) {
          setResult({
            status: 'error',
            errorCode: 'SERVER_ERROR',
            errorMessage: 'Not authenticated',
          });
          scheduleAutoReset();
          return;
        }

        if (response.status === 429) {
          setResult({
            status: 'error',
            errorCode: 'RATE_LIMITED',
            errorMessage: 'Too many requests. Try again in a minute.',
          });
          scheduleAutoReset();
          return;
        }

        const data: McpValidationResponse = await response.json();

        switch (data.status) {
          case 'mcp_valid':
            setResult({
              status: 'mcp_valid',
              responseTime: data.responseTime,
              serverInfo: data.serverInfo,
              protocolVersion: data.protocolVersion,
              tools: data.tools,
            });
            break;
          case 'reachable_not_mcp':
            setResult({
              status: 'reachable_not_mcp',
              responseTime: data.responseTime,
              errorCode: 'NOT_MCP_SERVER',
              errorMessage: data.errorMessage || 'URL is reachable but not an MCP server',
            });
            break;
          case 'timeout':
            setResult({
              status: 'error',
              errorCode: 'TIMEOUT',
              errorMessage: data.errorMessage || 'Connection timed out',
            });
            break;
          case 'ssrf_blocked':
            setResult({
              status: 'error',
              errorCode: 'SSRF_BLOCKED',
              errorMessage: data.errorMessage || 'URL is blocked',
            });
            break;
          case 'invalid_url':
            setResult({
              status: 'error',
              errorCode: 'INVALID_URL',
              errorMessage: data.errorMessage || 'Invalid URL',
            });
            break;
          case 'unreachable':
          default:
            setResult({
              status: 'unreachable',
              errorCode: 'NETWORK_ERROR',
              errorMessage: data.errorMessage || 'Unable to reach URL',
            });
            break;
        }
      } catch {
        if (abortController.signal.aborted) {
          // Request was cancelled (e.g. user changed URL or component unmounted)
          return;
        }
        setResult({
          status: 'error',
          errorCode: 'SERVER_ERROR',
          errorMessage: 'Failed to contact validation service',
        });
      }

      scheduleAutoReset();
    },
    [scheduleAutoReset]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoResetTimerRef.current) clearTimeout(autoResetTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return {
    isLoading: result.status === 'loading',
    result,
    testUrl,
    reset,
  };
}
