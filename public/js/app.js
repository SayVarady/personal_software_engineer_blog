/* ============================
   PROGRESS (localStorage — no backend writes)
   ============================ */
const STORAGE_KEY = "rd_completed_v1";
const THEME_KEY = "rd_dark";

function loadCompleted() {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (e) {
        return new Set();
    }
}
function saveCompleted(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function applyCheckVisual(el, done) {
    el.classList.toggle("done", done);
    el.innerHTML = done ? '<i class="fa-solid fa-check"></i>' : "";
}

function applyAllProgress() {
    const completed = loadCompleted();

    document.querySelectorAll("[data-toggle-check]").forEach((el) => {
        applyCheckVisual(el, completed.has(el.dataset.key));
    });

    document.querySelectorAll("[data-chapter-ids]").forEach((container) => {
        const seriesId = container.dataset.seriesId;
        const ids = container.dataset.chapterIds.split(",").filter(Boolean);
        const done = ids.filter((id) =>
            completed.has(seriesId + "-" + id),
        ).length;
        const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

        container.querySelectorAll(".series-pct").forEach((el) => {
            const tmpl = el.dataset.pctTemplate || "{}%";
            el.textContent = tmpl.replace("{}", pct);
        });
        container.querySelectorAll(".series-progress-fill").forEach((el) => {
            el.style.width = pct + "%";
        });
        container.querySelectorAll(".series-done-count").forEach((el) => {
            el.textContent = done;
        });
    });
}

function toggleChapter(el) {
    const key = el.dataset.key;
    const completed = loadCompleted();
    const nowDone = !completed.has(key);
    if (nowDone) completed.add(key);
    else completed.delete(key);
    saveCompleted(completed);
    applyAllProgress();
    if (nowDone) celebrate();
}

/* ============================
   THEME
   ============================ */
function toggleTheme() {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem(THEME_KEY, dark ? "1" : "0");
    updateThemeIcon(dark);
}
function updateThemeIcon(dark) {
    const icon = document.getElementById("theme-icon");
    if (icon)
        icon.className = dark
            ? "fa-solid fa-moon text-sm"
            : "fa-solid fa-sun text-sm";
}

/* ============================
   CHAPTER PAGE INTERACTIONS
   ============================ */
let tocObserver = null;
let scrollObserver = null;
let chapterScrolled = false;
let diffAnimated = false;
let playgroundTimer = null;

function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
}

window.initChapterPage = function initChapterPage() {
    chapterScrolled = false;
    diffAnimated = false;
    initTocObserver();
    initScrollProgress();
    initPlayground();
    initMotionGraphics();
};

function initTocObserver() {
    if (tocObserver) tocObserver.disconnect();
    const headings = [...document.querySelectorAll("#chapter-prose h2[id]")];
    if (!headings.length) return;
    tocObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    document.querySelectorAll(".toc-item").forEach((t) => {
                        t.classList.toggle(
                            "active",
                            t.dataset.toc === e.target.id,
                        );
                    });
                }
            });
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    headings.forEach((h) => tocObserver.observe(h));
}

function initScrollProgress() {
    const prose = document.getElementById("chapter-prose");
    const bar = document.getElementById("read-progress");
    if (!prose || !bar) return;
    if (scrollObserver) scrollObserver.disconnect();
    window.removeEventListener("scroll", onChapterScroll);
    scrollObserver = new IntersectionObserver(
        (entries) => {
            if (!entries[0].isIntersecting) return;
            window.addEventListener("scroll", onChapterScroll);
        },
        { threshold: 0 },
    );
    scrollObserver.observe(prose);
}

function onChapterScroll() {
    const prose = document.getElementById("chapter-prose");
    const bar = document.getElementById("read-progress");
    if (!prose || !bar) return;
    const rect = prose.getBoundingClientRect();
    const total = prose.scrollHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const pct = Math.min(
        100,
        Math.round((scrolled / Math.max(1, total)) * 100),
    );
    bar.style.width = pct + "%";
    if (pct >= 80 && !chapterScrolled) {
        chapterScrolled = true;
        const mainCheck = document.getElementById("chapter-check-main");
        if (mainCheck) {
            const completed = loadCompleted();
            if (!completed.has(mainCheck.dataset.key)) {
                completed.add(mainCheck.dataset.key);
                saveCompleted(completed);
                applyAllProgress();
                celebrate();
            }
        }
        window.removeEventListener("scroll", onChapterScroll);
    }
}

