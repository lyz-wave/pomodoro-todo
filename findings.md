# Findings: 番茄钟 + Todo List 应用

## 技术调研

### Vite + React 项目初始化
- `npm create vite@latest . -- --template react` 在当前目录创建
- 无需额外路由库，单页应用即可

### 番茄钟实现
- 使用 `setInterval` 每秒更新，精度足够（非毫秒级竞速场景）
- `useRef` 存储 interval ID，避免闭包陷阱
- 圆形进度条用 SVG circle + stroke-dasharray/stroke-dashoffset

### localStorage 封装
- JSON 序列化/反序列化
- 自定义 hook 封装读写，组件无需直接操作 localStorage

### 通知机制
- `Notification.requestPermission()` 请求浏览器通知权限
- Web Audio API 播放提示音（无需外部音频文件）

## 发现记录
| 日期 | 主题 | 内容 |
|------|------|------|
| - | - | - |
