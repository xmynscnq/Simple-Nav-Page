/* ===========================
   王五导航 · main.js
   =========================== */

const FAVICON_API = 'https://icons.duckduckgo.com/ip3/';
const BG_API      = 'https://bing.img.run/rand.php?t=';
const LINKS_FILE  = 'links.json';

const DEFAULT_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0yIDEyaDIwIj48L3BhdGg+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ij48L3BhdGg+PC9zdmc+';

/* ── 搜索分类数据 ── */
const SEARCH_CATEGORIES = [
  {
    id: 'engine',
    label: '引擎',
    icon: '🔍',
    engines: [
      { name: '百度',   icon: '🔵', url: 'https://www.baidu.com/s?wd=',           domain: 'baidu.com' },
      { name: 'Google', icon: '🌐', url: 'https://www.google.com/search?q=',      domain: 'google.com' },
      { name: 'Brave',  icon: '🦁', url: 'https://search.brave.com/search?q=',    domain: 'search.brave.com' },
      { name: '搜狗',   icon: '🐶', url: 'https://www.sogou.com/web?query=',      domain: 'sogou.com' },
      { name: 'Bing',   icon: '🔷', url: 'https://www.bing.com/search?q=',        domain: 'bing.com' },
      { name: '360',    icon: '🟢', url: 'https://www.so.com/s?q=',               domain: 'so.com' },
      { name: '夸克',   icon: '⚡', url: 'https://www.quark.cn/s?q=',             domain: 'quark.cn' },
    ]
  },
  {
    id: 'community',
    label: '社区',
    icon: '💬',
    engines: [
      { name: 'GitHub',  icon: '🐱', url: 'https://github.com/search?q=',                 domain: 'github.com' },
      { name: '微博',    icon: '🌊', url: 'https://s.weibo.com/weibo?q=',                  domain: 'weibo.com' },
      { name: '知乎',    icon: '🔵', url: 'https://www.zhihu.com/search?q=',               domain: 'zhihu.com' },
      { name: '豆瓣',    icon: '🟢', url: 'https://www.douban.com/search?q=',              domain: 'douban.com' },
      { name: '贴吧',    icon: '🟠', url: 'https://tieba.baidu.com/f/search/res?qw=',      domain: 'tieba.baidu.com' },
      { name: 'Reddit',  icon: '🔴', url: 'https://www.reddit.com/search/?q=',             domain: 'reddit.com' },
    ]
  },
  {
    id: 'video',
    label: '视频',
    icon: '🎬',
    engines: [
      { name: 'B站',   icon: '📺', url: 'https://search.bilibili.com/all?keyword=', domain: 'bilibili.com' },
      { name: '腾讯',  icon: '🐧', url: 'https://v.qq.com/search.html#stag=0&s=',  domain: 'v.qq.com' },
      { name: '爱奇艺', icon: '🟢', url: 'https://so.iqiyi.com/so/q_',              domain: 'iqiyi.com' },
      { name: '优酷',  icon: '🔵', url: 'https://so.youku.com/search_video/q_',    domain: 'youku.com' },
      { name: '芒果',  icon: '🟡', url: 'https://so.mgtv.com/so/k-',               domain: 'mgtv.com' },
    ]
  },
  {
    id: 'music',
    label: '音乐',
    icon: '🎵',
    engines: [
      { name: 'QQ音乐', icon: '🟢', url: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w=', domain: 'y.qq.com' },
      { name: '网易云', icon: '🔴', url: 'https://music.163.com/#/search/m/?s=',                                                    domain: 'music.163.com' },
    ]
  },
  {
    id: 'life',
    label: '生活',
    icon: '🛒',
    engines: [
      { name: '淘宝',  icon: '🟠', url: 'https://s.taobao.com/search?q=',                    domain: 'taobao.com' },
      { name: '京东',  icon: '🔴', url: 'https://search.jd.com/Search?keyword=',             domain: 'jd.com' },
      { name: '拼多多', icon: '🟣', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=', domain: 'pinduoduo.com' },
      { name: '做菜',  icon: '🍳', url: 'https://www.xiachufang.com/search/?keyword=',        domain: 'xiachufang.com' },
      { name: '翻译',  icon: '🌐', url: 'https://fanyi.baidu.com/#zh/en/',                   domain: 'fanyi.baidu.com' },
    ]
  },
  {
    id: 'job',
    label: '求职',
    icon: '💼',
    engines: [
      { name: '智联招聘', icon: '🔵', url: 'https://sou.zhaopin.com/?jl=530&kw=',          domain: 'zhaopin.com' },
      { name: 'BOSS直聘', icon: '🟡', url: 'https://www.zhipin.com/web/geek/job?query=',   domain: 'zhipin.com' },
      { name: '猎聘',     icon: '🟠', url: 'https://www.liepin.com/zhaopin/?key=',         domain: 'liepin.com' },
      { name: '前程无忧', icon: '🔴', url: 'https://search.51job.com/list/000000,000000,0000,00,9,99,',  domain: '51job.com' },
      { name: '拉勾网',   icon: '🟢', url: 'https://www.lagou.com/wn/jobs?kd=',            domain: 'lagou.com' },
    ]
  },
];

/* 当前选中的分类和引擎 */
let currentCategoryId = 'engine';
let currentEngine     = SEARCH_CATEGORIES[0].engines[0];

/* ── 工具：获取域名 ── */
function getDomain(url) {
  try { return new URL(url).hostname; } catch { return null; }
}

/* ── 工具：Favicon ── */
function faviconSrc(url) {
  const d = getDomain(url);
  return d ? `${FAVICON_API}${d}.ico` : DEFAULT_ICON;
}

function engineFavicon(engine) {
  const d = getDomain(engine.domain) || engine.domain;
  return `${FAVICON_API}${d}.ico`;
}

/* ── 渲染搜索分类 Tab ── */
function renderSearchTabs() {
  const tabsEl = document.getElementById('searchTabs');
  tabsEl.innerHTML = '';
  SEARCH_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'search-tab' + (cat.id === currentCategoryId ? ' active' : '');
    btn.innerHTML = `<span class="tab-icon">${cat.icon}</span><span class="tab-label">${cat.label}</span>`;
    btn.onclick = () => selectCategory(cat.id);
    tabsEl.appendChild(btn);
  });
}

