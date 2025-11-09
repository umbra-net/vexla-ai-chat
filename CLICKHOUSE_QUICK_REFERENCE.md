# ClickHouse 快速参考

## 🚀 快速开始（3 步）

### 1️⃣ 测试 REST API（推荐）

```typescript
import { ClickHouseRESTTest } from '@/components/ClickHouseRESTTest';

// 添加到 App.tsx
<ClickHouseRESTTest />
```

访问: http://localhost:3000

### 2️⃣ 测试 MCP（Claude Desktop）

1. **重启** Claude Desktop
2. **询问**: "连接到我的 ClickHouse 数据库"
3. **成功！** 看到数据库列表

### 3️⃣ 在实际组件中使用

```typescript
import { useClickHouseREST } from '@/hooks/useClickHouseREST';

const { data, isLoading } = useClickHouseREST<User>({
  sql: 'SELECT * FROM users LIMIT 10',
});
```

---

## 📋 常用代码片段

### 查询数据

```typescript
const { data, isLoading, error } = useClickHouseREST<{
  id: string;
  name: string;
}>({
  sql: 'SELECT id, name FROM users WHERE active = true',
  enabled: true,
  refetchInterval: 30000, // 每 30 秒刷新
});
```

### 获取单个值

```typescript
const { value } = useClickHouseSingleValue<number>({
  sql: 'SELECT count() FROM users',
});

// 结果: value = 12345
```

### 连接测试

```typescript
const { isConnected, checkConnection } = useQueriesAPIConnection();

<button onClick={checkConnection}>
  {isConnected ? '✅ Connected' : '❌ Disconnected'}
</button>
```

### 自定义查询

```typescript
import { queryClickHouseREST } from '@/utils/clickhouseQueriesAPI';

const result = await queryClickHouseREST<YourType>(`
  SELECT
    date,
    count(*) as total
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY
  GROUP BY date
`);
```

---

## 🎯 MCP 使用（Claude Desktop）

### 常用提问

```
# 数据库探索
列出我的 ClickHouse 数据库
显示 default 数据库中的表
描述 users 表的结构

# 数据查询
最近一周有多少活跃用户？
查询 users 表的前 10 条记录
统计每天的新增用户数

# 数据分析
分析最近 30 天的用户增长趋势
找出使用次数最多的 10 个功能
```

---

## 🔧 配置信息

### 环境变量 (.env.local)

```bash
# Queries API (推荐使用)
VITE_CLICKHOUSE_QUERIES_API=https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run

# 认证
VITE_CLICKHOUSE_KEY_ID=l4DEcRSjinOuGPCbmlD9
VITE_CLICKHOUSE_KEY_SECRET=4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm
```

### MCP 配置位置

```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

---

## 📚 可用工具

### Hooks

```typescript
// Queries API (推荐)
import { useClickHouseREST } from '@/hooks/useClickHouseREST';
import { useQueriesAPIConnection } from '@/hooks/useClickHouseREST';
import { useClickHouseSingleValue } from '@/hooks/useClickHouseREST';

// Native Protocol
import { useClickHouse } from '@/hooks/useClickHouse';
import { useClickHouseConnection } from '@/hooks/useClickHouse';
```

### 工具函数

```typescript
// Queries API (推荐)
import {
  queryClickHouseREST,
  testQueriesAPIConnection,
  getDatabasesREST,
  getTablesREST,
} from '@/utils/clickhouseQueriesAPI';

// Native Protocol
import {
  queryClickHouse,
  testClickHouseConnection,
  getDatabases,
  getTables,
} from '@/utils/clickhouse';
```

### 测试组件

```typescript
import { ClickHouseRESTTest } from '@/components/ClickHouseRESTTest';
import { ClickHouseDashboard } from '@/components/ClickHouseDashboard';
import { ClickHouseTest } from '@/components/ClickHouseTest';
```

---

## 💡 最佳实践

### 1. 使用 Queries API（推荐）

✅ 零依赖，bundle 更小
✅ 代码更简单
✅ 足够满足大多数需求

```typescript
// ✅ 推荐
import { useClickHouseREST } from '@/hooks/useClickHouseREST';
```

### 2. 启用自动刷新

```typescript
const { data } = useClickHouseREST({
  sql: 'SELECT * FROM metrics',
  refetchInterval: 30000, // 30 秒
});
```

### 3. 处理错误

```typescript
const { data, error, isLoading } = useClickHouseREST({ sql });

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <NoData />;

return <DataDisplay data={data} />;
```

### 4. 使用 LIMIT

```typescript
// ✅ 推荐
sql: 'SELECT * FROM large_table LIMIT 100'

// ❌ 避免
sql: 'SELECT * FROM large_table' // 可能返回百万行
```

### 5. 选择必要的列

```typescript
// ✅ 推荐
sql: 'SELECT id, name, email FROM users'

// ❌ 避免
sql: 'SELECT * FROM users'
```

---

## 🐛 常见问题

### Q: MCP 无法连接？

**A**: 完全重启 Claude Desktop
```bash
# macOS
Command + Q 退出
重新打开应用
```

### Q: REST API 401 错误？

**A**: 检查环境变量
```bash
cat .env.local
# 确保 KEY_ID 和 KEY_SECRET 正确
```

### Q: CORS 错误？

**A**: ClickHouse Queries API 支持跨域，无需担心 CORS

### Q: 如何测试 SQL 查询？

**A**: 使用 MCP 在 Claude Desktop 中测试
```
执行查询: SELECT version()
```

---

## 🔗 相关文档

- `CLICKHOUSE_SETUP_COMPLETE.md` - 完整配置总结
- `CLICKHOUSE_API_COMPARISON.md` - API 详细对比
- `CLICKHOUSE_MCP_SETUP.md` - MCP 配置指南

---

## 📞 获取帮助

### curl 测试

```bash
curl -X POST --user 'l4DEcRSjinOuGPCbmlD9:4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm' \
  'https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run?format=JSONEachRow' \
  -H 'Content-Type: application/json' \
  -d '{ "sql": "SELECT 1 as result" }'
```

### 浏览器控制台测试

```javascript
const response = await fetch(
  'https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run?format=JSONEachRow',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('l4DEcRSjinOuGPCbmlD9:4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: 'SELECT version()' })
  }
);
const text = await response.text();
console.log(JSON.parse(text.split('\n')[0]));
```

---

**更新时间**: 2025-11-09
**开发服务器**: http://localhost:3000
