🔄 Language / Language: [简体中文](README.md) | **English**

# 🌐 Simple Nav Page

A **simple, beautiful, and customizable personal navigation page template** that requires no server setup. Quickly and easily build your own personal navigation page.

---

## ✨ Features

* 🚀 **No server required**: Supports GitHub Pages / Cloudflare Pages deployment

* 🧩 **Minimal configuration**: Customize with only a few file changes

* 🎯 **Beginner-friendly**: No frontend experience required

* ✅ **Lightweight and clean UI**: Focused on usability and simplicity

* 📱 **Responsive layout**: Works across mobile, tablet, and desktop

* 🔍 **Multiple search engine support**: Built-in search categories and engines

* ⚡ **Fast on-site search**: Filter by title and description keywords

* 🖼️ **Automatic website icons**: Fetch favicons automatically, with custom icon support

* 🌄 **Random background images**: Background changes on each refresh

* 🌐 **Switch between public and intranet URLs**: External network by default, switch with one click

* 🌙 **Night Mode**: Easily switch between light and dark modes using the icon next to the title

* ⬆➡ **Layout Switching**:Click the title to toggle between horizontal and vertical card layouts.

* 💻 **Visual admin panel**: Add and manage websites visually

---

## 📸 Demo

Homepage:

https://xmynscnq.github.io/Simple-Nav-Page

<img width="1920" height="919" alt="王五导航 (24 06 2026 17_30)" src="https://github.com/user-attachments/assets/00db60cd-502b-425a-aed6-278d20d6c5f1" />

<img width="1920" height="919" alt="王五导航 (17 07 2026 10_27)" src="https://github.com/user-attachments/assets/344005fd-8807-42a3-b602-dbd0bdc59a1f" />

Admin Panel:

https://xmynscnq.github.io/Simple-Nav-Page/admin

<img width="1920" height="919" alt="image" src="https://github.com/user-attachments/assets/ae2963bd-5110-4c7f-b74a-e85c23492fc7" />

---

## 🧑‍💻 Suitable For

* Anyone who wants a personal navigation page

* Users without frontend experience

* People who don't want complicated deployment steps

* Users without a server

* Anyone who wants to quickly build a personal homepage

---

## 🛠️ Usage

### 1️⃣ Fork and Star this project

Click the **Fork** and **Star** buttons in the top-right corner.

---

### 2️⃣ Modify the page title

Edit `index.html`:

```html
<title>Your Navigation Page Name</title>
<h1 id="pageTitle" title="点击切换页面排列">Your Navigation Page Name</h1>
```

---

### 3️⃣ Configure website data

Edit `links.json`
(Collect the websites you frequently use. If you plan to deploy the backend, you can skip the step of editing Links.json.)

Fields:

* `section`: category name
* `title`: display name and search keyword
* `data-desc`: searchable keywords
* `desc`: description shown below the website
* `url`: website URL

Optional fields:

* `intranet`: internal URL for network switching

```json
"intranet":"your internal URL"
```

* `icon`: custom icon path

```json
"icon":"path/icon-name"
```

Edit `main.js` (optional)

Switch favicon provider according to compatibility:

```js
const FAVICON_PROVIDER='duckduckgo';
```

or:

```js
const FAVICON_PROVIDER='google';
```

---

### 4️⃣ (Optional) Deploy a Cloudflare Worker as an icon proxy

If icons load slowly or fail to load in certain regions, you can use the built-in `worker.js`.

---

#### 📦 Deployment Steps

1. Open Cloudflare
2. Go to **Workers & Pages**
3. Create a Worker
4. Copy the `worker.js` code into it
5. Bind a custom domain (don't use the same domain as your navigation page).

---

#### 🔗 Usage after deployment

Example:

```text
https://api.xxx.com
```

Modify `main.js`:

```js
const PROXY='https://api.xxx.com';
```

Do not add a trailing slash `/`

If many fallback icons appear:

* DuckDuckGo → arrow icon
* Google → colored globe icon

it usually indicates that the Worker is not functioning properly.

---

#### ⚙️ How it works

The Worker proxies:

* `icons.duckduckgo.com`
* `www.google.com`

to improve access stability.

---

#### ✅ Benefits

* Higher loading success rate
* Reduced external dependency
* Better experience in restricted network environments

---

### 5️⃣ (Optional) Admin Panel

The admin panel lets you manage websites visually without editing code every time.

Note:

The admin panel works by reading/writing GitHub files directly. If performance is unstable, a VPN or alternative network connection may be required.

#### 📦 Steps

1. Open:

https://github.com/settings/personal-access-tokens

2. Click **Generate new token**

3. Configure:

* Name: any
* Description: any
* Expiration: choose expiration or "No expiration"

4. Select:

**Only select repositories**

Choose your own repository.

5. Add permission:

**Contents → Read and Write**

6. Generate token

<img width="1272" height="844" alt="image" src="https://github.com/user-attachments/assets/598557b9-8407-4061-a894-1f33ab6f3b30" />


7. Copy and save the token somewhere safe

8. Edit `admin.html`

```js
const HARDCODED_REPO='yourusername/Simple-Nav-Page';
```

9. Open:

```text
your-site-url/admin
```

10. First login:

Enter token + custom short password

11. Save changes to GitHub after editing,Once the changes take effect, you can press Ctrl+F5 to force-refresh the navigation page to view the updated content.

<img width="1194" height="604" alt="image" src="https://github.com/user-attachments/assets/024e3353-91a7-4b70-8c24-cb3c534966cd" />


---

#### ⚙️ How it works

The token acts as a key with read/write permissions for your repository, allowing visual editing outside GitHub.

---

### 6️⃣ Deploy

* GitHub Pages
* Cloudflare Pages

---

### 7️⃣ Done 🎉

---

## 📸 Examples: Mobile View / Dark Mode

<img width="400" height="832" alt="王五导航 (17 07 2026 10_27) (1)" src="https://github.com/user-attachments/assets/94223f6d-a0b1-4453-ab50-cfce3f337edb" />

## 📄 License

Released under the MIT License.

Free to use and modify.
