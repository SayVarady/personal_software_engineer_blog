/* ============================
   DATA
   ============================ */
const seriesData = [
  {
    id: 'testing', title: 'Testing Strategies That Work', icon: 'fa-flask-vial', color: '#8E44AD',
    desc: 'Move beyond the testing pyramid. Learn boundary-focused unit tests, contract tests, and property-based testing that actually catch bugs.',
    prereqs: [], chapters: [
      { id: 't1', title: 'The Testing Pyramid Revisited', dur: '10 min', done: false, diff: 'beginner' },
      { id: 't2', title: 'Unit Testing with Boundaries', dur: '14 min', done: false, diff: 'beginner' },
      { id: 't3', title: 'Integration Testing Patterns', dur: '18 min', done: false, diff: 'intermediate' },
      { id: 't4', title: 'Contract Testing in Microservices', dur: '15 min', done: false, diff: 'intermediate' },
      { id: 't5', title: 'Property-Based Testing', dur: '20 min', done: false, diff: 'advanced' },
      { id: 't6', title: 'Test Infrastructure as Code', dur: '12 min', done: false, diff: 'intermediate' },
    ]
  },
  {
    id: 'clean-arch', title: 'Clean Architecture in Practice', icon: 'fa-cubes', color: '#2D6A4F',
    desc: 'Internalize the principles behind clean architecture: dependency inversion, layer boundaries, and framework independence — with real code in every chapter.',
    prereqs: ['testing'], chapters: [
      { id: 'ca1', title: 'The Dependency Inversion Principle', dur: '16 min', done: false, diff: 'intermediate' },
      { id: 'ca2', title: 'Entities and Use Cases', dur: '18 min', done: false, diff: 'intermediate' },
      { id: 'ca3', title: 'Interface Adapters and Controllers', dur: '15 min', done: false, diff: 'intermediate' },
      { id: 'ca4', title: 'Framework-Driven Architecture', dur: '20 min', done: false, diff: 'advanced' },
      { id: 'ca5', title: 'Testing Across Boundaries', dur: '17 min', done: false, diff: 'advanced' },
      { id: 'ca6', title: 'Building a Real-World Module', dur: '25 min', done: false, diff: 'advanced' },
    ]
  },
  {
    id: 'api-design', title: 'API Design Patterns', icon: 'fa-plug', color: '#C77D0A',
    desc: 'Design APIs that developers love. Cover resource modeling, versioning, pagination, error handling, rate limiting, and the REST vs GraphQL decision.',
    prereqs: ['clean-arch'], chapters: [
      { id: 'api1', title: 'RESTful Resource Modeling', dur: '13 min', done: false, diff: 'beginner' },
      { id: 'api2', title: 'Versioning Strategies That Scale', dur: '11 min', done: false, diff: 'intermediate' },
      { id: 'api3', title: 'Pagination, Filtering & Sorting', dur: '16 min', done: false, diff: 'intermediate' },
      { id: 'api4', title: 'Error Handling Patterns', dur: '12 min', done: false, diff: 'beginner' },
      { id: 'api5', title: 'Rate Limiting and Throttling', dur: '14 min', done: false, diff: 'intermediate' },
      { id: 'api6', title: 'GraphQL vs REST Trade-offs', dur: '19 min', done: false, diff: 'advanced' },
      { id: 'api7', title: 'API Gateway Patterns', dur: '17 min', done: false, diff: 'advanced' },
    ]
  },
  {
    id: 'db-internals', title: 'Database Internals Deep Dive', icon: 'fa-database', color: '#2980B9',
    desc: 'Understand what happens beneath your ORM. B-trees vs LSM trees, isolation levels, WAL, query planning, and replication protocols — all demystified.',
    prereqs: ['clean-arch'], chapters: [
      { id: 'db1', title: 'Storage Engines: B-Trees vs LSM Trees', dur: '22 min', done: false, diff: 'advanced' },
      { id: 'db2', title: 'Transaction Isolation Levels', dur: '18 min', done: false, diff: 'intermediate' },
      { id: 'db3', title: 'Write-Ahead Logging', dur: '15 min', done: false, diff: 'advanced' },
      { id: 'db4', title: 'Query Execution and Optimization', dur: '20 min', done: false, diff: 'advanced' },
      { id: 'db5', title: 'Replication and Consensus', dur: '24 min', done: false, diff: 'advanced' },
    ]
  },
  {
    id: 'system-design', title: 'System Design from Scratch', icon: 'fa-diagram-project', color: '#E74C3C',
    desc: 'Design scalable, resilient distributed systems from first principles. Load balancing, caching, sharding, message queues, and fault tolerance — one building block at a time.',
    prereqs: ['api-design', 'db-internals'], chapters: [
      { id: 'sd1', title: 'Why System Design Matters', dur: '8 min', done: false, diff: 'beginner' },
      { id: 'sd2', title: 'Client-Server Architecture Fundamentals', dur: '14 min', done: false, diff: 'beginner' },
      { id: 'sd3', title: 'Load Balancing Strategies', dur: '16 min', done: false, diff: 'intermediate' },
      { id: 'sd4', title: 'Caching Layers and Strategies', dur: '18 min', done: false, diff: 'intermediate' },
      { id: 'sd5', title: 'Database Sharding and Partitioning', dur: '20 min', done: false, diff: 'advanced' },
      { id: 'sd6', title: 'Message Queues and Async Processing', dur: '17 min', done: false, diff: 'intermediate' },
      { id: 'sd7', title: 'Designing for Fault Tolerance', dur: '19 min', done: false, diff: 'advanced' },
      { id: 'sd8', title: 'CAP Theorem in Practice', dur: '15 min', done: false, diff: 'advanced' },
    ]
  },
];

