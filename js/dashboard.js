// ── DASHBOARD ─────────────────────────────────────────────────────────────────
let _dashPosts = null;

async function renderDashboard() {
  const el = document.getElementById('dashboard-content');
  if (!el) return;

  el.innerHTML = '<p style="text-align:center;padding:40px 16px;color:var(--muted)">Loading…</p>';
  _dashPosts = await fetchAllPosts();

  const p = Progress.get();
  const pillarData = computePillarData(p, _dashPosts);
  el.innerHTML = `
    <div class="dash-section">
      <h2 class="dash-heading">MBA Progress</h2>
      <p class="dash-sub">Across all 10 pillars</p>
    </div>
    <div class="radar-wrap">
      <canvas id="radar-canvas" width="320" height="320"></canvas>
    </div>
    <div class="pillar-grid">
      ${pillarData.map(pd => pillarCard(pd)).join('')}
    </div>
    <div class="dash-section">
      <h2 class="dash-heading">Gap Analysis</h2>
      <p class="dash-sub">Weakest pillars — tap to explore posts</p>
    </div>
    ${renderGapAnalysis(pillarData)}
    <div class="dash-section">
      <h2 class="dash-heading">Books Library</h2>
      <p class="dash-sub">All books — tap to review cards</p>
    </div>
    ${renderBooksLibrary(_dashPosts, p)}
  `;

  requestAnimationFrame(() => drawRadar(pillarData));
}

function computePillarData(p, allPosts) {
  return PILLAR_NAMES.map(name => {
    const correct = p.pillarCorrect?.[name] || 0;
    const total = p.pillarQuestions?.[name] || 0;
    const quizScore = total > 0 ? correct / total : 0;

    const pillarPosts = allPosts.filter(post => (post.pillars || []).includes(name));
    const available = pillarPosts.length;
    const viewed = pillarPosts.filter(post => p.postsViewed?.[post.id]).length;
    const bookIds = new Set(pillarPosts.filter(post => post.bookId).map(post => post.bookId));

    const coverageScore = available > 0 ? Math.min(1, viewed / Math.min(15, available)) : 0;
    const combined = coverageScore * 0.5 + quizScore * 0.5;
    return {
      name, available, viewed, quizScore, coverageScore, combined,
      totalBooks: bookIds.size, color: PILLARS[name]?.color || '#6b7280',
    };
  });
}

function pillarCard(pd) {
  const pct = Math.round(pd.combined * 100);
  return `
    <div class="pillar-card" style="--c:${pd.color}">
      <div class="pc-name" style="color:${pd.color}">${PILLARS[pd.name]?.icon || ''} ${pd.name}</div>
      <div class="pc-bar-wrap">
        <div class="pc-bar" style="width:${pct}%;background:${pd.color}"></div>
      </div>
      <div class="pc-stats">
        <span>${pd.available} posts</span>
        <span>${pd.quizScore > 0 ? Math.round(pd.quizScore * 100) + '% quiz' : 'no quizzes yet'}</span>
        <span>${pd.totalBooks} books</span>
      </div>
      ${pd.viewed > 0 ? `<div class="pc-viewed">${pd.viewed} viewed</div>` : ''}
    </div>`;
}

function renderGapAnalysis(pillarData) {
  const sorted = [...pillarData].sort((a, b) => a.combined - b.combined);
  const gaps = sorted.slice(0, 3);
  return `<div class="gap-list">${gaps.map(g => {
    const bookTitles = [...new Set(
      (_dashPosts || [])
        .filter(p => (p.pillars || []).includes(g.name) && p.bookTitle)
        .map(p => p.bookTitle)
    )].slice(0, 2);
    return `
      <div class="gap-item" onclick="goToPillar('${g.name}')">
        <div class="gap-header">
          <span class="gap-pillar" style="color:${g.color}">${PILLARS[g.name]?.icon || ''} ${g.name}</span>
          <span class="gap-score">${Math.round(g.combined * 100)}% mastery</span>
        </div>
        <div class="gap-avail">${g.available} posts available · ${g.viewed} viewed</div>
        ${bookTitles.length ? `
          <p class="gap-tip">Books in this pillar:</p>
          <div class="gap-recs">${bookTitles.map(t => `<span class="rec-book">${t}</span>`).join('')}</div>
        ` : ''}
        <div class="gap-action">Browse ${g.name} posts →</div>
      </div>`;
  }).join('')}</div>`;
}

