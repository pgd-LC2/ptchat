# Chat UI 深度扫描报告（chat.openai.com / chatgpt.com 未登录页基准）
本报告依据浏览器开发者工具与运行时检测输出，整理页面布局、全局样式、组件规格与交互逻辑，作为复刻实现蓝图。

## 总体布局 (Overall Layout)
- 页面采用双栏布局（登录态）：左侧 Sidebar 固定宽度，右侧为主聊天内容区域，整体使用 flex 布局。
- 未登录页展示中区欢迎与输入框，主容器居中且有最大宽度限制。
- 关键容器与布局属性（示例值，来自运行时快照与尺⼨测量，后续实施时以像素对齐为目标进行微调）：
  - body:
    - 背景色：rgb(247, 247, 248) 近似 #F7F7F8
    - 字体：系统 UI Sans（Inter, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans 等）
    - 文本色：深灰/近黑
  - main:
    - display: flex（登录态：左侧栏 + 右侧主区；未登录页主区独占）
    - max-width：约 768px（未登录欢迎页中央容器）
    - margin：水平居中
    - padding：上下留白较大，便于居中
  - aside（登录态时可见）：
    - width：约 260px（固定）
    - 背景：白/极浅灰
    - 分割：右侧 1px 边框或阴影（box-shadow: rgba(0,0,0,0.05) 0 0 0 1px）

## 全局样式 (Global Styles)
- 颜色（浅色模式）：
  - 背景：#F7F7F8
  - 文本主色：#0F172A / #111（深灰/近黑）
  - 分割线：#E5E7EB 附近
  - 胶囊按钮/输入框边框：#E5E7EB，悬浮/聚焦加深
- 字体：
  - font-family：Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji"
  - 正文 font-size：14px–16px；line-height：~1.5
  - 标题（欢迎页 ChatGPT）：约 28–36px，font-weight: 600

## 组件化分析 (Component Breakdown)

### Sidebar
- 结构：左侧纵向导航容器，顶部包含 NewChatButton；下方为历史对话列表；底部为用户与设置入口。
- 布局与样式：
  - width: 260px（固定）
  - background: #FFFFFF 或 #FAFAFA
  - 边界：border-right: 1px solid rgb(229, 231, 235) 或等效阴影
  - 滚动：overflow-y: auto
  - 内边距：上下 8–12px，左右 8–12px
- 交互：
  - 悬浮项 hover:bg-zinc-50；选中态背景加深，文字加粗/强调

### NewChatButton
- 结构：胶囊按钮 + 图标
- 样式：
  - display: inline-flex; align-items: center; gap: 8px
  - padding: 8px 12–16px
  - border: 1px solid #E5E7EB; border-radius: 9999px
  - 背景：白；hover: bg-zinc-50；focus: ring-2 ring-zinc-200
  - 文本：中性色 #111；图标等比缩放 16–18px
- 状态：
  - hover、focus、active 均有轻微背景/边框变化与阴影：shadow-sm

### ChatHistoryItem
- 结构：图标 + 标题文本
- 样式：
  - 高度：40–48px；padding-x: 10–12px
  - 圆角：8–10px；hover:bg-zinc-50
  - 文本颜色：#111；次要说明：#6B7280
  - 选中态：背景更深或文字强调
- 布局：列表垂直排列，item 之间有 2–4px 间距

### ChatMessage
- user 变体：
  - 背景：#FFFFFF；边框：1px #E5E7EB；圆角：16–20px；padding: 12–16px
  - 对齐：通常靠右或以头像/标识区分
  - 文本：#111
- assistant 变体：
  - 背景：#F7F7F8 或 #FAFAFA；边框：1px #E5E7EB；圆角：16–20px；padding: 12–16px
  - 对齐：靠左；支持富文本（代码块、列表、链接）
- 通用：
  - 间距：消息之间 space-y-4/6
  - 代码块：等宽字体，背景更浅，边框 1px，圆角 8px，内边距 12–14px

### ChatInput
- 结构：自适应高度 textarea 或 contenteditable 区域 + 左右工具按钮（Attach/Search/Voice）+ 发送按钮
- 外壳容器：
  - 边框：1px solid #E5E7EB；圆角：28px；背景：#FFFFFF；shadow-sm
  - 内边距：左右 20–24px；上下 12–16px