const newChapters = [
  { seriesId: 'clean-arch', chId: 'ca1', title: 'The Dependency Inversion Principle', seriesTitle: 'Clean Architecture in Practice', date: 'Jan 13' },
  { seriesId: 'system-design', chId: 'sd1', title: 'Why System Design Matters', seriesTitle: 'System Design from Scratch', date: 'Jan 11' },
  { seriesId: 'api-design', chId: 'api1', title: 'RESTful Resource Modeling', seriesTitle: 'API Design Patterns', date: 'Jan 9' },
];

const sampleComments = [
  {
    id: 1, author: 'Sarah Chen', avatar: 'SC', avatarBg: '#8E44AD', date: '2 days ago', text: 'This is exactly the explanation I needed. The runnable demo really helped cement the concept — especially seeing how the mock implementation satisfies the same interface.', likes: 14, replies: [
      { id: 2, author: 'Marco Rivera', avatar: 'MR', avatarBg: '#2980B9', date: '1 day ago', text: "Same here. I've read the DIP chapter in Clean Code three times but the interactive example made it click differently.", likes: 6 }
    ]
  },
  { id: 3, author: 'Aisha Patel', avatar: 'AP', avatarBg: '#C77D0A', date: '5 hours ago', text: 'Would love to see a follow-up on how this pattern scales when you have deep dependency trees. At what point does the wiring become unwieldy without a DI container?', likes: 8, replies: [] },
  { id: 4, author: 'James Okonkwo', avatar: 'JO', avatarBg: '#2D6A4F', date: '3 hours ago', text: 'The diff widget showing the before/after is brilliant. In most tutorials you have to mentally compare two separate code blocks. This makes the refactoring step obvious.', likes: 11, replies: [] },
];

/* Chapter content for CA1 */
const ca1Content = {
  headings: ['the-problem-with-concrete-dependencies', 'applying-dependency-inversion', 'try-it-yourself', 'key-takeaways'],
  prose: `
      <h2 id="the-problem-with-concrete-dependencies">The Problem with Concrete Dependencies</h2>
      <p>Most codebases start clean and gradually accumulate coupling. The classic symptom: a high-level business class imports a low-level infrastructure class directly. Your <code>UserService</code> creates a <code>PostgreSQLConnection</code> inside its constructor. It works — until it doesn't.</p>
      <p>When the class is tightly bound to a specific database, you can't swap it out for testing. You can't replace Postgres with MongoDB without rewriting the service. You can't run your unit tests without a live database running. The dependency points <strong>downward</strong> from the business layer to the infrastructure layer, and that direction is the problem.</p>
      <p>Robert C. Martin's Dependency Inversion Principle states two simple rules:</p>
      <ul>
      <li><strong>High-level modules should not depend on low-level modules.</strong> Both should depend on abstractions.</li>
      <li><strong>Abstractions should not depend on details.</strong> Details should depend on abstractions.</li>
      </ul>
      <p>The key insight is about the <em>direction</em> of the dependency arrow. Inverting it means the infrastructure code implements an interface defined by the business layer — not the other way around.</p>

      <h2 id="applying-dependency-inversion">Applying Dependency Inversion</h2>
      <p>Click the button below to see the refactoring in action. Notice what changes: the service no longer creates its own database connection. Instead, it receives a <strong>repository</strong> through its constructor — an object that promises a <code>findById</code> method but says nothing about how it's implemented.</p>
      <p>This is the essence of DIP: the high-level policy (user lookup logic) depends on an abstraction (the repository interface), and the low-level detail (PostgreSQL queries) depends on that same abstraction. The dependency arrow has flipped.</p>
      <p>The practical impact is immediate. In your test suite, you inject a <code>MockUserRepo</code> that returns fixtures. In production, you inject a <code>PostgresUserRepo</code> that runs real queries. The <code>UserService</code> class never changes — it's genuinely decoupled.</p>

      <h2 id="try-it-yourself">Try It Yourself</h2>
      <p>The playground below demonstrates both the coupled and inverted approaches. Edit the code freely — the output updates instantly. Try swapping the repository implementation or adding a new one to see how the service remains unchanged.</p>

      <h2 id="key-takeaways">Key Takeaways</h2>
      <ul>
      <li>DIP is about <strong>dependency direction</strong>, not just using interfaces.</li>
      <li>The abstraction should be <strong>owned by the high-level module</strong>, not the low-level one.</li>
      <li>Constructor injection is the simplest way to apply DIP in most languages.</li>
      <li>The payoff is testability, swapability, and code that resists architectural rot.</li>
      <li>DIP is not dependency injection — DI is a <em>mechanism</em>; DIP is the <em>principle</em> that justifies it.</li>
      </ul>
    `
};