function renderBooksLibrary(allPosts, p) {
  const byBook = {};
  allPosts.forEach(post => {
    const key = post.bookId || '__misc__';
    if (!byBook[key]) byBook[key] = {
      bookTitle: post.bookTitle || 'Untitled',
      author: post.author || '',
      pillars: new Set(),
      posts: [],
    };
    byBook[key].posts.push(post);
    (post.pillars || []).forEach(pl => byBook[key].pillars.add(pl));
  });

  const books = Object.entries(byBook).sort((a, b) => a[1].bookTitle.localeCompare(b[1].bookTitle));
  if (!books.length) return '<p class="empty-msg">No posts loaded yet.</p>';

  return `<div class="book-library">${books.map(([bookId, book]) => {
    const total = book.posts.length;
    const viewed = book.posts.filter(post => p.postsViewed?.[post.id]).length;
    const pillars = [...book.pillars];
    const firstColor = PILLARS[pillars[0]]?.color || '#6366f1';
    const pct = total > 0 ? Math.round((viewed / total) * 100) : 0;

    let xp = 0;
    book.posts.forEach(post => {
      if (p.likes?.[post.id]) xp += XP_REWARDS.like;
      if (p.bookmarks?.[post.id]) xp += XP_REWARDS.bookmark;
      if (p.quizResults?.[post.id]) {
        const r = p.quizResults[post.id];
        xp += XP_REWARDS.quizComplete + (r.correct || 0) * XP_REWARDS.quizCorrect;
      }
      if (p.comments?.[post.id]) xp += p.comments[post.id].length * XP_REWARDS.comment;
    });

    return `
      <div class="bl-book" data-bookid="${bookId}" onclick="openBookView(this.dataset.bookid)" style="--bc:${firstColor}">
        <div class="bl-spine" style="background:${firstColor}"></div>
        <div class="bl-info">
          <div class="bl-title">${book.bookTitle}</div>
          <div class="bl-author">${book.author}</div>
          <div class="bl-pillars">${pillars.map(pl => pillarTag(pl)).join('')}</div>
          <div class="bl-stats">
            <span>${total} cards</span>
            ${viewed > 0 ? `<span class="bl-viewed">${viewed} viewed</span>` : ''}
            ${xp > 0 ? `<span class="bl-xp">+${xp} XP</span>` : ''}
          </div>
          <div class="bl-prog-wrap">
            <div class="bl-prog" style="width:${pct}%;background:${firstColor}"></div>
          </div>
        </div>
        <div class="bl-arrow">›</div>
      </div>`;
  }).join('')}</div>`;
}

