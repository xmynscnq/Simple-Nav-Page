// ── 图标 & 背景 配置 ────────────────────────────────────────
const FAVICON_PROVIDER = 'google';
const PROXY = '';

function withProxy(originUrl) {
  if (!PROXY) return originUrl;
  return PROXY + '/' + originUrl.replace(/^https?:\/\//, '');
}

function buildFaviconUrl(domain) {
  if (!domain) return DEFAULT_ICON;
  if (FAVICON_PROVIDER === 'google')
    return withProxy(`https://www.google.com/s2/favicons?sz=64&domain=${domain}`);
  if (FAVICON_PROVIDER === 'duckduckgo')
    return withProxy(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
  return DEFAULT_ICON;
}

// ── 内外网切换 ────────────────────────────────────────────────
let isIntranet = localStorage.getItem('netMode') === 'intranet';
let _linksData = null;

function getCardUrl(item) {
  return (isIntranet && item.intranet) ? item.intranet : item.url;
}

function toggleNetMode() {
  isIntranet = !isIntranet;
  localStorage.setItem('netMode', isIntranet ? 'intranet' : 'internet');
  updateNetToggleBtn();
  document.querySelectorAll('.card[data-url][data-intranet]').forEach(a => {
    const url = isIntranet ? a.dataset.intranet : a.dataset.url;
    a.href = url;
    const popup = a.querySelector('.info-popup');
    if (popup) popup.textContent = getDomain(url) ?? url;
    const badge = a.querySelector('.net-badge');
    if (badge) badge.textContent = isIntranet ? '内' : '外';
  });
}
window.toggleNetMode = toggleNetMode;

/* ── 回到顶部 ── */
function injectBackTopBtn() {
  if (document.getElementById('backTopBtn')) return;
  const btn = document.createElement('button');
  btn.id        = 'backTopBtn';
  btn.className = 'back-top-btn';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', '回到顶部');
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
}

function updateNetToggleBtn() {
  const btn = document.getElementById('netToggleBtn');
  if (!btn) return;
  btn.textContent = isIntranet ? '🏠 内网' : '🌐 外网';
  btn.classList.toggle('intranet-active', isIntranet);
}

function injectNetToggleBtn() {
  if (document.getElementById('netToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id        = 'netToggleBtn';
  btn.className = 'net-toggle-btn';
  btn.addEventListener('click', function () { toggleNetMode(); });
  document.body.appendChild(btn);
}

// ────────────────────────────────────────────────────────────
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const BG_API = isMobile
  ? 'https://imgapi.cn/api.php?zd=mobile&fl=fengjing&gs=images&t='
  : 'https://imgapi.cn/api.php?fl=fengjing&gs=images&t=';
const LINKS_FILE = 'links.json';
const DEFAULT_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0yIDEyaDIwIj48L3BhdGg+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ij48L3BhdGg+PC9zdmc+';

/* ── 搜索分类数据 ── */
const SEARCH_CATEGORIES = [
  {
    id: 'engine', label: '引擎', icon: '🔍',
    engines: [
      { name: '百度',       icon: '🔵', url: 'https://www.baidu.com/s?wd=',           domain: 'baidu.com' },
      { name: 'Google',     icon: '🌐', url: 'https://www.google.com/search?q=',      domain: 'google.com' },
      { name: 'Brave',      icon: '🦁', url: 'https://search.brave.com/search?q=',    domain: 'search.brave.com' },
      { name: '搜狗',       icon: '🐶', url: 'https://www.sogou.com/web?query=',      domain: 'sogou.com' },
      { name: 'Bing',       icon: '🔷', url: 'https://www.bing.com/search?q=',        domain: 'bing.com' },
      { name: 'DuckDuckGo', icon: '🦆', url: 'https://duckduckgo.com/?q=',            domain: 'duckduckgo.com' },
      { name: '360',        icon: '🟢', url: 'https://www.so.com/s?q=',               domain: 'so.com' },
      { name: '夸克',       icon: '⚡', url: 'https://www.quark.cn/s?q=',             domain: 'quark.cn' },
    ]
  },
  {
    id: 'community', label: '社区', icon: '💬',
    engines: [
      { name: 'GitHub', icon: '🐱', url: 'https://github.com/search?q=',             domain: 'github.com' },
      { name: '微博',   icon: '🌊', url: 'https://s.weibo.com/weibo?q=',              domain: 'weibo.com' },
      { name: '知乎',   icon: '🔵', url: 'https://www.zhihu.com/search?q=',           domain: 'zhihu.com' },
      { name: '豆瓣',   icon: '🟢', url: 'https://www.douban.com/search?q=',          domain: 'douban.com' },
      { name: '贴吧',   icon: '🟠', url: 'https://tieba.baidu.com/f/search/res?qw=',  domain: 'tieba.baidu.com' },
      { name: 'Reddit', icon: '🔴', url: 'https://www.reddit.com/search/?q=',         domain: 'reddit.com' },
    ]
  },
  {
    id: 'video', label: '视频', icon: '🎬',
    engines: [
      { name: 'B站',    icon: '📺', url: 'https://search.bilibili.com/all?keyword=', domain: 'bilibili.com' },
      { name: '腾讯',   icon: '🐧', url: 'https://v.qq.com/search.html#stag=0&s=',  domain: 'v.qq.com' },
      { name: '爱奇艺', icon: '🟢', url: 'https://so.iqiyi.com/so/q_',              domain: 'iqiyi.com' },
      { name: '优酷',   icon: '🔵', url: 'https://so.youku.com/search_video/q_',    domain: 'youku.com' },
      { name: '芒果',   icon: '🟡', url: 'https://so.mgtv.com/so/k-',               domain: 'mgtv.com' },
    ]
  },
  {
    id: 'music', label: '音乐', icon: '🎵',
    engines: [
      { name: 'QQ音乐', icon: '🟢', url: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w=', domain: 'y.qq.com' },
      { name: '网易云', icon: '🔴', url: 'https://music.163.com/#/search/m/?s=',                                                    domain: 'music.163.com' },
    ]
  },
  {
    id: 'life', label: '生活', icon: '🛒',
    engines: [
      { name: '淘宝',   icon: '🟠', url: 'https://s.taobao.com/search?q=',                              domain: 'taobao.com' },
      { name: '京东',   icon: '🔴', url: 'https://search.jd.com/Search?keyword=',                       domain: 'jd.com' },
      { name: '拼多多', icon: '🟣', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=',  domain: 'pinduoduo.com' },
      { name: '做菜',   icon: '🍳', url: 'https://www.xiachufang.com/search/?keyword=',                  domain: 'xiachufang.com' },
      { name: '翻译',   icon: '🌐', url: 'https://fanyi.baidu.com/#zh/en/',                             domain: 'fanyi.baidu.com' },
    ]
  },
  {
    id: 'job', label: '求职', icon: '💼',
    engines: [
      { name: '智联招聘', icon: '🔵', url: 'https://sou.zhaopin.com/?jl=530&kw=',                         domain: 'zhaopin.com' },
      { name: 'BOSS直聘', icon: '🟡', url: 'https://www.zhipin.com/web/geek/job?query=',                  domain: 'zhipin.com' },
      { name: '猎聘',     icon: '🟠', url: 'https://www.liepin.com/zhaopin/?key=',                        domain: 'liepin.com' },
      { name: '前程无忧', icon: '🔴', url: 'https://search.51job.com/list/000000,000000,0000,00,9,99,',   domain: '51job.com' },
      { name: '拉勾网',   icon: '🟢', url: 'https://www.lagou.com/wn/jobs?kd=',                           domain: 'lagou.com' },
    ]
  },
];

let currentCategoryId = 'engine';
let currentEngine     = SEARCH_CATEGORIES[0].engines[0];
let enginePanelOpen   = false;

/* ── 工具 ── */
function getDomain(url) {
  try { return new URL(url).host; } catch { return null; }
}
function faviconSrc(url) { return buildFaviconUrl(getDomain(url)); }
function engineFavicon(engine) { return buildFaviconUrl(engine.domain); }

/* ── 渲染分类 Tab ── */
function renderSearchTabs() {
  const tabsEl = document.getElementById('searchTabs');
  tabsEl.innerHTML = '';
  SEARCH_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'search-tab' + (cat.id === currentCategoryId ? ' active' : '');
    btn.innerHTML = `<span class="tab-icon">${cat.icon}</span><span class="tab-label">${cat.label}</span>`;
    btn.onclick = () => {
      selectCategory(cat.id);
      // 切换分类时若面板已开，刷新内容
      if (enginePanelOpen) renderEnginePanel();
    };
    tabsEl.appendChild(btn);
  });
}

/* ── 更新搜索框显示的引擎 ── */
function updateSearchBoxEngine() {
  const icon   = document.getElementById('search-engine-icon');
  const nameEl = document.getElementById('engineName');
  icon.src = engineFavicon(currentEngine);
  icon.onerror = () => { icon.src = DEFAULT_ICON; icon.onerror = null; };
  nameEl.textContent = currentEngine.name;
}

/* ── 切换分类 ── */
function selectCategory(catId) {
  currentCategoryId = catId;
  const cat = SEARCH_CATEGORIES.find(c => c.id === catId);
  currentEngine = cat.engines[0];
  renderSearchTabs();
  updateSearchBoxEngine();
}

/* ── 切换引擎 ── */
function selectEngine(engine) {
  currentEngine = engine;
  updateSearchBoxEngine();
  renderEnginePanel(); // 刷新高亮
  document.getElementById('searchInput').focus();
}

/* ── 渲染内联引擎面板（只显示当前分类） ── */
function renderEnginePanel() {
  const panel = document.getElementById('enginePanel');
  panel.innerHTML = '';
  const cat = SEARCH_CATEGORIES.find(c => c.id === currentCategoryId);
  if (!cat) return;

  cat.engines.forEach(engine => {
    const btn = document.createElement('button');
    btn.className = 'engine-btn' + (engine === currentEngine ? ' active' : '');

    const img = document.createElement('img');
    img.src = engineFavicon(engine);
    img.alt = engine.name;
    img.onerror = function () {
      this.src = DEFAULT_ICON;
      this.onerror = null;
    };

    const label = document.createElement('span');
    label.textContent = engine.name;

    btn.appendChild(img);
    btn.appendChild(label);
    btn.onclick = () => selectEngine(engine);
    panel.appendChild(btn);
  });
}

/* ── 开关内联面板 ── */
function toggleEnginePanel() {
  enginePanelOpen ? closeEnginePanel() : openEnginePanel();
}

function openEnginePanel() {
  enginePanelOpen = true;
  renderEnginePanel();
  const panel = document.getElementById('enginePanel');
  panel.style.display = 'flex';
  document.getElementById('engineArrow').style.transform = 'rotate(180deg)';
}

function closeEnginePanel() {
  enginePanelOpen = false;
  document.getElementById('enginePanel').style.display = 'none';
  document.getElementById('engineArrow').style.transform = '';
}

/* ── 清空搜索框 ── */
function clearSearch() {
  const input   = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  input.value   = '';
  clearBtn.style.display = 'none';
  input.focus();
  filterLinks();
}
window.clearSearch = clearSearch;

/* ── 同步清空按钮显隐 ── */
function syncClearBtn() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  clearBtn.style.display = input.value.length > 0 ? 'flex' : 'none';
}

/* ── 执行搜索 ── */
function doSearch() {
  const kw = document.getElementById('searchInput').value.trim();
  if (kw) window.open(currentEngine.url + encodeURIComponent(kw), '_blank');
}
window.doSearch = doSearch;

/* ── 站内筛选 ── */
function filterLinks(queryOverride) {
  syncClearBtn();
  const query = (queryOverride ?? document.getElementById('searchInput').value).toLowerCase().trim();

  // 1. 更新卡片 hidden 状态
  document.querySelectorAll('.card').forEach(card => {
    if (!query) {
      card.classList.remove('hidden');
    } else {
      const title    = card.querySelector('.title')?.innerText.toLowerCase() ?? '';
const datadesc = (card.dataset.desc ?? '').toLowerCase();
const pinyin   = (card.dataset.pinyin ?? '').toLowerCase();
const py       = (card.dataset.py ?? '').toLowerCase();

card.classList.toggle('hidden',
  !title.includes(query) &&
  !datadesc.includes(query) &&
  !pinyin.includes(query) &&
  !py.includes(query)
);
    }
  });

  // 2. 更新 section 的 section-hidden 状态
  document.querySelectorAll('.section').forEach(section => {
    if (!query) {
      section.classList.remove('section-hidden');
    } else {
      const visible = section.querySelectorAll('.card:not(.hidden)');
      section.classList.toggle('section-hidden', visible.length === 0);
    }
  });

  // 3. 单分类展示主题特殊处理
  if (document.body.classList.contains('theme-tabs')) {
    const tabsRow = document.getElementById('categoryTabsRow');
    if (!window._themeSearchState) {
      window._themeSearchState = { saved: false, preSearchIndex: 0 };
    }
    const state = window._themeSearchState;

    if (query) {
      // ========== 搜索 ==========
      if (!state.saved) {
        state.preSearchIndex = currentCategoryIndex;
        state.saved = true;
      }

      // 临时显示所有 section
      document.querySelectorAll('.section').forEach(sec => sec.classList.remove('cat-hidden'));

      let firstMatch = -1;
      if (tabsRow) {
        const sections = document.querySelectorAll('.section');
        const tabs = tabsRow.querySelectorAll('.category-tab-item');
        tabs.forEach((tab, index) => {
          const sec = sections[index];
          if (!sec) {
            tab.style.display = 'none';
            return;
          }
          const hasMatch = sec.querySelector('.card:not(.hidden)');
          tab.style.display = hasMatch ? '' : 'none';
          if (hasMatch && firstMatch === -1) firstMatch = index;
        });
        tabsRow.style.display = '';
        updateTabsRowAlignment();
      }

      if (firstMatch === -1) {
        if (tabsRow) tabsRow.style.display = 'none';
        document.querySelectorAll('.section').forEach(sec => sec.classList.add('cat-hidden'));
      } else {
        // 保存当前滚动位置（搜索前）
        const savedScrollLeft = tabsRow ? tabsRow.scrollLeft : 0;
        currentCategoryIndex = firstMatch;
        syncActiveTab(firstMatch);
        applyCategoryFilter();                     // 会移动标签行，重置 scrollLeft
        const activeTab = categoryTabsRowEl
  ? categoryTabsRowEl.querySelector('.category-tab-item.active')
  : null;

if (activeTab) {
  activeTab.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'start'
  });
}
      }
    } else {
  if (state.saved) {
    const restoreIndex = state.preSearchIndex;
    state.saved = false;

    // 恢复所有标签可见
    if (tabsRow) {
      tabsRow.style.display = '';
      tabsRow.querySelectorAll('.category-tab-item').forEach(tab => tab.style.display = '');
    }

    // 更新激活状态到原始分类
    currentCategoryIndex = restoreIndex;
    syncActiveTab(restoreIndex);

    // 应用分类过滤（会移动标签行，可能重置 scrollLeft）
    applyCategoryFilter();

    // ✅ 关键：让激活的标签滚动到居中可见位置（替代之前无效的 scrollLeft 恢复）
    const activeTab = categoryTabsRowEl ? categoryTabsRowEl.querySelector('.category-tab-item.active') : null;
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
    }
  } else {
    // 兜底：从未保存过状态
    if (tabsRow) {
      tabsRow.style.display = '';
      tabsRow.querySelectorAll('.category-tab-item').forEach(tab => tab.style.display = '');
    }
    applyCategoryFilter();
  }
}
  }
}
window.filterLinks = filterLinks;

