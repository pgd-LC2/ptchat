# Devin PT Chat

Next.js (App Router) + TypeScript + Tailwind，纯前端实现聊天 UI 与交互（不依赖任何后端与第三方 SDK）。

## 技术栈
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- 图标：`lucide-react`

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
- 本项目为纯前端实现，无需任何环境变量配置。

3) 本地运行
```bash
# pnpm
pnpm dev

# 或 npm
npm run dev
```
访问 http://localhost:3000

4) 本项目为纯前端实现，无需后端 API；启动后直接在首页体验聊天 UI 与交互。

## 目录结构
```
app/
  globals.css
  layout.tsx
  page.tsx
components/
  chat/
  sidebar/
  header/
```

## 说明
- 当前仅包含纯前端聊天 UI 与交互逻辑示例，不依赖任何后端或第三方 SDK。
