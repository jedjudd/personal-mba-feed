// ── LOCAL CACHE ──────────────────────────────────────────────────────────────
const CACHE_PREFIX = 'mba_cache_';

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts, ttl } = JSON.parse(raw);
    if (Date.now() - ts > ttl) { localStorage.removeItem(CACHE_PREFIX + key); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(key, data, ttl = CONFIG.cacheTTL) {
  try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now(), ttl })); }
  catch { /* storage full — skip */ }
}

function cacheClear(prefix = '') {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(CACHE_PREFIX + prefix)) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
}

// ── PROGRESS (persisted locally as source of truth for single user) ───────────
const Progress = {
  _key: 'mba_progress_v1',
  get() {
    try {
      return JSON.parse(localStorage.getItem(this._key)) || this._default();
    } catch { return this._default(); }
  },
  save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },
  _default() {
    return {
      xp: 0, likes: {}, bookmarks: {}, comments: {}, quizResults: {},
      badgesEarned: [], streak: 0, maxStreak: 0, lastSessionDate: null,
      postsRead: 0, booksEngaged: 0, booksRead: [], quizzesCompleted: 0,
      likeCount: 0, bookmarkCount: 0, commentCount: 0,
      pillarEngaged: {}, pillarCorrect: {}, pillarQuestions: {},
      postsViewed: {}, booksEngagedIds: [],
    };
  },
  update(fn) {
    const p = this.get();
    fn(p);
    this.save(p);
    return p;
  }
};

// ── API CALLS ─────────────────────────────────────────────────────────────────
async function apiFetch(params, bustCache = false) {
  const cacheKey = 'api_' + JSON.stringify(params);
  if (!bustCache) {
    const hit = cacheGet(cacheKey);
    if (hit) return hit;
  }

  const url = CONFIG.appsScriptUrl + '?' + new URLSearchParams(params);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    cacheSet(cacheKey, data);
    return data;
  } catch (err) {
    console.warn('API fetch failed, using local fallback:', err.message);
    return null;
  }
}

