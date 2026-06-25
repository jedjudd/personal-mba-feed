// ── CARD RENDERING ────────────────────────────────────────────────────────────

function pillarTag(name) {
  const p = PILLARS[name] || { color: '#6b7280', bg: 'rgba(107,114,128,0.15)' };
  return `<span class="pillar-tag" style="color:${p.color};background:${p.bg}">${p.icon || ''} ${name}</span>`;
}

function pillarTags(pillars) {
  return (pillars || []).map(pillarTag).join('');
}

function difficultyBadge(d) {
  const info = DIFFICULTY[d] || DIFFICULTY.Beginner;
  return `<span class="diff-badge" style="color:${info.color}">${info.label}</span>`;
}

function cardHeader(post) {
  const p = Progress.get();
  const liked = p.likes[post.id];
  const bookmarked = p.bookmarks[post.id];
  return `
    <div class="card-meta">
      <span class="card-book">${post.bookTitle}</span>
      <span class="card-author">— ${post.author}</span>
    </div>
    <div class="card-tags">
      ${pillarTags(post.pillars)}
      ${difficultyBadge(post.difficulty)}
    </div>
    <div class="card-actions" data-post-id="${post.id}">
      <button class="action-btn like-btn ${liked ? 'active' : ''}" onclick="handleLike('${post.id}',this)" aria-label="Like">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button class="action-btn bookmark-btn ${bookmarked ? 'active' : ''}" onclick="handleBookmark('${post.id}',this)" aria-label="Bookmark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
      <button class="action-btn comment-btn" onclick="handleComment('${post.id}')" aria-label="Comment">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
      <button class="action-btn share-btn" onclick="handleShare('${post.id}')" aria-label="Share">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </button>
    </div>`;
}

// ── QUOTE CARD ────────────────────────────────────────────────────────────────
function renderQuote(post) {
  const pillar = post.pillars?.[0] || 'Strategy';
  const color = PILLARS[pillar]?.color || '#3b82f6';
  return `
    <article class="card card-quote" data-id="${post.id}" style="--accent:${color}">
      <div class="quote-bg" style="background:linear-gradient(135deg,${color}22,${color}08)"></div>
      <div class="quote-mark" style="color:${color}">"</div>
      <blockquote class="quote-text">${post.content.quote}</blockquote>
      ${post.content.context ? `<p class="quote-context">${post.content.context}</p>` : ''}
      ${cardHeader(post)}
    </article>`;
}

// ── FRAMEWORK CARD ────────────────────────────────────────────────────────────
function renderFramework(post) {
  const c = post.content;
  const items = (c.items || []).map(item => `
    <div class="fw-item">
      <span class="fw-dot" style="background:${item.color}"></span>
      <span>${item.label}</span>
    </div>`).join('');
  return `
    <article class="card card-framework" data-id="${post.id}">
      <div class="fw-header">
        <h3 class="fw-title">${c.title}</h3>
        <p class="fw-subtitle">${c.subtitle || ''}</p>
      </div>
      <div class="fw-items">${items}</div>
      ${c.insight ? `<div class="fw-insight"><span class="insight-label">💡 Real World</span>${c.insight}</div>` : ''}
      ${cardHeader(post)}
    </article>`;
}

// ── INSIGHT CARD ──────────────────────────────────────────────────────────────
function renderInsight(post) {
  const c = post.content;
  return `
    <article class="card card-insight" data-id="${post.id}">
      <h3 class="insight-headline">${c.headline}</h3>
      <p class="insight-body">${c.body}</p>
      ${c.example ? `<div class="insight-example"><span class="example-label">📌 Example</span><p>${c.example}</p></div>` : ''}
      ${cardHeader(post)}
    </article>`;
}