- 输入域：
  - font-size: 14–16px；line-height: ~1.5
  - color: #111；placeholder: #9CA3AF
  - focus：边框色加深；outline 可见（ring-2）
- 发送按钮：
  - 禁用：opacity 降低、cursor: not-allowed；有 disabled 属性
  - 启用：背景实色或中性色对比，hover 轻微阴影

### WelcomeScreen
- 结构：居中标题 “ChatGPT” + 下方一排示例标签（胶囊按钮）
- 样式：
  - 标题：text-3xl/4xl, font-semibold, color: #111
  - 标签按钮：rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50
  - 容器：max-w-3xl（≈768px），水平居中，垂直留白充足

## 交互逻辑 (Interaction Logic)

### 输入框交互
- 输入域为 textarea 或 contenteditable 区域，支持多行输入。
- 自适应高度：输入行数增加时，高度增长到设定上限（约 6–8 行），超过后出现内部滚动。
- 发送按钮禁用/启用逻辑：
  - 当输入为空或仅空白时：button.disabled = true；样式为低不透明度/低对比
  - 当输入有内容：button.disabled = false；hover 生效
- 快捷键：
  - Enter 发送；Shift+Enter 换行

### 消息发送流程（DOM 更新顺序）
1. 用户点击发送或按 Enter：
   - 立即清空输入框
   - 用户消息立即插入到消息列表（ChatMessage: user）
2. 发起请求后：
   - 插入助手消息占位（ChatMessage: assistant loading），占位元素带有“打字/加载”专用类名（如动画光标或 pulse 效果）
3. 流式响应：
   - 占位消息的文本内容逐字/逐片段追加（打字机效果）
   - 流式过程中，输入框与发送按钮处于禁用或“加载”状态
4. 完成：
   - 占位状态移除，最终消息定型
   - 输入区恢复可用

---

以上为静态与交互蓝图。后续 Phase 2 将把本报告中的样式与结构精确翻译为 Tailwind 类与组件结构，并保证构建无误。
## 实测快照（DevTools 计算样式与尺寸）

以下数据来自登录态页面在当前视口的实时计算样式与元素边界矩形（getComputedStyle + getBoundingClientRect）。不同实验版本或视口下可能存在±1–2px 浮动，复刻时以视觉对齐为准。

- 页面信息
  - URL: https://chatgpt.com/
  - 字体栈（body 计算值）: ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"
  - 字号/行高（body 计算值）: 16px / 24px
  - 文本主色（body 计算值）: rgb(13, 13, 13)
  - 背景色（body 计算值）: rgb(255, 255, 255)

### 主布局与容器
- Sidebar（左侧边栏）
  - display: flex; flex-direction: column
  - width: 260px; min-width: 0; max-width: none
  - 背景色: rgba(0,0,0,0)（视觉为白底）
  - 右侧分割线/阴影相关计算：border-right-color: rgba(13,13,13,0.05); border-right-width: 0px; box-shadow: none
  - 内边距 padding: 0; gap: normal
  - 矩形区域 rect: { x:0, y:0, width:260, height:1035 }

- Main（右侧主区容器）
  - display: block（外层还有 flex 布局容器）
  - gap: normal; width: 1290px; max-width: none; margin: 0; padding: 0
  - 背景色: transparent
  - rect: { x:260, y:0, width:1290, height:1035 }

- Header（主区顶部栏）
  - height: 52px
  - 边界相关：border-bottom-color: rgba(13,13,13,0.05); border-bottom-width: 0px
  - box-shadow: rgba(0,0,0,0) 0px 1px 0px 0px
  - rect: { x:260, y:0, width:1290, height:52 }

- 标题（欢迎语 “What can I help with?”）
  - 字号/字重/字距: 28px / 400 / 0.38px
  - 颜色: rgb(13,13,13)
  - rect: { x:745.75, y:364.69, width:318.5, height:42 }

