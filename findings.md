# Findings: 番茄钟 + Todo List 应用 v2

## v1 技术调研
- Vite + React 项目手动创建（非空目录导致脚手架交互取消）
- setInterval 每秒更新，useRef 存储 interval ID
- SVG circle + stroke-dasharray/stroke-dashoffset 圆形进度条
- Notification API + AudioContext 蜂鸣通知
- localStorage JSON 序列化封装

## v2 新发现

### electron-builder 版本兼容
- **问题**: v26 需要 `nsis-resources-3.4.1.7z`，Go 二进制 `app-builder.exe` 坚持直连 GitHub 下载，无法使用本地缓存
- **结论**: 降级至 v24.13.3，该版本仅需 nsis 3.0.4.1（缓存命中）
- **影响**: 构建脚本 `npm run dist` 正常运行

### GitHub 网络环境
- **问题**: 中国网络下 GitHub HTTPS (20.205.243.166:443) 间歇阻断
- **解法**: 
  - Git push 用 SSH (`git@github.com`)
  - `gh` CLI API 走 `api.github.com` 正常
  - electron-builder 工具链需本地缓存

### 白噪音程序化生成方案
- Web Audio API 无需外部音频文件
- **雨声**: 白噪声 → BandpassFilter(800Hz) → 3Hz 振幅调制
- **森林**: 低通噪音(风) + 多频段正弦振荡器(鸟鸣) → 随机门控
- **咖啡馆**: 低通噪音(400Hz) + 短突发噪音(人声模拟)
- **白噪音**: 原始随机采样，平坦频谱
- AudioContext 需用户手势触发（浏览器自动播放策略）
- fade in/out 用 `GainNode.gain.linearRampToValueAtTime()`

### 悬浮窗 IPC 架构
- 主窗口推送完整 timer state → 主进程中继 → 悬浮窗渲染
- 悬浮窗发 action → 主进程中继 → 主窗口执行
- 悬浮窗为纯展示组件，无 useTimer hook
- 通信频率 ≤1/s（随 setInterval 节拍），开销极低
- frameless + `-webkit-app-region: drag` 实现拖拽
- `alwaysOnTop: true` + `skipTaskbar: true`

### localStorage 数据迁移
- 新增 `pomodoroCount` 字段：`{ pomodoroCount: 0, ...t }` idempotent 迁移
- 老数据自动兼容，无需版本管理

### 发现记录
| 日期 | 主题 | 内容 |
|------|------|------|
| 2026-05-10 | electron-builder | v26 NSIS 资源因 GFW 下载失败，降级 v24 解决 |
| 2026-05-10 | git push | HTTPS 阻断，SSH 正常 |
| 2026-05-10 | 白噪音 | Web Audio API 程序化生成，无需外部文件 |
| 2026-05-10 | 数据迁移 | pomodoroCount 字段 idempotent migration |