function initPlayground() {
    const ta = document.getElementById("playground-code");
    if (!ta) return;
    runPlayground();
    ta.addEventListener("input", () => {
        clearTimeout(playgroundTimer);
        playgroundTimer = setTimeout(runPlayground, 400);
    });
    ta.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = ta.selectionStart,
                end = ta.selectionEnd;
            ta.value =
                ta.value.substring(0, start) + "  " + ta.value.substring(end);
            ta.selectionStart = ta.selectionEnd = start + 2;
            clearTimeout(playgroundTimer);
            playgroundTimer = setTimeout(runPlayground, 400);
        }
    });
}

function runPlayground() {
    const ta = document.getElementById("playground-code");
    const out = document.getElementById("playground-output");
    if (!ta || !out) return;
    const logs = [];
    const mock = {
        log: (...a) =>
            logs.push(
                a
                    .map((v) =>
                        typeof v === "object"
                            ? JSON.stringify(v, null, 2)
                            : String(v),
                    )
                    .join(" "),
            ),
        error: (...a) => logs.push("Error: " + a.join(" ")),
        warn: (...a) => logs.push("Warning: " + a.join(" ")),
    };
    try {
        const fn = new Function("console", ta.value);
        fn(mock);
        if (!logs.length) logs.push("(no output)");
        out.innerHTML = logs
            .map((l) => `<div class="log-line">${esc(l)}</div>`)
            .join("");
    } catch (e) {
        out.innerHTML = `<div class="log-error">${esc(e.message)}</div>`;
    }
}