/* ============================
   STATE
   ============================ */
const state = {
  view: 'home',
  seriesId: null,
  chapterId: null,
  dark: false,
  completed: new Set(),
  chapterScrolled: false,
  activeToc: '',
};

/* ============================
   HELPERS
   ============================ */
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function getSeries(id) { return seriesData.find(s => s.id === id); }
function getChapter(sid, cid) { const s = getSeries(sid); return s ? s.chapters.find(c => c.id === cid) : null; }
function completionPct(s) { if (!s.chapters.length) return 0; const done = s.chapters.filter(c => state.completed.has(s.id + '-' + c.id)).length; return Math.round(done / s.chapters.length * 100); }
function diffColor(d) { return d === 'beginner' ? 'var(--primary)' : d === 'intermediate' ? 'var(--accent)' : 'var(--danger)'; }
function diffLabel(d) { return d === 'beginner' ? 'Beginner' : d === 'intermediate' ? 'Intermediate' : 'Advanced'; }

/* ============================
   NAVIGATION
   ============================ */
function navigate(view, p1, p2) {
  state.view = view;
  if (view === 'series') state.seriesId = p1;
  if (view === 'chapter') { state.seriesId = p1; state.chapterId = p2; state.chapterScrolled = false; }
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ============================
   RENDERERS
   ============================ */
function render() {
  const app = document.getElementById('app');
  switch (state.view) {
    case 'home': app.innerHTML = renderHome(); break;
    case 'series': app.innerHTML = renderSeriesPage(); break;
    case 'chapter': app.innerHTML = renderChapterPage(); break;
  }
  initInteractions();
  initScrollReveal();
}

function renderHome() {
  /* Hero */
  let hero = `
  <section class="hero-dots relative overflow-hidden" style="background:var(--bg)">
    <div class="absolute inset-0" style="background:radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 60%), radial-gradient(ellipse at 80% 80%, color-mix(in srgb, var(--accent) 6%, transparent), transparent 50%)"></div>
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
      <div class="max-w-2xl">
        <div class="badge mb-4" style="background:var(--primary-pale);color:var(--primary)">New Series Launch</div>
        <h1 class="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4" style="color:var(--fg)">System Design<br>from Scratch</h1>
        <p class="text-lg mb-6" style="color:var(--fg2);line-height:1.7">Eight chapters. Zero hand-waving. Build scalable, resilient systems one building block at a time — with runnable code in every chapter.</p>
        <div class="flex flex-wrap gap-3">
          <button class="btn-primary" onclick="navigate('series','system-design')"><i class="fa-solid fa-arrow-right mr-2"></i>Start Learning</button>
          <button class="btn-ghost" onclick="document.getElementById('library').scrollIntoView({behavior:'smooth'})">Browse All Series</button>
        </div>
      </div>
    </div>
  </section>`;

  /* New This Week */
  let newSec = `<section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <h2 class="text-sm font-bold uppercase tracking-widest mb-5" style="color:var(--muted)">New This Week</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">`;
  newChapters.forEach(nc => {
    const s = getSeries(nc.seriesId);
    newSec += `
    <div class="card p-4 cursor-pointer flex gap-4" onclick="navigate('chapter','${nc.seriesId}','${nc.chId}')">
      <div class="w-10 h-10 rounded-lg flex items-center justify-content flex-shrink-0" style="background:${s.color}15;color:${s.color};display:flex;align-items:center;justify-content:center"><i class="fa-solid ${s.icon}"></i></div>
      <div class="min-w-0">
        <div class="text-xs font-medium mb-1 truncate" style="color:${s.color}">${esc(s.title)}</div>
        <div class="font-semibold text-sm mb-1" style="color:var(--fg)">${esc(nc.title)}</div>
        <div class="text-xs" style="color:var(--muted)">${nc.date}</div>
      </div>
    </div>`;
  });
  newSec += `</div></section>`;

  /* Series Library */
  let lib = `<section id="library" class="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-sm font-bold uppercase tracking-widest" style="color:var(--muted)">Series Library</h2>
      <span class="text-sm" style="color:var(--fg2)">${seriesData.length} series, ${seriesData.reduce((a, s) => a + s.chapters.length, 0)} chapters</span>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">`;
  seriesData.forEach(s => {
    const pct = completionPct(s);
    const doneCount = s.chapters.filter(c => state.completed.has(s.id + '-' + c.id)).length;
    lib += `
    <div class="card p-5 cursor-pointer fade-up" onclick="navigate('series','${s.id}')">
      <div class="flex items-start justify-between mb-3">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background:${s.color}15;color:${s.color}"><i class="fa-solid ${s.icon} text-lg"></i></div>
        <span class="text-xs font-bold" style="color:${pct === 100 ? 'var(--success)' : pct > 0 ? 'var(--accent)' : 'var(--muted)'}">${pct}%</span>
      </div>
      <h3 class="font-bold text-base mb-2" style="color:var(--fg)">${esc(s.title)}</h3>
      <p class="text-sm mb-4" style="color:var(--fg2);line-height:1.6">${esc(s.desc).substring(0, 100)}...</p>
      <div class="progress-bar mb-2"><div class="progress-fill" style="width:${pct}%;background:${s.color}"></div></div>
      <div class="text-xs" style="color:var(--muted)">${doneCount} of ${s.chapters.length} chapters completed</div>
    </div>`;
  });
  lib += `</div></section>`;
  return hero + newSec + lib;
}

function renderSeriesPage() {
  const s = getSeries(state.seriesId);
  if (!s) return '<p>Series not found.</p>';
  const pct = completionPct(s);

  /* Prerequisite graph data */
  const graphNodes = seriesData.map((sr, i) => {
    const cols = [0, 0, 1, 1, 2]; const rows = [2, 1, 1, 1, 0];
    return { id: sr.id, x: 100 + cols[i] * 220, y: 60 + rows[i] * 140, r: 32, label: sr.title.split(' ').slice(0, 2).join(' '), color: sr.color, done: pct === 100 && sr.id === s.id };
  });
  const graphEdges = [
    { from: 'testing', to: 'clean-arch' }, { from: 'clean-arch', to: 'api-design' }, { from: 'clean-arch', to: 'db-internals' }, { from: 'api-design', to: 'system-design' }, { from: 'db-internals', to: 'system-design' }
  ];

  let svg = `<svg viewBox="0 0 560 360" class="w-full max-w-xl mx-auto" style="display:block">`;
  /* Edges */
  graphEdges.forEach(e => {
    const a = graphNodes.find(n => n.id === e.from), b = graphNodes.find(n => n.id === e.to);
    const dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / dist, ny = dy / dist;
    const x1 = a.x + nx * a.r, y1 = a.y + ny * a.r, x2 = b.x - nx * b.r, y2 = b.y - ny * b.r;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const cx = mx + ny * 20, cy = my - nx * 20;
    svg += `<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" class="graph-line" ${e.to === s.id || e.from === s.id ? 'style="stroke:var(--primary);stroke-width:2.5;opacity:0.7"' : ''}/>`;
    /* Arrowhead */
    const ax = x2 - nx * 8, ay = y2 - ny * 8, px = -ny * 4, py = nx * 4;
    svg += `<polygon points="${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}" fill="${e.to === s.id || e.from === s.id ? 'var(--primary)' : 'var(--muted)'}" opacity="0.6"/>`;
  });
  /* Nodes */
  graphNodes.forEach(n => {
    const isCurrent = n.id === s.id;
    svg += `<g class="nav-node" onclick="navigate('series','${n.id}')">`;
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${isCurrent ? n.color + '22' : 'var(--card)'}" stroke="${isCurrent ? n.color : 'var(--border)'}" stroke-width="${isCurrent ? 3 : 1.5}"/>`;
    svg += `<text x="${n.x}" y="${n.y + 1}" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="600" fill="${isCurrent ? n.color : 'var(--fg2)'}" font-family="DM Sans">${n.label}</text>`;
    if (completionPct(getSeries(n.id)) === 100) {
      svg += `<circle cx="${n.x + n.r * 0.65}" cy="${n.y - n.r * 0.65}" r="8" fill="var(--success)"/>`;
      svg += `<text x="${n.x + n.r * 0.65}" y="${n.y - n.r * 0.65 + 1}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#fff" font-family="DM Sans" font-weight="700">&#10003;</text>`;
    }
    svg += `</g>`;
  });
  svg += `</svg>`;

  let chapters = '';
  s.chapters.forEach((c, i) => {
    const key = s.id + '-' + c.id;
    const done = state.completed.has(key);
    chapters += `
    <div class="flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer group" style="background:${done ? 'var(--primary-pale)' : 'transparent'}" onclick="navigate('chapter','${s.id}','${c.id}')">
      <div class="chapter-check ${done ? 'done' : ''}" onclick="event.stopPropagation();toggleChapter('${s.id}','${c.id}')">
        ${done ? '<i class="fa-solid fa-check"></i>' : ''}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          <span class="text-xs font-mono" style="color:var(--muted)">Ch ${i + 1}</span>
          <span class="badge text-[10px]" style="background:${diffColor(c.diff)}18;color:${diffColor(c.diff)}">${diffLabel(c.diff)}</span>
        </div>
        <div class="font-semibold text-sm group-hover:text-[var(--primary)] transition-colors" style="color:var(--fg)">${esc(c.title)}</div>
      </div>
      <span class="text-xs flex-shrink-0" style="color:var(--muted)">${c.dur}</span>
      <i class="fa-solid fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition-opacity" style="color:var(--muted)"></i>
    </div>`;
  });

  return `
  <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm mb-8" style="color:var(--muted)">
      <a onclick="navigate('home')" class="cursor-pointer hover:text-[var(--primary)] transition-colors">Library</a>
      <i class="fa-solid fa-chevron-right text-[10px]"></i>
      <span style="color:var(--fg)">${esc(s.title)}</span>
    </nav>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="background:${s.color}15;color:${s.color}"><i class="fa-solid ${s.icon} text-2xl"></i></div>
      <div class="flex-1">
        <h1 class="text-2xl sm:text-3xl font-bold mb-1" style="color:var(--fg)">${esc(s.title)}</h1>
        <p class="text-sm" style="color:var(--fg2)">${esc(s.desc)}</p>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-3xl font-bold" style="color:${s.color}">${pct}%</div>
        <div class="text-xs" style="color:var(--muted)">Complete</div>
      </div>
    </div>
    <div class="progress-bar mb-10"><div class="progress-fill" style="width:${pct}%;background:${s.color}"></div></div>

    <div class="grid lg:grid-cols-5 gap-10">
      <!-- Chapters -->
      <div class="lg:col-span-3">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="color:var(--muted)">Chapters</h2>
        <div class="space-y-1">${chapters}</div>
      </div>
      <!-- Prerequisites -->
      <div class="lg:col-span-2">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="color:var(--muted)">Prerequisite Map</h2>
        <div class="card p-5">${svg}</div>
        <p class="text-xs mt-3" style="color:var(--muted)">Click any node to navigate. Completed series show a green checkmark.</p>
      </div>
    </div>
  </div>`;
}

function renderChapterPage() {
  const s = getSeries(state.seriesId);
  const c = getChapter(state.seriesId, state.chapterId);
  if (!s || !c) return '<p>Chapter not found.</p>';
  const key = s.id + '-' + c.id;
  const done = state.completed.has(key);
  const idx = s.chapters.indexOf(c);
  const prevCh = idx > 0 ? s.chapters[idx - 1] : null;
  const nextCh = idx < s.chapters.length - 1 ? s.chapters[idx + 1] : null;

  /* Diff widget data */
  const diffBefore = [
    { type: 'neutral', text: 'class UserService {' },
    { type: 'neutral', text: '  constructor() {' },
    { type: 'remove', text: "    this.db = new PostgreSQLConnection('db://...');" },
    { type: 'neutral', text: '  }' },
    { type: 'neutral', text: '' },
    { type: 'neutral', text: '  getUser(id) {' },
    { type: 'remove', text: "    return this.db.query('SELECT * FROM users WHERE id = $1', [id]);" },
    { type: 'neutral', text: '  }' },
    { type: 'neutral', text: '}' },
  ];
  const diffAfter = [
    { type: 'neutral', text: 'class UserService {' },
    { type: 'neutral', text: '  constructor(userRepository) {' },
    { type: 'add', text: '    this.repo = userRepository; // injected abstraction' },
    { type: 'neutral', text: '  }' },
    { type: 'neutral', text: '' },
    { type: 'neutral', text: '  getUser(id) {' },
    { type: 'add', text: '    return this.repo.findById(id);' },
    { type: 'neutral', text: '  }' },
    { type: 'neutral', text: '}' },
  ];

  let diffLines = '';
  diffBefore.forEach((l, i) => {
    diffLines += `<div class="diff-line ${l.type}" data-diff-idx="${i}">${l.type === 'remove' ? '- ' : l.type === 'add' ? '+ ' : '  '}${esc(l.text)}</div>`;
  });

  /* Playground code */
  const playgroundCode = `// Dependency Inversion in action
class MockUserRepo {
  findById(id) {
    return { id, name: 'Test User', role: 'admin' };
  }
}

class PostgresUserRepo {
  findById(id) {
    return { id, name: 'Real User', role: 'editor' };
  }
}

class UserService {
  constructor(repository) {
    this.repo = repository;
  }
  getUser(id) {
    return this.repo.findById(id);
  }
}

// Test environment — inject a mock
const testSvc = new UserService(new MockUserRepo());
console.log('Test env:', testSvc.getUser(42));

// Production — inject real DB
const prodSvc = new UserService(new PostgresUserRepo());
console.log('Production:', prodSvc.getUser(42));

console.log('Same service, different data sources.');
console.log('UserService never knows the difference.');`;

  /* TOC */
  let toc = '';
  ca1Content.headings.forEach(h => {
    const label = h.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    toc += `<a class="toc-item" data-toc="${h}" onclick="document.getElementById('${h}').scrollIntoView({behavior:'smooth',block:'start'})">${label}</a>`;
  });

  /* Comments */
  let commentsHtml = '';
  sampleComments.forEach(cm => {
    commentsHtml += `
    <div class="comment-box mb-3">
      <div class="flex items-start gap-3">
        <div class="avatar" style="background:${cm.avatarBg}">${cm.avatar}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-sm" style="color:var(--fg)">${esc(cm.author)}</span>
            <span class="text-xs" style="color:var(--muted)">${cm.date}</span>
          </div>
          <p class="text-sm mb-2" style="color:var(--fg2);line-height:1.65">${esc(cm.text)}</p>
          <div class="flex items-center gap-4 text-xs" style="color:var(--muted)">
            <button class="flex items-center gap-1 hover:text-[var(--primary)] transition-colors" onclick="this.querySelector('span').textContent=parseInt(this.querySelector('span').textContent)+1"><i class="fa-regular fa-heart"></i> <span>${cm.likes}</span></button>
            <button class="hover:text-[var(--primary)] transition-colors">Reply</button>
          </div>
          ${cm.replies.map(r => `
          <div class="flex items-start gap-3 mt-3 pt-3" style="border-top:1px solid var(--border)">
            <div class="avatar" style="background:${r.avatarBg};width:28px;height:28px;font-size:0.65rem">${r.avatar}</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-sm" style="color:var(--fg)">${esc(r.author)}</span>
                <span class="text-xs" style="color:var(--muted)">${r.date}</span>
              </div>
              <p class="text-sm" style="color:var(--fg2);line-height:1.65">${esc(r.text)}</p>
              <div class="flex items-center gap-4 text-xs mt-1.5" style="color:var(--muted)">
                <button class="flex items-center gap-1 hover:text-[var(--primary)] transition-colors" onclick="this.querySelector('span').textContent=parseInt(this.querySelector('span').textContent)+1"><i class="fa-regular fa-heart"></i> <span>${r.likes}</span></button>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  });

  return `
  <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm mb-6 flex-wrap" style="color:var(--muted)">
      <a onclick="navigate('home')" class="cursor-pointer hover:text-[var(--primary)] transition-colors">Library</a>
      <i class="fa-solid fa-chevron-right text-[10px]"></i>
      <a onclick="navigate('series','${s.id}')" class="cursor-pointer hover:text-[var(--primary)] transition-colors">${esc(s.title)}</a>
      <i class="fa-solid fa-chevron-right text-[10px]"></i>
      <span style="color:var(--fg)">Ch ${idx + 1}</span>
    </nav>

    <!-- Chapter header -->
    <div class="flex items-center gap-3 mb-2">
      <span class="badge" style="background:${diffColor(c.diff)}18;color:${diffColor(c.diff)}">${diffLabel(c.diff)}</span>
      <span class="text-sm" style="color:var(--muted)"><i class="fa-regular fa-clock mr-1"></i>${c.dur} read</span>
      <div class="flex-1"></div>
      <div class="chapter-check ${done ? 'done' : ''}" id="chapter-check-main" onclick="toggleChapter('${s.id}','${c.id}')">
        ${done ? '<i class="fa-solid fa-check"></i>' : ''}
      </div>
    </div>
    <h1 class="text-3xl sm:text-4xl font-bold font-serif mb-6" style="color:var(--fg)">${esc(c.title)}</h1>

    <!-- Progress bar for this chapter -->
    <div class="progress-bar mb-8" style="height:3px"><div class="progress-fill" id="read-progress" style="width:0%"></div></div>

    <div class="grid lg:grid-cols-4 gap-10">
      <!-- Sticky TOC -->
      <aside class="hidden lg:block">
        <div class="sticky top-20">
          <div class="text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--muted)">In This Chapter</div>
          <nav id="toc-nav" class="space-y-0.5">${toc}</nav>
          <div class="mt-6 pt-4" style="border-top:1px solid var(--border)">
            <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--muted)">Series Progress</div>
            <div class="text-sm font-semibold" style="color:var(--fg)">${completionPct(s)}% complete</div>
            <div class="progress-bar mt-2"><div class="progress-fill" style="width:${completionPct(s)}%;background:${s.color}"></div></div>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <article class="lg:col-span-3">
        <div class="prose" id="chapter-prose">
          ${ca1Content.prose}

          <!-- Diff Widget -->
          <div class="my-8">
            <div class="flex items-center justify-between mb-3">
              <h3 style="margin:0;font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;color:var(--fg)">Before: Tightly Coupled</h3>
              <button class="btn-primary text-xs py-2 px-4" id="diff-toggle-btn" onclick="animateDiff()"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>Apply DIP Refactor</button>
            </div>
            <div class="diff-widget" id="diff-widget" style="background:var(--card)">
              ${diffLines}
            </div>
            <p class="text-xs mt-2" style="color:var(--muted)" id="diff-hint">Click the button to see the refactoring animated line by line.</p>
          </div>

          <!-- Code Playground -->
          <div class="my-8">
            <div class="flex items-center justify-between mb-3">
              <h3 style="margin:0;font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;color:var(--fg)"><i class="fa-solid fa-play text-xs mr-2" style="color:var(--primary)"></i>Interactive Playground</h3>
              <button class="btn-ghost text-xs py-1.5 px-3" onclick="runPlayground()"><i class="fa-solid fa-rotate-right mr-1"></i>Re-run</button>
            </div>
            <div class="code-playground">
              <textarea id="playground-code" spellcheck="false">${esc(playgroundCode)}</textarea>
              <div class="code-output" id="playground-output"></div>
            </div>
            <p class="text-xs mt-2" style="color:var(--muted)">Edit the code above. Output updates as you type.</p>
          </div>
        </div>

        <!-- Navigation -->
        <div class="grid sm:grid-cols-2 gap-4 mt-12 pt-8" style="border-top:1px solid var(--border)">
          ${prevCh ? `<button class="card p-4 text-left hover:border-[var(--primary)]" onclick="navigate('chapter','${s.id}','${prevCh.id}')">
            <div class="text-xs mb-1" style="color:var(--muted)"><i class="fa-solid fa-arrow-left mr-1"></i>Previous</div>
            <div class="font-semibold text-sm" style="color:var(--fg)">${esc(prevCh.title)}</div>
          </button>`: '<div></div>'}
          ${nextCh ? `<button class="card p-4 text-right hover:border-[var(--primary)]" onclick="navigate('chapter','${s.id}','${nextCh.id}')">
            <div class="text-xs mb-1" style="color:var(--muted)">Next<i class="fa-solid fa-arrow-right ml-1"></i></div>
            <div class="font-semibold text-sm" style="color:var(--fg)">${esc(nextCh.title)}</div>
          </button>`: '<div></div>'}
        </div>

        <!-- Comments -->
        <section class="mt-14">
          <h2 class="text-lg font-bold mb-6" style="color:var(--fg)"><i class="fa-regular fa-comments mr-2" style="color:var(--primary)"></i>Discussion (${sampleComments.length})</h2>
          <div class="mb-4">
            <div class="flex items-start gap-3">
              <div class="avatar" style="background:var(--primary)">Y</div>
              <div class="flex-1">
                <textarea id="comment-input" rows="3" placeholder="Share your thoughts or questions..." class="w-full p-3 rounded-lg text-sm resize-none outline-none transition-colors" style="background:var(--bg2);color:var(--fg);border:1px solid var(--border);font-family:'DM Sans',sans-serif" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                <div class="flex justify-end mt-2">
                  <button class="btn-primary text-xs py-2 px-4" onclick="postComment()">Post Comment</button>
                </div>
              </div>
            </div>
          </div>
          <div id="comments-list">${commentsHtml}</div>
        </section>
      </article>
    </div>
  </div>`;
}

/* ============================
   INTERACTIONS
   ============================ */
let diffAnimated = false;
let playgroundTimer = null;
let tocObserver = null;
let scrollObserver = null;

function initInteractions() {
  diffAnimated = false;
  if (state.view === 'chapter') {
    initTocObserver();
    initScrollProgress();
    initPlayground();
  } else {
    if (tocObserver) tocObserver.disconnect();
    if (scrollObserver) scrollObserver.disconnect();
  }
}

function initTocObserver() {
  if (tocObserver) tocObserver.disconnect();
  const headings = ca1Content.headings.map(h => document.getElementById(h)).filter(Boolean);
  if (!headings.length) return;
  tocObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        state.activeToc = e.target.id;
        document.querySelectorAll('.toc-item').forEach(t => {
          t.classList.toggle('active', t.dataset.toc === state.activeToc);
        });
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });
  headings.forEach(h => tocObserver.observe(h));
}