### 侧边栏关键组件
- NewChatButton（devinid=3）
  - 文本: "New chat"
  - padding: 6px 10px; gap: 8px
  - border-radius: 10px; border-width: 0px; border-color: rgba(13,13,13,0.05)
  - 背景色: transparent; 文字色: rgb(13,13,13); box-shadow: none
  - rect: { x:6, y:60, width:233, height:36 }

- Search chats（devinid=4）
  - 同 New chat：padding 6px 10px; border-radius 10px; 高 36px

- Library（devinid=5）
  - padding: 6px 10px; border-radius: 10px; 高 36px

以上三者 hover 态在视觉上会出现浅底或边框加深（未在此快照中强制 :hover，但复刻时建议 hover:bg-zinc-50 / hover:border-zinc-300 近似）。

### 输入区（底部搜索/输入行）
- 可编辑区域（首次快照 devinid=71；当前会话表单内为 devinid=84, contenteditable）
  - 背景: transparent; color: rgb(13,13,13)
  - border-color: rgba(13,13,13,0.05); border-width: 0px; border-radius: 0px
  - padding: 0 0 16px
  - min-height: 0px; font-size: 16px; line-height: 24px
  - box-shadow: none; outline-color: rgb(16,16,16)
  - 示例 rect（首次快照）: { x:573, y:450.19, width:618, height:40 }

- 左/右侧按钮
  - 通用尺寸：36 × 36（rect 宽高）
  - 外观：rounded-full; inline-flex; items-center; justify-center
  - 发送按钮启用态：背景 rgb(229,243,255)（#E5F3FF），图标色 rgb(0,40,77)（#00284D）

> Tailwind 映射建议：
- 输入外壳容器（视觉为圆角药丸）：rounded-[28px] border border-zinc-200 bg-white shadow-sm px-5 py-3
- 按钮：size-9 rounded-full inline-flex items-center justify-center
- 发送按钮启用态：bg-sky-100 text-sky-900 hover:bg-sky-200
- 禁用态：opacity-50 cursor-not-allowed

### 交互观测（实时）
- 输入行为（contenteditable）
  - 插入 1/2/8 行文本后，rect.height 始终为 40px，overflowY: visible
  - 当前页面表现为“单行高度”的可编辑区域；长文本横向扩展。复刻时可按“单行胶囊输入”模式实现，Phase 3 再根据需求决定是否改为多行自适应。

- 发送按钮状态
  - 有文本时呈启用视觉；禁用/启用的属性切换未在快照中捕获到 disabled=true，复刻时请在输入为空或 isLoading 时设置 disabled 与 aria-disabled，并用样式降不透明度。

### DOM 结构参考（登录态首页）
- 侧边栏容器：nav[aria-label="Chat history"]（devinid=0），内部多个 aside 分组（固定按钮、导航、历史列表）
- 主区域：main > header + article* + form
  - form 内结构：div[contenteditable]（如 devinid=84） + 多个按钮（发送、听写、语音）
## 发送流程实测记录（MutationObserver）

以下为在登录态实测时，使用 MutationObserver 挂载在 main 下对提交一次消息的关键 DOM 变更采样（仅列关键片段）：

- 编辑区（ProseMirror）获得焦点时：
  - div.class: "ProseMirror ProseMirror-focused"
- 在可编辑段落 p 中插入文本：
  - childList add: #text "测试 DOM 顺序"
  - characterData: "测试 DOM 顺序"
- 提交相关按钮变化（提交触发阶段）：
  - 在某 div 下新增：
    - button.composer-submit-btn.composer-submit-button-color.h-9.w-9（submit/发送按钮）

基于该序列，发送消息的 DOM 更新顺序可以概括为：
1) 编辑器聚焦并写入文本（ProseMirror 段落内文本节点追加）。
2) 提交动作触发时，提交按钮状态/存在性发生变化（出现/切换到启用外观的 composer-submit-btn）。
3) 随后将产生消息区新增 article（用户消息）与助手占位/回复节点的插入与更新（本次日志截取未延伸到完整流式阶段，但与前述“交互逻辑”一致：先 user 行，再 assistant loading/流式）。

实现建议（Phase 3 对应）：
- 在提交后立即在本地 messages 中插入 user 节点，再插入 assistant 占位并启动流式拼接。
- 流式期间设置输入/发送禁用；结束后恢复。
