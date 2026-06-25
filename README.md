# 📚 Personal MBA Feed

A daily business learning app — Instagram-style feed of insights from 100+ books, with gamification, quizzes, and an MBA progress dashboard. Hosted on GitHub Pages, backed by Google Sheets.

**Live example:** `https://yourusername.github.io/personal-mba-feed/`

---

## Quickstart (15 minutes)

### Step 1 — Push to GitHub Pages

```bash
# Create a new repo named "personal-mba-feed" on GitHub, then:
cd personal-mba-feed
git init
git add .
git commit -m "Initial build"
git remote add origin https://github.com/YOURUSERNAME/personal-mba-feed.git
git push -u origin main

# In GitHub repo Settings → Pages → Source: Deploy from branch → main → / (root)
# URL will be: https://YOURUSERNAME.github.io/personal-mba-feed/
```

The app works immediately from GitHub Pages — it uses the embedded seed data (40+ posts from 10 books) with no backend required.

---

### Step 2 — Set up Google Sheets (optional, for unlimited content)

1. Go to [sheets.new](https://sheets.new) and create a blank spreadsheet
2. In the spreadsheet, click **Extensions → Apps Script**
3. Delete the default `myFunction` code, paste in the entire contents of `Code.gs`
4. Save (Ctrl+S), then click **Run → seedSheets** (accept the permissions prompt)
5. Deploy as Web App:
   - Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, copy the URL

6. In the app: **Profile → Settings → Apps Script URL** — paste the URL and tap **Save**.
   The URL is stored in `localStorage`; no code changes or redeployment needed.

---

### Step 3 — Add to Android home screen

1. Open Chrome on your Android phone
2. Navigate to `https://YOURUSERNAME.github.io/personal-mba-feed/`
3. Tap the **⋮ menu → Add to Home screen**
4. Opens as a full-screen app, no browser chrome

---

## Adding Content

### Option A — Generate with AI (recommended)

1. Go to `https://YOURUSERNAME.github.io/personal-mba-feed/admin/`
2. PIN: `1234` (change in `admin/index.html` line 1)
3. Enter a book title, click **Copy Prompt to Clipboard**
4. Paste into Claude or ChatGPT, copy the JSON output
5. Paste into the **Import Posts** box, click **Import**

### Option B — Edit seed-data.js directly

Add posts to the `SEED_POSTS` array in `js/seed-data.js`. Follow the schema below.

---

## Post JSON Schema

```json
{
  "id": "unique-slug-001",
  "type": "quote|framework|insight|carousel|quiz|stat|reflection|summary",
  "bookId": "url-safe-book-id",
  "bookTitle": "Full Book Title",
  "author": "Author Name",
  "pillars": ["Strategy"],
  "difficulty": "Beginner|Intermediate|Advanced",
  "content": {

    // QUOTE
    "quote": "The memorable line.",
    "context": "Why this matters.",

    // FRAMEWORK
    "title": "Framework Name",
    "subtitle": "Tagline",
    "items": [{ "label": "Item description", "color": "#3b82f6" }],
    "insight": "Real-world application example.",

    // INSIGHT
    "headline": "Key Idea Title",
    "body": "3-5 sentence explanation.",
    "example": "Concrete example from the real world.",

    // CAROUSEL
    "title": "Carousel Title",
    "slides": [{ "title": "Slide 1", "body": "Content..." }],

    // QUIZ
    "questions": [{
      "q": "Scenario-based question?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Why this answer is correct."
    }],

    // STAT
    "number": "42%",
    "label": "What this measures",
    "context": "Why it matters.",

    // REFLECTION
    "prompt": "Context from the book.",
    "question": "The journaling question.",

    // SUMMARY
    "premise": "Core thesis of the book.",
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "bestQuote": "The most memorable line.",
    "nextRead": "Recommended next book and why."
  }
}
```

---

## File Structure

```
personal-mba-feed/
├── index.html           — App shell (PWA)
├── manifest.json        — PWA manifest
├── sw.js                — Service worker (offline)
├── Code.gs              — Google Apps Script backend
├── css/
│   └── app.css          — All styles, dark/light mode
├── js/
│   ├── config.js        — API URL, pillars, XP table, badge definitions
│   ├── seed-data.js     — 40+ embedded posts (works with no backend)
│   ├── api.js           — localStorage cache + progress mutations
│   ├── cards.js         — Card rendering (all 8 types) + interactions
│   ├── dashboard.js     — Radar chart, pillar breakdown, gap analysis
│   └── app.js           — Tab routing, infinite scroll, modal, state
└── admin/
    └── index.html       — PIN-protected admin panel
```

---

## MBA Pillars

| Pillar | Color | Focus |
|---|---|---|
| Strategy | Blue | Competitive positioning, frameworks |
| Finance | Green | Accounting, investing, financial intelligence |
| Leadership | Purple | People, culture, management |
| Operations | Orange | Process, systems, execution |
| Marketing | Red | Positioning, messaging, growth |
| Systems Thinking | Teal | Feedback loops, leverage points |
| Personal Development | Gold | Habits, mindset, performance |
| Communication | Pink | Writing, presenting, persuasion |
| Entrepreneurship | Coral | Startups, risk, venture |
| Product Management | Indigo | Product strategy, roadmaps, discovery |

---

## Gamification

| Action | XP |
|---|---|
| Like a post | +2 |
| Bookmark | +3 |
| Comment / Reflect | +5 |
| Quiz correct answer | +10 |
| Complete a quiz | +15 |
| Finish a book | +50 |
| Daily streak | +5 × streak days (capped ×10) |

**Levels:** Freshman → Sophomore → Junior → Senior → Graduate → MBA Candidate → MBA → Executive → Strategist → Distinguished Fellow

---

## Recommended Additional Books

See Admin panel → "Recommended Additional Books" for 15 curated titles that fill gaps across Finance, Negotiation, Behavioral Psychology, and Systems Thinking.

---

## Customization

**Change admin PIN:** Edit `admin/index.html`, line starting with `const ADMIN_PIN`

**Change posts per page:** Edit `js/config.js` → `postsPerPage`

**Add a book:** Add to `SEED_BOOKS` in `js/seed-data.js`, then add posts for it

**Change the service worker scope:** If hosting at root (not `/personal-mba-feed/`), update `sw.js` and `manifest.json` paths

---

## Architecture Notes

- **No backend required** — the app is fully functional using `localStorage` for all progress data and the embedded `SEED_POSTS` array for content.
- **Google Sheets is additive** — once you set `appsScriptUrl`, the app fetches from Sheets and falls back to seed data on failure.
- **Single user design** — progress is stored in `localStorage` under `mba_progress_v1`. No auth, no multi-user.
- **PWA / offline** — service worker caches all static assets. Feed posts load from `localStorage` cache when offline.