function initScrollProgress() {
  const prose = document.getElementById('chapter-prose');
  const bar = document.getElementById('read-progress');
  if (!prose || !bar) return;
  if (scrollObserver) scrollObserver.disconnect();
  scrollObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    window.addEventListener('scroll', onChapterScroll);
  }, { threshold: 0 });
  scrollObserver.observe(prose);
}

function onChapterScroll() {
  const prose = document.getElementById('chapter-prose');
  const bar = document.getElementById('read-progress');
  if (!prose || !bar) return;
  const rect = prose.getBoundingClientRect();
  const total = prose.scrollHeight - window.innerHeight;
  const scrolled = Math.max(0, -rect.top);
  const pct = Math.min(100, Math.round(scrolled / Math.max(1, total) * 100));
  bar.style.width = pct + '%';
  if (pct >= 80 && !state.chapterScrolled) {
    state.chapterScrolled = true;
    const s = getSeries(state.seriesId);
    const c = getChapter(state.seriesId, state.chapterId);
    const key = s.id + '-' + c.id;
    if (!state.completed.has(key)) {
      state.completed.add(key);
      updateCheckVisuals();
      celebrate();
    }
    window.removeEventListener('scroll', onChapterScroll);
  }
}

function updateCheckVisuals() {
  document.querySelectorAll('.chapter-check').forEach(el => {
    /* We just re-render to keep things simple — but for the current view, update inline */
  });
  const s = getSeries(state.seriesId);
  const c = getChapter(state.seriesId, state.chapterId);
  if (s && c) {
    const key = s.id + '-' + c.id;
    const mainCheck = document.getElementById('chapter-check-main');
    if (mainCheck && state.completed.has(key)) {
      mainCheck.classList.add('done');
      mainCheck.innerHTML = '<i class="fa-solid fa-check"></i>';
    }
  }
}

