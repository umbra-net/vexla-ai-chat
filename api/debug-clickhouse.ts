/**
 * Debug ClickHouse connection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const QUERIES_API_URL = process.env.CLICKHOUSE_QUERIES_API;
  const KEY_ID = process.env.CLICKHOUSE_KEY_ID;
  const KEY_SECRET = process.env.CLICKHOUSE_KEY_SECRET;

  const debug = {
    env_vars_set: {
      QUERIES_API_URL: !!QUERIES_API_URL,
      KEY_ID: !!KEY_ID,
      KEY_SECRET: !!KEY_SECRET,
    },
    env_vars_preview: {
      QUERIES_API_URL: QUERIES_API_URL ? QUERIES_API_URL.substring(0, 50) + '...' : 'NOT SET',
      KEY_ID: KEY_ID ? KEY_ID.substring(0, 5) + '...' : 'NOT SET',
      KEY_SECRET: KEY_SECRET ? KEY_SECRET.substring(0, 5) + '...' : 'NOT SET',
    },
  };

  if (!QUERIES_API_URL || !KEY_ID || !KEY_SECRET) {
    return res.status(500).json({
      error: 'Missing configuration',
      debug,
    });
  }

  try {
    const authString = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

    const response = await fetch(`${QUERIES_API_URL}?format=JSONEachRow`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: 'SELECT 1 as result' }),
    });

    const responseText = await response.text();

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      debug,
    });

  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      debug,
    });
  }
}
