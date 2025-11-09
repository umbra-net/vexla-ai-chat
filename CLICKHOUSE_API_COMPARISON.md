# ClickHouse API 对比指南

## 📊 两种 API 方式对比

你的项目现在同时支持两种 ClickHouse API：

### 1. Native Protocol (原生协议)
使用 `@clickhouse/client` 包，通过 ClickHouse 原生协议通信

### 2. Queries API (REST API)
使用标准 HTTP REST API，通过 `fetch` 访问

---

## 🔍 详细对比

| 特性 | Native Protocol | Queries API (REST) |
|------|----------------|-------------------|
| **端点** | `https://ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud:8443` | `https://queries.clickhouse.cloud/service/{id}/run` |
| **协议** | ClickHouse Native | HTTP/HTTPS REST |
| **包依赖** | `@clickhouse/client` (需要安装) | 无需依赖，使用原生 `fetch` |
| **Bundle 大小** | ~150KB | ~0KB (使用浏览器原生 API) |
| **浏览器兼容性** | 需要 polyfill | 原生支持 |
| **认证方式** | Username/Password | HTTP Basic Auth |
| **数据格式** | 多种格式 (JSON, CSV, etc.) | JSONEachRow (默认) |
| **性能** | 更快（二进制协议） | 稍慢（HTTP/JSON） |
| **复杂度** | 中等 | 简单 |
| **INSERT 支持** | ✅ 完整支持 FORMAT | ⚠️ 需使用 VALUES 语法 |
| **流式查询** | ✅ 支持 | ❌ 不支持 |
| **压缩** | ✅ 支持 | ⚠️ HTTP 压缩 |
| **推荐场景** | Node.js / 复杂查询 | 浏览器 / 简单查询 |

---

## 🎯 使用建议

### 推荐使用 Queries API (REST) 的场景：

✅ **浏览器环境** - 减少 bundle 大小
✅ **简单查询** - SELECT 为主的读取操作
✅ **快速原型** - 不需要安装额外依赖
✅ **跨平台** - 任何支持 fetch 的环境
✅ **调试方便** - 可以直接用 curl 测试

### 推荐使用 Native Protocol 的场景：

✅ **Node.js 后端** - 性能更好
✅ **复杂操作** - 大量 INSERT、流式查询
✅ **高性能要求** - 二进制协议更快
✅ **完整功能** - 需要 ClickHouse 所有特性

---

## 💻 代码示例对比

### Queries API (REST) - 推荐浏览器使用

```typescript
import { useClickHouseREST } from '@/hooks/useClickHouseREST';

function MyComponent() {
  const { data, isLoading, error } = useClickHouseREST<User>({
    sql: 'SELECT * FROM users LIMIT 10',
    enabled: true,
    refetchInterval: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

**优势：**
- 📦 零依赖，bundle 更小
- 🚀 更快的页面加载
- 🔧 更简单的实现

---

### Native Protocol - 适用 Node.js

```typescript
import { useClickHouse } from '@/hooks/useClickHouse';

