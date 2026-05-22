# Web2App · 网页打包桌面应用

[English](#english) | [中文](#chinese)

---

## English

Turn any static web project into a standalone desktop app. **Zero runtime dependencies** — all web files are embedded at compile time and served by an internal Rust HTTP server.

### Quick Start

1. **Use this template** → Click "Use this template" on GitHub
2. **Replace `web/`** with your own HTML/CSS/JS
3. **Edit `src-tauri/tauri.conf.json`** — change `productName`, `identifier`, window `title`
4. **Push** → GitHub Actions builds for Windows / macOS / Linux
5. **Download** from Releases

### How It Works

```
your-repo/
├── web/              ← Your web app
├── src-tauri/        ← Rust desktop wrapper
└── .github/          ← CI builds
```

At compile time, all files in `web/` are embedded into the binary via `include_dir!`. When the app launches, an internal HTTP server (axum) serves them from memory on `127.0.0.1:4173`. The Tauri WebView loads this URL automatically.

### Local Build

```bash
npm install
npm run tauri build
```

Requires Node.js, Rust, and Tauri system dependencies.

### Demo

The included `web/` contains a **Snake Game** with login/register — a complete interactive web app demonstrating the framework.

### Platforms

| Platform | Output |
|----------|--------|
| Windows | .exe / .msi |
| macOS | .dmg |
| Linux | .AppImage / .deb |

### License

MIT

---

## Chinese

将任意静态网页项目打包成独立桌面应用。**零运行时依赖** —— 所有网页文件在编译时嵌入二进制，由内置 Rust HTTP 服务端从内存中提供。

### 快速开始

1. **使用模板** → 点击 GitHub 上的 "Use this template"
2. **替换 `web/`** → 放入你自己的 HTML/CSS/JS
3. **编辑 `src-tauri/tauri.conf.json`** → 修改应用名、窗口标题
4. **推送** → GitHub Actions 自动构建 Windows / macOS / Linux
5. **下载** → 从 Releases 页面获取

### 原理

```
your-repo/
├── web/              ← 你的网页应用
├── src-tauri/        ← Rust 桌面外壳
└── .github/          ← CI 自动构建
```

编译时通过 `include_dir!` 将 `web/` 目录全部嵌入二进制。应用启动时，内部 HTTP 服务端（axum）在 `127.0.0.1:4173` 从内存中提供网页。Tauri WebView 自动加载该地址。

### 本地构建

```bash
npm install
npm run tauri build
```

需要 Node.js、Rust 以及 Tauri 系统依赖。

### 示例

`web/` 中内置了一个**交互式贪吃蛇**，包含登录注册功能 —— 完整演示框架能力。

### 平台

| 平台 | 产物 |
|------|------|
| Windows | .exe / .msi |
| macOS | .dmg |
| Linux | .AppImage / .deb |

### 许可

MIT
