# ClickHouse MCP + API 集成配置

## ✅ 已完成配置

### 1. Claude Desktop MCP 服务器配置

**位置**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "clickhouse": {
      "command": "uv",
      "args": ["run", "--with", "mcp-clickhouse", "--python", "3.10", "mcp-clickhouse"],
      "env": {
        "CLICKHOUSE_HOST": "ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud",
        "CLICKHOUSE_PORT": "8443",
        "CLICKHOUSE_USER": "l4DEcRSjinOuGPCbmlD9",
        "CLICKHOUSE_PASSWORD": "4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm",
        "CLICKHOUSE_SECURE": "true",
        "CLICKHOUSE_VERIFY": "true",
        "CLICKHOUSE_CONNECT_TIMEOUT": "30",
        "CLICKHOUSE_SEND_RECEIVE_TIMEOUT": "30"
      }
    }
  }
}
```

### 2. 前端 API 客户端配置

**位置**: `.env.local`

```bash
VITE_CLICKHOUSE_URL=https://ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud:8443
VITE_CLICKHOUSE_KEY_ID=l4DEcRSjinOuGPCbmlD9
VITE_CLICKHOUSE_KEY_SECRET=4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm
```

---

## 🎯 MCP 功能说明

ClickHouse MCP 服务器提供以下工具（在 Claude Desktop 中可用）:

### 1. `run_select_query`
执行 SQL SELECT 查询

**示例（在 Claude 中使用）**:
```
请帮我查询 ClickHouse 数据库中的所有数据库列表
```

Claude 会自动调用:
```sql
SHOW DATABASES
```

### 2. `list_databases`
列出所有数据库

**示例**:
```
列出我的 ClickHouse 实例中的所有数据库
```

### 3. `list_tables`
显示数据库中的所有表

**示例**:
```
显示 default 数据库中的所有表
```

---

## 🔄 MCP vs API 使用场景

### 使用 MCP (在 Claude Desktop 中)

**优势**:
- ✅ 无需编写代码，直接对话查询
- ✅ 快速数据探索和分析
- ✅ 自动生成 SQL 查询
- ✅ 适合临时查询和数据分析

**适用场景**:
- 数据库探索
- 临时数据分析
- SQL 查询调试
- 快速数据验证

**使用方法**:
1. 重启 Claude Desktop 应用
2. 在对话中直接提问，例如:
   - "查询我的 ClickHouse 数据库中有哪些表"
   - "执行查询: SELECT * FROM users LIMIT 10"
   - "分析最近一周的用户活跃度数据"

---

### 使用 API (在前端应用中)

**优势**:
- ✅ 集成到生产应用
- ✅ 实时数据更新
- ✅ 用户交互式查询
- ✅ 自动刷新和状态管理

**适用场景**:
- 生产环境数据展示
- 实时数据仪表板
- 用户数据查询界面
- 自动数据刷新

**使用方法**:

#### 方式 1: 使用 React Hook
```typescript
import { useClickHouse } from '@/hooks/useClickHouse';

