'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UsageQuota } from '@/app/api/usage/route';

interface UseUsageQuotaState {
  quota: UsageQuota | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseUsageQuota extends UseUsageQuotaState {
  refetch: () => Promise<void>;
  canCreateDataset: boolean;
  canCreateEvaluation: boolean;
}

export function useUsageQuota(): UseUsageQuota {
  const [state, setState] = useState<UseUsageQuotaState>({
    quota: null,
    isLoading: true,
    error: null,
  });

  const fetchQuota = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch('/api/usage');
      if (!res.ok) {
        throw new Error(`Failed to fetch usage quota: ${res.status}`);
      }
      const data: UsageQuota = await res.json();
      setState({ quota: data, isLoading: false, error: null });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch usage quota');
      setState((prev) => ({ ...prev, isLoading: false, error }));
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  return {
    ...state,
    refetch: fetchQuota,
    canCreateDataset: state.quota
      ? state.quota.datasets_remaining === -1 || state.quota.datasets_remaining > 0
      : true,
    canCreateEvaluation: state.quota
      ? state.quota.evaluations_remaining === -1 || state.quota.evaluations_remaining > 0
      : true,
  };
}