/* ── 渲染引擎按钮列表 ── */
function renderEngineList() {
  const listEl = document.getElementById('engineList');
  listEl.innerHTML = '';
  const cat = SEARCH_CATEGORIES.find(c => c.id === currentCategoryId);
  if (!cat) return;

  cat.engines.forEach(engine => {
    const btn = document.createElement('button');
    btn.className = 'engine-btn' + (engine === currentEngine ? ' active' : '');

    const img = document.createElement('img');
    img.src = engineFavicon(engine);
    img.onerror = function () {
  const d = engine.domain;

  if (d && !this.dataset.fallbackTried) {
    this.dataset.fallbackTried = '1';
    this.src = `https://${d}/favicon.ico`;
  } else {
    this.src = DEFAULT_ICON;
    this.onerror = null;
  }
};
    img.alt = engine.name;

    const label = document.createElement('span');
    label.textContent = engine.name;

    btn.appendChild(img);
    btn.appendChild(label);
    btn.onclick = () => selectEngine(engine);
    listEl.appendChild(btn);
  });
}

/* ── 更新搜索框显示的引擎 ── */
function updateSearchBoxEngine() {
  const icon = document.getElementById('search-engine-icon');
  const nameEl = document.getElementById('engineName');
  icon.src = engineFavicon(currentEngine);
  icon.onerror = () => { icon.src = DEFAULT_ICON; icon.onerror = null; };
  nameEl.textContent = currentEngine.name;
}

/* ── 切换分类 ── */
function selectCategory(catId) {
  currentCategoryId = catId;
  const cat = SEARCH_CATEGORIES.find(c => c.id === catId);
  // 自动选中该分类第一个引擎
  currentEngine = cat.engines[0];
  renderSearchTabs();
  renderEngineList();
  updateSearchBoxEngine();
}

/* ── 切换引擎 ── */
function selectEngine(engine) {
  currentEngine = engine;
  renderEngineList();
  updateSearchBoxEngine();
  // 聚焦搜索框
  document.getElementById('searchInput').focus();
}

/* ── 执行搜索 ── */
function doSearch() {
  const kw = document.getElementById('searchInput').value.trim();
  if (kw) window.open(currentEngine.url + encodeURIComponent(kw), '_blank');
}
window.doSearch = doSearch;

