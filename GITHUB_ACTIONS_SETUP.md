# GitHub Actions 部署设置指南

## 概述

使用 GitHub Actions 自动化部署到 Vercel，配合 GitHub Enterprise Plan 和 Copilot。

---

## 前置要求

- ✅ GitHub Enterprise Plan（已确认）
- ✅ GitHub 仓库: `umbra-net/vexla-ai-chat`
- ✅ Vercel 项目已创建
- ✅ GitHub 已连接 Vercel

---

## 设置步骤

### 1. 获取 Vercel Token

访问 Vercel Settings 获取 API Token:

```
https://vercel.com/account/tokens
```

1. 点击 **"Create Token"**
2. 名称: `github-actions-deploy`
3. Scope: **Full Account**
4. 点击 **"Create"**
5. **复制 token**（只显示一次！）

---

### 2. 获取 Vercel Project ID

方式 A - 使用 CLI:
```bash
cd ~/Desktop/FORM
vercel project ls
```

方式 B - 从 Dashboard URL 获取:
```
https://vercel.com/yummyumbras-projects/vexla-ai-chat
                                       ^^^^^^^^^^^^^^^
                                       这是 Project ID
```

---

### 3. 获取 Vercel Org ID

使用 CLI:
```bash
vercel teams ls
```

或者从 Vercel Dashboard:
```
https://vercel.com/yummyumbras-projects/settings
                  ^^^^^^^^^^^^^^^^^^^^
                  这是 Org ID (Team ID)
```

---

### 4. 在 GitHub 添加 Secrets

访问 GitHub 仓库设置:
```
https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions
```

点击 **"New repository secret"** 并添加以下 3 个 secrets:

| Secret Name | Value | 说明 |
|-------------|-------|------|
| `VERCEL_TOKEN` | `从步骤1获取的 token` | Vercel API Token |
| `VERCEL_PROJECT_ID` | `vexla-ai-chat` 或 Project ID | 项目标识符 |
| `VERCEL_ORG_ID` | `从步骤3获取的 Org ID` | 团队/组织 ID |

#### 如何添加 Secret:

1. 点击 **"New repository secret"**
2. **Name**: `VERCEL_TOKEN`
3. **Secret**: 粘贴你的 Vercel Token
4. 点击 **"Add secret"**
5. 重复步骤添加 `VERCEL_PROJECT_ID` 和 `VERCEL_ORG_ID`

---

## 工作流程说明

### 文件位置
```
.github/workflows/deploy.yml
```

### 触发条件

1. **Push to main** → 自动部署到生产环境
2. **Pull Request** → 自动部署预览环境

### Workflow 步骤

#### Job 1: Build
- ✅ Checkout 代码
- ✅ 安装 Node.js 22
- ✅ 安装依赖 (`npm install --legacy-peer-deps`)
- ✅ TypeScript 类型检查
- ✅ 构建项目
- ✅ 上传构建产物

#### Job 2: Deploy Production (仅 main 分支)
- ✅ 安装 Vercel CLI
- ✅ 拉取 Vercel 环境配置
- ✅ 构建项目
- ✅ 部署到生产环境

#### Job 3: Deploy Preview (仅 PR)
- ✅ 安装 Vercel CLI
- ✅ 拉取 Vercel 预览环境配置
- ✅ 构建项目
- ✅ 部署预览版本

---

## 验证设置

### 1. 推送代码触发 Workflow

```bash
cd ~/Desktop/FORM
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deployment workflow"
git push origin main
```

### 2. 查看 Actions 状态

访问:
```
https://github.com/umbra-net/vexla-ai-chat/actions
```

你应该看到:
- ✅ **Build** job 成功
- ✅ **Deploy Production** job 成功
- ✅ 绿色勾号 ✓

### 3. 测试部署

```bash
# 等待 workflow 完成（约 1-2 分钟）
sleep 120

# 测试 ClickHouse API
curl https://vexla-ai-chat.vercel.app/api/clickhouse-ping
```

**预期结果**:
```json
{
  "connected": true,
  "message": "ClickHouse connection successful",
  "timestamp": "2025-11-09T..."
}
```

---

## GitHub Copilot 集成

### 启用 Copilot

1. 访问 GitHub Settings:
   ```
   https://github.com/settings/copilot
   ```

2. 确认 **GitHub Copilot** 已启用（Enterprise Plan 包含）

