// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderDashboard() {
  const p = Progress.get();
  const el = document.getElementById('dashboard-content');
  if (!el) return;

  const pillarData = computePillarData(p);
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
      <p class="dash-sub">Where to focus next</p>
    </div>
    ${renderGapAnalysis(pillarData)}
    <div class="dash-section">
      <h2 class="dash-heading">Reading List</h2>
    </div>
    ${renderReadingList()}
  `;

  requestAnimationFrame(() => drawRadar(pillarData));
}

function computePillarData(p) {
  return PILLAR_NAMES.map(name => {
    const engaged = p.pillarEngaged?.[name] || 0;
    const correct = p.pillarCorrect?.[name] || 0;
    const total = p.pillarQuestions?.[name] || 0;
    const quizScore = total > 0 ? correct / total : 0;
    const coverageScore = Math.min(1, engaged / 15); // 15 posts = full coverage
    const combined = coverageScore * 0.5 + quizScore * 0.5;
    return { name, engaged, quizScore, coverageScore, combined, color: PILLARS[name]?.color || '#6b7280' };
  });
}

function pillarCard(pd) {
  const pct = Math.round(pd.combined * 100);
  const books = SEED_BOOKS.filter(b => b.pillars?.includes(pd.name)).length;
  return `
    <div class="pillar-card" style="--c:${pd.color}">
      <div class="pc-name" style="color:${pd.color}">${PILLARS[pd.name]?.icon || ''} ${pd.name}</div>
      <div class="pc-bar-wrap">
        <div class="pc-bar" style="width:${pct}%;background:${pd.color}"></div>
      </div>
      <div class="pc-stats">
        <span>${pd.engaged} posts</span>
        <span>${pd.quizScore > 0 ? Math.round(pd.quizScore * 100) + '% quiz' : 'no quizzes yet'}</span>
        <span>${books} books</span>
      </div>
    </div>`;
}

function renderGapAnalysis(pillarData) {
  const sorted = [...pillarData].sort((a, b) => a.combined - b.combined);
  const gaps = sorted.slice(0, 3);
  return `<div class="gap-list">${gaps.map(g => {
    const recs = SEED_BOOKS.filter(b => b.pillars?.includes(g.name)).slice(0, 2);
    return `
      <div class="gap-item">
        <div class="gap-header">
          <span class="gap-pillar" style="color:${g.color}">${g.name}</span>
          <span class="gap-score">${Math.round(g.combined * 100)}% mastery</span>
        </div>
        <p class="gap-tip">Strengthen this pillar with:</p>
        <div class="gap-recs">${recs.map(b => `<span class="rec-book">${b.title}</span>`).join('')}</div>
      </div>`;
  }).join('')}</div>`;
}

function renderReadingList() {
  const books = SEED_BOOKS;
  const statusOrder = { read: 0, 'in-progress': 1, unread: 2 };
  const sorted = [...books].sort((a, b) => (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2));
  return `
    <div class="book-list">
      ${sorted.map(b => `
        <div class="book-row">
          <div class="book-dot" style="background:${b.color}"></div>
          <div class="book-info">
            <div class="book-title">${b.title}</div>
            <div class="book-author">${b.author}</div>
            <div class="book-pillars">${b.pillars?.map(pillarTag).join('') || ''}</div>
          </div>
          <div class="book-right">
            <span class="book-status ${b.status || 'unread'}">${b.status || 'unread'}</span>
            ${b.rating ? `<div class="book-stars">${'★'.repeat(b.rating)}${'☆'.repeat(5 - b.rating)}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>`;
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

  // Coverage area (lighter)
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
