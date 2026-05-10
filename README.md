# 番茄钟 + Todo

基于 React + Vite 的番茄钟计时器与待办事项集成应用。「墨色暖光」暗色主题，琥珀色辉光美学。

## 功能

**番茄钟**
- 标准 25 分钟专注 + 5 分钟休息，自动循环
- SVG 圆形进度条，随模式切换琥珀色 / 翡翠色辉光
- 浏览器 Notification API 通知 + AudioContext 音频提醒

**待办事项**
- 添加 / 删除 / 勾选任务
- 高 / 中 / 低三级优先级
- 自定义分类标签（datalist 自动补全）
- 按完成状态、优先级、分类三维筛选
- localStorage 持久化

## 设计

- 暗色温润背景 + SVG 噪声纹理
- 半透明玻璃态卡片 + 径向琥珀辉光
- Georgia 衬线字体计时数字
- 入场 stagger 动画

## 启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 技术栈

- React 18
- Vite
- CSS（无第三方 UI 库）
