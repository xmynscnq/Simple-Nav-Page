# 🌐 Simple Nav Page

一个**低门槛的个人导航页模板**，无需服务器，小白也能快速搭建属于自己的导航页。

---

## ✨ 特点

* 🚀 **无需服务器**：支持 GitHub Pages / Cloudflare Pages 部署

* 🧩 **极简配置**：只需修改少量文件即可完成自定义

* 🎯 **面向新手**：无需前端基础也能上手

* 🌙 **轻量美观**：简洁 UI，专注实用体验

* 🔍 **多搜索引擎支持**：内置常用搜索分类与引擎

* ⚡ **站内快速检索**：支持标题 & 描述关键词筛选

* 🖼️ **自动网站图标**：自动获取 favicon（多源 fallback）

* 🌄 **随机背景图**：每次刷新自动切换背景

---

## 🧑‍💻 适合人群

* 想要一个属于自己的导航页
* 不会前端 / 不想折腾部署
* 没有服务器
* 想快速搭建个人主页

---

## 🛠️ 使用方法

### 1️⃣ Fork 项目

点击右上角 Fork

---

### 2️⃣ 修改页面标题

编辑 `index.html`：

```html
<title>你的导航页名称</title>
```

---

### 3️⃣ 配置网站数据

编辑 `links.json`：

* `title`：显示名称、用于站内定位关键词
* `data-desc`：用于站内定位关键词
* `desc` ：网站下方的介绍
* `url`：网站地址

---

### 4️⃣（推荐）使用 Cloudflare Worker 代理（解决国内访问问题）

如果你在国内访问时遇到：

* 图标无法加载
* 背景图片加载失败

可以使用项目内置的 `worker.js` 来部署代理服务。

---

#### 📦 部署步骤

1. 打开 Cloudflare
2. 进入 **Workers & Pages**
3. 创建一个 Worker
4. 将项目中的 `worker.js` 代码复制进去
5. 绑定一个自定义域名（推荐）

---

#### 🔗 部署后使用方式

假设你的域名是：

```text id="8n1jnt"
https://api.xxx.com
```

修改 `main.js`：

```js id="m9g4cq"
const FAVICON_API = 'https://api.xxx.com/icons.duckduckgo.com/ip3/';
const BG_API      = 'https://api.xxx.com/bing.img.run/rand.php?t=';
```

---

#### ⚙️ 原理说明

Worker 会代理以下资源：

* 背景图：`bing.img.run`
* 网站图标：`icons.duckduckgo.com`

从而提升国内访问稳定性。

---

#### ✅ 优点

* 提升加载成功率
* 减少外部依赖
* 适合国内网络环境
  
---

### 5️⃣ 部署

* 使用 GitHub Pages
* 或接入 Cloudflare Pages

---

### 6️⃣ 完成 🎉

---

## 📸 示例

👉 https://xmynscnq.github.io/Simple-Nav-Page

![预览](https://github.com/user-attachments/assets/eb5a268b-30a5-46e0-9681-69b6ef3fe742)

---

## 📄 开源协议

使用 MIT License，可自由使用与修改。
