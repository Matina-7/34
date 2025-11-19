# Construction Game

一个简单的建筑游戏，使用HTML5 Canvas制作。

## 功能特性

- 🎮 点击选择建筑材料（砖块、木材、石头、玻璃）
- 🖱️ 在画布上点击放置建筑材料
- 💰 金币系统：每种材料有不同的成本
- ⚡ 能量系统：每次放置消耗能量
- 🔄 重置功能：随时重新开始游戏

## 如何使用

### 在线访问

1. 启用 GitHub Pages：
   - 进入仓库设置 (Settings)
   - 找到 Pages 选项
   - 在 Source 中选择分支
   - 保存后等待部署完成

2. 访问游戏：
   - 部署完成后会显示访问链接
   - 通常是：`https://[用户名].github.io/34/`

### 本地运行

1. 克隆仓库：
```bash
git clone [仓库地址]
cd 34
```

2. 使用任何HTTP服务器运行，例如：
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

3. 在浏览器中打开 `http://localhost:8000`

## 游戏说明

1. **选择材料**：点击顶部材料面板中的按钮选择建筑材料
2. **放置材料**：在画布上点击任意位置放置选中的材料
3. **资源管理**：
   - 🧱 砖块：10金币
   - 🪵 木材：5金币
   - 🪨 石头：15金币
   - 🪟 玻璃：20金币
4. **能量耗尽**：当能量用完时，点击重置按钮重新开始

## 文件结构

```
.
├── index.html          # 主HTML文件
├── style.css           # 样式表
├── game.js             # 游戏逻辑
├── assets/
│   └── bg_brick.svg    # 砖块背景图案
└── README.md           # 项目说明
```

## 技术栈

- HTML5 Canvas
- CSS3
- Vanilla JavaScript

## 许可证

MIT License
