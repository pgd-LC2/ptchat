# Devin PT Chat

Next.js (App Router) + TypeScript + Tailwind + Supabase 基础配置，含最小可用的健康检查 API。

## 技术栈
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK (`ai`)
- 图标：`lucide-react`
- 数据库/后端预留：`@supabase/supabase-js`

## 开发准备
1) 安装依赖
- 推荐使用 `pnpm` 或 `npm`，任选其一：

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install
```

2) 配置环境变量
- 复制 `.env.example` 为 `.env`，并填写 Supabase 项目的 URL 与匿名密钥：
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3) 本地运行
```bash
# pnpm
pnpm dev

# 或 npm
npm run dev
```
访问 http://localhost:3000

4) 健康检查
- 打开 http://localhost:3000/api/health
- 配置正确时返回：
```json
{ "ok": true, "supabase": "configured", "session": false }
```
若未配置或错误，会返回明确的错误信息。

## 目录结构
```
app/
  api/
    health/route.ts     # 健康检查 API
  globals.css
  layout.tsx
  page.tsx
lib/
  supabase/
    client.ts           # 浏览器端 Supabase 客户端工厂
    server.ts           # 服务端 Supabase 客户端工厂
```

## 说明
- 当前仅包含基础数据库连接与验证。后续可根据需要加入基于 Cookie 的服务端会话管理，或集成 Vercel AI SDK 的 useChat 路由与界面。
- 请勿将真实密钥提交到仓库；`.env` 已在 `.gitignore` 中忽略。
