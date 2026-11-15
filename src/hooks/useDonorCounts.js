import { useState, useEffect, useCallback } from 'react';
import { fetchPublicDonorCounts } from '../services/statisticsService';
import { BLOOD_GROUPS } from '../data/bloodGroups';

/**
 * Custom hook to manage live Supabase verified donor statistics.
 * Handles loading, zero-count states, and graceful error states.
 */
export function useDonorCounts(district = null) {
  const [counts, setCounts] = useState(() =>
    BLOOD_GROUPS.map((group) => ({ group, count: 0 }))
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      const result = await fetchPublicDonorCounts(district);
      if (isCancelled) return;

      if (result.success && result.data) {
        setCounts(result.data.groups);
        setTotal(result.data.total);
      } else {
        setError(result.error);
        setIsUnavailable(true);
        setCounts(BLOOD_GROUPS.map((group) => ({ group, count: 0 })));
        setTotal(0);
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [district]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchPublicDonorCounts(district).then((result) => {
      if (result.success && result.data) {
        setCounts(result.data.groups);
        setTotal(result.data.total);
      } else {
        setError(result.error);
        setIsUnavailable(true);
        setCounts(BLOOD_GROUPS.map((group) => ({ group, count: 0 })));
        setTotal(0);
      }
      setLoading(false);
    });
  }, [district]);

  return {
    counts,
    total,
    formattedTotal: total.toLocaleString('en-IN'),
    loading,
    error,
    isUnavailable,
    refetch,
  };
}