function initPlayground() {
  const ta = document.getElementById('playground-code');
  if (!ta) return;
  runPlayground();
  ta.addEventListener('input', () => {
    clearTimeout(playgroundTimer);
    playgroundTimer = setTimeout(runPlayground, 400);
  });
  /* Tab support */
  ta.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart, end = ta.selectionEnd;
      ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
      ta.selectionStart = ta.selectionEnd = start + 2;
      clearTimeout(playgroundTimer);
      playgroundTimer = setTimeout(runPlayground, 400);
    }
  });
}

function runPlayground() {
  const ta = document.getElementById('playground-code');
  const out = document.getElementById('playground-output');
  if (!ta || !out) return;
  out.innerHTML = '';
  const logs = [];
  const mock = {
    log: (...a) => logs.push(a.map(v => typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)).join(' ')),
    error: (...a) => logs.push('Error: ' + a.join(' ')),
    warn: (...a) => logs.push('Warning: ' + a.join(' ')),
  };
  try {
    const fn = new Function('console', ta.value);
    fn(mock);
    if (!logs.length) logs.push('(no output)');
    out.innerHTML = logs.map(l => `<div class="log-line">${esc(l)}</div>`).join('');
  } catch (e) {
    out.innerHTML = `<div class="log-error">${esc(e.message)}</div>`;
  }
}

