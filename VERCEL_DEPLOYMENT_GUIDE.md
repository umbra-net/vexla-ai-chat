# 🚀 Vercel 部署指南（Serverless 后端架构）

## 📋 部署概述

你的应用现在采用 **Serverless 架构**：

```
用户浏览器
    ↓ HTTP
Vercel (静态网站 + Serverless Functions)
    ↓ ClickHouse Client
ClickHouse Cloud (数据库)
```

**优势**:
- ✅ 凭证安全（不暴露在前端）
- ✅ SQL 白名单（防止危险操作）
- ✅ 自动扩展
- ✅ 零运维成本

---

## 🛠️ 部署前准备

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 检查项目文件

确保以下文件存在：

```
~/Desktop/FORM/
├── vercel.json            # Vercel 配置 ✅
├── .env.example           # 环境变量示例 ✅
├── api/
│   ├── clickhouse.ts      # 查询 API ✅
│   └── clickhouse-ping.ts # 连接测试 API ✅
├── src/
│   ├── utils/clickhouseAPI.ts    # 前端 API 客户端 ✅
│   └── hooks/useClickHouseAPI.tsx # React Hooks ✅
└── package.json
```

---

## 🚀 部署步骤

### 方式 1: 使用 Vercel CLI（推荐）

#### 步骤 1: 初始化项目

```bash
cd ~/Desktop/FORM
vercel
```

首次运行会询问：

```
? Set up and deploy "~/Desktop/FORM"? [Y/n] y
? Which scope? (选择你的账户)
? Link to existing project? [y/N] n
? What's your project's name? vexla-ai-chat
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

#### 步骤 2: 配置环境变量

在 Vercel Dashboard 或使用 CLI：

```bash
# 方法 A: 使用 Vercel CLI
vercel env add CLICKHOUSE_QUERIES_API
# 输入: https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run

vercel env add CLICKHOUSE_KEY_ID
# 输入: l4DEcRSjinOuGPCbmlD9

vercel env add CLICKHOUSE_KEY_SECRET
# 输入: 4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm

vercel env add CLICKHOUSE_SERVICE_ID
# 输入: 3c84c16a-2e8f-4331-b21b-d087a246d77d

# 可选：Native Protocol 配置
vercel env add CLICKHOUSE_URL
# 输入: https://ruq9matd8v.ap-northeast-1.aws.clickhouse.cloud:8443
```

**或者方法 B**: 访问 Vercel Dashboard → 项目 → Settings → Environment Variables

#### 步骤 3: 部署到生产环境

```bash
vercel --prod
```

部署完成后会显示：

```
✅  Production: https://vexla-ai-chat.vercel.app [复制]
```

---

### 方式 2: 使用 GitHub 集成（推荐用于团队）

#### 步骤 1: 创建 Git 仓库并推送

```bash
cd ~/Desktop/FORM

# 如果还没有初始化 git
git init
git add .
git commit -m "feat: add Vercel serverless backend"

# 创建 GitHub 仓库（需要 gh CLI）
gh repo create vexla-ai-chat --public --source=. --remote=origin --push
```

#### 步骤 2: 连接 Vercel

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 选择你的 GitHub 仓库
4. Vercel 会自动检测 Vite 项目

#### 步骤 3: 配置环境变量

在 "Environment Variables" 部分添加：

| Name | Value |
|------|-------|
| `CLICKHOUSE_QUERIES_API` | `https://queries.clickhouse.cloud/service/3c84c16a-2e8f-4331-b21b-d087a246d77d/run` |
| `CLICKHOUSE_KEY_ID` | `l4DEcRSjinOuGPCbmlD9` |
| `CLICKHOUSE_KEY_SECRET` | `4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm` |
| `CLICKHOUSE_SERVICE_ID` | `3c84c16a-2e8f-4331-b21b-d087a246d77d` |

#### 步骤 4: 部署

点击 "Deploy" 按钮，Vercel 会：

1. 克隆仓库
2. 安装依赖
3. 构建前端
4. 部署 Serverless Functions
5. 提供生产 URL

---

## 🧪 测试部署

### 1. 测试前端

访问你的 Vercel URL：

```
https://your-project.vercel.app
```

### 2. 测试 API 连接

```bash
# 测试连接
curl https://your-project.vercel.app/api/clickhouse-ping

# 应该返回:
# {"connected":true,"message":"ClickHouse connection successful","timestamp":"..."}
```

### 3. 测试查询

```bash
curl -X POST https://your-project.vercel.app/api/clickhouse \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT version()"}'

# 应该返回 ClickHouse 版本
```

### 4. 测试危险操作（应该被拒绝）

```bash
curl -X POST https://your-project.vercel.app/api/clickhouse \
  -H "Content-Type: application/json" \
  -d '{"sql":"DROP TABLE users"}'

# 应该返回:
# {"error":"Operation DROP is not allowed"}
```

---

## 🔧 环境变量管理

### 查看环境变量

```bash
vercel env ls
```

### 添加环境变量

```bash
vercel env add VARIABLE_NAME
```

### 删除环境变量