function UserStats() {
  const { data, isLoading, error } = useClickHouse<{ count: number }>({
    query: 'SELECT count() as count FROM users',
    enabled: true,
    refetchInterval: 30000, // 每 30 秒刷新
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Total Users: {data?.[0]?.count}</div>;
}
```

#### 方式 2: 使用工具函数
```typescript
import { queryClickHouse, insertClickHouse } from '@/utils/clickhouse';

// 查询数据
const users = await queryClickHouse<User>('SELECT * FROM users WHERE active = true');

// 插入数据
await insertClickHouse('events', [
  { user_id: '123', event: 'click', timestamp: Date.now() }
]);
```

---

## 🚀 激活 MCP

### 步骤 1: 重启 Claude Desktop
```bash
# 完全退出 Claude Desktop
# 然后重新打开应用
```

### 步骤 2: 验证 MCP 连接
在 Claude Desktop 中输入:
```
请连接到我的 ClickHouse 数据库并列出所有数据库
```

如果看到数据库列表，说明 MCP 配置成功！

### 步骤 3: 测试查询
```
执行查询: SELECT version()
```

---

## 📊 实战示例：MCP + API 协同工作

### 场景: 构建用户分析仪表板

#### 第 1 步：使用 MCP 探索数据（Claude Desktop）
```
Q: 我的 ClickHouse 中有哪些数据库？
A: [MCP 自动执行 SHOW DATABASES]

Q: default 数据库中有哪些表？
A: [MCP 自动执行 SHOW TABLES FROM default]

Q: users 表的结构是什么？
A: [MCP 自动执行 DESCRIBE users]

Q: 最近一周有多少活跃用户？
A: [MCP 自动生成并执行 SQL]
```

#### 第 2 步：将查询集成到前端（API）

基于 MCP 探索的结果，创建前端组件:

```typescript
// src/components/UserDashboard.tsx
import { useClickHouse } from '@/hooks/useClickHouse';

export function UserDashboard() {
  // 活跃用户数
  const { data: activeUsers } = useClickHouse<{ count: number }>({
    query: `
      SELECT count() as count
      FROM users
      WHERE last_active >= now() - INTERVAL 7 DAY
    `,
    refetchInterval: 60000, // 每分钟刷新
  });

  // 每日新增用户
  const { data: dailySignups } = useClickHouse<{ date: string; count: number }>({
    query: `
      SELECT
        toDate(created_at) as date,
        count() as count
      FROM users
      WHERE created_at >= now() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date DESC
    `,
    refetchInterval: 300000, // 每 5 分钟刷新
  });

  return (
    <div>
      <h2>User Analytics</h2>
      <div>Active Users (7d): {activeUsers?.[0]?.count}</div>
      <div>
        <h3>Daily Signups (30d)</h3>
        {dailySignups?.map(row => (
          <div key={row.date}>{row.date}: {row.count}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🛠️ 可用工具总结

| 工具 | 位置 | 用途 |
|------|------|------|
| **MCP Server** | Claude Desktop | 交互式查询、数据探索 |
| `useClickHouse<T>()` | React Hooks | 自动状态管理的查询 |
| `useClickHouseConnection()` | React Hooks | 连接状态监控 |
| `queryClickHouse()` | Utils | 原始查询执行 |
| `insertClickHouse()` | Utils | 数据插入 |
| `testClickHouseConnection()` | Utils | 连接测试 |
| `getDatabases()` | Utils | 获取数据库列表 |
| `getTables()` | Utils | 获取表列表 |

---

## ⚠️ 安全注意事项

### MCP 配置
- ✅ MCP 查询默认使用 `readonly = 1`（只读模式）
- ✅ 无法执行 DROP、DELETE、ALTER 等危险操作
- ✅ 适合安全的数据探索

### API 配置
- ⚠️ API 客户端使用完整凭证
- ⚠️ 可以执行写入操作
- ⚠️ 生产环境需要额外的权限控制
- ⚠️ 建议在后端实现查询白名单

---

## 🎯 下一步

### 1. 重启 Claude Desktop
完全退出并重新打开 Claude Desktop 以加载 MCP 配置

### 2. 测试 MCP 连接
在新的 Claude 对话中:
```
连接到我的 ClickHouse 数据库并显示所有数据库
```

### 3. 开发前端集成
参考 `src/components/ClickHouseTest.tsx` 开始集成

### 4. 构建实际功能
基于 MCP 探索的数据结构，使用 API 构建生产功能

---

## 📚 参考资源

- [ClickHouse MCP 官方文档](https://clickhouse.com/docs/use-cases/AI/MCP)
- [MCP GitHub 仓库](https://github.com/ClickHouse/mcp-clickhouse)
- [Model Context Protocol 规范](https://modelcontextprotocol.io)

---

**配置完成时间**: 2025-11-09
**实例位置**: ap-northeast-1 (AWS Tokyo)
**配置状态**: ✅ 生产就绪
