/**
 * Vercel Serverless Function - ClickHouse Connection Test
 *
 * 测试 ClickHouse 连接状态
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const QUERIES_API_URL = process.env.CLICKHOUSE_QUERIES_API;
const KEY_ID = process.env.CLICKHOUSE_KEY_ID;
const KEY_SECRET = process.env.CLICKHOUSE_KEY_SECRET;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 允许 GET 和 POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查配置
  if (!QUERIES_API_URL || !KEY_ID || !KEY_SECRET) {
    return res.status(500).json({
      connected: false,
      error: 'Server configuration missing',
    });
  }

  try {
    // 执行简单的 SELECT 1 查询
    const authString = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const response = await fetch(`${QUERIES_API_URL}?format=JSONEachRow`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: 'SELECT 1 as result' }),
    });

    if (!response.ok) {
      return res.status(200).json({
        connected: false,
        error: `Connection failed with status ${response.status}`,
      });
    }

    const text = await response.text();
    const result = JSON.parse(text.split('\n')[0]);

    if (result.result === 1) {
      return res.status(200).json({
        connected: true,
        message: 'ClickHouse connection successful',
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(200).json({
        connected: false,
        error: 'Unexpected response from ClickHouse',
      });
    }

  } catch (error) {
    console.error('Connection test error:', error);
    return res.status(200).json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
