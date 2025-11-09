/**
 * ClickHouse Connection Test Component
 * Use this to verify your ClickHouse configuration
 */

import { useClickHouseConnection, useClickHouse } from '@/hooks/useClickHouse';

export function ClickHouseTest() {
  const { isConnected, isChecking, checkConnection } = useClickHouseConnection();

  // Example query - uncomment and modify for your use case
  // const { data, isLoading, error } = useClickHouse<{ result: number }>({
  //   query: 'SELECT 1 as result',
  //   enabled: isConnected === true,
  // });

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>ClickHouse Connection Test</h2>

      <div style={{
        padding: '15px',
        marginTop: '20px',
        borderRadius: '8px',
        backgroundColor: isConnected ? '#d4edda' : isConnected === false ? '#f8d7da' : '#fff3cd',
        border: `1px solid ${isConnected ? '#c3e6cb' : isConnected === false ? '#f5c6cb' : '#ffeaa7'}`
      }}>
        <h3>Connection Status</h3>
        <p>
          <strong>Status:</strong> {' '}
          {isChecking && 'Checking...'}
          {!isChecking && isConnected === true && '✅ Connected'}
          {!isChecking && isConnected === false && '❌ Connection Failed'}
          {!isChecking && isConnected === null && '⏳ Not Checked'}
        </p>

        <button
          onClick={checkConnection}
          disabled={isChecking}
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            cursor: isChecking ? 'not-allowed' : 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isChecking ? 'Checking...' : 'Test Connection'}
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>Configuration Details:</h4>
        <ul>
          <li><strong>URL:</strong> https://ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud:8443</li>
          <li><strong>Key ID:</strong> l4DEcR... (configured)</li>
          <li><strong>Region:</strong> ap-northeast-1 (AWS)</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Next Steps:</h4>
        <ol style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <li>Click "Test Connection" to verify ClickHouse is accessible</li>
          <li>Check browser console for detailed connection logs</li>
          <li>If connected, you can start querying your ClickHouse database</li>
          <li>Use <code>useClickHouse</code> hook to fetch data in your components</li>
        </ol>
      </div>

      {/* Example Usage Code */}
      <div style={{ marginTop: '20px' }}>
        <h4>Example Usage:</h4>
        <pre style={{
          backgroundColor: '#282c34',
          color: '#61dafb',
          padding: '15px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px'
        }}>
{`// In your component:
const { data, isLoading, error } = useClickHouse<YourType>({
  query: 'SELECT * FROM your_table LIMIT 10',
  enabled: true,
  refetchInterval: 30000, // Optional: auto-refresh
});

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return <div>{JSON.stringify(data, null, 2)}</div>;`}
        </pre>
      </div>
    </div>
  );
}
