/**
 * React Hooks for ClickHouse API (通过 Vercel Serverless Functions)
 *
 * 安全的方式：通过后端 API 访问 ClickHouse
 * 凭证不暴露在前端
 */

import { useState, useEffect, useCallback } from 'react';
import {
  queryClickHouseAPI,
  testClickHouseAPIConnection,
} from '@/utils/clickhouseAPI';

interface UseClickHouseAPIOptions<T> {
  sql?: string;
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseClickHouseAPIResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to execute ClickHouse queries via API
 *
 * @example
 * const { data, isLoading, error } = useClickHouseAPI<User>({
 *   sql: 'SELECT * FROM users LIMIT 10',
 *   enabled: true,
 *   refetchInterval: 30000,
 * });
 */
export function useClickHouseAPI<T = any>(
  options: UseClickHouseAPIOptions<T> = {}
): UseClickHouseAPIResult<T> {
  const { sql, enabled = true, refetchInterval } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!sql || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryClickHouseAPI<T>(sql);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [sql, enabled]);

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
 * Hook to test API connection
 */
export function useClickHouseAPIConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await testClickHouseAPIConnection();
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

/**
 * Hook to fetch a single value from ClickHouse via API
 *
 * @example
 * const { value, isLoading } = useClickHouseAPISingleValue<number>({
 *   sql: 'SELECT count() FROM users',
 * });
 */
export function useClickHouseAPISingleValue<T = any>(
  options: UseClickHouseAPIOptions<T> = {}
): { value: T | null; isLoading: boolean; error: Error | null } {
  const { data, isLoading, error } = useClickHouseAPI<Record<string, T>>(options);

  const value = data && data.length > 0 ? Object.values(data[0])[0] : null;

  return {
    value,
    isLoading,
    error,
  };
}
