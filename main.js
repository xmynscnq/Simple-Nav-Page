/* ===========================
   王五导航 · main.js
   =========================== */

const FAVICON_API = 'https://www.google.com/s2/favicons?sz=64&domain=';
const BG_API      = 'https://bing.img.run/rand.php?t=';
const LINKS_FILE  = 'links.json';

const DEFAULT_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0yIDEyaDIwIj48L3BhdGg+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ij48L3BhdGg+PC9zdmc+';

/* ── 工具：获取域名 ── */
function getDomain(url) {
  try { return new URL(url).hostname; } catch { return null; }
}

/* ── 工具：Favicon ── */
function faviconSrc(url) {
  const d = getDomain(url);
  return d ? `${FAVICON_API}${d}` : DEFAULT_ICON;
}

/* ── 更新搜索引擎图标 ── */
function updateSearchIcon() {
  const sel  = document.getElementById('engine');
  const icon = document.getElementById('search-engine-icon');
  const d    = getDomain(sel.value);
  icon.onerror = () => { icon.src = DEFAULT_ICON; icon.onerror = null; };
  icon.src = d ? `${FAVICON_API}${d}` : DEFAULT_ICON;
}
window.updateSearchIcon = updateSearchIcon;

/* ── 执行搜索 ── */
function doSearch() {
  const engine = document.getElementById('engine').value;
  const kw     = document.getElementById('searchInput').value.trim();
  if (kw) window.open(engine + encodeURIComponent(kw), '_blank');
}
window.doSearch = doSearch;

/* ── 站内筛选 ── */
function filterLinks() {
  const query = document.getElementById('localFilter').value.toLowerCase().trim();

  document.querySelectorAll('.card').forEach(card => {
    if (!query) {
      card.classList.remove('hidden');
    } else {
      const title   = card.querySelector('.title')?.innerText.toLowerCase() ?? '';
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

      // Favicon
      const img = document.createElement('img');
      img.className = 'favicon';
      img.loading   = 'lazy';
      img.src       = faviconSrc(item.url);
      img.onerror   = function () { this.src = DEFAULT_ICON; this.onerror = null; };

      // 标题行
      const top = document.createElement('div');
      top.className = 'card-top';
      const titleEl = document.createElement('span');
      titleEl.className = 'title';
      titleEl.textContent = item.title;
      top.appendChild(img);
      top.appendChild(titleEl);

      // 介绍
      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = item.desc ?? '';

      // Tooltip（显示域名）
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

  /* 为移动端绑定长按显示 tooltip */
  bindTouchTooltip();
}

/* ── 移动端长按 Tooltip ──
   - touchstart 开始计时（500ms）
   - touchend / touchmove 取消
   - 点击卡片正常跳转，不触发 tooltip
   - 长按才显示 tooltip，500ms 后自动消失
*/
function bindTouchTooltip() {
  // 仅在触屏设备执行
  if (window.matchMedia('(hover: none)').matches) {
    let timer = null;
    let activeCard = null;

    function clearActive() {
      if (activeCard) {
        activeCard.classList.remove('touch-active');
        activeCard = null;
      }
      clearTimeout(timer);
      timer = null;
    }

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('touchstart', e => {
        clearActive();
        timer = setTimeout(() => {
          // 长按：阻止跳转，显示 tooltip
          card.classList.add('touch-active');
          activeCard = card;
          // 2s 后自动消失
          setTimeout(clearActive, 2000);
        }, 500);
      }, { passive: true });

      card.addEventListener('touchend', () => {
        // 短按（< 500ms）正常跳转，clearTimeout 阻止 tooltip 显示
        if (timer) clearTimeout(timer);
        // 注意：不 clearActive，让已弹出的 tooltip 保持到 2s
      });

      card.addEventListener('touchmove', () => {
        clearTimeout(timer);
        timer = null;
      }, { passive: true });
    });

    // 点击页面其他区域关闭 tooltip
    document.addEventListener('touchstart', e => {
      if (activeCard && !activeCard.contains(e.target)) {
        clearActive();
      }
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
  // 背景
  changeBackground();

  // 搜索引擎图标
  updateSearchIcon();

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
