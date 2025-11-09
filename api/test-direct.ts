/**
 * Test direct ClickHouse connection with full debug
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  // 硬编码凭证进行测试
  const TEST_URL = 'https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run';
  const TEST_KEY_ID = 'l4DEcRSjinOuGPCbmlD9';
  const TEST_KEY_SECRET = '4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm';

  try {
    const authString = Buffer.from(`${TEST_KEY_ID}:${TEST_KEY_SECRET}`).toString('base64');

    const response = await fetch(`${TEST_URL}?format=JSONEachRow`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: 'SELECT 1 as result' }),
    });

    const text = await response.text();

    return res.status(200).json({
      test: 'Using hardcoded credentials',
      success: response.ok,
      status: response.status,
      body: text,
      authString: authString.substring(0, 20) + '...',
    });

  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
