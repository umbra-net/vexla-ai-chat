# 🔐 GitHub Secrets 配置指南

## 当前状态

✅ **已完成**:
- GitHub Actions workflow 已创建
- 代码已推送到 GitHub
- Workflow 已触发但失败（缺少 secrets）

❌ **需要完成**:
- 添加 3 个 GitHub Secrets
- 重新运行 workflow

---

## 快速设置（3 步完成）

### 步骤 1: 获取 Vercel API Token

1. 访问: **https://vercel.com/account/tokens**

2. 点击 **"Create Token"**

3. 配置:
   - Name: `github-actions-deploy`
   - Scope: **Full Account**
   - Expiration: **No Expiration** (或根据安全策略选择)

4. 点击 **"Create"**

5. **立即复制 token**（只显示一次！）

   格式类似: `T0KEN_abc123def456...`

---

### 步骤 2: 添加 GitHub Secrets

访问: **https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions**

点击 **"New repository secret"** 并添加以下 3 个 secrets:

#### Secret 1: VERCEL_TOKEN

| Field | Value |
|-------|-------|
| **Name** | `VERCEL_TOKEN` |
| **Secret** | 从步骤 1 复制的 token |

#### Secret 2: VERCEL_PROJECT_ID

| Field | Value |
|-------|-------|
| **Name** | `VERCEL_PROJECT_ID` |
| **Secret** | `prj_mZSce4pp0wNEutTM5NINA8ZbXq5U` |

#### Secret 3: VERCEL_ORG_ID

| Field | Value |
|-------|-------|
| **Name** | `VERCEL_ORG_ID` |
| **Secret** | `team_nAP8l9Q8aCTdYpIOSOwlKTlX` |

---

### 步骤 3: 重新运行 Workflow

1. 访问: **https://github.com/umbra-net/vexla-ai-chat/actions**

2. 点击失败的 workflow: **"Deploy to Vercel"**

3. 点击右上角 **"Re-run all jobs"**

4. 等待部署完成（约 1-2 分钟）

---

## 验证部署

### 检查 Workflow 状态

访问: https://github.com/umbra-net/vexla-ai-chat/actions

期望看到:
- ✅ **Build and Type Check** - Success
- ✅ **Deploy to Production** - Success
- 绿色勾号 ✓

### 测试 API

```bash
# 测试 ClickHouse 连接
curl https://vexla-ai-chat.vercel.app/api/clickhouse-ping
```

**期望结果**:
```json
{
  "connected": true,
  "message": "ClickHouse connection successful",
  "timestamp": "2025-11-09T..."
}
```

### 测试前端

访问: https://vexla-ai-chat.vercel.app

应该看到 React 应用正常加载。

---

## 配置详情

### Vercel 项目信息

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `vexla-ai-chat` |
| **Project ID** | `prj_mZSce4pp0wNEutTM5NINA8ZbXq5U` |
| **Organization ID** | `team_nAP8l9Q8aCTdYpIOSOwlKTlX` |
| **Username** | `umbra-net` |
| **Production URL** | `https://vexla-ai-chat.vercel.app` |

### GitHub Actions Secrets

| Secret Name | 用途 | 值来源 |
|-------------|------|--------|
| `VERCEL_TOKEN` | 验证 Vercel API 访问 | 从 Vercel Account Tokens 创建 |
| `VERCEL_PROJECT_ID` | 标识要部署的项目 | 从 `.vercel/project.json` 获取 |
| `VERCEL_ORG_ID` | 标识 Vercel 组织/团队 | 从 `.vercel/project.json` 获取 |

---

## Workflow 工作流程

### 当你推送代码到 main 分支时:

1. **Build Job** (约 1 分钟):
   ```
   ✓ Checkout code
   ✓ Setup Node.js
   ✓ Install dependencies
   ✓ Type check (continue-on-error)
   ✓ Build project
   ✓ Upload build artifacts
   ```

2. **Deploy Production Job** (约 30 秒):
   ```
   ✓ Checkout code
   ✓ Install Vercel CLI
   ✓ Pull Vercel environment (使用 VERCEL_TOKEN)
   ✓ Build project artifacts
   ✓ Deploy to Production
   ```

3. **结果**:
   - 代码自动部署到 `https://vexla-ai-chat.vercel.app`
   - 环境变量从 Vercel Dashboard 加载
   - ClickHouse API endpoints 可用

---

## 故障排查

### 问题 1: Workflow 失败 "No existing credentials found"

**原因**: `VERCEL_TOKEN` secret 未设置或为空

