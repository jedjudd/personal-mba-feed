// ── PERSONAL MBA FEED — Google Apps Script Backend ────────────────────────────
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// Copy the deployment URL into js/config.js → CONFIG.appsScriptUrl

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── ROUTER ────────────────────────────────────────────────────────────────────
function doGet(e) {
  // Guard: running directly from editor sends no event object
  if (!e || !e.parameter) {
    return jsonResponse({ status: 'ok', message: 'Deploy as Web App to use. Run seedSheets() to initialize.' });
  }
  const action = e.parameter.action || 'feed';
  let result;
  try {
    switch (action) {
      case 'feed':      result = getFeed(e.parameter); break;
      case 'books':     result = getBooks(); break;
      case 'progress':  result = getProgress(); break;
      default:          result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }
  return jsonResponse(result);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch { return jsonResponse({ error: 'Invalid JSON' }); }

  let result;
  try {
    switch (body.action) {
      case 'like':        result = saveLike(body); break;
      case 'bookmark':    result = saveBookmark(body); break;
      case 'comment':     result = saveComment(body); break;
      case 'quiz':        result = saveQuizResult(body); break;
      case 'streak':      result = saveStreak(body); break;
      case 'importPosts': result = importPosts(body); break;
      default:            result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }
  return jsonResponse(result);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── FEED ──────────────────────────────────────────────────────────────────────
function getFeed(params) {
  const page  = parseInt(params.page  || 1);
  const limit = parseInt(params.limit || 10);
  const pillar = params.pillar || null;

  const sheet = getOrCreateSheet('Posts');
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { posts: SEED_POSTS_GS, total: SEED_POSTS_GS.length };

  const headers = rows[0];
  const posts = rows.slice(1)
    .filter(r => r[headers.indexOf('published')] === true || r[headers.indexOf('published')] === 'TRUE')
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => {
        if (h === 'pillars' || h === 'content') {
          try { obj[h] = JSON.parse(r[i]); } catch { obj[h] = r[i]; }
        } else {
          obj[h] = r[i];
        }
      });
      return obj;
    })
    .filter(p => !pillar || (p.pillars || []).includes(pillar));

  const total = posts.length;
  const page_posts = posts.slice((page - 1) * limit, page * limit);
  return { posts: page_posts, total };
}

// ── BOOKS ─────────────────────────────────────────────────────────────────────
function getBooks() {
  const sheet = getOrCreateSheet('Books');
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return SEED_BOOKS_GS;
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => {
      if (h === 'pillars') { try { obj[h] = JSON.parse(r[i]); } catch { obj[h] = []; } }
      else obj[h] = r[i];
    });
    return obj;
  });
}

// ── PROGRESS OPERATIONS ───────────────────────────────────────────────────────
function getProgress() {
  const sheet = getOrCreateSheet('UserProgress');
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return {};
  const headers = rows[0];
  const obj = {};
  headers.forEach((h, i) => {
    try { obj[h] = JSON.parse(rows[1][i]); } catch { obj[h] = rows[1][i]; }
  });
  return obj;
}

function saveLike(body) {
  appendToSheet('UserProgress', ['like', body.postId, body.value, new Date().toISOString()]);
  return { ok: true };
}

function saveBookmark(body) {
  appendToSheet('UserProgress', ['bookmark', body.postId, body.value, new Date().toISOString()]);
  return { ok: true };
}

function saveComment(body) {
  appendToSheet('UserProgress', ['comment', body.postId, body.text, new Date().toISOString()]);
  return { ok: true };
}

function saveQuizResult(body) {
  appendToSheet('UserProgress', ['quiz', body.postId, JSON.stringify({correct: body.correct, total: body.total}), new Date().toISOString()]);
  return { ok: true };
}

function saveStreak(body) {
  appendToSheet('UserProgress', ['streak', body.streak, body.xp, new Date().toISOString()]);
  return { ok: true };
}

