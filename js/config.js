// ── CONFIG ─────────────────────────────────────────────────────────────────
// appsScriptUrl is set via the in-app Settings screen (Profile → Settings)
// and persisted in localStorage. No need to edit this file.
const CONFIG = {
  get appsScriptUrl() { return localStorage.getItem('mba_api_url') || ''; },
  adminPin: '1234',
  postsPerPage: 10,
  cacheVersion: 1,
  cacheTTL: 5 * 60 * 1000,      // 5 min for content
  progressTTL: 60 * 1000,        // 1 min for progress
};

// ── PILLARS ─────────────────────────────────────────────────────────────────
const PILLARS = {
  Strategy:            { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  icon: '♟' },
  Finance:             { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   icon: '💰' },
  Leadership:          { color: '#a855f7', bg: 'rgba(168,85,247,0.15)',  icon: '⭐' },
  Operations:          { color: '#f97316', bg: 'rgba(249,115,22,0.15)',  icon: '⚙' },
  Marketing:           { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   icon: '📣' },
  'Systems Thinking':  { color: '#14b8a6', bg: 'rgba(20,184,166,0.15)', icon: '🔄' },
  'Personal Development': { color: '#eab308', bg: 'rgba(234,179,8,0.15)', icon: '🌱' },
  Communication:       { color: '#ec4899', bg: 'rgba(236,72,153,0.15)', icon: '💬' },
  Entrepreneurship:    { color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',  icon: '🚀' },
  'Product Management':{ color: '#6366f1', bg: 'rgba(99,102,241,0.15)', icon: '📦' },
};

const PILLAR_NAMES = Object.keys(PILLARS);

// ── DIFFICULTY ───────────────────────────────────────────────────────────────
const DIFFICULTY = {
  Beginner:     { color: '#22c55e', label: 'Beginner' },
  Intermediate: { color: '#f97316', label: 'Intermediate' },
  Advanced:     { color: '#ef4444', label: 'Advanced' },
};

// ── XP TABLE ─────────────────────────────────────────────────────────────────
const XP_REWARDS = {
  like: 2, unlike: -2,
  bookmark: 3,
  comment: 5,
  quizCorrect: 10,
  quizComplete: 15,
  bookComplete: 50,
  dailyStreak: 5,
  firstSession: 20,
};

const LEVELS = [
  { level: 1,  xpMin: 0,    title: 'Freshman' },
  { level: 2,  xpMin: 100,  title: 'Sophomore' },
  { level: 3,  xpMin: 250,  title: 'Junior' },
  { level: 4,  xpMin: 500,  title: 'Senior' },
  { level: 5,  xpMin: 900,  title: 'Graduate' },
  { level: 6,  xpMin: 1500, title: 'MBA Candidate' },
  { level: 7,  xpMin: 2500, title: 'MBA' },
  { level: 8,  xpMin: 4000, title: 'Executive' },
  { level: 9,  xpMin: 6000, title: 'Strategist' },
  { level: 10, xpMin: 9000, title: 'Distinguished Fellow' },
];

function getLevelInfo(xp) {
  let info = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xpMin) info = l; else break; }
  const nextLevel = LEVELS.find(l => l.xpMin > xp);
  const nextXp = nextLevel ? nextLevel.xpMin : info.xpMin + 1000;
  const pct = nextLevel ? Math.round(((xp - info.xpMin) / (nextXp - info.xpMin)) * 100) : 100;
  return { ...info, nextXp, pct };
}

// ── BADGES ───────────────────────────────────────────────────────────────────
const BADGE_DEFS = [
  { id: 'first_like',     icon: '❤️',  name: 'First Like',         desc: 'Liked your first post',          check: s => s.likeCount >= 1 },
  { id: 'first_bookmark', icon: '🔖', name: 'First Bookmark',      desc: 'Saved your first post',          check: s => s.bookmarkCount >= 1 },
  { id: 'first_comment',  icon: '💬', name: 'First Comment',       desc: 'Left your first comment',        check: s => s.commentCount >= 1 },
  { id: 'quiz_ace',       icon: '🎯', name: 'Quiz Ace',            desc: 'Completed a quiz',               check: s => s.quizzesCompleted >= 1 },
  { id: 'quiz_master',    icon: '🏆', name: 'Quiz Master',         desc: 'Completed 10 quizzes',           check: s => s.quizzesCompleted >= 10 },
  { id: 'streak_7',       icon: '🔥', name: '7-Day Streak',        desc: '7 days in a row',                check: s => s.maxStreak >= 7 },
  { id: 'streak_30',      icon: '⚡', name: '30-Day Streak',       desc: '30 days in a row',               check: s => s.maxStreak >= 30 },
  { id: 'bookworm',       icon: '📚', name: 'Bookworm',            desc: 'Engaged with 5 books',           check: s => s.booksEngaged >= 5 },
  { id: 'strategist',     icon: '♟',  name: 'Strategist',          desc: 'Mastered the Strategy pillar',   check: s => s.pillarMastery?.Strategy >= 0.7 },
  { id: 'lean_thinker',   icon: '🔄', name: 'Lean Thinker',        desc: 'Engaged with The Goal',          check: s => (s.booksRead || []).includes('the-goal') },
  { id: 'okr_operator',   icon: '🎯', name: 'OKR Operator',        desc: 'Engaged with Team OKR in Action',check: s => (s.booksRead || []).includes('team-okr-in-action') },
  { id: 'candid',         icon: '💜', name: 'Radically Candid',    desc: 'Engaged with Radical Candor',    check: s => (s.booksRead || []).includes('radical-candor') },
  { id: 'centurion',      icon: '💯', name: 'Centurion',           desc: 'Reached 100 XP',                 check: s => s.xp >= 100 },
  { id: 'thousand',       icon: '🌟', name: 'Thousand Club',       desc: 'Reached 1000 XP',                check: s => s.xp >= 1000 },
  { id: 'deep_diver',     icon: '🤿', name: 'Deep Diver',          desc: 'Read 50 posts',                  check: s => s.postsRead >= 50 },
];
