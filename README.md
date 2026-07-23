🔄 Language / 语言：**简体中文** | [English](README.en.md)

# 🌐 Simple Nav Page

一个**简洁、美观、支持自定义的个人导航页模板**，无需服务器，简单快速搭建属于自己的导航页。

---

## ✨ 特点

* 🚀 **无需服务器**：支持 GitHub Pages / Cloudflare Pages 部署

* 🧩 **极简配置**：只需修改少量文件即可完成自定义

* 🎯 **面向新手**：无需前端基础也能上手

* ✅ **轻量美观**：简洁 UI，专注实用体验

* 📱 **响应式布局**：自适应手机、平板与桌面端

* 🔍 **多搜索引擎支持**：内置常用搜索分类与引擎

* ⚡ **站内快速检索**：支持标题 & 描述关键词筛选

* 🖼️ **自动网站图标**：自动获取 favicon，支持自定义

* 🌄 **随机背景图**：每次刷新自动切换背景

* 🌐 **内外网地址切换**：默认外网，一键切换

* 🌙 **夜间模式**：点击标题右侧图标自由切换

* ⬆➡ **排列方向切换**：点击标题自由切换网站卡片横向纵向排列

* 💻 **新增后台功能**：可视化增减网站

---

## 📸 示例

主页👉 https://xmynscnq.github.io/Simple-Nav-Page
纵向瀑布流模式
<img width="1920" height="919" alt="王五导航 (24 06 2026 17_30)" src="https://github.com/user-attachments/assets/00db60cd-502b-425a-aed6-278d20d6c5f1" />
切换单分页模式
<img width="1920" height="919" alt="王五导航 (17 07 2026 10_27)" src="https://github.com/user-attachments/assets/fa762c5a-99e0-425b-9349-6400477f6335" />

后台👉https://xmynscnq.github.io/Simple-Nav-Page/admin

<img width="1920" height="919" alt="导航编辑器 (18 06 2026 21_38)" src="https://github.com/user-attachments/assets/69f09854-930c-4e67-9f33-7fff01258f70" />


---

## 🧑‍💻 适合人群

* 想要一个属于自己的导航页
* 不会前端 / 不想折腾部署
* 没有服务器
* 想快速搭建个人主页

---

## 🛠️ 使用方法

### 1️⃣ Fork、star 项目

点击右上角 Fork和Star项目，仓库名保持原样即可

---

### 2️⃣ 修改页面标题

编辑 `index.html`：

```html
<title>你的导航页名称</title>
<h1 id="pageTitle" title="点击切换页面排列">你的导航页名称</h1>

```

---

### 3️⃣ 配置网站数据

编辑 `links.json`：（收录你常用的网站，若计划部署后台可跳过编辑Links.json的步骤）

* `section`：分类名
* `title`：显示名称、用于站内定位关键词(不宜过长)
* `data-desc`：用于站内定位关键词
* `desc` ：网站下方的介绍
* `url`：网站地址
  
* `intranet`（可选）：若有内外网切换需求，则在下方加一行，【"intranet": "输入你的内网网址",】
* `icon`（可选）：若有自定义图标需求，则在下方加一行，【"icon": "路径/图标名称",】
  
 编辑 `main.js`：（可选）
 
* 根据您的网站图标适配情况，可切换图标源：'google' 或 'duckduckgo'
* const FAVICON_PROVIDER = 'duckduckgo';或const FAVICON_PROVIDER = 'google';

---

### 4️⃣（可选）推荐使用 Cloudflare Worker 代理图标接口

如果你没自定义图标，而是通过默认的自动抓取来获取图标，且在国内访问时遇到：

* 图标无法加载或加载非常缓慢

这是由于国内访问google或duckduckgo服务不稳定造成的，可以使用项目内置的 `worker.js` 来部署代理服务。

---

#### 📦 部署步骤

1. 打开 Cloudflare
2. 进入 **Workers & Pages**
3. 创建一个 Worker
4. 将项目中的 `worker.js` 代码复制进去
5. 绑定一个自定义域名（不要和你的导航页用同一个域名）

---

#### 🔗 部署后使用方式

假设你的worker自定义域名是：

```text id="8n1jnt"
https://api.xxx.com
```

修改 `main.js`：

```js id="m9g4cq"
const PROXY = 'https://api.xxx.com';
注意后面不要带有斜杠/
当导航页显示许多兜底图标“黑白地球”时，表示worker异常。（duckduckgo默认图标为箭头，google默认图标为彩色地球，显示其中之一为正常）
```

---

#### ⚙️ 原理说明

Worker 会代理以下资源：

* 网站图标：`icons.duckduckgo.com`,`www.google.com`

从而提升国内访问稳定性。

---

#### ✅ 优点

* 提升加载成功率
* 减少外部依赖
* 适合国内网络环境
  
---

### 5️⃣（可选）后台功能

登录后台可避免每次增减网站改代码的繁琐，并方便自定义图标（注意：在后台编辑网站实际上就是读写github文件，所以若使用不流畅，则在后台操作时应科学上网）

#### 📦 步骤

1. 打开 https://github.com/settings/personal-access-tokens
2. Generate new token
3. Token name *、Description随意、Expiration（token有效期，到期后需要重新申请token，也可选无限期：No expiration）
4. 然后点Only select repositories，然后选择自己的仓库
5. 选+Add permissions，再选Contents，将Contents后改为，Access：Read and Write
6. Generate token
<img width="1272" height="844" alt="New Fine-grained Personal Access Token (18 06 2026 21_22)" src="https://github.com/user-attachments/assets/425ae79e-d2ac-499a-8f13-b5779465151d" />

7. 复制token并保存本地任意位置，忘记需要重新申请
8. 编辑admin.html文件,修改 const HARDCODED_REPO   = '你的用户名/Simple-Nav-Page';
9. 打开后台{后台地址为【你的导航页网址/admin】，必须在完成下方 6️⃣ （部署到github pages或Cloudflare Pages后才能打开后台）}
10. 第一次需要输入token和自定义短密码，后续可通过短密码登录（换设备和浏览器后需要重新输入token）
11. 修改后台内容后点击保存到github，生效后可通过Ctrl+F5强制刷新导航页面查看修改内容。
<img width="1194" height="604" alt="导航编辑器 (18 06 2026 21_37)" src="https://github.com/user-attachments/assets/e6ab1926-ba82-4d67-8de3-b94d10c12d5c" />

---

#### ⚙️ 原理说明

token就是一个有权限读写你所授权的仓库的钥匙，从而实现在非github页面可视化修改网站。

---

### 6️⃣ 部署

* 使用 GitHub Pages
* 或接入 Cloudflare Pages

---

### 7️⃣ 完成 🎉

---

## 📸 示例：移动端/夜间模式

<img width="400" height="832" alt="王五导航 (17 07 2026 10_27) (1)" src="https://github.com/user-attachments/assets/6d6290ba-9321-4aec-a94b-ccfc70483f0e" />

## 📄 开源协议

使用 MIT License，可自由使用与修改。