// ── IMPORT POSTS ──────────────────────────────────────────────────────────────
function importPosts(body) {
  const posts = body.posts;
  if (!Array.isArray(posts)) return { error: 'Expected posts array' };

  const sheet = getOrCreateSheet('Posts');
  const headers = ['id','type','bookId','bookTitle','author','pillars','difficulty','published','content'];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  let count = 0;
  posts.forEach(post => {
    const row = headers.map(h => {
      if (h === 'pillars' || h === 'content') return JSON.stringify(post[h] || null);
      if (h === 'published') return post.published !== false;
      return post[h] || '';
    });
    sheet.appendRow(row);
    count++;
  });

  return { ok: true, imported: count };
}

// ── SHEET HELPERS ─────────────────────────────────────────────────────────────
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = {
      Posts:        ['id','type','bookId','bookTitle','author','pillars','difficulty','published','content'],
      Books:        ['id','title','author','pillars','color','status','rating'],
      UserProgress: ['action','postId','value','timestamp'],
      QuizQuestions:['postId','question','options','correct','explanation'],
      Resources:    ['pillar','name','url','description'],
    };
    if (headers[name]) {
      sheet.appendRow(headers[name]);
      sheet.getRange(1, 1, 1, headers[name].length).setFontWeight('bold');
    }
  }
  return sheet;
}

function appendToSheet(name, row) {
  getOrCreateSheet(name).appendRow(row);
}

// ── SEED DATA (fallback when Sheets is empty) ─────────────────────────────────
// This mirrors js/seed-data.js — keep in sync if you add books/posts

const SEED_BOOKS_GS = [
  { id: 'good-to-great',  title: 'Good to Great',          author: 'Jim Collins',     pillars: ['Strategy','Leadership'],        color: '#3b82f6', status: 'read', rating: 5 },
  { id: 'blue-ocean',     title: 'Blue Ocean Strategy',    author: 'W. Chan Kim',     pillars: ['Strategy','Marketing'],         color: '#14b8a6', status: 'read', rating: 5 },
  { id: 'lean-startup',   title: 'The Lean Startup',       author: 'Eric Ries',       pillars: ['Entrepreneurship','Operations'],color: '#f43f5e', status: 'read', rating: 5 },
  { id: 'thinking-fast',  title: 'Thinking, Fast and Slow',author: 'Daniel Kahneman', pillars: ['Personal Development','Systems Thinking'], color: '#eab308', status: 'read', rating: 5 },
  { id: 'radical-candor', title: 'Radical Candor',         author: 'Kim Scott',       pillars: ['Leadership','Communication'],   color: '#a855f7', status: 'read', rating: 5 },
  { id: 'made-to-stick',  title: 'Made to Stick',          author: 'Chip Heath',      pillars: ['Communication','Marketing'],    color: '#ec4899', status: 'read', rating: 5 },
  { id: 'the-goal',       title: 'The Goal',               author: 'Eliyahu Goldratt',pillars: ['Operations','Systems Thinking'],color: '#14b8a6', status: 'read', rating: 5 },
];

// Posts are served from js/seed-data.js when Apps Script URL isn't configured.
// Once you deploy and set the URL, all reads come from Sheets.
const SEED_POSTS_GS = [];

// ── SETUP: Populate Sheets with seed data ─────────────────────────────────────
// Run this function ONCE from the Apps Script editor after deploying.
function seedSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Books sheet
  const booksSheet = getOrCreateSheet('Books');
  if (booksSheet.getLastRow() <= 1) {
    SEED_BOOKS_GS.forEach(b => {
      booksSheet.appendRow([b.id, b.title, b.author, JSON.stringify(b.pillars), b.color, b.status, b.rating]);
    });
    Logger.log('Seeded Books sheet: ' + SEED_BOOKS_GS.length + ' books');
  }

  // Ensure all sheets exist
  ['Posts','UserProgress','QuizQuestions','Resources'].forEach(name => getOrCreateSheet(name));

  Logger.log('Setup complete. Deploy the web app and copy the URL into js/config.js');
}
