'use client';

/**
 * URL Reachability Testing Hook
 * Tests if a URL is reachable via HEAD/GET request
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type TestUrlStatus = 'idle' | 'loading' | 'success' | 'error';

export type TestUrlErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'INVALID_URL'
  | 'NOT_AGENT_URL'
  | 'AUTH_FAILED'
  | 'BAD_REQUEST'
  | 'RATE_LIMITED';

export interface TestUrlResult {
  status: TestUrlStatus;
  responseTime?: number;
  errorCode?: TestUrlErrorCode;
  errorMessage?: string;
  agentReply?: string;
}

interface TestUrlOptions {
  validateAgent?: boolean;
  model?: string;
  apiKey?: string;
  systemPrompt?: string;
}

interface UseTestUrlReturn {
  isLoading: boolean;
  result: TestUrlResult;
  testUrl: (url: string, options?: TestUrlOptions) => Promise<void>;
  reset: () => void;
}

const TIMEOUT_MS = 10000;
const AUTO_RESET_MS = 15000;

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getErrorMessage(errorCode: TestUrlErrorCode): string {
  switch (errorCode) {
    case 'NETWORK_ERROR':
      return 'Unable to reach URL. Check the address and network.';
    case 'TIMEOUT':
      return 'Request timed out. URL may be slow or unreachable.';
    case 'SERVER_ERROR':
      return 'Server error (5xx). Try again later.';
    case 'INVALID_URL':
      return 'Invalid URL. Must start with http:// or https://';
    case 'NOT_AGENT_URL':
      return 'URL does not appear to be an API endpoint. Agent URLs should return JSON responses.';
    case 'AUTH_FAILED':
      return 'Authentication failed. API key is required.';
    case 'BAD_REQUEST':
      return 'Bad request. Check your configuration.';
    case 'RATE_LIMITED':
      return 'Rate limited. Check your API quota and usage limits.';
    default:
      return 'An unknown error occurred.';
  }
}

/**
 * Hook for testing URL reachability
 * Performs HEAD request (with GET fallback for CORS)
 */
export function useTestUrl(): UseTestUrlReturn {
  const [result, setResult] = useState<TestUrlResult>({ status: 'idle' });
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

  const testUrl = useCallback(async (url: string, options?: TestUrlOptions) => {
    // Clear any pending auto-reset timer
    if (autoResetTimerRef.current) {
      clearTimeout(autoResetTimerRef.current);
      autoResetTimerRef.current = null;
    }

    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      setResult({
        status: 'error',
        errorCode: 'INVALID_URL',
        errorMessage: getErrorMessage('INVALID_URL'),
      });
      // Auto-reset after 15 seconds
      autoResetTimerRef.current = setTimeout(() => {
        setResult({ status: 'idle' });
      }, AUTO_RESET_MS);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setResult({ status: 'loading' });

    const startTime = performance.now();

    // Set up timeout
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, TIMEOUT_MS);

    try {
      if (options?.validateAgent) {
        // Agent validation: call server-side route to avoid CORS issues
        const response = await fetch('/api/test-agent-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            model: options?.model,
            apiKey: options?.apiKey,
            systemPrompt: options?.systemPrompt,
          }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        const agentStatus: string = data.status;

        switch (agentStatus) {
          case 'agent_valid':
            setResult({
              status: 'success',
              responseTime: data.responseTime,
              agentReply: data.agentReply,
            });
            break;
          case 'reachable_not_agent':
            setResult({
              status: 'error',
              errorCode: 'BAD_REQUEST',
              errorMessage: 'URL is reachable but did not return a valid agent response.',
            });
            break;
          case 'auth_failed':
            setResult({
              status: 'error',
              errorCode: 'AUTH_FAILED',
              errorMessage: data.errorMessage || getErrorMessage('AUTH_FAILED'),
            });
            break;
          case 'bad_request':
            setResult({
              status: 'error',
              errorCode: 'BAD_REQUEST',
              errorMessage: data.errorMessage || getErrorMessage('BAD_REQUEST'),
            });
            break;
          case 'rate_limited':
            setResult({
              status: 'error',
              errorCode: 'RATE_LIMITED',
              errorMessage: data.errorMessage || getErrorMessage('RATE_LIMITED'),
            });
            break;
          case 'not_agent_url':
            setResult({
              status: 'error',
              errorCode: 'NOT_AGENT_URL',
              errorMessage: getErrorMessage('NOT_AGENT_URL'),
            });
            break;
          case 'server_error':
            setResult({
              status: 'error',
              errorCode: 'SERVER_ERROR',
              errorMessage: getErrorMessage('SERVER_ERROR'),
            });
            break;
          case 'timeout':
            setResult({
              status: 'error',
              errorCode: 'TIMEOUT',
              errorMessage: getErrorMessage('TIMEOUT'),
            });
            break;
          case 'ssrf_blocked':
          case 'invalid_url':
            setResult({
              status: 'error',
              errorCode: 'INVALID_URL',
              errorMessage: getErrorMessage('INVALID_URL'),
            });
            break;
          case 'unreachable':
          default:
            setResult({
              status: 'error',
              errorCode: 'NETWORK_ERROR',
              errorMessage: data.errorMessage || getErrorMessage('NETWORK_ERROR'),
            });
            break;
        }
      } else {
        // Standard reachability check: HEAD with GET fallback
        let response: Response;
        try {
          response = await fetch(url, {
            method: 'HEAD',
            mode: 'cors',
            signal: abortController.signal,
          });
        } catch {
          // HEAD might fail due to CORS, try GET with no-cors mode
          response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            signal: abortController.signal,
          });
        }

        clearTimeout(timeoutId);
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        // In no-cors mode, we get an opaque response (type: 'opaque')
        // which has status 0, but means the request succeeded
        if (response.type === 'opaque' || (response.status >= 200 && response.status < 400)) {
          setResult({
            status: 'success',
            responseTime,
          });
        } else if (response.status >= 500) {
          setResult({
            status: 'error',
            errorCode: 'SERVER_ERROR',
            errorMessage: getErrorMessage('SERVER_ERROR'),
          });
        } else {
          // 4xx errors - URL is reachable but might have auth issues
          // For our purposes, we consider it reachable
          setResult({
            status: 'success',
            responseTime,
          });
        }
      }
    } catch {
      clearTimeout(timeoutId);

      if (abortController.signal.aborted) {
        setResult({
          status: 'error',
          errorCode: 'TIMEOUT',
          errorMessage: getErrorMessage('TIMEOUT'),
        });
      } else {
        setResult({
          status: 'error',
          errorCode: 'NETWORK_ERROR',
          errorMessage: getErrorMessage('NETWORK_ERROR'),
        });
      }
    }

    // Auto-reset after 15 seconds
    autoResetTimerRef.current = setTimeout(() => {
      setResult({ status: 'idle' });
    }, AUTO_RESET_MS);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoResetTimerRef.current) {
        clearTimeout(autoResetTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isLoading: result.status === 'loading',
    result,
    testUrl,
    reset,
  };
}
