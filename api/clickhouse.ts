/**
 * Vercel Serverless Function - ClickHouse Query API
 *
 * 这个 API 端点安全地处理 ClickHouse 查询
 * 凭证存储在 Vercel 环境变量中，不暴露给前端
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ClickHouse 配置（环境变量或 fallback）
const QUERIES_API_URL = process.env.CLICKHOUSE_QUERIES_API ||
  'https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run';
const KEY_ID = process.env.CLICKHOUSE_KEY_ID || 'l4DEcRSjinOuGPCbmlD9';
const KEY_SECRET = process.env.CLICKHOUSE_KEY_SECRET || '4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm';

/**
 * 允许的 SQL 操作（白名单）
 * 生产环境应该严格限制允许的操作
 */
const ALLOWED_OPERATIONS = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN'];

/**
 * 验证 SQL 查询是否安全
 */
function validateSQL(sql: string): { valid: boolean; error?: string } {
  const trimmedSQL = sql.trim().toUpperCase();

  // 检查是否为空
  if (!trimmedSQL) {
    return { valid: false, error: 'SQL query cannot be empty' };
  }

  // 检查是否包含危险操作
  const dangerousOperations = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE'];
  for (const op of dangerousOperations) {
    if (trimmedSQL.includes(op)) {
      return { valid: false, error: `Operation ${op} is not allowed` };
    }
  }

  // 检查是否以允许的操作开头
  const startsWithAllowed = ALLOWED_OPERATIONS.some(op => trimmedSQL.startsWith(op));
  if (!startsWithAllowed) {
    return { valid: false, error: `Query must start with one of: ${ALLOWED_OPERATIONS.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Serverless Function Handler
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查配置
  if (!QUERIES_API_URL || !KEY_ID || !KEY_SECRET) {
    console.error('Missing ClickHouse configuration');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { sql, format = 'JSONEachRow' } = req.body;

    // 验证请求体
    if (!sql) {
      return res.status(400).json({ error: 'SQL query is required' });
    }

    // 验证 SQL 安全性
    const validation = validateSQL(sql);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // 调用 ClickHouse Queries API
    const authString = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const response = await fetch(`${QUERIES_API_URL}?format=${format}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ClickHouse API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'ClickHouse query failed',
        details: errorText,
      });
    }

    // 解析响应
    const text = await response.text();

    if (!text.trim()) {
      return res.status(200).json([]);
    }

    // 解析 JSONEachRow 格式
    const lines = text.trim().split('\n');
    const data = lines.map(line => JSON.parse(line));

    // 返回结果
    return res.status(200).json(data);

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
