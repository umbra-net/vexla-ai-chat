/**
 * React Hook for ClickHouse queries
 */

import { useState, useEffect, useCallback } from 'react';
import { queryClickHouse, testClickHouseConnection } from '@/utils/clickhouse';

interface UseClickHouseOptions<T> {
  query?: string;
  params?: Record<string, any>;
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseClickHouseResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to execute ClickHouse queries with automatic state management
 */
export function useClickHouse<T = any>(
  options: UseClickHouseOptions<T> = {}
): UseClickHouseResult<T> {
  const { query, params, enabled = true, refetchInterval } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!query || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryClickHouse<T>(query, params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [query, params, enabled]);

  useEffect(() => {
    fetchData();

    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook to test ClickHouse connection
 */
export function useClickHouseConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await testClickHouseConnection();
      setIsConnected(result);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    isChecking,
    checkConnection,
  };
}
