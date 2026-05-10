# Task Plan: Pomelo v2

## 项目概述
React + Vite + Electron 番茄钟与待办事项桌面应用 Pomelo。v2 新增6个功能模块。

## 技术决策
| 项目 | 选择 |
|------|------|
| 框架 | React 18 + Vite |
| 桌面打包 | Electron + electron-builder 24.x |
| 番茄钟模式 | 标准 25 分钟专注 + 5 分钟休息 |
| Todo List | 优先级（高/中/低）+ 分类标签 |
| 数据存储 | localStorage（3 keys: todos / sessions / settings） |
| 通知 | Notification API + AudioContext |
| 白噪音 | Web Audio API 程序化生成（雨声/森林/咖啡馆/白噪音） |
| 悬浮窗 | Electron IPC + 独立 BrowserWindow |
| 状态管理 | 无外部库，useTimer/useTodos 提升至 App.jsx 层级 |

---

## v1 — 基础功能 [completed]
> Phase 1-4: 项目初始化、番茄钟核心、Todo List、布局样式、Electron 打包

## v2 — 6 个新功能

### Phase 1: 数据层改造 [completed]
- [x] `storage.js` — 新增 sessions / settings 读写
- [x] `useTodos.js` — 新增 `pomodoroCount` 字段 + `incrementPomodoroCount()`
- [x] `useHistory.js` — 新建，session CRUD + 统计计算 + 热力图数据
- verify: 构建通过，localStorage 数据模型验证

### Phase 2: 历史统计 + 热力图 [in_progress]
- [ ] `Heatmap.jsx` — GitHub-style 7×12 热力图组件
- [ ] `HistoryPanel.jsx` — 统计卡片 + 柱状图 + 周期选择
- [ ] `App.jsx` — 添加 tab 导航（番茄钟 / 统计）
- [ ] CSS — tab bar / heatmap / history panel 样式
- verify: tab 切换正常，热力图渲染，统计数据正确

### Phase 3: 任务绑定番茄钟 [pending]
- [ ] `useTimer.js` — `activeTaskId`, `activeTaskTitle`, `bindTask()`, `onSessionComplete` 回调
- [ ] `PomodoroTimer.jsx` — 任务下拉选择器 + 当前任务显示
- [ ] `TodoItem.jsx` — 番茄计数徽章
- [ ] `App.jsx` — 提升 hooks 至 App 层，连接 `onSessionComplete` → `recordSession` + `incrementPomodoroCount`
- verify: 选择任务 → 开始番茄 → 完成后 session 记录写入 + todo 计数递增

### Phase 4: 自动循环 [pending]
- [ ] `useTimer.js` — `autoCycle`, `maxCycles`, 完成时自动续期逻辑
- [ ] `PomodoroTimer.jsx` — toggle + 次数输入
- [ ] 设置持久化至 localStorage
- verify: 开启自动循环后专注→休息→专注自动流转，达 maxCycles 后停止

### Phase 5: 白噪音 [pending]
- [ ] `useWhiteNoise.js` — Web Audio API 程序化生成 4 种环境音
- [ ] `WhiteNoiseSelector.jsx` — 音效选择按钮 + 音量滑块
- [ ] 集成至 `PomodoroTimer.jsx`
- verify: 选择音效 → 专注+运行中自动播放，暂停/休息时停止

### Phase 6: 悬浮窗 [pending]
- [ ] `electron/preload.cjs` — IPC bridge 方法
- [ ] `electron/main.cjs` — 悬浮窗创建 + IPC 中继
- [ ] `FloatingTimer.jsx` — IPC 驱动的极简计时器
- [ ] `main.jsx` — `?floating=1` 路由
- [ ] `App.jsx` — state 变更时 IPC 同步
- verify: 切换悬浮窗 → 状态同步 → 双向控制 → 关闭清理

---

## Decisions Log
| 时间 | 决策 | 原因 |
|------|------|------|
| 2026-05-10 | React + Vite | 用户偏好 |
| 2026-05-10 | 暗色琥珀主题 | frontend-design skill 重新设计 |
| 2026-05-10 | Electron 打包 | 用户需要可下载的桌面应用 |
| 2026-05-10 | electron-builder@24 | v26 需要 nsis-resources 3.4.1，GFW 阻断无法下载 |
| 2026-05-10 | SSH 推送 | HTTPS 被 GFW 阻断 |
| 2026-05-10 | hooks 提升至 App 层 | 跨功能通信（任务绑定→历史记录）无需引入外部状态库 |
| 2026-05-10 | localStorage 3 keys | sessions 存历史，settings 存偏好，todos 新增 pomodoroCount |
| 2026-05-10 | Web Audio API 白噪音 | 无需外部音频文件，纯程序化生成 |
| 2026-05-10 | Electron IPC 悬浮窗 | 主窗口推送 state，悬浮窗转发 action，主进程中继 |
