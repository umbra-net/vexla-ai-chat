/**
 * React Hooks for ClickHouse Queries API (REST)
 *
 * 使用简单的 REST API，不需要 ClickHouse 客户端
 * 推荐在浏览器环境中使用
 */

import { useState, useEffect, useCallback } from 'react';
import {
  queryClickHouseREST,
  testQueriesAPIConnection,
} from '@/utils/clickhouseQueriesAPI';

interface UseClickHouseRESTOptions<T> {
  sql?: string;
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseClickHouseRESTResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to execute ClickHouse queries using REST API
 *
 * @example
 * const { data, isLoading, error } = useClickHouseREST<User>({
 *   sql: 'SELECT * FROM users LIMIT 10',
 *   enabled: true,
 *   refetchInterval: 30000, // 每 30 秒刷新
 * });
 */
export function useClickHouseREST<T = any>(
  options: UseClickHouseRESTOptions<T> = {}
): UseClickHouseRESTResult<T> {
  const { sql, enabled = true, refetchInterval } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!sql || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryClickHouseREST<T>(sql);
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
 * Hook to test Queries API connection
 */
export function useQueriesAPIConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await testQueriesAPIConnection();
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
 * Hook to fetch a single value from ClickHouse
 *
 * @example
 * const { value, isLoading } = useClickHouseSingleValue<number>({
 *   sql: 'SELECT count() FROM users',
 * });
 */
export function useClickHouseSingleValue<T = any>(
  options: UseClickHouseRESTOptions<T> = {}
): { value: T | null; isLoading: boolean; error: Error | null } {
  const { data, isLoading, error } = useClickHouseREST<Record<string, T>>(options);

  const value = data && data.length > 0 ? Object.values(data[0])[0] : null;

  return {
    value,
    isLoading,
    error,
  };
}