async function apiPost(body) {
  try {
    const res = await fetch(CONFIG.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  } catch (err) {
    console.warn('API post failed:', err.message);
    return { ok: false };
  }
}

// ── FEED SHUFFLE ──────────────────────────────────────────────────────────────
const _feedShuffles = new Map(); // pillarFilter -> shuffled posts array

function _shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getShuffledFeed(pillarFilter) {
  const key = pillarFilter || '__all__';
  if (!_feedShuffles.has(key)) {
    let posts = pillarFilter
      ? SEED_POSTS.filter(p => p.pillars && p.pillars.includes(pillarFilter))
      : SEED_POSTS;
    // Group by book, shuffle within each group, then round-robin interleave
    const byBook = {};
    posts.forEach(p => { const k = p.bookId || 'misc'; (byBook[k] = byBook[k] || []).push(p); });
    const queues = _shuffle(Object.values(byBook)).map(g => _shuffle(g));
    const result = [];
    while (queues.some(q => q.length > 0)) {
      queues.forEach(q => { if (q.length > 0) result.push(q.shift()); });
    }
    _feedShuffles.set(key, result);
  }
  return _feedShuffles.get(key);
}

// ── DATA ACCESS ───────────────────────────────────────────────────────────────
async function fetchFeed(page = 1, pillarFilter = null) {
  const params = { action: 'feed', page, limit: CONFIG.postsPerPage };
  if (pillarFilter) params.pillar = pillarFilter;
  const remote = await apiFetch(params);
  if (!remote) {
    const shuffled = getShuffledFeed(pillarFilter);
    const start = (page - 1) * CONFIG.postsPerPage;
    return { posts: shuffled.slice(start, start + CONFIG.postsPerPage), total: shuffled.length };
  }
  return remote;
}

async function fetchBooks() {
  const remote = await apiFetch({ action: 'books' });
  if (!remote) return SEED_BOOKS;
  return remote;
}

async function fetchAllPosts() {
  if (CONFIG.appsScriptUrl) {
    const data = await apiFetch({ action: 'feed', page: 1, limit: 9999 });
    if (data?.posts?.length) return data.posts;
  }
  return SEED_POSTS;
}

async function fetchBookmarks() {
  const p = Progress.get();
  const ids = Object.keys(p.bookmarks).filter(id => p.bookmarks[id]);
  const posts = SEED_POSTS.filter(p => ids.includes(p.id));
  return { posts };
}

// ── PROGRESS MUTATIONS ────────────────────────────────────────────────────────
function toggleLike(postId) {
  let isLiked = false;
  Progress.update(p => {
    isLiked = !p.likes[postId];
    p.likes[postId] = isLiked;
    p.likeCount = Object.values(p.likes).filter(Boolean).length;
    p.xp = Math.max(0, p.xp + (isLiked ? XP_REWARDS.like : XP_REWARDS.unlike));
  });
  checkBadges();
  return isLiked;
}

function toggleBookmark(postId) {
  let isBookmarked = false;
  Progress.update(p => {
    isBookmarked = !p.bookmarks[postId];
    p.bookmarks[postId] = isBookmarked;
    p.bookmarkCount = Object.values(p.bookmarks).filter(Boolean).length;
    if (isBookmarked) p.xp += XP_REWARDS.bookmark;
  });
  checkBadges();
  return isBookmarked;
}

function addComment(postId, text) {
  Progress.update(p => {
    if (!p.comments[postId]) p.comments[postId] = [];
    p.comments[postId].push({ text, ts: Date.now() });
    p.commentCount++;
    p.xp += XP_REWARDS.comment;
  });
  checkBadges();
}

function recordQuizResult(postId, correct, total, pillars) {
  let firstTime = false;
  Progress.update(p => {
    firstTime = !p.quizResults[postId];
    p.quizResults[postId] = { correct, total, ts: Date.now() };
    if (firstTime) {
      p.quizzesCompleted = (p.quizzesCompleted || 0) + 1;
      p.xp += XP_REWARDS.quizComplete + (correct * XP_REWARDS.quizCorrect);
      (pillars || []).forEach(pillar => {
        p.pillarCorrect[pillar] = (p.pillarCorrect[pillar] || 0) + correct;
        p.pillarQuestions[pillar] = (p.pillarQuestions[pillar] || 0) + total;
      });
    }
  });
  checkBadges();
  return firstTime;
}

function recordPostRead(post) {
  Progress.update(p => {
    if (!p.postsViewed) p.postsViewed = {};
    if (p.postsViewed[post.id]) return; // deduplicate — only count first view
    p.postsViewed[post.id] = true;
    p.postsRead = (p.postsRead || 0) + 1;
    (post.pillars || []).forEach(pillar => {
      p.pillarEngaged[pillar] = (p.pillarEngaged[pillar] || 0) + 1;
    });
    if (post.bookId) {
      if (!p.booksEngagedIds) p.booksEngagedIds = [];
      if (!p.booksEngagedIds.includes(post.bookId)) {
        p.booksEngagedIds.push(post.bookId);
        p.booksEngaged = p.booksEngagedIds.length;
      }
    }
  });
  checkBadges();
}

function updateStreak() {
  Progress.update(p => {
    const today = new Date().toDateString();
    if (p.lastSessionDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (p.lastSessionDate === yesterday) {
      p.streak++;
    } else if (p.lastSessionDate !== today) {
      p.streak = 1;
    }
    p.maxStreak = Math.max(p.maxStreak || 0, p.streak);
    p.lastSessionDate = today;
    p.xp += XP_REWARDS.dailyStreak * Math.min(p.streak, 10);
  });
  checkBadges();
}

function checkBadges() {
  const p = Progress.get();
  const pillarMastery = {};
  PILLAR_NAMES.forEach(pillar => {
    const q = p.pillarQuestions?.[pillar] || 0;
    const c = p.pillarCorrect?.[pillar] || 0;
    pillarMastery[pillar] = q > 0 ? c / q : 0;
  });
  const stats = { ...p, pillarMastery };

  const newBadges = [];
  BADGE_DEFS.forEach(def => {
    if (!p.badgesEarned.includes(def.id) && def.check(stats)) {
      p.badgesEarned.push(def.id);
      newBadges.push(def);
    }
  });
  if (newBadges.length > 0) {
    Progress.save(p);
    newBadges.forEach(b => showBadgeToast(b));
  }
}

// ── SEED DATA (used when Apps Script isn't configured) ─────────────────────
// Imported from seed-data.js at the bottom of this file via SEED_POSTS/SEED_BOOKS globals