function animateDiff() {
    if (diffAnimated) return;
    diffAnimated = true;
    const widget = document.getElementById("diff-widget");
    const btn = document.getElementById("diff-toggle-btn");
    const hint = document.getElementById("diff-hint");
    if (!widget || !btn || !hint) return;
    btn.disabled = true;
    btn.style.opacity = "0.5";
    hint.textContent =
        "Refactoring applied. Notice the constructor now receives an abstraction.";

    const afterLines = [
        { type: "neutral", text: "class UserService {" },
        { type: "neutral", text: "  constructor(userRepository) {" },
        {
            type: "add",
            text: "    this.repo = userRepository; // injected abstraction",
        },
        { type: "neutral", text: "  }" },
        { type: "neutral", text: "" },
        { type: "neutral", text: "  getUser(id) {" },
        { type: "add", text: "    return this.repo.findById(id);" },
        { type: "neutral", text: "  }" },
        { type: "neutral", text: "}" },
    ];

    const currentLines = widget.querySelectorAll(".diff-line");
    currentLines.forEach((el) => {
        if (el.classList.contains("remove")) {
            el.style.opacity = "0";
            el.style.transform = "translateX(-20px)";
            el.style.maxHeight = "0";
            el.style.padding = "0 16px";
            el.style.overflow = "hidden";
        }
    });

    setTimeout(() => {
        widget.innerHTML = afterLines
            .map((l, i) => {
                let cls = "diff-line";
                if (l.type === "add") cls += " add enter";
                else cls += " neutral";
                return `<div class="${cls}" style="transition-delay:${l.type === "add" ? i * 60 + "ms" : "0ms"}">${l.type === "add" ? "+ " : "  "}${esc(l.text)}</div>`;
            })
            .join("");

        requestAnimationFrame(() => {
            widget.querySelectorAll(".enter").forEach((el) => {
                requestAnimationFrame(() => el.classList.remove("enter"));
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
    showToast("Chapter completed");
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
            o.type = "sine";
            o.frequency.value = freq;
            o.connect(g);
            o.start(ctx.currentTime + i * 0.15);
            o.stop(ctx.currentTime + i * 0.15 + 0.35);
        });
    } catch (e) {}
}

function launchConfetti() {
    const canvas = document.getElementById("celebration-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const cx = canvas.width / 2,
        cy = canvas.height / 2;
    const colors = [
        "#C77D0A",
        "#E09B15",
        "#F5DEB3",
        "#2D6A4F",
        "#52B788",
        "#fff",
    ];
    for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        particles.push({
            x: cx,
            y: cy,
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
        particles.forEach((p) => {
            if (p.life <= 0) return;
            alive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.rot += p.rotV;
            p.life -= p.decay;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
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
    const existing = document.querySelector(".completion-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "completion-toast";
    toast.innerHTML = `<div class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--primary)"><i class="fa-solid fa-check text-white text-xs"></i></div><span class="font-semibold text-sm" style="color:var(--fg)">${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.3s";
    }, 2500);
    setTimeout(() => toast.remove(), 2900);
}

/* ============================
   SCROLL REVEAL
   ============================ */
function initScrollReveal() {
    const els = document.querySelectorAll(".fade-up");
    if (!els.length) return;
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    obs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
}

/* ============================
   MOTION GRAPHICS & VISUAL EXPLAINERS
   ============================ */
function initMotionGraphics() {
    document.querySelectorAll(".motion-card").forEach((card) => {
        if (card.dataset.initialized) return;
        card.dataset.initialized = "true";

        const type = card.dataset.motionType;

        if (type === "lottie" || type === "video") {
            const player =
                card.querySelector("dotlottie-player") ||
                card.querySelector("video");
            const toggleBtn = card.querySelector('[data-action="toggle-play"]');
            const restartBtn = card.querySelector('[data-action="restart"]');
            const speedBtn = card.querySelector('[data-action="speed"]');
            let currentSpeed = 1;
            const speeds = [1, 1.5, 2, 0.5];

            if (toggleBtn && player) {
                toggleBtn.addEventListener("click", () => {
                    let isPaused = false;
                    if (player.tagName.toLowerCase() === "video") {
                        if (player.paused) {
                            player.play();
                            isPaused = false;
                        } else {
                            player.pause();
                            isPaused = true;
                        }
                    } else {
                        // dotlottie-player custom element
                        if (typeof player.togglePlay === "function") {
                            player.togglePlay();
                            isPaused = !player.isPlaying;
                        } else if (
                            typeof player.pause === "function" &&
                            typeof player.play === "function"
                        ) {
                            if (player.isPlaying) {
                                player.pause();
                                isPaused = true;
                            } else {
                                player.play();
                                isPaused = false;
                            }
                        }
                    }
                    toggleBtn.innerHTML = isPaused
                        ? '<i class="fa-solid fa-play text-xs"></i>'
                        : '<i class="fa-solid fa-pause text-xs"></i>';
                });
            }

            if (restartBtn && player) {
                restartBtn.addEventListener("click", () => {
                    if (player.tagName.toLowerCase() === "video") {
                        player.currentTime = 0;
                        player.play();
                    } else if (typeof player.seek === "function") {
                        player.seek(0);
                        if (typeof player.play === "function") player.play();
                    }
                    if (toggleBtn)
                        toggleBtn.innerHTML =
                            '<i class="fa-solid fa-pause text-xs"></i>';
                });
            }

            if (speedBtn && player) {
                speedBtn.addEventListener("click", () => {
                    const nextIdx =
                        (speeds.indexOf(currentSpeed) + 1) % speeds.length;
                    currentSpeed = speeds[nextIdx];
                    speedBtn.textContent = currentSpeed + "x";
                    if (player.tagName.toLowerCase() === "video") {
                        player.playbackRate = currentSpeed;
                    } else if (typeof player.setSpeed === "function") {
                        player.setSpeed(currentSpeed);
                    }
                });
            }
        } else if (type === "steps") {
            const tabs = card.querySelectorAll(".motion-step-tab");
            const panels = card.querySelectorAll(".motion-step-panel");
            const nodes = card.querySelectorAll(".motion-pipeline-node");
            const progressBar = card.querySelector(".motion-pipeline-progress");
            const beacon = card.querySelector(".motion-pipeline-beacon");
            const prevBtn = card.querySelector('[data-action="prev-step"]');
            const nextBtn = card.querySelector('[data-action="next-step"]');
            const autoplayBtn = card.querySelector(
                '[data-action="toggle-steps-autoplay"]',
            );
            const totalSteps = parseInt(
                card.dataset.totalSteps || tabs.length,
                10,
            );
            let activeIdx = 0;
            let autoplayTimer = null;

            function goToStep(idx) {
                activeIdx = (idx + tabs.length) % tabs.length;
                const pct =
                    totalSteps > 1 ? (activeIdx / (totalSteps - 1)) * 100 : 0;
                if (progressBar) progressBar.style.width = pct + "%";
                if (beacon) beacon.style.left = pct + "%";

                tabs.forEach((tab, i) => {
                    tab.classList.toggle("active", i === activeIdx);
                    tab.setAttribute(
                        "aria-selected",
                        i === activeIdx ? "true" : "false",
                    );
                });
                nodes.forEach((node, i) => {
                    node.classList.toggle("active", i === activeIdx);
                });
                panels.forEach((panel, i) => {
                    panel.classList.toggle("active", i === activeIdx);
                    panel.style.display = i === activeIdx ? "block" : "none";
                });
            }

            tabs.forEach((tab, i) => {
                tab.addEventListener("click", () => {
                    stopAutoplay();
                    goToStep(i);
                });
            });

            nodes.forEach((node, i) => {
                node.addEventListener("click", () => {
                    stopAutoplay();
                    goToStep(i);
                });
            });

            if (prevBtn) {
                prevBtn.addEventListener("click", () => {
                    stopAutoplay();
                    goToStep(activeIdx - 1);
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener("click", () => {
                    stopAutoplay();
                    goToStep(activeIdx + 1);
                });
            }

            function stopAutoplay() {
                if (autoplayTimer) {
                    clearInterval(autoplayTimer);
                    autoplayTimer = null;
                    if (autoplayBtn)
                        autoplayBtn.innerHTML =
                            '<i class="fa-solid fa-play text-xs mr-1"></i>Play';
                }
            }

            if (autoplayBtn) {
                autoplayBtn.addEventListener("click", () => {
                    if (autoplayTimer) {
                        stopAutoplay();
                    } else {
                        autoplayBtn.innerHTML =
                            '<i class="fa-solid fa-pause text-xs mr-1"></i>Pause';
                        autoplayTimer = setInterval(
                            () => goToStep(activeIdx + 1),
                            3200,
                        );
                    }
                });
            }
        } else if (type === "diagram") {
            initTransactionDiagram(card);
        }
    });
}

function initTransactionDiagram(card) {
    const ramBox = card.querySelector(".tx-ram");
    const diskBox = card.querySelector(".tx-disk");
    const ramBadge = card.querySelector(".tx-ram-badge");
    const diskBadge = card.querySelector(".tx-disk-badge");
    const ramBal = card.querySelector('[id^="tx-ram-val-bal"]');
    const ramStock = card.querySelector('[id^="tx-ram-val-stock"]');
    const diskBal = card.querySelector('[id^="tx-disk-val-bal"]');
    const diskStock = card.querySelector('[id^="tx-disk-val-stock"]');
    const packet = card.querySelector(".tx-packet-dot");
    const statusText = card.querySelector('[id^="tx-stage-status"]');
    const ramHint = card.querySelector('[id^="tx-ram-hint-text"]');
    const diskHint = card.querySelector('[id^="tx-disk-status"]');
    const pills = card.querySelectorAll(".tx-step-pill");
    let currentStep = 1;
    let txAutoplayTimer = null;

    function setStep(step) {
        currentStep = step;
        pills.forEach((p) => {
            const active = parseInt(p.dataset.txStep, 10) === step;
            p.style.background = active ? "var(--primary)" : "var(--bg2)";
            p.style.color = active ? "#ffffff" : "var(--fg)";
        });

        if (step === 1) {
            // 1. BEGIN
            ramBox.className =
                "md:col-span-3 tx-block tx-ram p-4 rounded-xl border active-glow";
            diskBox.className =
                "md:col-span-3 tx-block tx-disk p-4 rounded-xl border";
            ramBadge.textContent = "ALLOCATED (RAM)";
            ramBadge.style.background = "var(--primary-pale)";
            ramBadge.style.color = "var(--primary)";
            diskBadge.textContent = "UNTOUCHED";
            diskBadge.style.background = "var(--bg2)";
            diskBadge.style.color = "var(--muted)";

            ramBal.textContent = "$100";
            ramBal.style.color = "var(--fg)";
            ramStock.textContent = "99";
            ramStock.style.color = "var(--fg)";

            diskBal.textContent = "bal: $100";
            diskStock.textContent = "stock: 99";

            if (packet) {
                packet.style.opacity = "0";
                packet.style.transform = "translateX(0px)";
            }
            if (statusText)
                statusText.textContent =
                    "Step 1: BEGIN initialized buffer pool in RAM.";
            if (ramHint)
                ramHint.textContent = "Working session memory ready in RAM.";
            if (diskHint)
                diskHint.textContent =
                    "Disk is clean. No disk I/O performed yet.";
        } else if (step === 2) {
            // 2. UPDATE Queries
            ramBox.className =
                "md:col-span-3 tx-block tx-ram p-4 rounded-xl border active-glow";
            diskBox.className =
                "md:col-span-3 tx-block tx-disk p-4 rounded-xl border";
            ramBadge.textContent = "MODIFIED IN RAM";
            ramBadge.style.background = "var(--accent-light)";
            ramBadge.style.color = "var(--accent)";

            ramBal.textContent = "$50 (-$50)";
            ramBal.style.color = "var(--accent)";
            ramStock.textContent = "98 (-1)";
            ramStock.style.color = "var(--accent)";

            diskBal.textContent = "bal: $100";
            diskStock.textContent = "stock: 99";

            if (packet) {
                packet.style.opacity = "0";
                packet.style.transform = "translateX(0px)";
            }
            if (statusText)
                statusText.textContent =
                    "Step 2: Balance & Stock modified in RAM. Disk still holds original values!";
            if (ramHint)
                ramHint.textContent = "Staged in RAM. Can rollback in 0ms!";
            if (diskHint)
                diskHint.textContent =
                    "Disk protected from half-finished queries.";
        } else if (step === 3) {
            // 3. COMMIT (Flush)
            setStep(2); // ensure dirty in RAM first
            setTimeout(() => {
                if (packet) {
                    packet.style.opacity = "1";
                    packet.style.transform = "translateX(75px)";
                }
                if (statusText)
                    statusText.textContent =
                        "Flushing dirty buffers from RAM across bus to Disk...";

                setTimeout(() => {
                    diskBox.className =
                        "md:col-span-3 tx-block tx-disk p-4 rounded-xl border active-glow";
                    ramBadge.textContent = "COMMITTED";
                    ramBadge.style.background = "var(--primary-pale)";
                    ramBadge.style.color = "var(--primary)";

                    diskBadge.textContent = "DURABLE ON DISK";
                    diskBadge.style.background = "var(--primary-pale)";
                    diskBadge.style.color = "var(--primary)";

                    diskBal.textContent = "bal: $50 (SAVED)";
                    diskBal.style.color = "var(--primary)";
                    diskStock.textContent = "stock: 98 (SAVED)";
                    diskStock.style.color = "var(--primary)";

                    if (statusText)
                        statusText.textContent =
                            "Step 3: COMMIT complete! Written to Disk in 1 atomic flush.";
                    if (diskHint)
                        diskHint.textContent =
                            "Data is permanently persisted. Survives power cuts!";
                }, 800);
            }, 200);
        }
    }
    function doRollback() {
        setStep(2); // start from modified state
        setTimeout(() => {
            ramBox.classList.add("rollback-flash");
            ramBadge.textContent = "ROLLED BACK";
            ramBadge.style.background =
                "color-mix(in srgb, var(--danger) 15%, transparent)";
            ramBadge.style.color = "var(--danger)";

            ramBal.textContent = "$100 (REVERTED)";
            ramBal.style.color = "var(--danger)";
            ramStock.textContent = "99 (REVERTED)";
            ramStock.style.color = "var(--danger)";

            if (statusText)
                statusText.textContent =
                    "ROLLBACK: RAM buffer cleared in 0ms! Disk never had to undo any writes.";
            if (ramHint)
                ramHint.textContent =
                    "RAM changes wiped cleanly. Zero disk overhead.";
            setTimeout(() => ramBox.classList.remove("rollback-flash"), 600);
        }, 300);
    }

    pills.forEach((p) => {
        p.addEventListener("click", () => {
            stopTxAutoplay();
            setStep(parseInt(p.dataset.txStep, 10));
        });
    });

    const commitBtn = card.querySelector('[data-action="tx-commit"]');
    const rollbackBtn = card.querySelector('[data-action="tx-rollback"]');
    const resetBtn = card.querySelector('[data-action="tx-reset"]');
    const autoplayBtn = card.querySelector('[data-action="tx-autoplay"]');

    if (commitBtn)
        commitBtn.addEventListener("click", () => {
            stopTxAutoplay();
            setStep(3);
        });
    if (rollbackBtn)
        rollbackBtn.addEventListener("click", () => {
            stopTxAutoplay();
            doRollback();
        });
    if (resetBtn)
        resetBtn.addEventListener("click", () => {
            stopTxAutoplay();
            setStep(1);
        });

    function stopTxAutoplay() {
        if (txAutoplayTimer) {
            clearInterval(txAutoplayTimer);
            txAutoplayTimer = null;
            if (autoplayBtn)
                autoplayBtn.innerHTML =
                    '<i class="fa-solid fa-play text-xs mr-1"></i>Auto-Play';
        }
    }

    if (autoplayBtn) {
        autoplayBtn.addEventListener("click", () => {
            if (txAutoplayTimer) {
                stopTxAutoplay();
            } else {
                autoplayBtn.innerHTML =
                    '<i class="fa-solid fa-pause text-xs mr-1"></i>Pause';
                let seq = [1, 2, 3];
                let seqIdx = 0;
                setStep(seq[seqIdx]);
                txAutoplayTimer = setInterval(() => {
                    seqIdx = (seqIdx + 1) % seq.length;
                    setStep(seq[seqIdx]);
                }, 2800);
            }
        });
    }

    // Init at step 1
    setStep(1);
}

/* ============================
   INIT
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
    updateThemeIcon(document.documentElement.classList.contains("dark"));
    applyAllProgress();
    initScrollReveal();
    initMotionGraphics();
});