function animateDiff() {
  if (diffAnimated) return;
  diffAnimated = true;
  const widget = document.getElementById('diff-widget');
  const btn = document.getElementById('diff-toggle-btn');
  const hint = document.getElementById('diff-hint');
  btn.disabled = true;
  btn.style.opacity = '0.5';
  hint.textContent = 'Refactoring applied. Notice the constructor now receives an abstraction.';

  const afterLines = [
    { type: 'neutral', text: 'class UserService {' },
    { type: 'neutral', text: '  constructor(userRepository) {' },
    { type: 'add', text: '    this.repo = userRepository; // injected abstraction' },
    { type: 'neutral', text: '  }' },
    { type: 'neutral', text: '' },
    { type: 'neutral', text: '  getUser(id) {' },
    { type: 'add', text: '    return this.repo.findById(id);' },
    { type: 'neutral', text: '  }' },
    { type: 'neutral', text: '}' },
  ];

  const currentLines = widget.querySelectorAll('.diff-line');
  /* Step 1: Fade out removed lines */
  currentLines.forEach(el => {
    if (el.classList.contains('remove')) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.maxHeight = '0';
      el.style.padding = '0 16px';
      el.style.overflow = 'hidden';
    }
  });

  /* Step 2: After fade, replace content */
  setTimeout(() => {
    widget.innerHTML = afterLines.map((l, i) => {
      let cls = 'diff-line';
      if (l.type === 'add') cls += ' add enter';
      else cls += ' neutral';
      return `<div class="${cls}" style="transition-delay:${l.type === 'add' ? (i * 60) + 'ms' : '0ms'}">${l.type === 'add' ? '+ ' : '  '}${esc(l.text)}</div>`;
    }).join('');

    /* Step 3: Animate added lines in */
    requestAnimationFrame(() => {
      widget.querySelectorAll('.enter').forEach(el => {
        requestAnimationFrame(() => {
          el.classList.remove('enter');
        });
      });
    });
  }, 450);
}