function openBookView(bookId) {
  if (!_dashPosts) return;
  const posts = _dashPosts.filter(p => (p.bookId || '__misc__') === bookId);
  if (!posts.length) return;

  const first = posts[0];
  const p = Progress.get();
  const pillars = [...new Set(posts.flatMap(post => post.pillars || []))];

  const viewedCount = posts.filter(post => p.postsViewed?.[post.id]).length;
  const likedCount  = posts.filter(post => p.likes?.[post.id]).length;
  const savedCount  = posts.filter(post => p.bookmarks?.[post.id]).length;

  let xp = 0;
  posts.forEach(post => {
    if (p.likes?.[post.id]) xp += XP_REWARDS.like;
    if (p.bookmarks?.[post.id]) xp += XP_REWARDS.bookmark;
    if (p.quizResults?.[post.id]) {
      const r = p.quizResults[post.id];
      xp += XP_REWARDS.quizComplete + (r.correct || 0) * XP_REWARDS.quizCorrect;
    }
    if (p.comments?.[post.id]) xp += p.comments[post.id].length * XP_REWARDS.comment;
  });

  const typeColors = {
    quote: '#a855f7', framework: '#3b82f6', insight: '#22c55e',
    carousel: '#f97316', quiz: '#ef4444', stat: '#eab308',
    reflection: '#6366f1', summary: '#14b8a6',
  };

  const overlay = document.createElement('div');
  overlay.id = 'book-overlay';
  overlay.className = 'book-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeBookOverlay(); });

  overlay.innerHTML = `
    <div class="bov-container">
      <div class="bov-header">
        <button class="bov-close" onclick="closeBookOverlay()">✕</button>
        <div class="bov-meta">
          <div class="bov-title">${first.bookTitle}</div>
          <div class="bov-author">by ${first.author}</div>
        </div>
      </div>
      <div class="bov-stats">
        <div class="bov-stat"><span class="bov-n">${posts.length}</span><span class="bov-l">Cards</span></div>
        <div class="bov-stat"><span class="bov-n" style="color:#22c55e">${viewedCount}</span><span class="bov-l">Viewed</span></div>
        <div class="bov-stat"><span class="bov-n" style="color:#ef4444">${likedCount}</span><span class="bov-l">Liked</span></div>
        <div class="bov-stat"><span class="bov-n" style="color:#f97316">${savedCount}</span><span class="bov-l">Saved</span></div>
        ${xp > 0 ? `<div class="bov-stat"><span class="bov-n" style="color:#6366f1">+${xp}</span><span class="bov-l">XP</span></div>` : ''}
      </div>
      <div class="bov-pillars">${pillars.map(pl => pillarTag(pl)).join('')}</div>
      <div class="bov-cards">
        ${posts.map(post => {
          const viewed  = p.postsViewed?.[post.id];
          const liked   = p.likes?.[post.id];
          const bm      = p.bookmarks?.[post.id];
          const preview = getPostPreview(post);
          const typeColor = typeColors[post.type] || '#6366f1';
          return `
            <div class="bov-card ${viewed ? 'bov-card--viewed' : ''}" data-postid="${post.id}"
              onclick="const pid=this.dataset.postid;closeBookOverlay();openDetailView(pid)">
              <div class="bov-card-left">
                <span class="bov-card-type" style="color:${typeColor}">${post.type}</span>
                ${preview ? `<span class="bov-card-preview">${preview}</span>` : ''}
              </div>
              <span class="bov-card-icons">${viewed ? '<span class="bov-seen">✓</span>' : ''}${liked ? ' ❤' : ''}${bm ? ' 🔖' : ''}</span>
            </div>`;
        }).join('')}
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

function closeBookOverlay() {
  const el = document.getElementById('book-overlay');
  if (el) el.remove();
  document.body.style.overflow = '';
}

function getPostPreview(post) {
  const c = post.content || {};
  switch (post.type) {
    case 'quote':      return c.quote       ? `"${c.quote.substring(0, 60)}…"` : '';
    case 'insight':    return c.headline    ? c.headline.substring(0, 65) : '';
    case 'framework':  return c.title       ? c.title.substring(0, 65) : '';
    case 'stat':       return c.number      ? `${c.number} — ${(c.label || '').substring(0, 40)}` : '';
    case 'reflection': return c.question    ? c.question.substring(0, 60) + '…' : '';
    case 'summary':    return c.premise     ? c.premise.substring(0, 60) + '…' : '';
    case 'carousel':   return c.title       ? c.title.substring(0, 65) : '';
    case 'quiz':       return c.questions?.[0]?.q ? c.questions[0].q.substring(0, 60) + '…' : 'Quiz';
    default:           return '';
  }
}

// ── RADAR CHART ───────────────────────────────────────────────────────────────
function drawRadar(pillarData) {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 320;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2;
  const r = size * 0.36;
  const n = pillarData.length;
  const angle = i => (2 * Math.PI * i / n) - Math.PI / 2;
  const pt = (i, val) => ({
    x: cx + r * val * Math.cos(angle(i)),
    y: cy + r * val * Math.sin(angle(i)),
  });

  // Grid rings
  for (let level = 1; level <= 4; level++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const { x, y } = pt(i, level / 4);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axes
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const { x, y } = pt(i, 1);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();
  }

  // Coverage area
  ctx.beginPath();
  pillarData.forEach((pd, i) => {
    const { x, y } = pt(i, pd.coverageScore);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(99,102,241,0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,102,241,0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Combined mastery area
  ctx.beginPath();
  pillarData.forEach((pd, i) => {
    const { x, y } = pt(i, pd.combined);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(99,102,241,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots
  pillarData.forEach((pd, i) => {
    const { x, y } = pt(i, pd.combined);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = pd.color;
    ctx.fill();
  });

  // Labels
  ctx.font = `${10 * dpr / dpr}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  pillarData.forEach((pd, i) => {
    const labelR = r + 22;
    const lx = cx + labelR * Math.cos(angle(i));
    const ly = cy + labelR * Math.sin(angle(i));
    ctx.fillStyle = pd.color;
    ctx.fillText(pd.name.split(' ')[0], lx, ly);
  });
}
