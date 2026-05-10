# Task Plan: 番茄钟 + Todo List 应用

## 项目概述
React + Vite 构建的番茄钟计时器与待办事项集成应用，数据通过 localStorage 持久化。

## 技术决策
| 项目 | 选择 |
|------|------|
| 框架 | React 18 + Vite |
| 番茄钟模式 | 标准 25 分钟专注 + 5 分钟休息，循环 |
| Todo List | 支持优先级（高/中/低）和分类标签 |
| 数据存储 | localStorage |
| 通知 | Notification API + AudioContext |

---

## Phase 1: 项目初始化 [completed]
1. 手动创建 Vite + React 项目结构 → verify: `npm run dev` 启动成功 (localhost:5173)
2. 安装依赖 react, react-dom, vite, @vitejs/plugin-react

## Phase 2: 番茄钟核心 [completed]
1. `useTimer` hook — 倒计时逻辑 (25min focus / 5min break), 状态机 (idle/running/paused)
2. `PomodoroTimer` 组件 — SVG 圆形进度条 + 时间显示 + 开始/暂停/重置
3. 通知机制 — Notification API + AudioContext 蜂鸣

## Phase 3: Todo List [completed]
1. `useTodos` hook — CRUD + 优先级 + 分类 + localStorage 持久化
2. `TodoForm` 组件 — 添加任务（标题、优先级选择、分类输入 + datalist 自动补全）
3. `TodoItem` 组件 — 勾选/删除/优先级标签/分类标签
4. `TodoList` 组件 — 筛选（状态/优先级/分类） + 空状态

## Phase 4: 集成与布局 [completed]
1. `App` 布局 — 双栏网格，左侧番茄钟 + 右侧 Todo List，响应式单栏
2. 样式 — 番茄红主题，卡片式布局，柔和阴影，过渡动画

## Decisions Log
| 时间 | 决策 | 原因 |
|------|------|------|
| 2026-05-10 | React + Vite | 用户偏好，组件化开发方便扩展 |
| 2026-05-10 | 标准番茄钟 | 用户选择固定 25+5 模式 |
| 2026-05-10 | localStorage | 用户选择本地存储，无需后端 |
| 2026-05-10 | 优先级+分类 | 用户选择带优先级和分类的 Todo |
| 2026-05-10 | setInterval 每秒 | 非毫秒级场景，精度足够 |
| 2026-05-10 | AudioContext 蜂鸣 | 无需外部音频文件，纯代码生成提示音 |
