/**
 * ClickHouse Analytics Dashboard
 *
 * 这个组件展示了如何使用 ClickHouse API 构建实时数据仪表板
 * 配合 MCP 使用：先用 MCP 探索数据结构，再用 API 构建生产功能
 */

import { useState } from 'react';
import { useClickHouse, useClickHouseConnection } from '@/hooks/useClickHouse';

// 数据类型定义（基于 MCP 探索的结果）
interface DatabaseInfo {
  name: string;
}

interface TableInfo {
  name: string;
}

interface SystemMetric {
  metric: string;
  value: number;
}

export function ClickHouseDashboard() {
  const [selectedDatabase, setSelectedDatabase] = useState<string>('default');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 连接状态
  const { isConnected, isChecking, checkConnection } = useClickHouseConnection();

  // 获取数据库列表
  const { data: databases, isLoading: loadingDatabases, error: dbError } =
    useClickHouse<DatabaseInfo>({
      query: 'SHOW DATABASES',
      enabled: isConnected === true,
    });

  // 获取表列表
  const { data: tables, isLoading: loadingTables } =
    useClickHouse<TableInfo>({
      query: `SHOW TABLES FROM ${selectedDatabase}`,
      enabled: isConnected === true && !!selectedDatabase,
    });

  // 系统指标查询（每 30 秒刷新）
  const { data: systemMetrics, isLoading: loadingMetrics, refetch } =
    useClickHouse<SystemMetric>({
      query: `
        SELECT
          'Total Databases' as metric,
          count() as value
        FROM system.databases
        UNION ALL
        SELECT
          'Total Tables' as metric,
          count() as value
        FROM system.tables
        UNION ALL
        SELECT
          'Active Queries' as metric,
          count() as value
        FROM system.processes
        WHERE query != ''
      `,
      enabled: isConnected === true,
      refetchInterval: autoRefresh ? 30000 : undefined,
    });

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0 }}>ClickHouse Analytics Dashboard</h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Auto Refresh (30s)
          </label>

          <button
            onClick={checkConnection}
            disabled={isChecking}
            style={{
              padding: '8px 16px',
              cursor: isChecking ? 'not-allowed' : 'pointer',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {isChecking ? 'Checking...' : 'Test Connection'}
          </button>

          <button
            onClick={() => refetch()}
            disabled={!isConnected}
            style={{
              padding: '8px 16px',
              cursor: !isConnected ? 'not-allowed' : 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div style={{
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        backgroundColor: isConnected ? '#d4edda' : isConnected === false ? '#f8d7da' : '#fff3cd',
        border: `1px solid ${isConnected ? '#c3e6cb' : isConnected === false ? '#f5c6cb' : '#ffeaa7'}`
      }}>
        <strong>Connection Status:</strong> {' '}
        {isChecking && '🔄 Checking...'}
        {!isChecking && isConnected === true && '✅ Connected'}
        {!isChecking && isConnected === false && '❌ Disconnected'}
        {!isChecking && isConnected === null && '⏳ Not Checked'}

        <span style={{ marginLeft: '20px', fontSize: '13px', color: '#666' }}>
          Instance: ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud
        </span>
      </div>

      {isConnected && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* System Metrics Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, fontSize: '18px', color: '#495057' }}>
              System Metrics
            </h2>

            {loadingMetrics ? (
              <div style={{ color: '#6c757d' }}>Loading metrics...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {systemMetrics?.map((metric, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <span style={{ fontSize: '14px', color: '#495057' }}>
                      {metric.metric}
                    </span>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#007bff'
                    }}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {autoRefresh && !loadingMetrics && (
              <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#6c757d',
                textAlign: 'center'
              }}>
                🔄 Auto-refreshing every 30 seconds
              </div>
            )}
          </div>

          {/* Databases Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, fontSize: '18px', color: '#495057' }}>
              Databases ({databases?.length || 0})
            </h2>

            {loadingDatabases ? (
              <div style={{ color: '#6c757d' }}>Loading databases...</div>
            ) : dbError ? (
              <div style={{ color: '#dc3545' }}>Error: {dbError.message}</div>
            ) : (
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {databases?.map((db, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDatabase(db.name)}
                    style={{
                      padding: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      backgroundColor: selectedDatabase === db.name ? '#007bff' : '#f8f9fa',
                      color: selectedDatabase === db.name ? 'white' : '#495057',
                      border: selectedDatabase === db.name ? '1px solid #0056b3' : '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                  >
                    📁 {db.name}
                    {selectedDatabase === db.name && (
                      <span style={{ float: 'right' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tables Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, fontSize: '18px', color: '#495057' }}>
              Tables in "{selectedDatabase}" ({tables?.length || 0})
            </h2>

            {loadingTables ? (
              <div style={{ color: '#6c757d' }}>Loading tables...</div>
            ) : (
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {tables && tables.length > 0 ? (
                  tables.map((table, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: '#495057'
                      }}
                    >
                      📊 {table.name}
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#6c757d', fontSize: '14px' }}>
                    No tables found in this database
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#495057' }}>
          💡 MCP + API 协同使用提示
        </h3>

        <ol style={{ fontSize: '14px', lineHeight: '1.8', color: '#6c757d', marginBottom: 0 }}>
          <li>
            <strong>步骤 1 - 使用 MCP 探索：</strong> 在 Claude Desktop 中询问 "列出我的 ClickHouse 数据库"
          </li>
          <li>
            <strong>步骤 2 - 查看表结构：</strong> 在 Claude 中询问 "描述 users 表的结构"
          </li>
          <li>
            <strong>步骤 3 - 测试查询：</strong> 让 Claude 帮你编写和测试 SQL 查询
          </li>
          <li>
            <strong>步骤 4 - 集成到前端：</strong> 将验证过的查询添加到这个仪表板中
          </li>
        </ol>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '20px' }}>
        <details style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <summary style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#495057'
          }}>
            📝 查看示例代码
          </summary>

          <pre style={{
            backgroundColor: '#282c34',
            color: '#61dafb',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '13px',
            marginTop: '15px'
          }}>
{`// 自定义查询示例
const { data, isLoading, error } = useClickHouse<YourType>({
  query: \`
    SELECT
      date,
      count(*) as events
    FROM your_table
    WHERE timestamp >= now() - INTERVAL 7 DAY
    GROUP BY date
    ORDER BY date DESC
  \`,
  enabled: true,
  refetchInterval: 60000, // 每分钟刷新
});

// 使用数据
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    {data?.map(row => (
      <div key={row.date}>
        {row.date}: {row.events} events
      </div>
    ))}
  </div>
);`}
          </pre>
        </details>
      </div>
    </div>
  );
}
