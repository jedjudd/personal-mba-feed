// ── LESSON SLIDE GENERATOR ────────────────────────────────────────────────────

function generateLessonSlides(post) {
  const slides = [];
  const c = post.content;
  const pillar = post.pillars?.[0] || 'Strategy';
  const color = PILLARS[pillar]?.color || '#6366f1';

  switch (post.type) {

    case 'quote':
      slides.push({ icon: '💬', label: 'Core Idea', title: post.bookTitle,
        body: `<blockquote class="dl-quote" style="border-color:${color}">"${c.quote}"</blockquote><p class="dl-author">— ${post.author}</p>` });
      if (c.context) slides.push({ icon: '🔍', label: 'Why It Matters', title: 'The Big Picture',
        body: `<p>${c.context}</p>` });
      slides.push({ icon: '⚡', label: 'Application', title: 'Put It Into Practice',
        body: `<p>Ask yourself:</p><ul class="dl-list"><li>Where in your work does "good enough" hold you back from being great?</li><li>What one area could you pursue excellence in right now?</li><li>What would you need to stop doing to make room for it?</li></ul>` });
      slides.push({ type: 'quiz', icon: '🎯', label: 'Check Your Thinking', title: 'Quick Reflection',
        quiz: { q: `What does this quote argue is the primary obstacle to achieving greatness?`,
          options: ['External competition', 'Accepting "good" as sufficient', 'Lack of talent', 'Insufficient resources'],
          correct: 1, explanation: 'Settling for "good" removes the urgency needed to become truly great. The enemy is internal complacency, not external forces.' } });
      break;

    case 'framework':
      slides.push({ icon: '🗺', label: 'Framework Overview', title: c.title,
        body: `<p class="dl-subtitle">${c.subtitle || 'A structured way to think about this problem.'}</p>` });
      (c.items || []).slice(0, 5).forEach((item, i) => {
        slides.push({ icon: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'][i] || '•', label: `Component ${i + 1}`, title: item.label,
          body: `<div class="dl-item-chip" style="background:${item.color}22;border:2px solid ${item.color};color:${item.color}">${item.label}</div><p>Each component of the <strong>${c.title}</strong> represents a distinct lens. Understanding this one helps you see where your organization or strategy stands.</p>` });
      });
      if (c.insight) slides.push({ icon: '💡', label: 'Real World', title: 'In Practice',
        body: `<p>${c.insight}</p>` });
      slides.push({ type: 'quiz', icon: '🎯', label: 'Test Yourself', title: 'Framework Check',
        quiz: { q: `The primary purpose of the ${c.title} framework is to:`,
          options: ['Maximize short-term profit', 'Focus energy on what matters most', 'Eliminate all risk', 'Scale the team quickly'],
          correct: 1, explanation: `Frameworks like ${c.title} cut through complexity so you can direct your limited resources to the highest-leverage activities.` } });
      break;

    case 'insight':
      slides.push({ icon: '💡', label: 'Key Insight', title: c.headline,
        body: '' });
      slides.push({ icon: '📖', label: 'Deep Dive', title: 'The Full Picture',
        body: `<p>${c.body}</p>` });
      if (c.example) slides.push({ icon: '📌', label: 'Example', title: 'In the Real World',
        body: `<p>${c.example}</p>` });
      slides.push({ icon: '⚡', label: 'Application', title: 'Your Turn',
        body: `<p>How does this insight change your thinking?</p><ul class="dl-list"><li>Where do you see this pattern in your current work?</li><li>What decision would you make differently knowing this?</li><li>Who else in your organization needs to hear this?</li></ul>` });
      slides.push({ type: 'quiz', icon: '🎯', label: 'Quiz', title: 'Check Understanding',
        quiz: { q: `What is the central argument of "${c.headline}"?`,
          options: ['Success is primarily luck-driven', c.body.length > 90 ? c.body.substring(0, 88) + '…' : c.body, 'Competition always drives improvement', 'Larger teams produce better results'],
          correct: 1, explanation: `This insight from ${post.bookTitle} challenges conventional thinking and rewards those who internalize it.` } });
      break;

    case 'carousel':
      (c.slides || []).forEach((slide, i) => {
        slides.push({ icon: ['📖','🔍','💡','⚡','🎯','✨','🚀'][i % 7], label: `Slide ${i + 1} of ${c.slides.length}`, title: slide.title,
          body: `<p>${slide.body}</p>` });
      });
      slides.push({ icon: '⚡', label: 'Apply It', title: 'From Theory to Practice',
        body: `<p>You've explored <strong>${c.title}</strong>. Now:</p><ul class="dl-list"><li>Which slide resonated most — and why?</li><li>What's one action you can take this week based on this?</li><li>Who in your network should know about this concept?</li></ul>` });
      break;

    case 'stat':
      slides.push({ icon: '📊', label: 'Surprising Data', title: 'The Number That Changes Everything',
        body: `<div class="dl-stat" style="color:${color}">${c.number}</div><div class="dl-stat-label">${c.label}</div>` });
      slides.push({ icon: '🔍', label: 'Context', title: 'What This Means',
        body: `<p>${c.context}</p>` });
      slides.push({ icon: '⚡', label: 'Implications', title: 'So What?',
        body: `<p>This data from <em>${post.bookTitle}</em> should shift how you think about:</p><ul class="dl-list"><li>Assumptions you're making in your current strategy</li><li>Decisions based on conventional wisdom instead of evidence</li><li>Where to concentrate resources for maximum impact</li></ul>` });
      slides.push({ type: 'quiz', icon: '🎯', label: 'Quiz', title: 'Test Your Memory',
        quiz: { q: `The statistic "${c.number}" specifically measures:`,
          options: ['A general industry trend', c.label, 'A one-time historical anomaly', 'A metric relevant only to large companies'],
          correct: 1, explanation: `Data gains power through context. This figure from ${post.bookTitle} matters because it quantifies: ${c.label}.` } });
      break;

    case 'reflection':
      slides.push({ icon: '🤔', label: 'Reflect', title: 'Reflection Exercise',
        body: `<p class="dl-prompt">${c.prompt}</p>` });
      slides.push({ icon: '💭', label: 'The Question', title: 'Go Deeper',
        body: `<p class="dl-big-q">"${c.question}"</p>` });
      slides.push({ icon: '✍️', label: 'Your Answer', title: 'Write It Out',
        body: `<p>Take 2 minutes to write your response. Writing forces clarity that thinking alone can't achieve.</p><textarea class="dl-textarea" placeholder="Your reflection…" rows="5" onblur="saveReflection('${post.id}',this.value)"></textarea>` });
      break;

    case 'summary':
      slides.push({ icon: '📖', label: 'Book Summary', title: post.bookTitle,
        body: `<p class="dl-author-lg">by ${post.author}</p>${c.premise ? `<p>${c.premise}</p>` : ''}` });
      (c.takeaways || []).slice(0, 4).forEach((tk, i) => {
        slides.push({ icon: ['1️⃣','2️⃣','3️⃣','4️⃣'][i], label: `Key Takeaway ${i + 1}`, title: 'Lesson',
          body: `<p class="dl-takeaway">${tk}</p>` });
      });
      if (c.bestQuote) slides.push({ icon: '💬', label: 'Best Quote', title: 'Worth Remembering',
        body: `<blockquote class="dl-quote" style="border-color:${color}">"${c.bestQuote}"</blockquote><p class="dl-author">— ${post.author}</p>` });
      slides.push({ icon: '🚀', label: 'Next Steps', title: c.nextRead ? `Up Next: ${c.nextRead}` : 'Keep Learning',
        body: `<p>You've covered the essentials of <em>${post.bookTitle}</em>.</p><ul class="dl-list"><li>Find the full book and read the chapters matching your current challenges</li><li>Share one insight from this book with a colleague today</li>${c.nextRead ? `<li>Your recommended next read: <strong>${c.nextRead}</strong></li>` : ''}</ul>` });
      break;

    case 'quiz':
      slides.push({ icon: '🎯', label: 'Knowledge Check', title: 'Test Your Understanding',
        body: `<p>From <em>${post.bookTitle}</em>. Answer these questions to lock in what you've learned.</p>` });
      (c.questions || []).forEach((q, qi) => {
        slides.push({ type: 'quiz', icon: '❓', label: `Question ${qi + 1} of ${c.questions.length}`, title: 'Quiz',
          quiz: { ...q, qi } });
      });
      slides.push({ icon: '✅', label: 'Complete', title: 'Great Work!',
        body: `<p>You've finished the quiz on <em>${post.bookTitle}</em>.</p><ul class="dl-list"><li>Review any questions you got wrong</li><li>Apply these concepts in a real decision this week</li><li>Return to earlier cards if concepts felt unclear</li></ul>` });
      break;

    default:
      slides.push({ icon: '📚', label: 'Lesson', title: post.bookTitle, body: '' });
  }

  return slides;
}

