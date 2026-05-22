<p align="center">
  <h1 align="center">Web2App</h1>
  <p align="center">Turn any static web project into a standalone desktop app — <b>zero runtime dependencies</b>.</p>
</p>

[English](#english) | [中文](#chinese)

---

## English

### What is Web2App?

Web2App bundles your HTML/CSS/JS files into a native desktop application for Windows, macOS, and Linux. All web files are **embedded at compile time** and served by an internal Rust HTTP server. No Electron, no Node.js runtime, no external dependencies — users just double-click the `.exe` / `.dmg` / `.AppImage`.

### How It Works

```
your-repo/
├── web/                  ← drop your web app here
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src-tauri/            ← Rust desktop wrapper (don't touch)
│   ├── src/main.rs       ← app entry, starts HTTP server
│   ├── src/server.rs     ← embeds web/ at compile time, serves from memory
│   ├── tauri.conf.json   ← app name, window size, icon
│   └── Cargo.toml
├── .github/workflows/    ← CI builds for Win/Mac/Linux
└── package.json
```

At compile time, `include_dir!` embeds the entire `web/` directory into the binary. When the app launches:

1. An internal HTTP server (axum) starts on `127.0.0.1:4173`
2. All files are served **from memory** — zero disk I/O
3. A Tauri WebView window opens and loads `http://127.0.0.1:4173/`
4. SPA routing: unknown paths fall back to `index.html`

### Quick Start

**1. Use this template**

Click **"Use this template"** → **"Create a new repository"** on GitHub.

**2. Add your web app**

Replace the contents of `web/` with your own HTML/CSS/JS files. Delete the demo snake game.

**3. Customize**

Edit `src-tauri/tauri.conf.json`:

```json
{
  "productName": "YourAppName",
  "identifier": "com.yourcompany.yourapp",
  "app": {
    "windows": [{
      "title": "Your App Title",
      "width": 1280,
      "height": 800
    }]
  }
}
```

**4. Push & Build**

```bash
git add -A && git commit -m "my app" && git push
git tag v1.0.0 && git push origin v1.0.0
```

GitHub Actions will build for Windows, macOS, and Linux. Download the installers from the **Releases** page.

### Local Development

```bash
# Install dependencies once
npm install

# Build for your current platform
npm run tauri build

# The output is in src-tauri/target/release/bundle/
```

**Prerequisites:** [Node.js](https://nodejs.org), [Rust](https://rustup.rs), and Tauri [system dependencies](https://tauri.app/start/prerequisites/).

### Demo: Snake Game

The included `web/` contains a complete interactive **Snake game** with:
- User registration & login (localStorage)
- Arrow key controls, pause (P), score tracking
- Persistent high scores per account
- Dark-themed responsive UI

Open the repo in a browser or build the desktop app to try it.

### Customization

| File | Purpose |
|------|---------|
| `src-tauri/tauri.conf.json` | App name, identifier, window size, icon |
| `src-tauri/icons/` | App icon (replace with your own PNGs) |
| `web/` | Your web application |
| `.github/workflows/release.yml` | CI pipeline (triggered by `v*` tags) |

### Platform Output

| Platform | Artifacts |
|----------|-----------|
| Windows | `.exe` installer (NSIS), `.msi` |
| macOS | `.dmg` (Apple Silicon) |
| Linux | `.AppImage`, `.deb` |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | [Tauri](https://tauri.app) v2 (Rust) |
| HTTP server | [axum](https://github.com/tokio-rs/axum) 0.7 |
| File embedding | [include_dir](https://crates.io/crates/include_dir) |
| WebView | System WebView2 (Win) / WebKit (Mac) / WebKitGTK (Linux) |

### FAQ

**Q: Can I use a backend API?**  
Yes — your JavaScript can call any external API via `fetch()`. The app has CSP disabled (`"csp": null`) to allow all network requests.

**Q: Does it support SPAs with client-side routing?**  
Yes. Any URL that doesn't match a static file falls back to `index.html`.

**Q: What if my app needs persistent data?**  
Use `localStorage`, `IndexedDB`, or call an external API. The `data_dir` is available at `app.path().app_data_dir()` if you need file storage (edit `src/main.rs`).

**Q: Can I change the port?**  
Edit `src-tauri/src/main.rs` — change `127.0.0.1:4173` to your preferred port.

**Q: What's the binary size?**  
~10 MB (Rust binary + embedded web files). No Electron (150 MB+), no Node.js runtime.

### License

MIT

---

## 中文

### 这是什么？

Web2App 将你的 HTML/CSS/JS 网页打包成 Windows / macOS / Linux 原生桌面应用。所有文件**编译时嵌入二进制**，由内置 Rust HTTP 服务端从内存中提供。无需 Electron、无需 Node.js 运行时、无需任何外部依赖 — 用户双击即可运行。

### 原理

```
your-repo/
├── web/                  ← 你的网页应用放这里
├── src-tauri/            ← Rust 桌面外壳（不要改）
├── .github/workflows/    ← CI 自动构建
└── package.json
```

编译时 `include_dir!` 将整个 `web/` 目录嵌入二进制。应用启动流程：

1. 内置 HTTP 服务端（axum）在 `127.0.0.1:4173` 启动
2. 所有文件**从内存中提供** — 零磁盘 I/O
3. Tauri WebView 窗口打开并加载 `http://127.0.0.1:4173/`
4. SPA 路由支持：未匹配路径返回 `index.html`

### 快速开始

**1. 使用模板**

点击 GitHub 上的 **"Use this template"** → **"Create a new repository"**。

**2. 放入你的网页**

将 `web/` 目录中的内容替换为你自己的 HTML/CSS/JS 文件。删除演示的贪吃蛇游戏。

**3. 自定义**

编辑 `src-tauri/tauri.conf.json`：

```json
{
  "productName": "你的应用名",
  "identifier": "com.example.yourapp",
  "app": {
    "windows": [{
      "title": "窗口标题",
      "width": 1280,
      "height": 800
    }]
  }
}
```

**4. 推送构建**

```bash
git add -A && git commit -m "我的应用" && git push
git tag v1.0.0 && git push origin v1.0.0
```

GitHub Actions 自动构建 Windows / macOS / Linux 三个平台。从 **Releases** 页面下载安装包。

### 本地构建

```bash
npm install              # 安装依赖
npm run tauri build      # 构建当前平台
# 产物在 src-tauri/target/release/bundle/
```

**前置条件：** [Node.js](https://nodejs.org)、[Rust](https://rustup.rs)、以及 Tauri [系统依赖](https://tauri.app/start/prerequisites/)。

### 示例：贪吃蛇

`web/` 中内置了一个完整的交互式**贪吃蛇游戏**：
- 注册 / 登录（localStorage）
- 方向键控制、P 暂停、分数记录
- 按账号持久化最高分
- 暗色主题响应式 UI

直接在浏览器打开或构建桌面版体验。

### 平台产物

| 平台 | 产物 |
|------|------|
| Windows | `.exe` 安装包 (NSIS) / `.msi` |
| macOS | `.dmg` (Apple Silicon) |
| Linux | `.AppImage` / `.deb` |

### 技术栈

| 层 | 技术 |
|----|------|
| 桌面外壳 | [Tauri](https://tauri.app) v2 (Rust) |
| HTTP 服务 | [axum](https://github.com/tokio-rs/axum) 0.7 |
| 文件嵌入 | [include_dir](https://crates.io/crates/include_dir) |
| WebView | 系统自带 WebView2 (Win) / WebKit (Mac) / WebKitGTK (Linux) |

### 常见问题

**Q: 可以用后端 API 吗？**  
可以 — JavaScript 通过 `fetch()` 调用任何外部 API。CSP 已禁用（`"csp": null`），允许所有网络请求。

**Q: 支持 SPA 前端路由吗？**  
支持。未匹配静态文件的 URL 自动返回 `index.html`。

**Q: 需要持久化数据怎么办？**  
使用 `localStorage`、`IndexedDB`，或调用外部 API。如需文件存储，可编辑 `src/main.rs` 使用 `app_data_dir()`。

**Q: 能改端口吗？**  
编辑 `src-tauri/src/main.rs`，将 `127.0.0.1:4173` 改为你的端口。

**Q: 打包后多大？**  
约 10 MB（Rust 二进制 + 嵌入的网页文件）。对比 Electron（150 MB+）非常轻量。

### 许可

MIT