function toggleChapter(sid, cid) {
  const key = sid + '-' + cid;
  if (state.completed.has(key)) {
    state.completed.delete(key);
  } else {
    state.completed.add(key);
    /* Check if we're on this chapter's page */
    if (state.view === 'chapter' && state.seriesId === sid && state.chapterId === cid) {
      celebrate();
    }
  }
  render();
}

function postComment() {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if (!text) return;
  const list = document.getElementById('comments-list');
  const div = document.createElement('div');
  div.className = 'comment-box mb-3';
  div.style.animation = 'viewIn 0.4s ease';
  div.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="avatar" style="background:var(--primary)">Y</div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-sm" style="color:var(--fg)">You</span>
          <span class="text-xs" style="color:var(--muted)">Just now</span>
        </div>
        <p class="text-sm" style="color:var(--fg2);line-height:1.65">${esc(text)}</p>
        <div class="flex items-center gap-4 text-xs mt-1.5" style="color:var(--muted)">
          <button class="flex items-center gap-1 hover:text-[var(--primary)] transition-colors" onclick="this.querySelector('span').textContent=parseInt(this.querySelector('span').textContent)+1"><i class="fa-regular fa-heart"></i> <span>0</span></button>
          <button class="hover:text-[var(--primary)] transition-colors">Reply</button>
        </div>
      </div>
    </div>`;
  list.prepend(div);
  input.value = '';
  showToast('Comment posted');
}

/* ============================
   CELEBRATION
   ============================ */
function celebrate() {
  playChime();
  launchConfetti();
  showToast('Chapter completed');
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    g.connect(ctx.destination);
    [880, 1318.5].forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g);
      o.start(ctx.currentTime + i * 0.15);
      o.stop(ctx.currentTime + i * 0.15 + 0.35);
    });
  } catch (e) { }
}

function launchConfetti() {
  const canvas = document.getElementById('celebration-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const colors = ['#C77D0A', '#E09B15', '#F5DEB3', '#2D6A4F', '#52B788', '#fff'];
  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      w: 4 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: 0.012 + Math.random() * 0.008,
    });
  }
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.rot += p.rotV;
      p.life -= p.decay;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  frame();
}

function showToast(msg) {
  const existing = document.querySelector('.completion-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'completion-toast';
  toast.innerHTML = `<div class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--primary)"><i class="fa-solid fa-check text-white text-xs"></i></div><span class="font-semibold text-sm" style="color:var(--fg)">${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; toast.style.transition = 'all 0.3s'; }, 2500);
  setTimeout(() => toast.remove(), 2900);
}

/* ============================
   THEME
   ============================ */
function toggleTheme() {
  state.dark = !state.dark;
  document.documentElement.classList.toggle('dark', state.dark);
  document.getElementById('theme-icon').className = state.dark ? 'fa-solid fa-moon text-sm' : 'fa-solid fa-sun text-sm';
}

/* ============================
   SCROLL REVEAL
   ============================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ============================
   INIT
   ============================ */
render();