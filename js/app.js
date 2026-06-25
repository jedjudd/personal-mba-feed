// ── APP STATE ─────────────────────────────────────────────────────────────────
const App = {
  activeTab: 'feed',
  feedPage: 1,
  feedPosts: [],
  allLoaded: false,
  loading: false,
  pillarFilter: null,
  darkMode: true,

  async init() {
    this.darkMode = localStorage.getItem('mba_dark') !== 'false';
    document.documentElement.classList.toggle('light', !this.darkMode);

    updateStreak();
    this.renderNav();
    this.renderHeader();
    await this.loadTab('feed');
    this.setupIntersectionObserver();
    this.setupFilterBar();
    this.setupCommentModal();
    registerSW();
  },

  renderHeader() {
    const p = Progress.get();
    const lvl = getLevelInfo(p.xp);
    document.getElementById('streak-count').textContent = p.streak || 0;
    document.getElementById('xp-level').textContent = `Lv.${lvl.level}`;
    document.getElementById('xp-bar').style.width = lvl.pct + '%';
  },

  renderNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === this.activeTab);
    });
  },

  async loadTab(tab) {
    this.activeTab = tab;
    this.renderNav();
    const sections = ['feed-section', 'dashboard-section', 'bookmarks-section', 'profile-section'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', id !== tab + '-section');
    });

    if (tab === 'feed' && this.feedPosts.length === 0) {
      await this.loadMoreFeed();
    } else if (tab === 'dashboard') {
      renderDashboard();
    } else if (tab === 'bookmarks') {
      await this.loadBookmarks();
    } else if (tab === 'profile') {
      this.renderProfile();
    }
  },

  async loadMoreFeed() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.showSkeleton();

    const data = await fetchFeed(this.feedPage, this.pillarFilter);
    this.hideSkeleton();

    if (data?.posts?.length) {
      data.posts.forEach(post => {
        this.feedPosts.push(post);
        const el = document.createElement('div');
        el.innerHTML = renderCard(post);
        document.getElementById('feed-list').appendChild(el.firstElementChild);
      });
      this.feedPage++;
      if (this.feedPosts.length >= (data.total || 9999)) this.allLoaded = true;
    } else {
      this.allLoaded = true;
      if (this.feedPosts.length === 0) {
        document.getElementById('feed-list').innerHTML = '<p class="empty-msg">No posts yet. Add content in the Admin panel.</p>';
      }
    }
    this.loading = false;
  },

  async loadBookmarks() {
    const { posts } = await fetchBookmarks();
    const el = document.getElementById('bookmarks-list');
    if (!posts.length) {
      el.innerHTML = '<p class="empty-msg">No bookmarks yet. Tap 🔖 on any card.</p>';
      return;
    }
    el.innerHTML = '';
    posts.forEach(post => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = renderCard(post);
      el.appendChild(wrapper.firstElementChild);
    });
  },

  renderProfile() {
    const p = Progress.get();
    const lvl = getLevelInfo(p.xp);
    const el = document.getElementById('profile-content');
    const badges = BADGE_DEFS.filter(b => p.badgesEarned.includes(b.id));
    const locked = BADGE_DEFS.filter(b => !p.badgesEarned.includes(b.id));

    el.innerHTML = `
      <div class="profile-hero">
        <div class="profile-avatar">📚</div>
        <div class="profile-name">Personal MBA</div>
        <div class="profile-level">${lvl.title} · Level ${lvl.level}</div>
        <div class="profile-xp-bar-wrap">
          <div class="profile-xp-bar" style="width:${lvl.pct}%"></div>
        </div>
        <div class="profile-xp-label">${p.xp} / ${lvl.nextXp} XP</div>
      </div>
      <div class="profile-stats">
        <div class="pstat"><div class="pstat-n">${p.streak || 0}</div><div class="pstat-l">Day Streak</div></div>
        <div class="pstat"><div class="pstat-n">${p.postsRead || 0}</div><div class="pstat-l">Posts Read</div></div>
        <div class="pstat"><div class="pstat-n">${p.quizzesCompleted || 0}</div><div class="pstat-l">Quizzes</div></div>
        <div class="pstat"><div class="pstat-n">${p.likeCount || 0}</div><div class="pstat-l">Likes</div></div>
      </div>
      <div class="section-head">Badges Earned (${badges.length})</div>
      <div class="badge-shelf">
        ${badges.length ? badges.map(b => `
          <div class="badge-item earned" title="${b.desc}">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
          </div>`).join('') : '<p class="empty-msg">Keep learning to earn badges!</p>'}
      </div>
      <div class="section-head">Locked Badges (${locked.length})</div>
      <div class="badge-shelf">
        ${locked.slice(0, 8).map(b => `
          <div class="badge-item locked" title="${b.desc}">
            <div class="badge-icon">🔒</div>
            <div class="badge-name">${b.name}</div>
          </div>`).join('')}
      </div>
      <div class="section-head">Settings</div>
      <div class="settings-list">
        <label class="setting-row">
          <span>Dark Mode</span>
          <input type="checkbox" class="toggle" ${App.darkMode ? 'checked' : ''} onchange="toggleDark(this)">
        </label>
        <div class="setting-row setting-row--col">
          <div class="setting-row-label">
            <span>Apps Script URL</span>
            <span class="setting-hint" id="api-url-status">${localStorage.getItem('mba_api_url') ? '✓ Connected' : 'Not set — using local data'}</span>
          </div>
          <div class="api-url-row">
            <input type="url" id="api-url-input" class="api-url-input"
              placeholder="https://script.google.com/macros/s/…/exec"
              value="${localStorage.getItem('mba_api_url') || ''}">
            <button class="api-url-save" onclick="saveApiUrl()">Save</button>
          </div>
        </div>
        <button class="setting-row setting-btn" onclick="location.href='admin/'">Admin Panel</button>
        <button class="setting-row setting-btn danger" onclick="resetProgress()">Reset Progress</button>
      </div>`;
  },

  setupIntersectionObserver() {
    const sentinel = document.getElementById('feed-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && this.activeTab === 'feed') this.loadMoreFeed();
    }, { rootMargin: '200px' });
    obs.observe(sentinel);
  },

  setupFilterBar() {
    const bar = document.getElementById('pillar-filter');
    if (!bar) return;
    bar.innerHTML = `<button class="filter-btn active" data-pillar="">All</button>` +
      PILLAR_NAMES.map(n => `<button class="filter-btn" data-pillar="${n}" style="--c:${PILLARS[n].color}">${n}</button>`).join('');
    bar.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.pillarFilter = btn.dataset.pillar || null;
      this.resetFeed();
    });
  },

  resetFeed() {
    this.feedPage = 1;
    this.feedPosts = [];
    this.allLoaded = false;
    document.getElementById('feed-list').innerHTML = '';
    this.loadMoreFeed();
  },

  setupCommentModal() {
    const modal = document.getElementById('comment-modal');
    if (!modal) return;
    document.getElementById('comment-close').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('comment-submit').addEventListener('click', () => {
      const input = document.getElementById('comment-input');
      const postId = modal.dataset.postId;
      if (input.value.trim() && postId) {
        addComment(postId, input.value.trim());
        input.value = '';
        modal.classList.add('hidden');
        showToast('+5 XP — Comment saved!');
        App.renderHeader();
      }
    });
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  },

  showSkeleton() {
    const sk = document.getElementById('feed-skeleton');
    if (sk) sk.classList.remove('hidden');
  },

  hideSkeleton() {
    const sk = document.getElementById('feed-skeleton');
    if (sk) sk.classList.add('hidden');
  },
};