/**
 * 兼容不同 pinyin-pro 版本的拼音转换
 * @param {string} text - 待转换的文本
 * @param {object} options - 配置项
 * @returns {string} 拼音字符串（无声调，空格已去除）
 */
function safePinyin(text, options = {}) {
  if (!text) return '';
  const lib = window.pinyinPro;
  if (!lib) return text; // 没有库，返回原文本

  let fn = null;
  if (typeof lib === 'function') {
    fn = lib;
  } else if (typeof lib === 'object') {
    // 优先尝试常见的导出属性
    fn = lib.pinyin || lib.default || lib;
  }
  if (typeof fn === 'function') {
    try {
      return fn(text, options).replace(/\s+/g, '');
    } catch (e) {
      console.warn('pinyinPro 调用失败：', e);
    }
  }
  return text; // 降级：返回原文本
}

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
      a.href         = getCardUrl(item);
      a.target       = '_blank';
      a.className    = 'card';
      a.dataset.desc = item['data-desc'] ?? item.desc ?? '';
     // ===== 生成拼音搜索字段（兼容不同 pinyin-pro 版本） =====
const rawText = item.title.replace(/\s+/g, '');
const fullPinyin = safePinyin(rawText, { toneType: 'none' });
const shortPinyin = safePinyin(rawText, { pattern: 'first', toneType: 'none' });
a.dataset.pinyin = fullPinyin;
a.dataset.py     = shortPinyin;
// ===================================================
      a.rel          = 'noopener noreferrer';
      if (item.intranet) {
        a.dataset.url      = item.url;
        a.dataset.intranet = item.intranet;
      }

      const img = document.createElement('img');
      img.className = 'favicon';
      img.loading   = 'lazy';
      img.src = item.icon ? item.icon : faviconSrc(item.url);
      img.onerror   = function () {
        const domain = getDomain(item.url);
        if (domain && !this.dataset.fallbackTried) {
          this.dataset.fallbackTried = '1';
          this.src = `https://${domain}/favicon.ico`;
        } else {
          this.src = DEFAULT_ICON;
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
      popup.textContent = getDomain(getCardUrl(item)) ?? getCardUrl(item);

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

      card.addEventListener('touchend',  () => { if (timer) clearTimeout(timer); });
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

/* ===========================
   单分类展示主题（点击页面大标题切换主题；
   在该主题下，点击分区标题在各分类间循环切换，
   页面内始终只显示一个分类）
   =========================== */
let layoutTheme = localStorage.getItem('layoutTheme') === 'tabs' ? 'tabs' : 'classic';

/* 单分类展示主题：始终从第一个（常用）分类开始，不做记忆 */
let currentCategoryIndex = 0;

/* 共享的分类标签行元素（会被挪到当前显示的那张卡片里） */
let categoryTabsRowEl = null;

/* 只切 body class，页面刚加载、数据还没到时就可以先应用 */
function setLayoutThemeClass() {
  document.body.classList.toggle('theme-tabs', layoutTheme === 'tabs');
}

/* 把分类标签行挪到当前显示的那个分区卡片最上面（在卡片自带标题之前） */
function placeTabsRowInActiveSection() {
  if (!categoryTabsRowEl) return;
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;
  const activeSection = sections[currentCategoryIndex] || sections[0];
  if (activeSection.firstChild !== categoryTabsRowEl) {
    const savedScrollLeft = categoryTabsRowEl.scrollLeft;   // 保存
    activeSection.insertBefore(categoryTabsRowEl, activeSection.firstChild);
    categoryTabsRowEl.scrollLeft = savedScrollLeft;         // 恢复
    updateTabsRowAlignment();
  }
}

/* 内容装得下就居中，装不下（需要横向滚动）就靠左，避免居中导致滑不到最左侧 */
function updateTabsRowAlignment() {
  if (!categoryTabsRowEl) return;
  const overflowing = categoryTabsRowEl.scrollWidth > categoryTabsRowEl.clientWidth + 1;
  categoryTabsRowEl.classList.toggle('is-overflowing', overflowing);
}

/* 根据 currentCategoryIndex，只显示对应的一个 .section，其余隐藏 */
function applyCategoryFilter() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;
  if (currentCategoryIndex >= sections.length) currentCategoryIndex = 0;
  sections.forEach((sec, i) => {
    sec.classList.toggle('cat-hidden', i !== currentCategoryIndex);
  });
  placeTabsRowInActiveSection();
}

/* 渲染一整排分类标签（绿色竖杠+文字风格），初始放入当前分类对应的卡片里 */
function renderCategoryTabsRow(sectionsData) {
  const old = document.getElementById('categoryTabsRow');
  if (old) old.remove();

  const row = document.createElement('div');
  row.className = 'category-tabs-row';
  row.id = 'categoryTabsRow';

  sectionsData.forEach(({ section }, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-tab-item';
    btn.textContent = section;
    btn.addEventListener('click', () => selectCategoryIndex(i));
    row.appendChild(btn);
  });

  categoryTabsRowEl = row;
  placeTabsRowInActiveSection();
  syncActiveTab(currentCategoryIndex);  // 初始激活
}

// PC端鼠标拖动分类栏
function enableCategoryMouseDrag() {
  if (!categoryTabsRowEl) return;

  let pressed = false;
  let startX = 0;
  let startScrollLeft = 0;

  categoryTabsRowEl.addEventListener('mousedown', function(e) {
    pressed = true;

    categoryTabsRowEl.style.cursor = 'grabbing';

    startX = e.pageX;
    startScrollLeft = categoryTabsRowEl.scrollLeft;
  });


  document.addEventListener('mouseup', function() {
    pressed = false;

    if (categoryTabsRowEl) {
      categoryTabsRowEl.style.cursor = 'grab';
    }
  });


  categoryTabsRowEl.addEventListener('mouseleave', function() {
    pressed = false;

    categoryTabsRowEl.style.cursor = 'grab';
  });


  document.addEventListener('mousemove', function(e) {

    if (!pressed) return;

    e.preventDefault();

    const moveX = e.pageX - startX;

    categoryTabsRowEl.scrollLeft =
      startScrollLeft - moveX;
  });
}

/* 点击某个分类标签：直接跳到该分类，竖杠随之出现在它前面 */
/* 点击某个分类标签：直接跳到该分类，竖杠随之出现在它前面 */
function selectCategoryIndex(i) {
  currentCategoryIndex = i;
  const savedScrollLeft = categoryTabsRowEl ? categoryTabsRowEl.scrollLeft : 0;
  syncActiveTab(i);  // 使用统一函数
  applyCategoryFilter();
  if (categoryTabsRowEl) categoryTabsRowEl.scrollLeft = savedScrollLeft;
}

/**
 * 统一设置分类标签的激活状态
 * @param {number} activeIndex - 要激活的标签索引
 */
function syncActiveTab(activeIndex) {
  if (!categoryTabsRowEl) return;
  const tabs = categoryTabsRowEl.querySelectorAll('.category-tab-item');
  tabs.forEach((tab, idx) => {
    const isActive = (idx === activeIndex);
    tab.classList.toggle('active', isActive);
    tab.dataset.active = isActive ? 'true' : 'false';
  });
}

/* 数据渲染完成后，根据当前主题决定分区的显隐状态 */
function applyLayoutTheme() {
  setLayoutThemeClass();
  if (layoutTheme === 'tabs') {
    applyCategoryFilter();
  } else {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('cat-hidden'));
  }
}

