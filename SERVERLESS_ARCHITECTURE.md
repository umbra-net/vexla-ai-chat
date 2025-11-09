# 🏗️ Serverless 架构总结

## ✅ 已完成配置

你的应用现在拥有**生产级的 Serverless 后端架构**！

---

## 🎯 架构对比

### ❌ 之前的架构（不安全）

```
┌────────────┐
│   浏览器    │
│  (前端)     │
└──────┬─────┘
       │ 直接连接
       │ ⚠️ 凭证暴露
       ↓
┌────────────┐
│ ClickHouse │
│  (数据库)   │
└────────────┘
```

**问题**:
- ❌ 数据库凭证暴露在前端代码
- ❌ 任何人都可以查看网络请求获取凭证
- ❌ 无法控制允许的 SQL 操作
- ❌ 不适合生产环境

---

### ✅ 现在的架构（安全）

```
┌────────────────────────────┐
│      用户浏览器              │
│   https://your-app.app      │
└─────────┬──────────────────┘
          │ HTTPS/fetch()
          │ ✅ 无凭证
          ↓
┌────────────────────────────┐
│    Vercel 平台              │
│                            │
│  ┌────────────────────┐   │
│  │   静态网站 (CDN)    │   │
│  │   - React 前端      │   │
│  │   - HTML/CSS/JS     │   │
│  └────────────────────┘   │
│                            │
│  ┌────────────────────┐   │
│  │ Serverless API     │   │
│  │ /api/clickhouse    │   │
│  │                    │   │
│  │ ✅ 凭证安全存储     │   │
│  │ ✅ SQL 白名单       │   │
│  │ ✅ 权限控制         │   │
│  └─────┬──────────────┘   │
└────────┼──────────────────┘
         │ ClickHouse Client
         │ 🔒 后端凭证
         ↓
┌────────────────────────────┐
│     ClickHouse Cloud       │
│  ruq9matd8v.ap-northeast-1 │
└────────────────────────────┘
```

**优势**:
- ✅ 凭证完全隐藏
- ✅ SQL 白名单（只允许 SELECT/SHOW/DESCRIBE）
- ✅ 防止 DROP/DELETE/INSERT 等危险操作
- ✅ 适合生产环境
- ✅ 自动扩展
- ✅ 全球 CDN 加速

---

## 📁 创建的文件

### 后端 API（Serverless Functions）

```
api/
├── clickhouse.ts          # 主查询 API
└── clickhouse-ping.ts     # 连接测试 API
```

**路由**:
- `/api/clickhouse` - 执行 SQL 查询
- `/api/clickhouse-ping` - 测试连接状态

### 前端代码

```
src/
├── utils/
│   └── clickhouseAPI.ts        # API 客户端（调用后端）
├── hooks/
│   └── useClickHouseAPI.tsx    # React Hooks
└── components/
    └── ClickHouseAPITest.tsx   # 测试组件
```

### 配置文件

```
vercel.json        # Vercel 部署配置
.env.example       # 环境变量示例
```

### 文档

```
VERCEL_DEPLOYMENT_GUIDE.md    # 部署指南
SERVERLESS_ARCHITECTURE.md    # 本文件（架构说明）
```

---

## 🔒 安全特性

### 1. SQL 白名单

后端 API 只允许以下操作：

```typescript
ALLOWED_OPERATIONS = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN']
```

禁止的操作：

```typescript
BLOCKED_OPERATIONS = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE']
```

**测试**:

```bash
# ✅ 允许
curl -X POST /api/clickhouse -d '{"sql":"SELECT version()"}'

# ❌ 拒绝
curl -X POST /api/clickhouse -d '{"sql":"DROP TABLE users"}'
# 返回: {"error":"Operation DROP is not allowed"}
```

### 2. 凭证隔离

```
前端代码: ❌ 无法访问凭证
  ↓
后端 API: ✅ Vercel 环境变量（加密存储）
  ↓
ClickHouse: ✅ 安全连接
```

### 3. 环境变量管理

**开发环境** (.env.local - 本地):

```bash
# 前端不再需要 ClickHouse 凭证
# 只需要知道 API 端点
```

**生产环境** (Vercel Dashboard):

```bash
CLICKHOUSE_QUERIES_API=https://queries.clickhouse.cloud/...
CLICKHOUSE_KEY_ID=***
CLICKHOUSE_KEY_SECRET=***
```

---

## 💻 使用方式

### 前端代码示例

```typescript
import { useClickHouseAPI } from '@/hooks/useClickHouseAPI';

function MyComponent() {
  // ✅ 安全：调用后端 API
  const { data, isLoading, error } = useClickHouseAPI<User>({
    sql: 'SELECT * FROM users LIMIT 10',
    refetchInterval: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### API 调用流程

```
1. 前端发起请求
   fetch('/api/clickhouse', {
     body: JSON.stringify({ sql: 'SELECT...' })
   })

