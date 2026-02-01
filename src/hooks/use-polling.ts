'use client';

/**
 * Generic Polling Hook
 * For polling background jobs until completion
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '@/lib/api/client';

interface UsePollingOptions<T> {
  /** Function to fetch data */
  fetcher: () => Promise<T>;
  /** Function to check if polling should continue (return true to keep polling) */
  shouldContinue: (data: T) => boolean;
  /** Polling interval in milliseconds (default: 3000) */
  interval?: number;
  /** Whether to start polling immediately (default: true) */
  enabled?: boolean;
}

interface UsePollingResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  isPolling: boolean;
  refetch: () => Promise<void>;
  stopPolling: () => void;
  startPolling: () => void;
}

/**
 * Generic polling hook for background jobs
 * Auto-stops when shouldContinue returns false
 */
export function usePolling<T>({
  fetcher,
  shouldContinue,
  interval = 3000,
  enabled = true,
}: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        return result;
      }
      return null;
    } catch (err) {
      if (isMountedRef.current) {
        const apiError = err instanceof ApiError ? err : new ApiError('Fetch failed', 500);
        setError(apiError);
      }
      return null;
    }
  }, [fetcher]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling

    setIsPolling(true);
    intervalRef.current = setInterval(async () => {
      const result = await fetchData();
      if (result && !shouldContinue(result)) {
        stopPolling();
      }
    }, interval);
  }, [fetchData, shouldContinue, interval, stopPolling]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchData();
    setIsLoading(false);

    // Start polling if data requires it
    if (result && shouldContinue(result) && enabled) {
      startPolling();
    }
  }, [fetchData, shouldContinue, enabled, startPolling]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      refetch();
    }

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [enabled]); // Only run on mount and when enabled changes

  return {
    data,
    isLoading,
    error,
    isPolling,
    refetch,
    stopPolling,
    startPolling,
  };
}
