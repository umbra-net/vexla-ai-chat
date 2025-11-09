/**
 * ClickHouse Cloud Client
 *
 * Provides utilities for connecting to and querying ClickHouse Cloud
 */

import { createClient, ClickHouseClient } from '@clickhouse/client';

// ClickHouse Client Instance
let clickhouseClient: ClickHouseClient | null = null;

/**
 * Get or create ClickHouse client instance
 */
export function getClickHouseClient(): ClickHouseClient {
  if (!clickhouseClient) {
    const url = import.meta.env.VITE_CLICKHOUSE_URL;
    const keyId = import.meta.env.VITE_CLICKHOUSE_KEY_ID;
    const keySecret = import.meta.env.VITE_CLICKHOUSE_KEY_SECRET;

    if (!url || !keyId || !keySecret) {
      throw new Error('ClickHouse configuration missing. Please check your .env.local file.');
    }

    clickhouseClient = createClient({
      url,
      username: keyId,
      password: keySecret,
      compression: {
        response: true,
      },
    });
  }

  return clickhouseClient;
}

/**
 * Execute a ClickHouse query
 */
export async function queryClickHouse<T = any>(
  query: string,
  params?: Record<string, any>
): Promise<T[]> {
  try {
    const client = getClickHouseClient();

    const resultSet = await client.query({
      query,
      query_params: params,
      format: 'JSONEachRow',
    });

    const data = await resultSet.json<T>();
    return data;
  } catch (error) {
    console.error('ClickHouse query error:', error);
    throw error;
  }
}

/**
 * Execute a ClickHouse insert operation
 */
export async function insertClickHouse(
  table: string,
  data: any[]
): Promise<void> {
  try {
    const client = getClickHouseClient();

    await client.insert({
      table,
      values: data,
      format: 'JSONEachRow',
    });
  } catch (error) {
    console.error('ClickHouse insert error:', error);
    throw error;
  }
}

/**
 * Test ClickHouse connection
 */
export async function testClickHouseConnection(): Promise<boolean> {
  try {
    const client = getClickHouseClient();
    const result = await client.ping();
    console.log('✅ ClickHouse connection successful:', result);
    return result.success;
  } catch (error) {
    console.error('❌ ClickHouse connection failed:', error);
    return false;
  }
}

/**
 * Get database list
 */
export async function getDatabases(): Promise<string[]> {
  const result = await queryClickHouse<{ name: string }>('SHOW DATABASES');
  return result.map(row => row.name);
}

/**
 * Get tables from a database
 */
export async function getTables(database: string = 'default'): Promise<string[]> {
  const result = await queryClickHouse<{ name: string }>(
    `SHOW TABLES FROM ${database}`
  );
  return result.map(row => row.name);
}

/**
 * Close ClickHouse connection
 */
export async function closeClickHouseConnection(): Promise<void> {
  if (clickhouseClient) {
    await clickhouseClient.close();
    clickhouseClient = null;
  }
}