```bash
vercel env rm VARIABLE_NAME
```

### 拉取环境变量到本地

```bash
vercel env pull .env.local
```

---

## 📊 监控和日志

### 查看部署日志

```bash
vercel logs
```

### 查看实时日志

```bash
vercel logs --follow
```

### 在 Dashboard 查看

访问: https://vercel.com/your-username/your-project

- **Deployments**: 查看所有部署历史
- **Analytics**: 查看访问统计
- **Logs**: 查看函数日志
- **Settings**: 管理环境变量和域名

---

## 🌐 自定义域名（可选）

### 添加域名

```bash
vercel domains add your-domain.com
```

### 或在 Dashboard

1. 项目 → Settings → Domains
2. 添加你的域名
3. 配置 DNS 记录（Vercel 会提供说明）

---

## 🔒 安全检查清单

部署前确保：

- [ ] `.env.local` 在 `.gitignore` 中（✅ 已配置）
- [ ] Vercel 环境变量已正确设置
- [ ] API 白名单已启用（✅ 只允许 SELECT/SHOW/DESCRIBE）
- [ ] 没有将凭证硬编码在前端代码中
- [ ] ClickHouse 用户权限最小化（建议创建只读用户）

---

## 🔄 更新部署

### 自动部署（GitHub 集成）

推送代码到 GitHub 后自动部署：

```bash
git add .
git commit -m "update: feature description"
git push
```

Vercel 会自动：
- 检测到新提交
- 构建新版本
- 部署到生产环境

### 手动部署（CLI）

```bash
# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

---

## 📁 项目结构（部署后）

```
Vercel 部署:

/dist/                    # 静态网站文件（前端）
├── index.html
├── assets/
│   ├── index-*.js       # 打包后的 JS
│   └── index-*.css      # 打包后的 CSS
└── ...

/api/                     # Serverless Functions（后端）
├── clickhouse.ts        # → /api/clickhouse
└── clickhouse-ping.ts   # → /api/clickhouse-ping
```

---

## 🎯 优化建议

### 1. 启用缓存

在 API 函数中添加缓存头：

```typescript
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
```

### 2. 设置函数超时

在 `vercel.json` 中：

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### 3. 启用 Analytics

Vercel Dashboard → Analytics → Enable

### 4. 监控错误

集成 Sentry 或其他错误追踪服务

---

## 🐛 常见问题

### Q: API 返回 500 错误？

**A**: 检查环境变量：

```bash
vercel env ls
```

确保所有 ClickHouse 配置都已设置。

### Q: 本地可以运行，部署后无法连接？

**A**:

1. 检查 Vercel 环境变量是否正确
2. 查看 Vercel 日志: `vercel logs`
3. 确认 ClickHouse 允许来自 Vercel IP 的连接

### Q: 如何回滚到之前的版本？

**A**:

在 Vercel Dashboard:
1. Deployments → 选择之前的部署
2. 点击 "Promote to Production"

或使用 CLI:
```bash
vercel rollback
```

### Q: 函数执行超时？

**A**:

1. 优化 SQL 查询（添加 LIMIT）
2. 增加函数超时时间（Pro 计划）
3. 使用分页加载大量数据

---

## 💰 费用说明

### Vercel Hobby 计划（免费）

- ✅ 100 GB 带宽/月
- ✅ 无限 Serverless Functions 调用
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ⚠️ 单个函数最多运行 10 秒

### Vercel Pro 计划（$20/月）

- ✅ 1 TB 带宽/月
- ✅ 函数最多运行 60 秒
- ✅ 密码保护
- ✅ 团队协作

---

## 🎉 完成后的架构

```
┌──────────────────────────────────┐
│  用户浏览器                        │
│  https://your-app.vercel.app      │
└─────────────┬────────────────────┘
              │ HTTPS
              ↓
┌──────────────────────────────────┐
│  Vercel 平台                      │
│                                  │
│  ┌──────────────────────────┐   │
│  │  静态网站 (CDN)           │   │
│  │  - React 前端             │   │
│  │  - HTML/CSS/JS            │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │  Serverless Functions     │   │
│  │  - /api/clickhouse        │   │
│  │  - /api/clickhouse-ping   │   │
│  │  - SQL 白名单验证         │   │
│  │  - 凭证安全存储           │   │
│  └─────────┬────────────────┘   │
└────────────┼────────────────────┘
             │ ClickHouse Protocol
             ↓
┌──────────────────────────────────┐
│  ClickHouse Cloud                │
│  ruq9matd8v.ap-northeast-1       │
│  - 数据存储                       │
│  - SQL 查询引擎                   │
└──────────────────────────────────┘
```

**特点**:
- 🔒 凭证完全隐藏在后端
- 🛡️ SQL 白名单防护
- ⚡ 全球 CDN 加速
- 📈 自动扩展
- 💰 按需计费

---

## 📞 获取帮助

- Vercel 文档: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- ClickHouse 文档: https://clickhouse.com/docs

---

**准备好了吗？开始部署！** 🚀

```bash
cd ~/Desktop/FORM
vercel
```
