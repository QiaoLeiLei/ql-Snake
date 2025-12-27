# 太空像素蛇 - Vue3 + TypeScript 版本

一个使用 Vite + Vue 3 + TypeScript 构建的太空主题贪吃蛇游戏。

## 🎮 游戏预览

![太空像素蛇](https://img.shields.io/badge/游戏-太空像素蛇-blue?style=for-the-badge)
![技术栈](https://img.shields.io/badge/技术-Vue3--TypeScript--Vite-green?style=for-the-badge)
![状态](https://img.shields.io/badge/状态-可运行-brightgreen?style=for-the-badge)

## ✨ 项目特点

- 🎮 **经典玩法** - 像素风格的贪吃蛇游戏
- 🌌 **太空主题** - 霓虹色彩与星空背景
- 📱 **移动端支持** - 触摸滑动和虚拟按钮控制
- ⌨️ **键盘控制** - 方向键精确操控
- 🎯 **渐进难度** - 随着得分增加游戏速度提升
- 🔧 **现代技术栈** - Vue3 + TypeScript + Tailwind CSS
- 🚀 **快速开发** - Vite热重载和自动浏览器打开

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **字体**: Press Start 2P (像素字体)
- **图标**: Font Awesome

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```
> 🎉 Vite会自动打开浏览器并启动开发服务器

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```
> 🌐 自动打开浏览器预览生产构建版本

## 🎮 游戏控制

### ⌨️ 键盘控制
| 按键 | 功能 |
|------|------|
| ↑ | 向上移动 |
| ↓ | 向下移动 |
| ← | 向左移动 |
| → | 向右移动 |

### 📱 移动端控制
- **滑动控制** - 在游戏区域上滑动手指来改变方向
- **虚拟按钮** - 点击屏幕下方的方向按钮进行精确控制

### 🎯 游戏目标

1. 🐍 控制贪吃蛇在太空中移动
2. ⭐ 收集旋转的星形食物来增长身体
3. 🚫 避免撞到墙壁或自己的身体
4. 📈 每吃到一个食物得分+1
5. ⚡ 随着得分增加，游戏速度会逐渐加快
6. 🏆 挑战最高分，成为太空大师！

## 📁 项目结构

```
space-snake-game/
├── 📄 index.html              # HTML 入口文件
├── 📄 package.json            # 项目配置和依赖
├── 📄 tsconfig.json          # TypeScript 配置
├── 📄 tailwind.config.js     # Tailwind CSS 配置
├── 📄 vite.config.ts         # Vite 构建配置 (自动打开浏览器)
├── 📄 README.md              # 项目文档
└── src/
    ├── 📄 main.ts            # Vue 应用入口
    ├── 📄 App.vue            # 根组件 (游戏界面布局)
    ├── 📄 style.css          # 全局样式和游戏特效
    ├── 📄 shims-vue.d.ts     # Vue 类型声明
    ├── 📄 vite-env.d.ts      # Vite 环境类型
    └── 📂 components/
        └── 📄 SnakeGame.vue  # 游戏核心逻辑组件
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**🎮 开始你的太空冒险吧！**