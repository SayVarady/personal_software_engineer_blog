/* ============================
   PROGRESS (localStorage — no backend writes)
   ============================ */
const STORAGE_KEY = 'rd_completed_v1';
const THEME_KEY = 'rd_dark';

function loadCompleted() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch (e) { return new Set(); }
}
function saveCompleted(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function applyCheckVisual(el, done) {
  el.classList.toggle('done', done);
  el.innerHTML = done ? '<i class="fa-solid fa-check"></i>' : '';
}

function applyAllProgress() {
  const completed = loadCompleted();

  document.querySelectorAll('[data-toggle-check]').forEach(el => {
    applyCheckVisual(el, completed.has(el.dataset.key));
  });

  document.querySelectorAll('[data-chapter-ids]').forEach(container => {
    const seriesId = container.dataset.seriesId;
    const ids = container.dataset.chapterIds.split(',').filter(Boolean);
    const done = ids.filter(id => completed.has(seriesId + '-' + id)).length;
    const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

    container.querySelectorAll('.series-pct').forEach(el => {
      const tmpl = el.dataset.pctTemplate || '{}%';
      el.textContent = tmpl.replace('{}', pct);
    });
    container.querySelectorAll('.series-progress-fill').forEach(el => {
      el.style.width = pct + '%';
    });
    container.querySelectorAll('.series-done-count').forEach(el => {
      el.textContent = done;
    });
  });
}

function toggleChapter(el) {
  const key = el.dataset.key;
  const completed = loadCompleted();
  const nowDone = !completed.has(key);
  if (nowDone) completed.add(key); else completed.delete(key);
  saveCompleted(completed);
  applyAllProgress();
  if (nowDone) celebrate();
}

/* ============================
   THEME
   ============================ */
function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, dark ? '1' : '0');
  updateThemeIcon(dark);
}
function updateThemeIcon(dark) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = dark ? 'fa-solid fa-moon text-sm' : 'fa-solid fa-sun text-sm';
}

/* ============================
   CHAPTER PAGE INTERACTIONS
   ============================ */
let tocObserver = null;
let scrollObserver = null;
let chapterScrolled = false;
let diffAnimated = false;
let playgroundTimer = null;

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

window.initChapterPage = function initChapterPage() {
  chapterScrolled = false;
  diffAnimated = false;
  initTocObserver();
  initScrollProgress();
  initPlayground();
};

function initTocObserver() {
  if (tocObserver) tocObserver.disconnect();
  const headings = [...document.querySelectorAll('#chapter-prose h2[id]')];
  if (!headings.length) return;
  tocObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.toc-item').forEach(t => {
          t.classList.toggle('active', t.dataset.toc === e.target.id);
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
  window.removeEventListener('scroll', onChapterScroll);
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
  const pct = Math.min(100, Math.round((scrolled / Math.max(1, total)) * 100));
  bar.style.width = pct + '%';
  if (pct >= 80 && !chapterScrolled) {
    chapterScrolled = true;
    const mainCheck = document.getElementById('chapter-check-main');
    if (mainCheck) {
      const completed = loadCompleted();
      if (!completed.has(mainCheck.dataset.key)) {
        completed.add(mainCheck.dataset.key);
        saveCompleted(completed);
        applyAllProgress();
        celebrate();
      }
    }
    window.removeEventListener('scroll', onChapterScroll);
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
  if (!widget || !btn || !hint) return;
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
  currentLines.forEach(el => {
    if (el.classList.contains('remove')) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.maxHeight = '0';
      el.style.padding = '0 16px';
      el.style.overflow = 'hidden';
    }
  });

  setTimeout(() => {
    widget.innerHTML = afterLines.map((l, i) => {
      let cls = 'diff-line';
      if (l.type === 'add') cls += ' add enter';
      else cls += ' neutral';
      return `<div class="${cls}" style="transition-delay:${l.type === 'add' ? (i * 60) + 'ms' : '0ms'}">${l.type === 'add' ? '+ ' : '  '}${esc(l.text)}</div>`;
    }).join('');

    requestAnimationFrame(() => {
      widget.querySelectorAll('.enter').forEach(el => {
        requestAnimationFrame(() => el.classList.remove('enter'));
      });
    });
  }, 450);
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
  if (!canvas) return;
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
document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon(document.documentElement.classList.contains('dark'));
  applyAllProgress();
  initScrollReveal();
});
