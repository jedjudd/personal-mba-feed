// ── SEED BOOKS ────────────────────────────────────────────────────────────────
const SEED_BOOKS = [
  { id: 'good-to-great',   title: 'Good to Great',                   author: 'Jim Collins',        pillars: ['Strategy','Leadership'],          color: '#3b82f6', status: 'read', rating: 5 },
  { id: 'blue-ocean',      title: 'Blue Ocean Strategy',             author: 'W. Chan Kim',         pillars: ['Strategy','Marketing'],           color: '#14b8a6', status: 'read', rating: 5 },
  { id: 'lean-startup',    title: 'The Lean Startup',                author: 'Eric Ries',           pillars: ['Entrepreneurship','Operations'],   color: '#f43f5e', status: 'read', rating: 5 },
  { id: 'thinking-fast',   title: 'Thinking, Fast and Slow',         author: 'Daniel Kahneman',    pillars: ['Personal Development','Systems Thinking'], color: '#eab308', status: 'read', rating: 5 },
  { id: 'how-to-win',      title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', pillars: ['Communication','Leadership'],   color: '#ec4899', status: 'read', rating: 5 },
  { id: 'start-with-why', title: 'Start with Why',                   author: 'Simon Sinek',        pillars: ['Leadership','Marketing'],          color: '#a855f7', status: 'read', rating: 5 },
  { id: 'gtd',             title: 'Getting Things Done',             author: 'David Allen',        pillars: ['Personal Development','Operations'], color: '#f97316', status: 'read', rating: 4 },
  { id: 'radical-candor',  title: 'Radical Candor',                  author: 'Kim Scott',          pillars: ['Leadership','Communication'],      color: '#a855f7', status: 'read', rating: 5 },
  { id: 'rich-dad',        title: 'Rich Dad Poor Dad',               author: 'Robert Kiyosaki',    pillars: ['Finance','Personal Development'],  color: '#22c55e', status: 'read', rating: 4 },
  { id: 'made-to-stick',   title: 'Made to Stick',                   author: 'Chip Heath',         pillars: ['Communication','Marketing'],       color: '#ec4899', status: 'read', rating: 5 },
  { id: 'the-goal',        title: 'The Goal',                        author: 'Eliyahu Goldratt',   pillars: ['Operations','Systems Thinking'],   color: '#14b8a6', status: 'read', rating: 5 },
  { id: 'thinking-systems',title: 'Thinking in Systems',             author: 'Donella Meadows',    pillars: ['Systems Thinking'],               color: '#14b8a6', status: 'read', rating: 5 },
];

// ── SEED POSTS ────────────────────────────────────────────────────────────────
const SEED_POSTS = [

  // ── GOOD TO GREAT ──
  {
    id: 'g2g-001', type: 'quote', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Strategy','Leadership'], difficulty: 'Intermediate',
    content: {
      quote: 'Good is the enemy of great. And that is one of the key reasons why we have so little that becomes great.',
      context: 'Collins studied 1,435 companies over 40 years to find what separates truly great companies from merely good ones.',
    },
  },
  {
    id: 'g2g-002', type: 'framework', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Strategy','Leadership'], difficulty: 'Intermediate',
    content: {
      title: 'The Hedgehog Concept',
      subtitle: 'Three overlapping circles that define your "one big thing"',
      items: [
        { label: 'What you are DEEPLY PASSIONATE about', color: '#3b82f6' },
        { label: 'What you can be BEST IN THE WORLD at', color: '#a855f7' },
        { label: 'What DRIVES YOUR ECONOMIC ENGINE', color: '#22c55e' },
      ],
      insight: 'Great companies ignore opportunities that fall outside these three circles. The intersection is your Hedgehog Concept — pursue it relentlessly.',
    },
  },
  {
    id: 'g2g-003', type: 'insight', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Leadership'], difficulty: 'Intermediate',
    content: {
      headline: 'Level 5 Leadership: Humility + Will',
      body: 'The best leaders Collins studied weren\'t charismatic visionaries — they were humble people with fierce professional will. They attributed success to their team and circumstances, and failure to themselves.',
      example: 'Darwin Smith (Kimberly-Clark CEO) sold the company\'s paper mills — its core business — to bet everything on consumer brands. Utterly counterintuitive, wildly successful. When asked about his leadership, he said he was "just trying to do the right job."',
    },
  },
  {
    id: 'g2g-004', type: 'stat', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Strategy'], difficulty: 'Beginner',
    content: {
      number: '6.9×',
      label: 'average stock returns above market',
      context: 'Good-to-great companies sustained this performance for at least 15 years after their transformation point — not from a single bet or charismatic leader.',
    },
  },
  {
    id: 'g2g-005', type: 'quiz', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Strategy','Leadership'], difficulty: 'Intermediate',
    content: {
      questions: [
        {
          q: 'What does Collins mean by "First Who, Then What"?',
          options: [
            'Hire people before deciding strategy',
            'Define strategy before hiring',
            'Always interview internally first',
            'Customers first, employees second',
          ],
          correct: 0,
          explanation: 'Great leaders get the right people on the bus FIRST, then figure out where to drive it. With the right people, you can adapt to almost any strategy.',
        },
        {
          q: 'The Flywheel concept means:',
          options: [
            'One big breakthrough creates all momentum',
            'Consistent small pushes compound into unstoppable momentum',
            'Technology is the primary driver of success',
            'Acquisitions build scale quickly',
          ],
          correct: 1,
          explanation: 'There\'s no single defining moment. Great companies build momentum through consistent disciplined effort — each push makes the next one easier.',
        },
      ],
    },
  },
  {
    id: 'g2g-006', type: 'reflection', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Strategy','Leadership'], difficulty: 'Advanced',
    content: {
      prompt: 'The Stockdale Paradox says great leaders confront the brutal facts of reality while simultaneously maintaining unwavering faith they will prevail.',
      question: 'Think of a current challenge in your work or life. Are you confronting the brutal facts clearly — or telling yourself a comforting story? What would it mean to hold both honesty and optimism at the same time?',
    },
  },

  // ── BLUE OCEAN STRATEGY ──
  {
    id: 'bos-001', type: 'quote', bookId: 'blue-ocean',
    bookTitle: 'Blue Ocean Strategy', author: 'W. Chan Kim',
    pillars: ['Strategy','Marketing'], difficulty: 'Intermediate',
    content: {
      quote: 'The only way to beat the competition is to stop trying to beat the competition.',
      context: 'Kim & Mauborgne analyzed 150 strategic moves across 30+ industries over 100 years to identify what creates uncontested market space.',
    },
  },
  {
    id: 'bos-002', type: 'framework', bookId: 'blue-ocean',
    bookTitle: 'Blue Ocean Strategy', author: 'W. Chan Kim',
    pillars: ['Strategy','Marketing'], difficulty: 'Intermediate',
    content: {
      title: 'The Four Actions Framework',
      subtitle: 'Break the value-cost trade-off',
      items: [
        { label: 'ELIMINATE — which factors should be removed entirely?', color: '#ef4444' },
        { label: 'REDUCE — which factors should be reduced well below standard?', color: '#f97316' },
        { label: 'RAISE — which factors should be elevated well above standard?', color: '#22c55e' },
        { label: 'CREATE — which factors should be created that the industry never offered?', color: '#3b82f6' },
      ],
      insight: 'Cirque du Soleil eliminated animals and star performers (cost), raised artistry and venue, created a theatrical narrative — charging 5× circus prices.',
    },
  },
  {
    id: 'bos-003', type: 'carousel', bookId: 'blue-ocean',
    bookTitle: 'Blue Ocean Strategy', author: 'W. Chan Kim',
    pillars: ['Strategy'], difficulty: 'Advanced',
    content: {
      title: 'Red Ocean vs Blue Ocean Thinking',
      slides: [
        { title: 'Red Ocean', body: 'Compete in existing market space. Beat the competition. Exploit existing demand. Make the value-cost trade-off. Align the whole system with a strategic choice of differentiation OR low cost.' },
        { title: 'Blue Ocean', body: 'Create uncontested market space. Make the competition irrelevant. Create and capture new demand. Break the value-cost trade-off. Align the whole system in pursuit of differentiation AND low cost.' },
        { title: 'Classic Example: iTunes', body: 'Apple didn\'t compete with music stores — they made piracy AND physical retail irrelevant. 99¢/song created a new market of people who wouldn\'t buy full albums.' },
        { title: 'Your Turn', body: 'What assumptions is your industry making about who the customer is, what they value, and what must be included? Challenging one assumption = your blue ocean.' },
      ],
    },
  },
  {
    id: 'bos-004', type: 'stat', bookId: 'blue-ocean',
    bookTitle: 'Blue Ocean Strategy', author: 'W. Chan Kim',
    pillars: ['Strategy','Marketing'], difficulty: 'Beginner',
    content: {
      number: '86%',
      label: 'of new launches were line extensions into Red Oceans',
      context: 'Yet those 14% of Blue Ocean launches generated 61% of total profits in the study. Competing less = earning more.',
    },
  },

  // ── THE LEAN STARTUP ──
  {
    id: 'lean-001', type: 'quote', bookId: 'lean-startup',
    bookTitle: 'The Lean Startup', author: 'Eric Ries',
    pillars: ['Entrepreneurship','Operations'], difficulty: 'Beginner',
    content: {
      quote: 'The only way to win is to learn faster than anyone else.',
      context: 'Ries developed Lean Startup while building IMVU, where he learned that shipping features customers didn\'t want faster was not an advantage.',
    },
  },
  {
    id: 'lean-002', type: 'framework', bookId: 'lean-startup',
    bookTitle: 'The Lean Startup', author: 'Eric Ries',
    pillars: ['Entrepreneurship','Operations'], difficulty: 'Intermediate',
    content: {
      title: 'Build → Measure → Learn',
      subtitle: 'The core feedback loop of the Lean Startup',
      items: [
        { label: 'BUILD — minimum viable product (MVP), not the perfect product', color: '#f43f5e' },
        { label: 'MEASURE — validated learning, not vanity metrics', color: '#f97316' },
        { label: 'LEARN — pivot or persevere based on data', color: '#22c55e' },
      ],
      insight: 'Zappos didn\'t build a shoe warehouse. They photographed shoes at local stores and bought them retail when orders came in. The MVP validated demand before any infrastructure.',
    },
  },
  {
    id: 'lean-003', type: 'insight', bookId: 'lean-startup',
    bookTitle: 'The Lean Startup', author: 'Eric Ries',
    pillars: ['Entrepreneurship'], difficulty: 'Intermediate',
    content: {
      headline: 'Vanity Metrics vs Actionable Metrics',
      body: 'A vanity metric makes you feel good but doesn\'t change your decisions. Total registered users is a vanity metric. Active users who returned after 7 days is actionable — it tells you whether you\'re actually solving the problem.',
      example: 'A startup celebrated 1 million app downloads. But when they broke it down by cohort: 95% never opened the app twice. The real metric was Week-1 retention — 5%. Everything else was noise.',
    },
  },
  {
    id: 'lean-004', type: 'quiz', bookId: 'lean-startup',
    bookTitle: 'The Lean Startup', author: 'Eric Ries',
    pillars: ['Entrepreneurship','Operations'], difficulty: 'Intermediate',
    content: {
      questions: [
        {
          q: 'What is an MVP (Minimum Viable Product)?',
          options: [
            'The cheapest version of your product',
            'A version with enough features to learn from real customers',
            'A product you\'re not embarrassed by',
            'A prototype shown only to investors',
          ],
          correct: 1,
          explanation: 'An MVP isn\'t about being minimum — it\'s about maximum learning per unit of effort. It can even be a concierge (human-powered) service.',
        },
        {
          q: 'A "pivot" in Lean Startup means:',
          options: [
            'Shutting down the company',
            'A structured course correction testing a new fundamental hypothesis',
            'Changing your marketing message',
            'Firing the founding team',
          ],
          correct: 1,
          explanation: 'A pivot is a deliberate strategic change based on validated learning — not giving up. Instagram pivoted from a gaming app. YouTube from video dating.',
        },
      ],
    },
  },

  // ── THINKING FAST AND SLOW ──
  {
    id: 'tfs-001', type: 'quote', bookId: 'thinking-fast',
    bookTitle: 'Thinking, Fast and Slow', author: 'Daniel Kahneman',
    pillars: ['Personal Development','Systems Thinking'], difficulty: 'Intermediate',
    content: {
      quote: 'Nothing in life is as important as you think it is, while you are thinking about it.',
      context: 'Kahneman calls this the "focusing illusion" — our attention on any topic inflates its perceived importance to our wellbeing.',
    },
  },
  {
    id: 'tfs-002', type: 'framework', bookId: 'thinking-fast',
    bookTitle: 'Thinking, Fast and Slow', author: 'Daniel Kahneman',
    pillars: ['Personal Development','Systems Thinking'], difficulty: 'Advanced',
    content: {
      title: 'System 1 vs System 2',
      subtitle: 'The two modes of thinking',
      items: [
        { label: 'SYSTEM 1 — Fast, automatic, emotional, intuitive, always on. Uses heuristics. Prone to biases.', color: '#ef4444' },
        { label: 'SYSTEM 2 — Slow, deliberate, logical, effortful. Rarely engaged. Can override System 1.', color: '#3b82f6' },
      ],
      insight: 'Most of our decisions are System 1. We think we\'re being rational (System 2) but we\'re usually rationalizing after the fact.',
    },
  },
  {
    id: 'tfs-003', type: 'insight', bookId: 'thinking-fast',
    bookTitle: 'Thinking, Fast and Slow', author: 'Daniel Kahneman',
    pillars: ['Systems Thinking','Personal Development'], difficulty: 'Advanced',
    content: {
      headline: 'Anchoring: The First Number Wins',
      body: 'When estimating, the first number you hear anchors your judgment — even if it\'s completely arbitrary. In negotiation, salary discussions, and pricing, the party who names the first number has a structural advantage.',
      example: 'Experiment: spin a wheel stopping at 10 or 65, then ask "what percentage of African countries are in the UN?" People who saw 10 guessed ~25%. People who saw 65 guessed ~45%. The wheel was random. The anchor was real.',
    },
  },
  {
    id: 'tfs-004', type: 'stat', bookId: 'thinking-fast',
    bookTitle: 'Thinking, Fast and Slow', author: 'Daniel Kahneman',
    pillars: ['Personal Development'], difficulty: 'Intermediate',
    content: {
      number: '~95%',
      label: 'of cognition is System 1 (fast, automatic)',
      context: 'We\'re not rational calculators who occasionally make mistakes. We\'re intuitive pattern-matchers who occasionally reflect.',
    },
  },

  // ── HOW TO WIN FRIENDS ──
  {
    id: 'htw-001', type: 'quote', bookId: 'how-to-win',
    bookTitle: 'How to Win Friends and Influence People', author: 'Dale Carnegie',
    pillars: ['Communication','Leadership'], difficulty: 'Beginner',
    content: {
      quote: 'You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.',
      context: 'First published in 1936, this remains the most influential book ever written on human relations. Over 30 million copies sold.',
    },
  },
  {
    id: 'htw-002', type: 'framework', bookId: 'how-to-win',
    bookTitle: 'How to Win Friends and Influence People', author: 'Dale Carnegie',
    pillars: ['Communication'], difficulty: 'Beginner',
    content: {
      title: 'Six Ways to Make People Like You',
      subtitle: 'Carnegie\'s core techniques',
      items: [
        { label: '1. Become genuinely interested in other people', color: '#ec4899' },
        { label: '2. Smile', color: '#ec4899' },
        { label: '3. Remember that a person\'s name is, to that person, the sweetest sound', color: '#ec4899' },
        { label: '4. Be a good listener — encourage others to talk about themselves', color: '#ec4899' },
        { label: '5. Talk in terms of the other person\'s interests', color: '#ec4899' },
        { label: '6. Make the other person feel important — sincerely', color: '#ec4899' },
      ],
      insight: 'None of these require charisma or talent. They require genuine attention. The rarest thing you can give someone today.',
    },
  },
  {
    id: 'htw-003', type: 'insight', bookId: 'how-to-win',
    bookTitle: 'How to Win Friends and Influence People', author: 'Dale Carnegie',
    pillars: ['Communication','Leadership'], difficulty: 'Beginner',
    content: {
      headline: 'Never Criticize, Condemn, or Complain',
      body: 'Criticism is futile because it puts the other person on the defensive. Instead, try to understand — genuinely understand — why they did what they did. That understanding leads to tolerance and kindness.',
      example: 'Al Capone didn\'t think of himself as a villain. Most people who do wrong things believe they are justified. Changing behavior requires making the other person want to change — not proving them wrong.',
    },
  },

  // ── START WITH WHY ──
  {
    id: 'swy-001', type: 'quote', bookId: 'start-with-why',
    bookTitle: 'Start with Why', author: 'Simon Sinek',
    pillars: ['Leadership','Marketing'], difficulty: 'Beginner',
    content: {
      quote: 'People don\'t buy what you do; they buy why you do it.',
      context: 'Sinek noticed that inspired leaders all communicate the same way — from the inside out. Most organizations communicate from the outside in.',
    },
  },
  {
    id: 'swy-002', type: 'framework', bookId: 'start-with-why',
    bookTitle: 'Start with Why', author: 'Simon Sinek',
    pillars: ['Leadership','Marketing'], difficulty: 'Beginner',
    content: {
      title: 'The Golden Circle',
      subtitle: 'Why → How → What (inside out)',
      items: [
        { label: 'WHY — your purpose, cause, or belief. Why does your organization exist?', color: '#f97316' },
        { label: 'HOW — your differentiating values and principles. Your process.', color: '#3b82f6' },
        { label: 'WHAT — the products and services you sell. The proof of your Why.', color: '#6366f1' },
      ],
      insight: 'Apple\'s Why: "We challenge the status quo." Their ads never lead with specs — they lead with belief. Wright Brothers had no money, no connections, no college degrees. Langley (who had all three) lost. Why matters.',
    },
  },
  {
    id: 'swy-003', type: 'carousel', bookId: 'start-with-why',
    bookTitle: 'Start with Why', author: 'Simon Sinek',
    pillars: ['Leadership'], difficulty: 'Intermediate',
    content: {
      title: 'The Celery Test',
      slides: [
        { title: 'The Problem', body: 'Everyone gives you advice. Someone says buy celery. Someone says buy Oreos. Someone says buy rice milk. You do it all — lots of money, confusing message, exhausted team.' },
        { title: 'The Solution', body: 'When you know your Why, you filter every decision through it. If your Why is "healthy living," you go back to the store and buy only the celery — and leave behind everything that doesn\'t fit.' },
        { title: 'Business Application', body: 'Southwest Airlines\' Why: "democratize air travel." Every decision — no assigned seats, no hub, no frills — passes the celery test. Continental tried Southwest\'s tactics without Southwest\'s Why. It failed.' },
        { title: 'Your Turn', body: 'Complete this sentence: "Everything we do is to _____ so that _____." The first blank is your How. The second is your Why. If you can\'t complete it, that\'s your work.' },
      ],
    },
  },

  // ── GETTING THINGS DONE ──
  {
    id: 'gtd-001', type: 'quote', bookId: 'gtd',
    bookTitle: 'Getting Things Done', author: 'David Allen',
    pillars: ['Personal Development','Operations'], difficulty: 'Beginner',
    content: {
      quote: 'Your mind is for having ideas, not holding them.',
      context: 'Allen realized that most stress doesn\'t come from having too much to do — it comes from not honoring commitments to yourself by not completing what you said you would.',
    },
  },
  {
    id: 'gtd-002', type: 'framework', bookId: 'gtd',
    bookTitle: 'Getting Things Done', author: 'David Allen',
    pillars: ['Personal Development','Operations'], difficulty: 'Intermediate',
    content: {
      title: 'The GTD Processing Tree',
      subtitle: 'What to do with every input',
      items: [
        { label: 'Is it actionable? NO → Trash / Someday-Maybe / Reference', color: '#9ca3af' },
        { label: 'Is it actionable? YES → What\'s the NEXT action?', color: '#22c55e' },
        { label: 'Will it take < 2 minutes? YES → Do it now', color: '#22c55e' },
        { label: 'Should you do it? NO → Delegate (Waiting For list)', color: '#f97316' },
        { label: 'Should you do it? YES → Defer (Calendar or Next Actions)', color: '#3b82f6' },
      ],
      insight: 'The 2-minute rule is the most important productivity rule. If you keep re-reading something and not doing it, you\'re paying a "psychic debt" every time.',
    },
  },

  // ── RADICAL CANDOR ──
  {
    id: 'rc-001', type: 'quote', bookId: 'radical-candor',
    bookTitle: 'Radical Candor', author: 'Kim Scott',
    pillars: ['Leadership','Communication'], difficulty: 'Intermediate',
    content: {
      quote: 'The worst thing you can do for the people you work with is not tell them the truth.',
      context: 'Scott built her framework from experience managing teams at Apple and Google, where she saw how silence disguised as kindness destroys careers.',
    },
  },
  {
    id: 'rc-002', type: 'framework', bookId: 'radical-candor',
    bookTitle: 'Radical Candor', author: 'Kim Scott',
    pillars: ['Leadership','Communication'], difficulty: 'Intermediate',
    content: {
      title: 'The Radical Candor 2×2',
      subtitle: 'Challenge Directly × Care Personally',
      items: [
        { label: 'RADICAL CANDOR — high care + high challenge. "I\'m telling you this because I care about you and expect more."', color: '#22c55e' },
        { label: 'RUINOUS EMPATHY — high care + low challenge. Being "nice" while watching someone fail.', color: '#f97316' },
        { label: 'OBNOXIOUS AGGRESSION — low care + high challenge. Being honest but hurtful.', color: '#ef4444' },
        { label: 'MANIPULATIVE INSINCERITY — low care + low challenge. Praise you don\'t mean, avoid feedback you should give.', color: '#6b7280' },
      ],
      insight: 'Most managers default to Ruinous Empathy. They don\'t want to hurt feelings. But withholding honest feedback is the most harmful thing you can do to someone\'s career.',
    },
  },
  {
    id: 'rc-003', type: 'insight', bookId: 'radical-candor',
    bookTitle: 'Radical Candor', author: 'Kim Scott',
    pillars: ['Leadership'], difficulty: 'Intermediate',
    content: {
      headline: 'Praise and Criticism: The Same Formula',
      body: 'Radically candid feedback — positive or negative — must be specific, immediate, and in-person. Vague praise ("great job!") teaches nothing. Delayed criticism is punishment, not coaching.',
      example: '"Hey, I noticed in the all-hands you said \'um\' 25 times in the first five minutes — I counted. I think it was nerves, and I can help. Want to practice before the next one?" That\'s Radical Candor.',
    },
  },

  // ── RICH DAD POOR DAD ──
  {
    id: 'rdpd-001', type: 'quote', bookId: 'rich-dad',
    bookTitle: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki',
    pillars: ['Finance','Personal Development'], difficulty: 'Beginner',
    content: {
      quote: 'The poor and middle class work for money. The rich have money work for them.',
      context: 'Written as a narrative of the two father figures in Kiyosaki\'s life — his educated but financially struggling biological father vs his friend\'s father who dropped out of school but built wealth.',
    },
  },
  {
    id: 'rdpd-002', type: 'framework', bookId: 'rich-dad',
    bookTitle: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki',
    pillars: ['Finance'], difficulty: 'Beginner',
    content: {
      title: 'Asset vs Liability',
      subtitle: 'The most important financial distinction',
      items: [
        { label: 'ASSET — something that puts money IN your pocket. Rental income, dividends, royalties, business that runs without you.', color: '#22c55e' },
        { label: 'LIABILITY — something that takes money OUT of your pocket. Car payments, mortgage on your primary home, consumer debt.', color: '#ef4444' },
      ],
      insight: 'Most people think their house is an asset. But it costs money every month. An asset PAYS you. Rich people buy assets; the middle class buys liabilities thinking they\'re assets.',
    },
  },
  {
    id: 'rdpd-003', type: 'stat', bookId: 'rich-dad',
    bookTitle: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki',
    pillars: ['Finance'], difficulty: 'Beginner',
    content: {
      number: '40%',
      label: 'of income goes to taxes for the average employee',
      context: 'Rich Dad\'s lesson: corporations pay taxes AFTER expenses. Employees pay income tax BEFORE expenses. The legal entity changes your tax position dramatically.',
    },
  },

  // ── MADE TO STICK ──
  {
    id: 'mts-001', type: 'quote', bookId: 'made-to-stick',
    bookTitle: 'Made to Stick', author: 'Chip Heath',
    pillars: ['Communication','Marketing'], difficulty: 'Beginner',
    content: {
      quote: 'The curse of knowledge: once we know something, we find it hard to imagine what it was like not to know it.',
      context: 'Heath brothers studied why some ideas survive and others die. The Curse of Knowledge is the #1 reason experts communicate badly.',
    },
  },
  {
    id: 'mts-002', type: 'framework', bookId: 'made-to-stick',
    bookTitle: 'Made to Stick', author: 'Chip Heath',
    pillars: ['Communication','Marketing'], difficulty: 'Intermediate',
    content: {
      title: 'SUCCESs — Six Traits of Sticky Ideas',
      subtitle: 'What makes ideas survive',
      items: [
        { label: 'SIMPLE — find the core. Prune ruthlessly.', color: '#ec4899' },
        { label: 'UNEXPECTED — break a pattern to get attention. Then fill the gap.', color: '#f97316' },
        { label: 'CONCRETE — use sensory language. Abstract = forgettable.', color: '#eab308' },
        { label: 'CREDIBLE — use statistics sparingly. Use human-scale examples.', color: '#22c55e' },
        { label: 'EMOTIONAL — people care about people, not numbers.', color: '#3b82f6' },
        { label: 'STORIES — inspire people to act. Simulation + inspiration.', color: '#a855f7' },
      ],
      insight: 'JFK didn\'t say "let\'s improve the space program." He said "we will put a man on the moon and return him safely before the end of the decade." Concrete. Unexpected. Emotional. A story waiting to happen.',
    },
  },
  {
    id: 'mts-003', type: 'carousel', bookId: 'made-to-stick',
    bookTitle: 'Made to Stick', author: 'Chip Heath',
    pillars: ['Communication'], difficulty: 'Intermediate',
    content: {
      title: 'The Tappers and Listeners Experiment',
      slides: [
        { title: 'The Setup', body: 'Stanford researcher Elizabeth Newton had "tappers" tap out well-known songs with their fingers. She asked them to predict: what percentage of "listeners" would identify the song?' },
        { title: 'The Guess', body: 'Tappers predicted 50% of listeners would identify the song. They could hear the melody in their heads as they tapped.' },
        { title: 'Reality', body: 'Listeners got it right 2.5% of the time. But from the tapper\'s perspective, it seemed obvious. They couldn\'t NOT hear the melody.' },
        { title: 'The Lesson', body: 'This is the Curse of Knowledge. When you know something deeply, you communicate it assuming the other person hears what you hear. They don\'t. Use concrete examples to bridge the gap.' },
      ],
    },
  },

  // ── THE GOAL ──
  {
    id: 'goal-001', type: 'quote', bookId: 'the-goal',
    bookTitle: 'The Goal', author: 'Eliyahu Goldratt',
    pillars: ['Operations','Systems Thinking'], difficulty: 'Intermediate',
    content: {
      quote: 'Tell me how you measure me, and I will tell you how I will behave.',
      context: 'Written as a novel — a factory manager has 90 days to save his plant. Through conversations with a physicist named Jonah, he discovers the Theory of Constraints.',
    },
  },
  {
    id: 'goal-002', type: 'framework', bookId: 'the-goal',
    bookTitle: 'The Goal', author: 'Eliyahu Goldratt',
    pillars: ['Operations','Systems Thinking'], difficulty: 'Advanced',
    content: {
      title: 'Theory of Constraints — The Five Steps',
      subtitle: 'Every system has exactly one bottleneck that limits throughput',
      items: [
        { label: '1. IDENTIFY — find the one constraint limiting system throughput', color: '#f97316' },
        { label: '2. EXPLOIT — squeeze maximum performance from the constraint (don\'t waste its time)', color: '#eab308' },
        { label: '3. SUBORDINATE — align everything else to support the constraint', color: '#3b82f6' },
        { label: '4. ELEVATE — invest to increase constraint capacity', color: '#22c55e' },
        { label: '5. REPEAT — the constraint will shift; find the new one', color: '#a855f7' },
      ],
      insight: 'An hour lost at the bottleneck is an hour lost for the entire system. An hour saved at a non-bottleneck saves nothing. This is why local efficiency measures are dangerous.',
    },
  },
  {
    id: 'goal-003', type: 'insight', bookId: 'the-goal',
    bookTitle: 'The Goal', author: 'Eliyahu Goldratt',
    pillars: ['Operations'], difficulty: 'Advanced',
    content: {
      headline: 'Throughput Accounting vs Cost Accounting',
      body: 'Traditional cost accounting makes local optimization look good. TOC uses three metrics: Throughput (rate money comes in), Inventory (money tied up in the system), Operating Expense (money to turn inventory into throughput).',
      example: 'Running non-constraint machines at 100% feels productive but creates inventory piles that aren\'t throughput. "Efficiency" at a non-bottleneck is a mirage. Goldratt showed that reducing batch sizes and synchronizing to the bottleneck (the "drum") dramatically reduces lead time — even with the same total capacity.',
    },
  },

  // ── THINKING IN SYSTEMS ──
  {
    id: 'tis-001', type: 'quote', bookId: 'thinking-systems',
    bookTitle: 'Thinking in Systems', author: 'Donella Meadows',
    pillars: ['Systems Thinking'], difficulty: 'Advanced',
    content: {
      quote: 'You think that because you understand "one" that you must therefore understand "two" because one and one make two. But you forget that you must also understand "and."',
      context: 'Meadows was a pioneer in systems thinking, best known for the 1972 Limits to Growth study. This book is her masterwork on systems dynamics.',
    },
  },
  {
    id: 'tis-002', type: 'framework', bookId: 'thinking-systems',
    bookTitle: 'Thinking in Systems', author: 'Donella Meadows',
    pillars: ['Systems Thinking'], difficulty: 'Advanced',
    content: {
      title: 'Stocks, Flows, and Feedback Loops',
      subtitle: 'The fundamental vocabulary of systems',
      items: [
        { label: 'STOCK — any quantity that accumulates over time: water in a bathtub, money in an account, trust in a relationship', color: '#3b82f6' },
        { label: 'FLOW — the rate of change in a stock: income (in), expenses (out), learning (in), forgetting (out)', color: '#22c55e' },
        { label: 'REINFORCING LOOP — self-amplifying: growth creates more growth (compounding interest, viral spread, arms races)', color: '#f97316' },
        { label: 'BALANCING LOOP — goal-seeking: a thermostat, hunger, market prices seeking equilibrium', color: '#a855f7' },
      ],
      insight: 'Most policy failures come from intervening at the wrong place in a system, or ignoring the delays between action and effect.',
    },
  },
  {
    id: 'tis-003', type: 'stat', bookId: 'thinking-systems',
    bookTitle: 'Thinking in Systems', author: 'Donella Meadows',
    pillars: ['Systems Thinking'], difficulty: 'Advanced',
    content: {
      number: '72 years',
      label: 'for atmospheric CO₂ to respond to policy changes',
      context: 'Meadows\'s example of why systems with long delays are so hard to manage: by the time you see the problem clearly, the cause is decades in the past. This applies to organizational culture, supply chains, and education outcomes too.',
    },
  },

  // ── BOOK SUMMARY CARDS ──
  {
    id: 'sum-001', type: 'summary', bookId: 'good-to-great',
    bookTitle: 'Good to Great', author: 'Jim Collins',
    pillars: ['Strategy','Leadership'], difficulty: 'Beginner',
    content: {
      premise: 'What separates companies that make the leap to sustained greatness from those that don\'t? Collins and a 21-person research team analyzed 1,435 Fortune 500 companies over 40 years.',
      takeaways: [
        'Great companies start with "who" (the right people) before "what" (strategy)',
        'The Hedgehog Concept: be the best in the world at one thing that also drives your economic engine',
        'There\'s no single transformational moment — greatness comes from relentless small pushes on the flywheel',
      ],
      bestQuote: 'Good is the enemy of great.',
      nextRead: 'Blue Ocean Strategy — pairs perfectly: G2G tells you how to build, BOS tells you where to compete.',
    },
  },
  {
    id: 'sum-002', type: 'summary', bookId: 'lean-startup',
    bookTitle: 'The Lean Startup', author: 'Eric Ries',
    pillars: ['Entrepreneurship','Operations'], difficulty: 'Beginner',
    content: {
      premise: 'Entrepreneurship is management — specifically, management under extreme uncertainty. The Lean Startup is a method for reducing waste and accelerating learning in new ventures.',
      takeaways: [
        'Build-Measure-Learn: the fundamental loop; minimize time through each cycle',
        'Distinguish validated learning from vanity metrics',
        'A pivot is a structured course correction, not failure',
      ],
      bestQuote: 'The only way to win is to learn faster than anyone else.',
      nextRead: 'The Goal by Goldratt — the Theory of Constraints underpins much of Lean thinking.',
    },
  },
];