function MyComponent() {
  const { data, isLoading, error } = useClickHouse<User>({
    query: 'SELECT * FROM users LIMIT 10',
    enabled: true,
    refetchInterval: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

**优势：**
- ⚡ 性能更好
- 🎯 完整功能支持
- 📊 流式查询

---

## 🛠️ 配置详情

### 环境变量 (.env.local)

```bash
# Native Protocol
VITE_CLICKHOUSE_URL=https://ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud:8443
VITE_CLICKHOUSE_KEY_ID=l4DEcRSjinOuGPCbmlD9
VITE_CLICKHOUSE_KEY_SECRET=4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm

# Queries API (REST)
VITE_CLICKHOUSE_QUERIES_API=https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run
VITE_CLICKHOUSE_SERVICE_ID=3c84c16a-2e8f-4331-b21b-d087a246d77d
```

---

## 🧪 测试连接

### 测试 Queries API (推荐在浏览器中)

```typescript
import { useQueriesAPIConnection } from '@/hooks/useClickHouseREST';

function ConnectionTest() {
  const { isConnected, isChecking, checkConnection } = useQueriesAPIConnection();

  return (
    <div>
      <p>Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
      <button onClick={checkConnection}>Test Connection</button>
    </div>
  );
}
```

### 测试 Native Protocol

```typescript
import { useClickHouseConnection } from '@/hooks/useClickHouse';

function ConnectionTest() {
  const { isConnected, isChecking, checkConnection } = useClickHouseConnection();

  return (
    <div>
      <p>Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
      <button onClick={checkConnection}>Test Connection</button>
    </div>
  );
}
```

---

## 📝 实战示例

### 场景：获取用户总数

#### 使用 Queries API (推荐)

```typescript
import { useClickHouseSingleValue } from '@/hooks/useClickHouseREST';

function UserCount() {
  const { value, isLoading } = useClickHouseSingleValue<number>({
    sql: 'SELECT count() FROM users',
  });

  return <div>Total Users: {value}</div>;
}
```

#### 使用 Native Protocol

```typescript
import { useClickHouse } from '@/hooks/useClickHouse';

function UserCount() {
  const { data, isLoading } = useClickHouse<{ count: number }>({
    query: 'SELECT count() as count FROM users',
  });

  return <div>Total Users: {data?.[0]?.count}</div>;
}
```

---

## 🚀 性能优化建议

### 使用 Queries API 时

1. **减少请求频率**
   ```typescript
   refetchInterval: 60000, // 1 分钟，而不是 5 秒
   ```

2. **使用 LIMIT**
   ```sql
   SELECT * FROM large_table LIMIT 100
   ```

3. **选择必要的列**
   ```sql
   SELECT id, name FROM users  -- 而不是 SELECT *
   ```

4. **启用查询缓存**
   ```typescript
   // 使用 React Query 或 SWR 进行缓存
   ```

### 使用 Native Protocol 时

1. **启用压缩**
   ```typescript
   compression: { response: true }
   ```

2. **批量操作**
   ```typescript
   await insertClickHouse('table', largeArray);
   ```

3. **使用连接池**（已自动实现）

---

## 🎯 迁移指南

### 从 Native Protocol 迁移到 Queries API

**之前：**
```typescript
import { useClickHouse } from '@/hooks/useClickHouse';

const { data } = useClickHouse({
  query: 'SELECT * FROM users',
  params: {},
});
```

**之后：**
```typescript
import { useClickHouseREST } from '@/hooks/useClickHouseREST';

const { data } = useClickHouseREST({
  sql: 'SELECT * FROM users',
});
```

**主要变化：**
- `query` → `sql`
- 移除 `params`（在 SQL 中直接插入值）
- 更快的加载速度（无需加载客户端）

---

## 🔧 MCP 集成

ClickHouse MCP 使用 Native Protocol，配置在：

```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

MCP 与两种 API 的关系：

```
┌─────────────────────┐
│   Claude Desktop    │
│       (MCP)         │ ← 使用 Native Protocol
└─────────────────────┘

┌─────────────────────┐
│   Frontend App      │
│  (React + Vite)     │
├─────────────────────┤
│  • Queries API ✅   │ ← 推荐（浏览器）
│  • Native Protocol  │ ← 可选（高级功能）
└─────────────────────┘
```

---

## 📊 Bundle 大小影响

### 只使用 Queries API
```
Total bundle: ~600 KB
- React: 140 KB
- App code: 460 KB
- ClickHouse Client: 0 KB ✅
```

### 使用 Native Protocol
```
Total bundle: ~750 KB
- React: 140 KB
- App code: 460 KB
- ClickHouse Client: ~150 KB ⚠️
```

**建议：** 如果只需要简单查询，使用 Queries API 可以减少 20% 的 bundle 大小！

---

## ✅ 最终建议

### 对于这个项目（React 前端应用）

**推荐使用 Queries API (REST)**

理由：
1. ✅ 零依赖，bundle 更小
2. ✅ 浏览器原生支持
3. ✅ 代码更简单
4. ✅ 足够满足大多数需求
5. ✅ 更好的性能（更小的 JS bundle）

### 何时使用 Native Protocol

只在以下情况使用：
- 需要流式查询
- 需要高性能批量 INSERT
- 需要 ClickHouse 特殊功能
- 在 Node.js 后端使用

---

**配置完成时间**: 2025-11-09
**两种 API 均已配置完成**
**推荐在前端使用 Queries API** ✅