// ── CAROUSEL CARD ─────────────────────────────────────────────────────────────
function renderCarousel(post) {
  const c = post.content;
  const slides = (c.slides || []).map((slide, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}" data-index="${i}">
      <h4 class="slide-title">${slide.title}</h4>
      <p class="slide-body">${slide.body}</p>
    </div>`).join('');
  const dots = (c.slides || []).map((_, i) => `
    <button class="dot ${i === 0 ? 'active' : ''}" onclick="carouselGo(this,'${post.id}',${i})" aria-label="Slide ${i+1}"></button>`).join('');
  return `
    <article class="card card-carousel" data-id="${post.id}">
      <div class="carousel-header">
        <h3 class="carousel-title">${c.title}</h3>
      </div>
      <div class="carousel-track" id="carousel-${post.id}" data-current="0"
           ontouchstart="touchStart(event)" ontouchmove="touchMove(event)" ontouchend="touchEnd(event,'${post.id}')">
        ${slides}
      </div>
      <div class="carousel-nav">
        <button class="carousel-arrow" onclick="carouselStep('${post.id}',-1)">‹</button>
        <div class="dots">${dots}</div>
        <button class="carousel-arrow" onclick="carouselStep('${post.id}',1)">›</button>
      </div>
      ${cardHeader(post)}
    </article>`;
}

// ── QUIZ CARD ─────────────────────────────────────────────────────────────────
function renderQuiz(post) {
  const c = post.content;
  const p = Progress.get();
  const done = p.quizResults[post.id];
  const questions = (c.questions || []).map((q, qi) => {
    const opts = (q.options || []).map((opt, oi) => `
      <button class="quiz-option ${done ? (oi === q.correct ? 'correct' : '') : ''}"
              data-post="${post.id}" data-q="${qi}" data-opt="${oi}" data-correct="${q.correct}"
              onclick="handleQuizAnswer(this)" ${done ? 'disabled' : ''}>
        <span class="opt-letter">${String.fromCharCode(65+oi)}</span>${opt}
      </button>`).join('');
    return `
      <div class="quiz-question" data-qi="${qi}">
        <p class="q-text">${q.q}</p>
        <div class="quiz-options">${opts}</div>
        <div class="q-explanation hidden" id="qexp-${post.id}-${qi}">${q.explanation}</div>
      </div>`;
  }).join('');
  return `
    <article class="card card-quiz" data-id="${post.id}" data-total="${(c.questions||[]).length}" data-score="0">
      <div class="quiz-header">
        <span class="quiz-icon">🎯</span>
        <span class="quiz-label">Quiz</span>
        ${done ? `<span class="quiz-done-badge">${done.correct}/${done.total} correct</span>` : ''}
      </div>
      <div class="quiz-questions">${questions}</div>
      ${cardHeader(post)}
    </article>`;
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function renderStat(post) {
  const c = post.content;
  const pillar = post.pillars?.[0] || 'Strategy';
  const color = PILLARS[pillar]?.color || '#3b82f6';
  return `
    <article class="card card-stat" data-id="${post.id}" style="--accent:${color}">
      <div class="stat-number" style="color:${color}">${c.number}</div>
      <div class="stat-label">${c.label}</div>
      <p class="stat-context">${c.context}</p>
      ${cardHeader(post)}
    </article>`;
}

// ── REFLECTION CARD ───────────────────────────────────────────────────────────
function renderReflection(post) {
  const c = post.content;
  const p = Progress.get();
  const saved = p.comments?.[post.id]?.[0]?.text || '';
  return `
    <article class="card card-reflection" data-id="${post.id}">
      <div class="reflect-icon">🤔</div>
      <p class="reflect-prompt">${c.prompt}</p>
      <p class="reflect-question">${c.question}</p>
      <textarea class="reflect-input" placeholder="Write your reflection…" rows="3"
                onblur="saveReflection('${post.id}',this.value)">${saved}</textarea>
      ${cardHeader(post)}
    </article>`;
}

// ── SUMMARY CARD ──────────────────────────────────────────────────────────────
function renderSummary(post) {
  const c = post.content;
  const tks = (c.takeaways || []).map(t => `<li>${t}</li>`).join('');
  return `
    <article class="card card-summary" data-id="${post.id}">
      <div class="summary-header">
        <span class="summary-icon">📖</span>
        <div>
          <div class="summary-label">Book Summary</div>
          <h3 class="summary-title">${post.bookTitle}</h3>
          <div class="summary-author">${post.author}</div>
        </div>
      </div>
      <p class="summary-premise">${c.premise}</p>
      <div class="summary-takeaways">
        <div class="tk-label">Key Takeaways</div>
        <ol>${tks}</ol>
      </div>
      <div class="summary-quote">"${c.bestQuote}"</div>
      ${c.nextRead ? `<div class="summary-next"><span class="next-label">📚 Read Next:</span> ${c.nextRead}</div>` : ''}
      ${cardHeader(post)}
    </article>`;
}

// ── ROUTER ────────────────────────────────────────────────────────────────────
function renderCard(post) {
  recordPostRead(post);
  switch (post.type) {
    case 'quote':      return renderQuote(post);
    case 'framework':  return renderFramework(post);
    case 'insight':    return renderInsight(post);
    case 'carousel':   return renderCarousel(post);
    case 'quiz':       return renderQuiz(post);
    case 'stat':       return renderStat(post);
    case 'reflection': return renderReflection(post);
    case 'summary':    return renderSummary(post);
    default:           return renderInsight(post);
  }
}

// ── INTERACTIONS ──────────────────────────────────────────────────────────────
function handleLike(postId, btn) {
  const isLiked = toggleLike(postId);
  btn.classList.toggle('active', isLiked);
  btn.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
  flashAction(btn, isLiked ? '+2 XP' : '');
}

function handleBookmark(postId, btn) {
  const isBm = toggleBookmark(postId);
  btn.classList.toggle('active', isBm);
  btn.querySelector('svg').setAttribute('fill', isBm ? 'currentColor' : 'none');
  flashAction(btn, isBm ? '+3 XP' : '');
}

function handleComment(postId) {
  openCommentModal(postId);
}

function handleShare(postId) {
  const post = SEED_POSTS.find(p => p.id === postId);
  if (!post) return;
  const text = `📚 "${post.content?.quote || post.content?.headline || post.bookTitle}" — ${post.author}\n\nFrom The Personal MBA Feed`;
  if (navigator.share) {
    navigator.share({ title: post.bookTitle, text });
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
  }
}

function saveReflection(postId, text) {
  if (!text.trim()) return;
  addComment(postId, text.trim());
}

// ── QUIZ LOGIC ────────────────────────────────────────────────────────────────
function handleQuizAnswer(btn) {
  const postId = btn.dataset.post;
  const qi = parseInt(btn.dataset.q);
  const selected = parseInt(btn.dataset.opt);
  const correct = parseInt(btn.dataset.correct);
  const card = document.querySelector(`.card[data-id="${postId}"]`);
  if (!card) return;

  const qDiv = card.querySelectorAll('.quiz-question')[qi];
  const opts = qDiv.querySelectorAll('.quiz-option');
  opts.forEach((o, i) => {
    o.disabled = true;
    if (i === correct) o.classList.add('correct');
    else if (i === selected) o.classList.add('wrong');
  });
  const expEl = card.querySelector(`#qexp-${postId}-${qi}`);
  if (expEl) expEl.classList.remove('hidden');

  // Track score on the card element
  if (selected === correct) {
    card.dataset.score = String(parseInt(card.dataset.score || 0) + 1);
  }

  // Check if all questions answered
  const allQs = card.querySelectorAll('.quiz-question');
  const allDone = [...card.querySelectorAll('.quiz-option')].every(o => o.disabled);
  const totalDone = [...allQs].every(q => q.querySelector('.quiz-option[disabled]'));
  if (totalDone) {
    const score = parseInt(card.dataset.score || 0);
    const total = parseInt(card.dataset.total || 1);
    const post = SEED_POSTS.find(p => p.id === postId);
    const firstTime = recordQuizResult(postId, score, total, post?.pillars);
    if (firstTime) {
      showToast(`Quiz complete! ${score}/${total} correct — +${XP_REWARDS.quizComplete + score * XP_REWARDS.quizCorrect} XP`);
    }
    const header = card.querySelector('.quiz-header');
    if (header) {
      const badge = document.createElement('span');
      badge.className = 'quiz-done-badge';
      badge.textContent = `${score}/${total} correct`;
      header.appendChild(badge);
    }
  }
}

// ── CAROUSEL LOGIC ────────────────────────────────────────────────────────────
let _touchStartX = 0;
function touchStart(e) { _touchStartX = e.touches[0].clientX; }
function touchMove(e) { e.preventDefault(); }
function touchEnd(e, postId) {
  const dx = e.changedTouches[0].clientX - _touchStartX;
  if (Math.abs(dx) > 40) carouselStep(postId, dx < 0 ? 1 : -1);
}

function carouselStep(postId, dir) {
  const track = document.getElementById('carousel-' + postId);
  if (!track) return;
  const slides = track.querySelectorAll('.slide');
  const current = parseInt(track.dataset.current || 0);
  const next = Math.max(0, Math.min(slides.length - 1, current + dir));
  carouselGo(null, postId, next);
}

function carouselGo(dotEl, postId, index) {
  const track = document.getElementById('carousel-' + postId);
  if (!track) return;
  const slides = track.querySelectorAll('.slide');
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  track.dataset.current = index;
  const card = track.closest('.card');
  if (card) {
    card.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
  }
}

// ── FLASH XP ──────────────────────────────────────────────────────────────────
function flashAction(el, text) {
  if (!text) return;
  const tip = document.createElement('span');
  tip.className = 'xp-flash';
  tip.textContent = text;
  el.parentElement.appendChild(tip);
  setTimeout(() => tip.remove(), 1200);
}