// ── DETAIL VIEW ───────────────────────────────────────────────────────────────
const DetailView = {
  post: null,
  slides: [],
  current: 0,
  quizAnswered: {},
  _touchStartX: 0,

  open(postId) {
    const post = SEED_POSTS.find(p => p.id === postId)
      || (typeof App !== 'undefined' ? App.feedPosts.find(p => p.id === postId) : null);
    if (!post) return;
    this.post = post;
    this.slides = generateLessonSlides(post);
    this.current = 0;
    this.quizAnswered = {};
    this.render();
    const overlay = document.getElementById('detail-overlay');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this._bindSwipe(overlay);
  },

  close() {
    document.getElementById('detail-overlay').classList.add('hidden');
    document.body.style.overflow = '';
    this.post = null;
  },

  goto(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.current = index;
    this.renderSlide();
  },

  next() {
    if (this.current === this.slides.length - 1) { this.close(); return; }
    this.goto(this.current + 1);
  },

  prev() { this.goto(this.current - 1); },

  _bindSwipe(el) {
    el.addEventListener('touchstart', e => { this._touchStartX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - this._touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev();
    }, { passive: true });
  },

  render() {
    const pillar = this.post.pillars?.[0] || 'Strategy';
    const color = PILLARS[pillar]?.color || '#6366f1';
    const p = Progress.get();
    const liked = p.likes[this.post.id];
    const bookmarked = p.bookmarks[this.post.id];

    document.getElementById('detail-overlay').innerHTML = `
      <div class="dl-container">
        <div class="dl-header">
          <button class="dl-close" onclick="DetailView.close()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="dl-book-meta">
            <span class="dl-book-title">${this.post.bookTitle}</span>
            <span class="dl-book-author">— ${this.post.author}</span>
          </div>
          <div class="dl-pillar-dot" style="background:${color}"></div>
        </div>
        <div class="dl-progress-bar">
          <div class="dl-progress-fill" id="dl-progress" style="background:${color}"></div>
        </div>
        <div id="dl-slide-area" class="dl-slide-area"></div>
        <div class="dl-foot">
          <div class="dl-nav">
            <button class="dl-nav-btn" id="dl-prev" onclick="DetailView.prev()">‹</button>
            <div class="dl-dots" id="dl-dots"></div>
            <button class="dl-nav-btn" id="dl-next" onclick="DetailView.next()">›</button>
          </div>
          <div class="dl-actions">
            <button class="dl-act ${liked ? 'dl-act--liked' : ''}" id="dl-like-btn" onclick="DetailView.toggleLike()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Like
            </button>
            <button class="dl-act ${bookmarked ? 'dl-act--saved' : ''}" id="dl-bm-btn" onclick="DetailView.toggleBookmark()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              Save
            </button>
            <button class="dl-act" onclick="DetailView.share()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
            <button class="dl-act dl-act--done" onclick="DetailView.close()">Done</button>
          </div>
        </div>
      </div>`;
    this.renderSlide();
  },

  renderSlide() {
    const slide = this.slides[this.current];
    const total = this.slides.length;
    const isLast = this.current === total - 1;
    const isQuizSlide = slide.type === 'quiz' && slide.quiz;
    const qi = isQuizSlide ? (slide.quiz.qi !== undefined ? slide.quiz.qi : 'gen') : null;
    const quizAnswered = isQuizSlide && this.quizAnswered[qi] !== undefined;

    const prog = document.getElementById('dl-progress');
    if (prog) prog.style.width = (((this.current + 1) / total) * 100) + '%';

    const dotsEl = document.getElementById('dl-dots');
    if (dotsEl) {
      dotsEl.innerHTML = this.slides.map((_, i) =>
        `<button class="dl-dot ${i === this.current ? 'active' : ''}" onclick="DetailView.goto(${i})"></button>`
      ).join('');
    }

    const prevBtn = document.getElementById('dl-prev');
    if (prevBtn) prevBtn.style.opacity = this.current === 0 ? '0.25' : '1';

    const nextBtn = document.getElementById('dl-next');
    if (nextBtn) {
      const locked = isLast && isQuizSlide && !quizAnswered;
      nextBtn.textContent = locked ? '—' : isLast ? '✓' : '›';
      nextBtn.style.background = (!locked && isLast) ? '#6366f1' : '';
      nextBtn.style.color = (!locked && isLast) ? '#fff' : '';
      nextBtn.style.opacity = locked ? '0.25' : '1';
      nextBtn.onclick = locked ? null : isLast ? () => DetailView.close() : () => DetailView.next();
    }

    const area = document.getElementById('dl-slide-area');
    if (area) {
      area.innerHTML = isQuizSlide
        ? this._renderQuizSlide(slide)
        : this._renderContentSlide(slide);
      area.scrollTop = 0;
    }
  },

  _renderContentSlide(slide) {
    return `
      <div class="dl-slide">
        <div class="dl-slide-eyebrow">
          <span class="dl-slide-icon">${slide.icon}</span>
          <span class="dl-slide-label">${slide.label}</span>
        </div>
        ${slide.title ? `<h2 class="dl-slide-title">${slide.title}</h2>` : ''}
        <div class="dl-slide-body">${slide.body || ''}</div>
      </div>`;
  },

  _renderQuizSlide(slide) {
    const q = slide.quiz;
    const qi = q.qi !== undefined ? q.qi : 'gen';
    const answered = this.quizAnswered[qi];
    const isCorrect = answered !== undefined && answered === q.correct;

    const resultBanner = answered !== undefined ? `
      <div class="dl-quiz-result ${isCorrect ? 'dl-quiz-result--correct' : 'dl-quiz-result--wrong'}">
        <span class="dl-quiz-result-icon">${isCorrect ? '✓' : '✗'}</span>
        <span>${isCorrect ? 'Correct!' : 'Not quite — see the explanation below'}</span>
      </div>` : '';

    const opts = (q.options || []).map((opt, oi) => {
      let cls = 'dl-quiz-opt';
      if (answered !== undefined) {
        if (oi === q.correct) cls += ' correct';
        else if (oi === answered) cls += ' wrong';
      }
      return `<button class="${cls}" ${answered !== undefined ? 'disabled' : ''}
        onclick="DetailView.answerQuiz(${JSON.stringify(qi)},${oi},${q.correct})">
        <span class="opt-letter">${String.fromCharCode(65 + oi)}</span>${opt}
      </button>`;
    }).join('');

    return `
      <div class="dl-slide">
        <div class="dl-slide-eyebrow">
          <span class="dl-slide-icon">${slide.icon}</span>
          <span class="dl-slide-label">${slide.label}</span>
        </div>
        <p class="dl-quiz-q">${q.q}</p>
        ${resultBanner}
        <div class="dl-quiz-opts">${opts}</div>
        ${answered !== undefined ? `<div class="dl-explanation">${q.explanation || ''}</div>` : '<p class="dl-quiz-hint">Tap an option to answer</p>'}
      </div>`;
  },

  answerQuiz(qi, selected, correct) {
    if (this.quizAnswered[qi] !== undefined) return;
    this.quizAnswered[qi] = selected;
    this.renderSlide();
    App.renderHeader();
  },

  share() {
    const slide = this.slides[this.current];
    const post = this.post;

    // Build share text from the current slide's content
    let excerpt = '';
    if (slide.type === 'quiz' && slide.quiz) {
      excerpt = slide.quiz.q;
    } else if (slide.body) {
      // Strip HTML tags to get plain text
      const tmp = document.createElement('div');
      tmp.innerHTML = slide.body;
      excerpt = tmp.textContent.trim().substring(0, 200);
    }
    if (!excerpt) excerpt = slide.title || post.bookTitle;

    const text = `📚 ${slide.title ? slide.title + '\n\n' : ''}${excerpt}\n\n— ${post.bookTitle} by ${post.author}\n\nFrom The Personal MBA Feed`;

    if (navigator.share) {
      navigator.share({ title: `${post.bookTitle} — ${slide.label || 'Insight'}`, text });
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
    }
  },

  toggleLike() {
    const isLiked = toggleLike(this.post.id);
    const btn = document.getElementById('dl-like-btn');
    if (btn) {
      btn.classList.toggle('dl-act--liked', isLiked);
      btn.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
    }
    showToast(isLiked ? '+2 XP — Liked!' : 'Unliked');
    App.renderHeader();
  },

  toggleBookmark() {
    const isBm = toggleBookmark(this.post.id);
    const btn = document.getElementById('dl-bm-btn');
    if (btn) {
      btn.classList.toggle('dl-act--saved', isBm);
      btn.querySelector('svg').setAttribute('fill', isBm ? 'currentColor' : 'none');
    }
    showToast(isBm ? '+3 XP — Saved!' : 'Removed from bookmarks');
    App.renderHeader();
  },
};

function openDetailView(postId) { DetailView.open(postId); }
