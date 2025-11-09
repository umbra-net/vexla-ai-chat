/**
 * ClickHouse Queries API (REST) Test Component
 *
 * 测试新的 REST API 接口，比 Native Protocol 更简单
 * 零依赖，使用浏览器原生 fetch
 */

import { useState } from 'react';
import {
  useClickHouseREST,
  useQueriesAPIConnection,
  useClickHouseSingleValue,
} from '@/hooks/useClickHouseREST';
import { getQueriesAPIConfig } from '@/utils/clickhouseQueriesAPI';

interface DatabaseInfo {
  name: string;
}

export function ClickHouseRESTTest() {
  const [customSQL, setCustomSQL] = useState('SELECT version()');
  const [executeCustom, setExecuteCustom] = useState(false);

  // API 配置信息
  const apiConfig = getQueriesAPIConfig();

  // 连接测试
  const { isConnected, isChecking, checkConnection } = useQueriesAPIConnection();

  // 获取数据库列表
  const { data: databases, isLoading: loadingDatabases, error: dbError } =
    useClickHouseREST<DatabaseInfo>({
      sql: 'SHOW DATABASES',
      enabled: isConnected === true,
    });

  // 获取版本号（单值查询示例）
  const { value: version, isLoading: loadingVersion } = useClickHouseSingleValue<string>({
    sql: 'SELECT version()',
    enabled: isConnected === true,
  });

  // 自定义 SQL 查询
  const { data: customResult, isLoading: customLoading, error: customError, refetch } =
    useClickHouseREST<any>({
      sql: customSQL,
      enabled: executeCustom && isConnected === true,
    });

  const handleExecuteCustom = () => {
    setExecuteCustom(true);
    setTimeout(() => refetch(), 100);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>
          ClickHouse Queries API (REST) Test
        </h1>
        <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '10px' }}>
          使用简单的 REST API，零依赖，更小的 bundle 大小
        </p>
      </div>

      {/* API 配置信息 */}
      <div style={{
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>API Configuration</h3>
        <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#495057' }}>
          <div>
            <strong>URL:</strong> {apiConfig.url || '❌ Not configured'}
          </div>
          <div style={{ marginTop: '5px' }}>
            <strong>Service ID:</strong> {apiConfig.serviceId || '❌ Not configured'}
          </div>
          <div style={{ marginTop: '5px' }}>
            <strong>Status:</strong> {apiConfig.isConfigured ? '✅ Configured' : '❌ Missing configuration'}
          </div>
        </div>
      </div>

      {/* 连接状态 */}
      <div style={{
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        backgroundColor: isConnected ? '#d4edda' : isConnected === false ? '#f8d7da' : '#fff3cd',
        border: `1px solid ${isConnected ? '#c3e6cb' : isConnected === false ? '#f5c6cb' : '#ffeaa7'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Connection Status:</strong> {' '}
            {isChecking && '🔄 Checking...'}
            {!isChecking && isConnected === true && '✅ Connected'}
            {!isChecking && isConnected === false && '❌ Connection Failed'}
            {!isChecking && isConnected === null && '⏳ Not Checked'}
          </div>

          <button
            onClick={checkConnection}
            disabled={isChecking}
            style={{
              padding: '8px 16px',
              cursor: isChecking ? 'not-allowed' : 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {isChecking ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>

      {isConnected && (
        <>
          {/* ClickHouse 版本 */}
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>ClickHouse Version</h3>
            <div style={{
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              {loadingVersion ? '⏳ Loading...' : version || '❌ Unknown'}
            </div>
          </div>

          {/* 数据库列表 */}
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>
              Databases ({databases?.length || 0})
            </h3>

            {loadingDatabases ? (
              <div style={{ color: '#6c757d' }}>⏳ Loading databases...</div>
            ) : dbError ? (
              <div style={{
                padding: '10px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                ❌ Error: {dbError.message}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '10px'
              }}>
                {databases?.map((db, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#e7f3ff',
                      border: '1px solid #b3d9ff',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#004085'
                    }}
                  >
                    📁 {db.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 自定义 SQL 查询 */}
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>Custom SQL Query</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                SQL Statement:
              </label>
              <textarea
                value={customSQL}
                onChange={(e) => setCustomSQL(e.target.value)}
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
                placeholder="Enter your SQL query here..."
              />
            </div>

            <button
              onClick={handleExecuteCustom}
              disabled={customLoading || !customSQL.trim()}
              style={{
                padding: '10px 20px',
                cursor: (customLoading || !customSQL.trim()) ? 'not-allowed' : 'pointer',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {customLoading ? '⏳ Executing...' : '▶️ Execute Query'}
            </button>

            {/* 查询结果 */}
            {executeCustom && (
              <div style={{ marginTop: '15px' }}>
                <strong style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>
                  Result:
                </strong>

                {customLoading ? (
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '4px',
                    color: '#856404'
                  }}>
                    ⏳ Executing query...
                  </div>
                ) : customError ? (
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}>
                    ❌ Error: {customError.message}
                  </div>
                ) : customResult ? (
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}>
                    <pre style={{
                      margin: 0,
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      {JSON.stringify(customResult, null, 2)}
                    </pre>

                    <div style={{
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid #dee2e6',
                      fontSize: '13px',
                      color: '#6c757d'
                    }}>
                      ✅ Returned {customResult.length} row(s)
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* 预设查询示例 */}
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>Quick Examples</h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {[
                'SELECT version()',
                'SHOW DATABASES',
                'SELECT 1 + 1 as result',
                'SELECT now() as current_time',
                'SHOW TABLES FROM system',
                'SELECT name FROM system.databases LIMIT 5',
              ].map((sql, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomSQL(sql)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    backgroundColor: 'white',
                    border: '1px solid #007bff',
                    color: '#007bff',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {sql}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 优势说明 */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#155724' }}>
          ✨ Queries API 优势
        </h3>
        <ul style={{ fontSize: '14px', color: '#155724', marginBottom: 0, lineHeight: '1.8' }}>
          <li>📦 <strong>零依赖</strong> - 不需要安装 @clickhouse/client</li>
          <li>🚀 <strong>更小的 Bundle</strong> - 减少约 150KB JavaScript</li>
          <li>🌐 <strong>浏览器原生</strong> - 使用标准 fetch API</li>
          <li>🔧 <strong>更简单</strong> - 代码更少，更易维护</li>
          <li>🧪 <strong>易于测试</strong> - 可以直接用 curl 测试</li>
        </ul>
      </div>
    </div>
  );
}
