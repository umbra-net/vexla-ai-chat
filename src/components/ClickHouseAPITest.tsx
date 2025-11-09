/**
 * ClickHouse API Test Component (Serverless Backend)
 *
 * 使用安全的后端 API 方式访问 ClickHouse
 * ✅ 凭证不暴露在前端
 * ✅ 生产环境就绪
 */

import { useState } from 'react';
import {
  useClickHouseAPI,
  useClickHouseAPIConnection,
  useClickHouseAPISingleValue,
} from '@/hooks/useClickHouseAPI';
import { getAPIConfig } from '@/utils/clickhouseAPI';

interface DatabaseInfo {
  name: string;
}

export function ClickHouseAPITest() {
  const [customSQL, setCustomSQL] = useState('SELECT version()');
  const [executeCustom, setExecuteCustom] = useState(false);

  // API 配置信息
  const apiConfig = getAPIConfig();

  // 连接测试
  const { isConnected, isChecking, checkConnection } = useClickHouseAPIConnection();

  // 获取数据库列表
  const { data: databases, isLoading: loadingDatabases, error: dbError } =
    useClickHouseAPI<DatabaseInfo>({
      sql: 'SHOW DATABASES',
      enabled: isConnected === true,
    });

  // 获取版本号
  const { value: version, isLoading: loadingVersion } = useClickHouseAPISingleValue<string>({
    sql: 'SELECT version()',
    enabled: isConnected === true,
  });

  // 自定义查询
  const { data: customResult, isLoading: customLoading, error: customError, refetch } =
    useClickHouseAPI<any>({
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
          🔐 ClickHouse API (Serverless Backend)
        </h1>
        <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '10px' }}>
          安全架构：前端 → Vercel API → ClickHouse（凭证不暴露）
        </p>
      </div>

      {/* 架构说明 */}
      <div style={{
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#155724' }}>
          ✅ 安全优势
        </h3>
        <ul style={{ fontSize: '14px', color: '#155724', marginBottom: 0, lineHeight: '1.8' }}>
          <li>🔒 <strong>凭证安全</strong> - ClickHouse 凭证存储在 Vercel 后端</li>
          <li>🛡️ <strong>SQL 白名单</strong> - 后端限制允许的 SQL 操作</li>
          <li>🚫 <strong>防止滥用</strong> - 禁止 DROP/DELETE/INSERT 等危险操作</li>
          <li>📊 <strong>审计日志</strong> - 后端记录所有查询请求</li>
          <li>⚡ <strong>Serverless</strong> - 自动扩展，无需维护服务器</li>
        </ul>
      </div>

      {/* API 配置 */}
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
            <strong>Base URL:</strong> {apiConfig.baseURL || '(relative)'}
          </div>
          <div style={{ marginTop: '5px' }}>
            <strong>Environment:</strong> {apiConfig.environment}
          </div>
          <div style={{ marginTop: '5px' }}>
            <strong>Endpoints:</strong>
            <ul style={{ marginTop: '5px', marginBottom: 0 }}>
              <li>/api/clickhouse - Query endpoint</li>
              <li>/api/clickhouse-ping - Connection test</li>
            </ul>
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
            <strong>Backend API Status:</strong> {' '}
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
              <div style={{ color: '#6c757d' }}>⏳ Loading...</div>
            ) : dbError ? (
              <div style={{
                padding: '10px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                ❌ {dbError.message}
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

          {/* 自定义查询 */}
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>
              Custom SQL Query (Read-Only)
            </h3>

            <div style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              fontSize: '13px',
              color: '#856404'
            }}>
              🛡️ <strong>安全限制:</strong> 只允许 SELECT, SHOW, DESCRIBE, EXPLAIN 操作
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
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
                <strong style={{ display: 'block', marginBottom: '10px' }}>Result:</strong>

                {customLoading ? (
                  <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                    ⏳ Executing...
                  </div>
                ) : customError ? (
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}>
                    ❌ {customError.message}
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

          {/* 示例查询 */}
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>Quick Examples</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'SELECT version()',
                'SHOW DATABASES',
                'SELECT 1 + 1 as result',
                'SELECT now() as current_time',
                'SHOW TABLES FROM system',
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
    </div>
  );
}
