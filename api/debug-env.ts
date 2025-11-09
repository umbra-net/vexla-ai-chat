/**
 * Debug endpoint to check environment variables
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const envVars = {
    CLICKHOUSE_QUERIES_API: process.env.CLICKHOUSE_QUERIES_API ? 'SET' : 'NOT SET',
    CLICKHOUSE_KEY_ID: process.env.CLICKHOUSE_KEY_ID ? 'SET' : 'NOT SET',
    CLICKHOUSE_KEY_SECRET: process.env.CLICKHOUSE_KEY_SECRET ? 'SET' : 'NOT SET',
    CLICKHOUSE_SERVICE_ID: process.env.CLICKHOUSE_SERVICE_ID ? 'SET' : 'NOT SET',
    CLICKHOUSE_URL: process.env.CLICKHOUSE_URL ? 'SET' : 'NOT SET',
  };

  return res.status(200).json({
    message: 'Environment variable status',
    env: envVars,
  });
}