3. 在 VS Code 或 Claude Code 中使用 Copilot:
   - 安装 GitHub Copilot 扩展
   - 登录 GitHub 账号
   - 开始编码时自动获得建议

### Copilot 与 Actions 配合

Copilot 可以帮助:
- ✅ 编写 GitHub Actions workflows
- ✅ 优化 TypeScript 代码
- ✅ 生成测试用例
- ✅ 修复 TypeScript 错误

---

## 环境变量管理

### Vercel 环境变量（已设置）

通过 Vercel Dashboard 设置:
```
https://vercel.com/yummyumbras-projects/vexla-ai-chat/settings/environment-variables
```

| Variable | Value | Environment |
|----------|-------|-------------|
| `CLICKHOUSE_QUERIES_API` | `https://queries.clickhouse.cloud/service/.../run` | Production |
| `CLICKHOUSE_KEY_ID` | `l4DEcRSjinOuGPCbmlD9` | Production |
| `CLICKHOUSE_KEY_SECRET` | `4b1d2XMgr2HqLXN8GKeAWEK2hhaKmibPjleBZmP2vm` | Production |

### GitHub Secrets（刚刚设置）

用于 Actions 部署:
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

---

## 自动部署流程

### 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发 + 提交
git add .
git commit -m "feat: add new feature"

# 3. 推送到 GitHub
git push origin feature/new-feature

# 4. 创建 Pull Request
# → GitHub Actions 自动部署预览版本

# 5. 审查 + 合并到 main
# → GitHub Actions 自动部署到生产环境
```

### 每次 push 到 main 自动:

1. ✅ TypeScript 类型检查
2. ✅ 构建项目
3. ✅ 部署到 Vercel Production
4. ✅ 更新生产 URL: `https://vexla-ai-chat.vercel.app`

---

## 故障排查

### 问题 1: Workflow 失败 "VERCEL_TOKEN not found"

**原因**: GitHub Secrets 未设置

**解决**:
```
https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions
```
确认添加了 `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`

---

### 问题 2: Vercel 部署失败 401

**原因**: Token 权限不足

**解决**:
1. 重新创建 Vercel Token，选择 **Full Account** scope
2. 更新 GitHub Secret: `VERCEL_TOKEN`

---

### 问题 3: TypeScript 错误阻止部署

**当前设置**: `continue-on-error: true` - 类型错误不会阻止部署

**如需严格检查**:
编辑 `.github/workflows/deploy.yml`:
```yaml
- name: Type check
  run: npm run type-check
  # 删除这一行: continue-on-error: true
```

---

## 快速命令

### 获取 Vercel 信息
```bash
# Project ID
vercel project ls

# Org ID
vercel teams ls

# 当前部署状态
vercel ls vexla-ai-chat
```

### 查看 Actions 日志
```bash
# 安装 GitHub CLI (如果没有)
brew install gh

# 查看最近的 workflows
gh run list

# 查看特定 run 的日志
gh run view [run-id] --log
```

---

## 下一步

### 立即行动

1. **获取 Vercel Token**:
   ```
   https://vercel.com/account/tokens
   ```

2. **添加 GitHub Secrets**:
   ```
   https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions
   ```

3. **推送 workflow 文件**:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "feat: add GitHub Actions CI/CD"
   git push origin main
   ```

4. **查看 Actions 运行**:
   ```
   https://github.com/umbra-net/vexla-ai-chat/actions
   ```

### 可选增强

- [ ] 添加自动化测试 (Jest, Cypress)
- [ ] 配置 Lighthouse CI 性能检查
- [ ] 添加 Dependabot 自动更新依赖
- [ ] 设置 Code scanning (CodeQL)
- [ ] 配置 Branch protection rules

---

## 总结

✅ **GitHub Actions 配置**:
- Workflow 文件已创建
- 支持 Production + Preview 部署
- TypeScript 类型检查集成

✅ **需要手动操作**:
- 获取 Vercel Token
- 添加 3 个 GitHub Secrets
- 推送代码触发首次部署

✅ **GitHub Enterprise 优势**:
- Copilot 集成开发
- 高级安全功能
- 私有仓库无限制
- Actions 分钟数更多

---

**准备好了吗？**

访问 Vercel 获取 Token: https://vercel.com/account/tokens

然后添加到 GitHub: https://github.com/umbra-net/vexla-ai-chat/settings/secrets/actions