2. Vercel Function 接收请求
   - 验证 SQL（白名单检查）
   - 使用服务器端凭证连接 ClickHouse
   - 执行查询

3. 返回结果给前端
   res.json(data)

4. 前端渲染数据
   <div>{data.map(...)}</div>
```

---

## 🧪 测试方式

### 1. 本地测试

```bash
cd ~/Desktop/FORM
npm run dev
```

访问 http://localhost:3000

添加测试组件：

```typescript
import { ClickHouseAPITest } from '@/components/ClickHouseAPITest';

<ClickHouseAPITest />
```

### 2. 本地测试 API

Vercel CLI 提供本地 Serverless Functions 支持：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 本地运行（包含 Serverless Functions）
vercel dev
```

这会在 http://localhost:3000 启动完整环境：
- 前端
- /api/* Serverless Functions

### 3. 生产环境测试

部署后测试：

```bash
# 测试连接
curl https://your-app.vercel.app/api/clickhouse-ping

# 测试查询
curl -X POST https://your-app.vercel.app/api/clickhouse \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT version()"}'
```

---

## 📊 性能特点

### Serverless Functions

- **冷启动**: ~200-500ms（首次调用）
- **热执行**: ~50-100ms（后续调用）
- **并发**: 自动扩展（Vercel 管理）
- **超时**: 10 秒（Hobby）/ 60 秒（Pro）

### 优化建议

1. **减少冷启动**
   - 保持函数轻量
   - 使用边缘函数（Edge Functions）

2. **启用缓存**
   ```typescript
   res.setHeader('Cache-Control', 's-maxage=60');
   ```

3. **优化查询**
   - 使用 LIMIT
   - 选择必要的列
   - 避免复杂 JOIN

---

## 🔄 迁移对比

### 从直连迁移到 API

**之前** (直连 ClickHouse):

```typescript
import { useClickHouseREST } from '@/hooks/useClickHouseREST';

const { data } = useClickHouseREST({
  sql: 'SELECT * FROM users'
});
```

**现在** (通过后端 API):

```typescript
import { useClickHouseAPI } from '@/hooks/useClickHouseAPI';

const { data } = useClickHouseAPI({
  sql: 'SELECT * FROM users'
});
```

**代码几乎相同！** 只是引入路径改变，底层实现更安全。

---

## 📦 部署清单

### 部署前检查

- [ ] 代码已提交到 Git
- [ ] `.env.local` 在 `.gitignore` 中
- [ ] Vercel 账户已创建
- [ ] ClickHouse 凭证已准备

### 部署步骤

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   cd ~/Desktop/FORM
   vercel --prod
   ```

4. **配置环境变量**
   ```bash
   vercel env add CLICKHOUSE_QUERIES_API
   vercel env add CLICKHOUSE_KEY_ID
   vercel env add CLICKHOUSE_KEY_SECRET
   ```

5. **验证**
   ```bash
   curl https://your-app.vercel.app/api/clickhouse-ping
   ```

详细步骤见: `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 🎯 三种访问方式总结

你的项目现在支持 **3 种** ClickHouse 访问方式：

### 1. MCP (Claude Desktop)

**用途**: 数据探索

```
Claude Desktop → MCP Server → ClickHouse
```

### 2. Serverless API（推荐生产环境）

**用途**: 前端应用

```
浏览器 → Vercel Functions → ClickHouse
```

### 3. 直连 API（开发/测试）

**用途**: 本地测试

```
浏览器 → ClickHouse (直连)
```

**推荐使用**:
- 🔍 探索数据: MCP (Claude Desktop)
- 🚀 生产环境: Serverless API (Vercel)
- 🧪 本地测试: 直连 API

---

## 💰 成本估算

### Vercel Hobby（免费）

- ✅ 100 GB 带宽/月
- ✅ 无限 Serverless Function 调用
- ✅ 自动 HTTPS
- ✅ 全球 CDN

**适合**:
- 个人项目
- 小型应用
- 原型展示

### Vercel Pro（$20/月）

- ✅ 1 TB 带宽
- ✅ 更长函数执行时间（60s vs 10s）
- ✅ 密码保护
- ✅ 团队协作

**适合**:
- 商业项目
- 高流量应用
- 团队开发

### ClickHouse Cloud

根据你的使用量计费，当前配置足够测试使用。

---

## 🎉 总结

你现在拥有:

1. ✅ **安全的后端** - Vercel Serverless Functions
2. ✅ **简洁的前端** - React + Hooks
3. ✅ **完整的文档** - 部署和使用指南
4. ✅ **生产就绪** - 可直接部署上线

**下一步**: 参考 `VERCEL_DEPLOYMENT_GUIDE.md` 部署到 Vercel！

---

**架构完成时间**: 2025-11-09
**状态**: ✅ 生产就绪
**安全级别**: 🔒 高（凭证隔离 + SQL 白名单）