/* 点击页面大标题：在"经典主题"与"单分类展示主题"之间切换 */
function toggleLayoutTheme() {
  layoutTheme = layoutTheme === 'classic' ? 'tabs' : 'classic';
  localStorage.setItem('layoutTheme', layoutTheme);
  if (layoutTheme === 'tabs') {
    currentCategoryIndex = 0;
    syncActiveTab(0);  // 使用统一函数
  }
  applyLayoutTheme();
}

/* ── 入口 ── */
document.addEventListener('DOMContentLoaded', async () => {
  changeBackground();

  // 尽早应用一次布局主题的 body class（不依赖数据）
  setLayoutThemeClass();

  renderSearchTabs();
  updateSearchBoxEngine();

  injectNetToggleBtn();
  updateNetToggleBtn();
  injectBackTopBtn();
  // ── 白天 / 夜间模式 ────────────────────────────────────────
const themeBtn = document.getElementById('themeToggleBtn');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'night') {
  document.body.classList.add('night-mode');
  themeBtn.textContent = '🌙';
}

themeBtn.addEventListener('click', () => {
  const isNight = document.body.classList.toggle('night-mode');
  themeBtn.textContent = isNight ? '🌙' : '☀️';
  localStorage.setItem('theme', isNight ? 'night' : 'day');
});

  // 点击标题切换"横向分类"新主题
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.addEventListener('click', toggleLayoutTheme);
  }

  // 引擎触发器点击
  document.getElementById('engineTrigger').addEventListener('click', () => {
    toggleEnginePanel();
  });

  // 窗口尺寸变化（比如手机横竖屏切换）时，重新判断分类标签行要不要居中
  window.addEventListener('resize', updateTabsRowAlignment);

            // ── 搜索框输入过滤（兼容所有输入法） ──
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    filterLinks();
  });
  
  // 搜索框键盘事件
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') closeEnginePanel();
  });

  try {
    const res  = await fetch(LINKS_FILE);
    const data = await res.json();
    _linksData = data;
    renderCards(data);
    renderCategoryTabsRow(data);
    enableCategoryMouseDrag();
    applyLayoutTheme();
  } catch (err) {
    console.error('加载 links.json 失败：', err);
    document.getElementById('main-content').innerHTML =
      '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;">链接数据加载失败，请检查 links.json 文件。</p>';
  }
});