// ── GLOBALS ───────────────────────────────────────────────────────────────────
function switchTab(tab) { App.loadTab(tab); }

function toggleDark(cb) {
  App.darkMode = cb.checked;
  localStorage.setItem('mba_dark', cb.checked);
  document.documentElement.classList.toggle('light', !cb.checked);
}

function openCommentModal(postId) {
  const modal = document.getElementById('comment-modal');
  const p = Progress.get();
  const existing = (p.comments?.[postId] || []).map(c => `<div class="existing-comment">${c.text}</div>`).join('');
  document.getElementById('existing-comments').innerHTML = existing || '<p class="empty-msg">No comments yet.</p>';
  modal.dataset.postId = postId;
  modal.classList.remove('hidden');
  document.getElementById('comment-input').focus();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function showBadgeToast(badge) {
  showToast(`${badge.icon} Badge Unlocked: ${badge.name}!`);
  App.renderHeader();
}

function saveApiUrl() {
  const input = document.getElementById('api-url-input');
  const url = input?.value.trim() || '';
  if (url && !url.startsWith('https://script.google.com/macros/s/')) {
    showToast('URL should start with https://script.google.com/macros/s/');
    return;
  }
  localStorage.setItem('mba_api_url', url);
  const status = document.getElementById('api-url-status');
  if (status) status.textContent = url ? '✓ Connected' : 'Not set — using local data';
  // Clear cached API responses so next feed load uses the new URL
  cacheClear('api_');
  App.resetFeed();
  showToast(url ? 'API URL saved — reloading feed…' : 'URL cleared — using local data');
}

function resetProgress() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  localStorage.removeItem('mba_progress_v1');
  location.reload();
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/personal-mba-feed/sw.js').catch(() => {});
  }
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