/* ── 站内筛选 ── */
function filterLinks() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  document.querySelectorAll('.card').forEach(card => {
    if (!query) {
      card.classList.remove('hidden');
    } else {
      const title    = card.querySelector('.title')?.innerText.toLowerCase() ?? '';
      const datadesc = (card.dataset.desc ?? '').toLowerCase();
      card.classList.toggle('hidden', !title.includes(query) && !datadesc.includes(query));
    }
  });

  document.querySelectorAll('.section').forEach(section => {
    if (!query) {
      section.classList.remove('section-hidden');
    } else {
      const visible = section.querySelectorAll('.card:not(.hidden)');
      section.classList.toggle('section-hidden', visible.length === 0);
    }
  });
}
window.filterLinks = filterLinks;

/* ── 动态渲染卡片 ── */
function renderCards(sections) {
  const main = document.getElementById('main-content');
  main.innerHTML = '';

  sections.forEach(({ section, items }) => {
    const sec = document.createElement('div');
    sec.className = 'section';

    const h2 = document.createElement('h2');
    h2.className = 'section-title';
    h2.textContent = section;
    sec.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'link-container';

    items.forEach(item => {
      const a = document.createElement('a');
      a.href      = item.url;
      a.target    = '_blank';
      a.className = 'card';
      a.dataset.desc = item['data-desc'] ?? item.desc ?? '';
      a.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.className = 'favicon';
      img.loading   = 'lazy';
      img.src       = faviconSrc(item.url);
      img.onerror = function () {
  const domain = getDomain(item.url);

  if (domain && !this.dataset.fallbackTried) {
    this.dataset.fallbackTried = '1';
    this.src = `https://${domain}/favicon.ico`; // 第二层
  } else {
    this.src = DEFAULT_ICON; // 最终兜底
    this.onerror = null;
  }
};

      const top = document.createElement('div');
      top.className = 'card-top';
      const titleEl = document.createElement('span');
      titleEl.className = 'title';
      titleEl.textContent = item.title;
      top.appendChild(img);
      top.appendChild(titleEl);

      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = item.desc ?? '';

      const popup = document.createElement('div');
      popup.className = 'info-popup';
      popup.textContent = getDomain(item.url) ?? item.url;

      a.appendChild(top);
      a.appendChild(desc);
      a.appendChild(popup);
      grid.appendChild(a);
    });

    sec.appendChild(grid);
    main.appendChild(sec);
  });

  bindTouchTooltip();
}

/* ── 移动端长按 Tooltip ── */
function bindTouchTooltip() {
  if (window.matchMedia('(hover: none)').matches) {
    let timer = null;
    let activeCard = null;

    function clearActive() {
      if (activeCard) { activeCard.classList.remove('touch-active'); activeCard = null; }
      clearTimeout(timer); timer = null;
    }

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('touchstart', () => {
        clearActive();
        timer = setTimeout(() => {
          card.classList.add('touch-active');
          activeCard = card;
          setTimeout(clearActive, 2000);
        }, 500);
      }, { passive: true });

      card.addEventListener('touchend', () => { if (timer) clearTimeout(timer); });
      card.addEventListener('touchmove', () => { clearTimeout(timer); timer = null; }, { passive: true });
    });

    document.addEventListener('touchstart', e => {
      if (activeCard && !activeCard.contains(e.target)) clearActive();
    }, { passive: true });
  }
}

/* ── 随机背景 ── */
function changeBackground() {
  const url = `${BG_API}${Date.now()}`;
  document.getElementById('bgLayer').style.backgroundImage = `url('${url}')`;
}

/* ── 入口 ── */
document.addEventListener('DOMContentLoaded', async () => {
  changeBackground();

  // 初始化搜索分类
  renderSearchTabs();
  renderEngineList();
  updateSearchBoxEngine();

  // 键盘回车搜索
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });

  // 加载并渲染链接
  try {
    const res  = await fetch(LINKS_FILE);
    const data = await res.json();
    renderCards(data);
  } catch (err) {
    console.error('加载 links.json 失败：', err);
    document.getElementById('main-content').innerHTML =
      '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;">链接数据加载失败，请检查 links.json 文件。</p>';
  }
});
