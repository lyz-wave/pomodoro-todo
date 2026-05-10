# Pomelo

基于 React + Vite + Electron 的番茄钟计时器与待办事项桌面应用。「墨色暖光」暗色主题，琥珀色辉光美学。

## 功能

**番茄钟**
- 标准 25 分钟专注 + 5 分钟休息，自动循环
- SVG 圆形进度条，随模式切换琥珀色 / 翡翠色辉光
- 浏览器 Notification API + AudioContext 音频提醒
- 任务绑定：每个番茄钟可关联具体待办任务
- 自动循环：连续完成多轮后自动停止
- 白噪音：雨声 / 森林 / 咖啡馆 / 白噪音，程序化生成
- 悬浮窗：紧凑 mini 计时器，始终置顶

**待办事项**
- 添加 / 删除 / 勾选任务
- 高 / 中 / 低三级优先级
- 自定义分类标签（datalist 自动补全）
- 按完成状态、优先级、分类三维筛选
- 番茄钟绑定计数

**统计**
- 总专注时间、次数、常用任务汇总
- 柱状图：日/周/月/年专注分布
- GitHub 风格热力图：过去 84 天专注可视化

## 设计

- 暗色温润背景 + SVG 噪声纹理
- 半透明玻璃态卡片 + 径向琥珀辉光
- Georgia 衬线字体计时数字
- 入场 stagger 动画
- 悬浮窗 compact 独立布局

## 启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run dist
```

## 技术栈

- React 18
- Vite
- Electron + electron-builder
- Web Audio API（白噪音）
- localStorage（数据持久化）