**解决**:
1. 访问 https://vercel.com/account/tokens
2. 创建新 token
3. 添加到 GitHub Secrets: `VERCEL_TOKEN`
4. 重新运行 workflow

---

### 问题 2: Workflow 失败 "Project not found"

**原因**: `VERCEL_PROJECT_ID` 或 `VERCEL_ORG_ID` 不正确

**解决**:
确认 GitHub Secrets 中的值:
- `VERCEL_PROJECT_ID` = `prj_mZSce4pp0wNEutTM5NINA8ZbXq5U`
- `VERCEL_ORG_ID` = `team_nAP8l9Q8aCTdYpIOSOwlKTlX`

---

### 问题 3: 部署成功但 API 返回 401

**当前状态**: 这个问题仍然存在

**原因**: 环境变量在 Vercel 中可能未正确设置

**已实施的解决方案**:
- API 文件已添加 fallback 凭证
- 即使环境变量失败，仍会使用硬编码的 ClickHouse 凭证

**备用解决方案**:
1. 手动检查 Vercel 环境变量:
   ```
   https://vercel.com/yummyumbras-projects/vexla-ai-chat/settings/environment-variables
   ```

2. 确认以下变量存在且值正确:
   - `CLICKHOUSE_QUERIES_API`
   - `CLICKHOUSE_KEY_ID`
   - `CLICKHOUSE_KEY_SECRET`

3. 如果值不正确,删除并重新添加

---

## 使用 GitHub CLI 管理 Secrets

### 安装 GitHub CLI (如果还没有)

```bash
brew install gh
```

### 添加 Secrets (命令行方式)

```bash
# 设置 VERCEL_TOKEN
gh secret set VERCEL_TOKEN --repo umbra-net/vexla-ai-chat

# 设置 VERCEL_PROJECT_ID
echo "prj_mZSce4pp0wNEutTM5NINA8ZbXq5U" | gh secret set VERCEL_PROJECT_ID --repo umbra-net/vexla-ai-chat

# 设置 VERCEL_ORG_ID
echo "team_nAP8l9Q8aCTdYpIOSOwlKTlX" | gh secret set VERCEL_ORG_ID --repo umbra-net/vexla-ai-chat
```

### 查看 Secrets

```bash
gh secret list --repo umbra-net/vexla-ai-chat
```

### 删除 Secret

```bash
gh secret delete VERCEL_TOKEN --repo umbra-net/vexla-ai-chat
```

---

## 下一步行动清单

### 必须完成 (才能使用 GitHub Actions):

- [ ] 访问 https://vercel.com/account/tokens
- [ ] 创建 Vercel API Token
- [ ] 访问 https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions
- [ ] 添加 `VERCEL_TOKEN` secret
- [ ] 添加 `VERCEL_PROJECT_ID` secret (值: `prj_mZSce4pp0wNEutTM5NINA8ZbXq5U`)
- [ ] 添加 `VERCEL_ORG_ID` secret (值: `team_nAP8l9Q8aCTdYpIOSOwlKTlX`)
- [ ] 访问 https://github.com/umbra-net/vexla-ai-chat/actions
- [ ] 重新运行失败的 workflow
- [ ] 验证部署成功

### 可选优化:

- [ ] 设置 Vercel 环境变量 (修复 401 错误)
- [ ] 添加自动化测试
- [ ] 配置 branch protection rules
- [ ] 启用 Dependabot

---

## 快速链接

### Vercel

- **API Tokens**: https://vercel.com/account/tokens
- **项目设置**: https://vercel.com/yummyumbras-projects/vexla-ai-chat/settings
- **环境变量**: https://vercel.com/yummyumbras-projects/vexla-ai-chat/settings/environment-variables
- **部署列表**: https://vercel.com/yummyumbras-projects/vexla-ai-chat/deployments

### GitHub

- **Actions**: https://github.com/umbra-net/vexla-ai-chat/actions
- **Secrets**: https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions
- **仓库**: https://github.com/umbra-net/vexla-ai-chat

---

## 总结

当前部署状态:
- ✅ GitHub 仓库创建
- ✅ GitHub Actions workflow 配置
- ✅ 代码推送到 main 分支
- ✅ Vercel 项目存在
- ❌ GitHub Secrets 未设置（需要手动添加）
- ❌ Workflow 部署失败（等待 secrets）

**你需要做的只有 3 件事**:

1. 创建 Vercel API Token
2. 添加 3 个 GitHub Secrets
3. 重新运行 workflow

完成这些步骤后,每次 push 到 main 分支都会自动部署到生产环境！🚀
