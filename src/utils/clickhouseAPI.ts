/**
 * ClickHouse API Client (通过 Vercel Serverless Functions)
 *
 * 这个客户端调用后端 API，而不是直接连接 ClickHouse
 * 凭证安全地存储在后端，不暴露给前端
 */

// API 基础 URL（开发和生产环境自动切换）
const API_BASE_URL = import.meta.env.PROD
  ? '' // 生产环境使用相对路径
  : 'http://localhost:3000'; // 开发环境

/**
 * 执行 ClickHouse 查询（通过后端 API）
 *
 * @param sql - SQL 查询语句
 * @returns 查询结果数组
 */
export async function queryClickHouseAPI<T = any>(sql: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clickhouse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('ClickHouse API error:', error);
    throw error;
  }
}

/**
 * 测试 ClickHouse 连接（通过后端 API）
 */
export async function testClickHouseAPIConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clickhouse-ping`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Connection test failed:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('✅ ClickHouse API connection:', result);
    return result.connected === true;

  } catch (error) {
    console.error('❌ ClickHouse API connection failed:', error);
    return false;
  }
}

/**
 * 获取数据库列表（通过 API）
 */
export async function getDatabasesAPI(): Promise<string[]> {
  const result = await queryClickHouseAPI<{ name: string }>('SHOW DATABASES');
  return result.map(row => row.name);
}

/**
 * 获取表列表（通过 API）
 */
export async function getTablesAPI(database: string = 'default'): Promise<string[]> {
  const result = await queryClickHouseAPI<{ name: string }>(
    `SHOW TABLES FROM ${database}`
  );
  return result.map(row => row.name);
}

/**
 * 获取表结构（通过 API）
 */
export async function getTableSchemaAPI(
  table: string,
  database: string = 'default'
): Promise<Array<{ name: string; type: string; default_type: string }>> {
  return queryClickHouseAPI<{ name: string; type: string; default_type: string }>(
    `DESCRIBE TABLE ${database}.${table}`
  );
}

/**
 * 执行查询并返回单个值（通过 API）
 */
export async function querySingleValueAPI<T = any>(sql: string): Promise<T | null> {
  const result = await queryClickHouseAPI<Record<string, T>>(sql);
  if (result.length === 0) {
    return null;
  }
  const firstRow = result[0];
  const firstValue = Object.values(firstRow)[0];
  return firstValue;
}

/**
 * 获取总数（通过 API）
 */
export async function getCountAPI(
  table: string,
  database: string = 'default',
  whereClause?: string
): Promise<number> {
  const sql = whereClause
    ? `SELECT count() as count FROM ${database}.${table} WHERE ${whereClause}`
    : `SELECT count() as count FROM ${database}.${table}`;

  const result = await querySingleValueAPI<number>(sql);
  return result || 0;
}

/**
 * API 配置信息
 */
export function getAPIConfig() {
  return {
    baseURL: API_BASE_URL,
    environment: import.meta.env.PROD ? 'production' : 'development',
    isConfigured: true, // 始终配置好（后端处理凭证）
  };
}
