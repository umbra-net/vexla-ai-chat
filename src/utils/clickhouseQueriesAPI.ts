/**
 * ClickHouse Cloud Queries API (REST API)
 *
 * 这是一个更简单的 HTTP REST API 接口，不需要 ClickHouse 客户端
 * 适合在浏览器环境中使用，使用标准的 fetch API
 */

// Queries API 配置
const QUERIES_API_URL = import.meta.env.VITE_CLICKHOUSE_QUERIES_API;
const KEY_ID = import.meta.env.VITE_CLICKHOUSE_KEY_ID;
const KEY_SECRET = import.meta.env.VITE_CLICKHOUSE_KEY_SECRET;

/**
 * 创建 Basic Auth 头
 */
function getAuthHeader(): string {
  const credentials = `${KEY_ID}:${KEY_SECRET}`;
  return `Basic ${btoa(credentials)}`;
}

/**
 * 执行 ClickHouse 查询 (使用 Queries API)
 *
 * @param sql - SQL 查询语句
 * @param format - 响应格式，默认 JSONEachRow
 * @returns 查询结果数组
 */
export async function queryClickHouseREST<T = any>(
  sql: string,
  format: string = 'JSONEachRow'
): Promise<T[]> {
  if (!QUERIES_API_URL || !KEY_ID || !KEY_SECRET) {
    throw new Error('ClickHouse Queries API configuration missing. Please check your .env.local file.');
  }

  try {
    const response = await fetch(`${QUERIES_API_URL}?format=${format}`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClickHouse API error: ${response.status} - ${errorText}`);
    }

    // JSONEachRow 格式返回的是多个 JSON 对象，每行一个
    const text = await response.text();

    if (!text.trim()) {
      return [];
    }

    // 解析 JSONEachRow 格式（每行一个 JSON 对象）
    const lines = text.trim().split('\n');
    const data = lines.map(line => JSON.parse(line) as T);

    return data;
  } catch (error) {
    console.error('ClickHouse Queries API error:', error);
    throw error;
  }
}

/**
 * 测试 Queries API 连接
 */
export async function testQueriesAPIConnection(): Promise<boolean> {
  try {
    const result = await queryClickHouseREST<{ result: number }>('SELECT 1 as result');
    console.log('✅ ClickHouse Queries API connection successful:', result);
    return result.length > 0 && result[0].result === 1;
  } catch (error) {
    console.error('❌ ClickHouse Queries API connection failed:', error);
    return false;
  }
}

/**
 * 获取数据库列表 (Queries API)
 */
export async function getDatabasesREST(): Promise<string[]> {
  const result = await queryClickHouseREST<{ name: string }>('SHOW DATABASES');
  return result.map(row => row.name);
}

/**
 * 获取表列表 (Queries API)
 */
export async function getTablesREST(database: string = 'default'): Promise<string[]> {
  const result = await queryClickHouseREST<{ name: string }>(
    `SHOW TABLES FROM ${database}`
  );
  return result.map(row => row.name);
}

/**
 * 获取表结构 (Queries API)
 */
export async function getTableSchemaREST(
  table: string,
  database: string = 'default'
): Promise<Array<{ name: string; type: string; default_type: string }>> {
  return queryClickHouseREST<{ name: string; type: string; default_type: string }>(
    `DESCRIBE TABLE ${database}.${table}`
  );
}

/**
 * 执行查询并返回单个值
 */
export async function querySingleValueREST<T = any>(sql: string): Promise<T | null> {
  const result = await queryClickHouseREST<Record<string, T>>(sql);
  if (result.length === 0) {
    return null;
  }
  // 返回第一行的第一个值
  const firstRow = result[0];
  const firstValue = Object.values(firstRow)[0];
  return firstValue;
}

/**
 * 执行查询并返回总数
 */
export async function getCountREST(
  table: string,
  database: string = 'default',
  whereClause?: string
): Promise<number> {
  const sql = whereClause
    ? `SELECT count() as count FROM ${database}.${table} WHERE ${whereClause}`
    : `SELECT count() as count FROM ${database}.${table}`;

  const result = await querySingleValueREST<number>(sql);
  return result || 0;
}

/**
 * 批量插入数据 (使用 VALUES 语法)
 *
 * 注意：Queries API 不支持 INSERT ... FORMAT，需要使用传统的 VALUES 语法
 */
export async function insertDataREST(
  table: string,
  columns: string[],
  values: any[][],
  database: string = 'default'
): Promise<void> {
  const columnsList = columns.join(', ');
  const valuesList = values
    .map(row => {
      const formattedValues = row.map(val => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'string') return `'${val.replace(/'/g, "\\'")}'`;
        if (typeof val === 'number') return val;
        if (typeof val === 'boolean') return val ? '1' : '0';
        return `'${JSON.stringify(val)}'`;
      });
      return `(${formattedValues.join(', ')})`;
    })
    .join(', ');

  const sql = `INSERT INTO ${database}.${table} (${columnsList}) VALUES ${valuesList}`;

  await queryClickHouseREST(sql);
}

/**
 * API 配置信息
 */
export function getQueriesAPIConfig() {
  return {
    url: QUERIES_API_URL,
    serviceId: import.meta.env.VITE_CLICKHOUSE_SERVICE_ID,
    isConfigured: !!(QUERIES_API_URL && KEY_ID && KEY_SECRET),
  };
}
