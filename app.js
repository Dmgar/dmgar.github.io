/* ==========================================================================
   Dariem Garcia Portfolio - Multi-Page (SPA Router) & Canvas Interactivity
   ========================================================================== */

const GITHUB_USER = "Dmgar";
const REPO_CACHE_KEY = "dg_repos_v2";
const REPO_CACHE_TTL = 60 * 60 * 1000; // 1h — keeps us well under the 60 req/h API limit
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Repos that should never appear in the portfolio grid
const EXCLUDED_REPOS = new Set(["dmgar", "dmgar.github.io"]);

// --- Curated metadata (Spanish copy, categories, stack) keyed by repo name (lowercase) ---
// Any public repo NOT listed here still shows up automatically using GitHub's data.
const REPO_META = {
  "project_flowsense": {
    title: "FlowSense: Priority Routing & Perception",
    category: "ds-ml",
    desc: "Percepción de tráfico en tiempo real con OpenCV 5 para enrutar dinámicamente ambulancias y bomberos. OpenCV AI Competition 2026 (AWS).",
    tech: ["Python", "OpenCV 5", "FastAPI", "OSMnx", "AWS"]
  },
  "project_terra": {
    title: "Project Terra: Clustering de Ecorregiones",
    category: "econo",
    desc: "Clustering no supervisado (K-Means, jerárquico, PCA) sobre datos edafoclimáticos para identificar ecorregiones y recomendar cultivos.",
    tech: ["Python", "Scikit-Learn", "PCA", "Pandas"]
  },
  "corporate-bi-dashboard": {
    title: "Corporate BI Dashboard",
    category: "econo",
    fenix: true,
    desc: "Dashboard de inteligencia comercial con drill-down y alertas automáticas, construido con Streamlit, DuckDB y Plotly.",
    tech: ["Python", "Streamlit", "DuckDB", "Plotly"]
  },
  "colombia-pobreza-multidimensional": {
    title: "Colombia: Pobreza Multidimensional (IPM)",
    category: "econo",
    fenix: true,
    desc: "Dashboard interactivo y análisis geoespacial del IPM en Colombia con microdatos DANE ECV (2018–2025).",
    tech: ["Python", "Dash", "Plotly", "GeoPandas"]
  },
  "stochastica": {
    title: "Stochastica: Markov Chain Solver",
    category: "web-auto",
    desc: "Solver y visualizador de cadenas de Markov en tiempo discreto con matemática simbólica exacta (SymPy), derivaciones LaTeX paso a paso y grafos de transición.",
    tech: ["TypeScript", "SymPy", "LaTeX", "Grafos"]
  },
  "yahoo-finance-data-visualization-analysis": {
    title: "Forex & Market Volatility",
    category: "econo",
    fenix: true,
    desc: "Monorepo FastAPI (uv) + Next.js 15 que calcula ATR, MACD, RSI y drawdowns dinámicamente sobre datos de Yahoo Finance.",
    tech: ["Next.js 15", "FastAPI", "uv", "Recharts"]
  },
  "exoplanet-outlier-detector": {
    title: "Exoplanet Outlier Detector",
    category: "astro",
    fenix: true,
    desc: "Detección de candidatos a exoplanetas mediante análisis estadístico de outliers en curvas de luz de Kepler, K2 y TESS.",
    tech: ["Python", "Lightkurve", "Astropy", "NumPy"]
  },
  "experimentos-fisicos": {
    title: "Experimentos Físicos",
    category: "astro",
    desc: "Colección de código, datos y documentación de experimentos de física: simulaciones, análisis de datos y material didáctico.",
    tech: ["Jupyter", "Python", "R", "Simulación"]
  },
  "transit-route-optimizer": {
    title: "Transit Route Optimizer (TNDP)",
    category: "ds-ml",
    desc: "Optimización de rutas de transporte público con algoritmos genéticos multiobjetivo (NSGA-II) sobre redes viales reales de OSMnx.",
    tech: ["Python", "OSMnx", "NetworkX", "FastAPI"]
  }
};

// Collaborations / repos hosted outside the Dmgar account
const EXTRA_REPOS = [
  {
    name: "Veles", full_name: "Jmyukopila/Veles", html_url: "https://github.com/Jmyukopila/Veles",
    language: "Python", collab: true,
    meta: { title: "Veles: Audio DSP & Genre Classifier", category: "ds-ml",
      desc: "Clasificación de géneros musicales con extracción MFCC/espectral (librosa) y Scikit-Learn — 86.5% de precisión.",
      tech: ["Python", "Librosa", "Scikit-Learn", "FastAPI", "React"] }
  },
  {
    name: "NEOs-Analysis", full_name: "Jmyukopila/NEOs-Analysis", html_url: "https://github.com/Jmyukopila/NEOs-Analysis",
    language: "Python", collab: true,
    meta: { title: "Near Earth Objects (NEOs) Analysis", category: "astro",
      desc: "Análisis de trayectorias orbitales y mapeo de riesgo de Objetos Cercanos a la Tierra con datos de la NASA.",
      tech: ["Python", "NASA API", "Plotly", "Astrofísica"] }
  },
  {
    name: "coin-change", full_name: "pxtroniwnl/coin-change", html_url: "https://github.com/pxtroniwnl/coin-change",
    language: "Python", collab: true,
    meta: { title: "Coin Change Algorithmic Solver", category: "web-auto",
      desc: "Solucionador interactivo del problema de cambio de monedas (voraz, programación dinámica y backtracking).",
      tech: ["Python", "FastAPI", "Pytest", "Algoritmos"] }
  },
  {
    name: "transit-route-optimizer", full_name: "Dmgar/transit-route-optimizer",
    html_url: "https://github.com/Dmgar/transit-route-optimizer", language: "Python"
  }
];

// Offline snapshot used only if the GitHub API is unreachable and there is no cache
const SNAPSHOT_REPOS = [
  "Project_Terra:Jupyter Notebook", "corporate-bi-dashboard:Jupyter Notebook",
  "Colombia-pobreza-multidimensional:Python", "project_Flowsense:Python", "stochastica:TypeScript",
  "Yahoo-Finance-Data-Visualization-Analysis:Python", "exoplanet-outlier-detector:Python",
  "Experimentos-fisicos:Jupyter Notebook"
].map(entry => {
  const [name, language] = entry.split(":");
  return { name, full_name: `${GITHUB_USER}/${name}`, html_url: `https://github.com/${GITHUB_USER}/${name}`, language };
});

const LANG_COLORS = {
  "Python": "#3572A5", "Jupyter Notebook": "#DA5B0B", "TypeScript": "#3178c6",
  "JavaScript": "#f1e05a", "CSS": "#563d7c", "HTML": "#e34c26", "R": "#198CE7", "SQL": "#e38c00"
};

const CATEGORY_LABELS = {
  "ds-ml": "Machine Learning", "econo": "Economía & Datos",
  "astro": "Astro & Física", "web-auto": "Web & Herramientas"
};

let allProjects = [];
let projectFilter = "all";
let projectQuery = "";

// --- Helpers ---
const escapeHTML = str => String(str ?? "").replace(/[&<>"']/g, c => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "justo ahora";
}

function prettifyName(name) {
  return name.replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function inferCategory(repo) {
  const haystack = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (/astro|exoplanet|kepler|tess|nasa|f[ií]sic|physics/.test(haystack)) return "astro";
  if (/econ|finan|pobreza|sales|venta|market|bi\b|dashboard/.test(haystack)) return "econo";
  if (/ml|machine|learning|cluster|model|vision|opencv|neural|predict/.test(haystack)) return "ds-ml";
  return "web-auto";
}

function toProject(repo) {
  const meta = repo.meta || REPO_META[repo.name.toLowerCase()] || {};
  const topics = repo.topics || [];
  return {
    id: repo.full_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: repo.name,
    title: meta.title || prettifyName(repo.name),
    category: meta.category || inferCategory(repo),
    desc: meta.desc || repo.description || "Repositorio público en GitHub.",
    tech: meta.tech || [repo.language, ...topics.slice(0, 3)].filter(Boolean),
    language: repo.language,
    stars: repo.stargazers_count || 0,
    pushedAt: repo.pushed_at || null,
    repo: repo.html_url,
    homepage: repo.homepage || "",
    collab: !!repo.collab,
    fenix: !!meta.fenix
  };
}

// --- GitHub data layer ---
function readCache() {
  try { return JSON.parse(localStorage.getItem(REPO_CACHE_KEY)); } catch { return null; }
}

async function fetchGitHubRepos() {
  const cached = readCache();
  if (cached && Date.now() - cached.t < REPO_CACHE_TTL) {
    return { repos: cached.data, source: "cache", at: cached.t };
  }
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = (await res.json())
      .filter(r => !r.fork && !r.archived)
      .map(r => ({
        name: r.name, full_name: r.full_name, html_url: r.html_url, description: r.description,
        language: r.language, stargazers_count: r.stargazers_count, topics: r.topics || [],
        homepage: r.homepage, pushed_at: r.pushed_at
      }));
    try { localStorage.setItem(REPO_CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch { /* storage full/blocked */ }
    return { repos: data, source: "live", at: Date.now() };
  } catch (err) {
    console.warn("[portfolio] GitHub API no disponible, usando respaldo:", err);
    if (cached) return { repos: cached.data, source: "stale", at: cached.t };
    return { repos: SNAPSHOT_REPOS, source: "snapshot", at: null };
  }
}

async function loadProjects() {
  const { repos, source, at } = await fetchGitHubRepos();
  const own = repos.filter(r => !EXCLUDED_REPOS.has(r.name.toLowerCase()));
  const seen = new Set(own.map(r => r.full_name.toLowerCase()));
  const extras = EXTRA_REPOS.filter(r => !seen.has(r.full_name.toLowerCase()));

  allProjects = [...own, ...extras].map(toProject).sort((a, b) => {
    if (a.collab !== b.collab) return a.collab ? 1 : -1; // own repos first
    return (new Date(b.pushedAt || 0)) - (new Date(a.pushedAt || 0));
  });

  updateRepoCounters(allProjects.length);
  updateFilterCounts();
  renderOtherProjects();
  renderLiveActivity();
  renderSyncStatus(source, at);
}

function renderSyncStatus(source, at) {
  const el = document.getElementById("repo-sync-status");
  if (!el) return;
  const count = allProjects.length;
  const labels = {
    live: `Sincronizado en vivo con GitHub · ${count} repositorios`,
    cache: `Sincronizado con GitHub ${timeAgo(new Date(at).toISOString())} · ${count} repositorios`,
    stale: `Mostrando la última sincronización (${timeAgo(new Date(at).toISOString())}) · ${count} repositorios`,
    snapshot: `GitHub no respondió — mostrando copia local · ${count} repositorios`
  };
  el.classList.toggle("is-offline", source === "snapshot" || source === "stale");
  el.innerHTML = `<span class="live-dot" aria-hidden="true"></span> ${escapeHTML(labels[source])}`;
}

function updateRepoCounters(total) {
  document.querySelectorAll(".js-repo-count").forEach(el => countUp(el, total));
  document.querySelectorAll(".js-repo-stat").forEach(el => {
    el.setAttribute("data-target", String(total));
    el.textContent = String(total);
  });
}

function updateFilterCounts() {
  document.querySelectorAll(".pfilter-btn").forEach(btn => {
    const f = btn.dataset.pfilter;
    const n = f === "all" ? allProjects.length : allProjects.filter(p => p.category === f).length;
    const badge = btn.querySelector(".pfilter-count");
    if (badge) badge.textContent = n;
    btn.disabled = n === 0;
  });
}

// --- Render Full Portfolio Grid ---
function projectCardHTML(project) {
  const techHTML = project.tech.slice(0, 5).map(t => `<li>${escapeHTML(t)}</li>`).join("");
  const langColor = LANG_COLORS[project.language] || "#8892b0";
  const badges = [
    `<span class="pbadge pbadge-cat">${escapeHTML(CATEGORY_LABELS[project.category] || "Proyecto")}</span>`,
    project.fenix ? `<span class="pbadge pbadge-fenix"><i class="fa-solid fa-fire"></i> Fénix</span>` : "",
    project.collab ? `<span class="pbadge pbadge-collab"><i class="fa-solid fa-user-group"></i> Colaboración</span>` : ""
  ].join("");
  const meta = [
    project.language ? `<span><i class="lang-dot" style="--lang:${langColor}"></i>${escapeHTML(project.language)}</span>` : "",
    project.stars ? `<span><i class="fa-regular fa-star"></i>${project.stars}</span>` : "",
    project.pushedAt ? `<span title="Último push"><i class="fa-solid fa-code-commit"></i>${escapeHTML(timeAgo(project.pushedAt))}</span>` : ""
  ].join("");
  const homepage = project.homepage
    ? `<a href="${escapeHTML(project.homepage)}" target="_blank" rel="noopener noreferrer" class="project-github-icon" aria-label="Demo en vivo de ${escapeHTML(project.title)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
    : "";

  return `
    <div class="project-card-top">
      <div class="project-card-header">
        <i class="fa-regular fa-folder-open project-folder-icon" aria-hidden="true"></i>
        <div class="project-card-links">
          ${homepage}
          <a href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer" class="project-github-icon" aria-label="Repositorio de ${escapeHTML(project.title)}">
            <i class="fa-brands fa-github"></i>
          </a>
        </div>
      </div>
      <div class="project-badges">${badges}</div>
      <h3 class="project-card-title">
        <a href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer" class="project-card-stretch">${escapeHTML(project.title)}</a>
      </h3>
      <p class="project-card-desc">${escapeHTML(project.desc)}</p>
    </div>
    <div class="project-card-bottom">
      <ul class="project-card-tech">${techHTML}</ul>
      ${meta ? `<div class="project-card-meta">${meta}</div>` : ""}
    </div>`;
}

function renderOtherProjects() {
  const grid = document.getElementById("other-projects-grid");
  const empty = document.getElementById("projects-empty");
  if (!grid) return;

  const q = projectQuery.trim().toLowerCase();
  const filtered = allProjects.filter(p => {
    if (projectFilter !== "all" && p.category !== projectFilter) return false;
    if (!q) return true;
    return `${p.title} ${p.name} ${p.desc} ${p.tech.join(" ")} ${p.language || ""}`.toLowerCase().includes(q);
  });

  grid.innerHTML = "";
  filtered.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card glass-panel";
    card.id = `project-${project.id}`;
    card.style.setProperty("--d", `${Math.min(index, 8) * 60}ms`);
    card.innerHTML = projectCardHTML(project);
    grid.appendChild(card);
  });

  if (empty) empty.hidden = filtered.length > 0;
  if (currentPage === "projects") observeReveals(grid);
}

// --- Home: live GitHub activity ---
function renderLiveActivity() {
  const grid = document.getElementById("live-activity-grid");
  if (!grid) return;
  const recent = allProjects.filter(p => p.pushedAt && !p.collab).slice(0, 3);
  const list = recent.length ? recent : allProjects.slice(0, 3);

  grid.innerHTML = list.map((p, i) => `
    <a class="live-card glass-panel" href="${escapeHTML(p.repo)}" target="_blank" rel="noopener noreferrer" style="--d:${i * 90}ms">
      <div class="live-card-top">
        <span class="live-card-lang"><i class="lang-dot" style="--lang:${LANG_COLORS[p.language] || "#8892b0"}"></i>${escapeHTML(p.language || "Repo")}</span>
        <span class="live-card-time">${p.pushedAt ? `<span class="live-pulse"></span>${escapeHTML(timeAgo(p.pushedAt))}` : ""}</span>
      </div>
      <h3 class="live-card-title">${escapeHTML(p.title)}</h3>
      <p class="live-card-desc">${escapeHTML(p.desc)}</p>
      <span class="live-card-cta">Abrir repositorio <i class="fa-solid fa-arrow-right"></i></span>
    </a>`).join("");

  if (currentPage === "home") observeReveals(grid);
}

// --- Home: tech marquee ---
function initTechMarquee() {
  const track = document.getElementById("tech-marquee-track");
  if (!track) return;
  const items = [
    ["fa-brands fa-python", "Python"], ["fa-solid fa-chart-line", "Econometría"], ["fa-solid fa-brain", "Scikit-Learn"],
    ["fa-solid fa-database", "PostgreSQL"], ["fa-solid fa-feather", "DuckDB"], ["fa-solid fa-bolt", "FastAPI"],
    ["fa-brands fa-react", "React"], ["fa-solid fa-n", "Next.js"], ["fa-solid fa-eye", "OpenCV"],
    ["fa-solid fa-meteor", "Astropy"], ["fa-solid fa-diagram-project", "NetworkX"], ["fa-brands fa-aws", "AWS"],
    ["fa-solid fa-chart-pie", "Plotly"], ["fa-solid fa-robot", "n8n"]
  ];
  const html = items.map(([icon, label]) => `<span class="marquee-item"><i class="${icon}"></i>${label}</span>`).join("");
  track.innerHTML = html + html; // duplicated for a seamless loop
}

// --- SPA Page Router System ---
const validPages = ["home", "about", "featured", "fenix", "projects", "contact"];
let currentPage = null;

function navigateTo(pageId, updateHash = true) {
  const targetId = validPages.includes(pageId) ? pageId : "home";
  if (targetId === currentPage) return;
  currentPage = targetId;

  document.querySelectorAll(".page-view").forEach(view => {
    view.classList.remove("active", "page-enter");
  });

  const activePageElement = document.getElementById(`page-${targetId}`);
  if (activePageElement) {
    activePageElement.classList.add("active");
    void activePageElement.offsetWidth; // force reflow so the animation restarts
    activePageElement.classList.add("page-enter");
    observeReveals(activePageElement);
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
  });

  if (updateHash) window.location.hash = targetId;
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

  if (targetId === "about") setTimeout(() => animateAboutStats(), 300);
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "");
  navigateTo(hash || "home", false);
}

// --- Reveal on scroll ---
const REVEAL_SELECTORS = [
  ".section-heading", ".about-text p", ".skills-list li", ".about-highlight-card",
  ".featured-card", ".sidebar-box", ".fenix-intro", ".fenix-card", ".projects-sync",
  ".projects-toolbar", ".project-card", ".contact-container > *", ".live-header", ".live-card"
].join(",");

const revealObserver = "IntersectionObserver" in window && !prefersReducedMotion
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        revealObserver.unobserve(el);
        el.classList.add("is-visible");
        const delay = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
        // Drop the reveal classes once done so hover/tilt transitions go back to normal
        setTimeout(() => el.classList.remove("reveal", "is-visible"), 800 + delay);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
  : null;

function observeReveals(root) {
  if (!revealObserver || !root) return;
  root.querySelectorAll(REVEAL_SELECTORS).forEach((el, i) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = "1";
    if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i, 6) * 70}ms`);
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

// --- Category Filter Buttons (Featured page sidebar) ---
function initFeaturedFilters() {
  const categoryButtons = document.querySelectorAll(".side-cat-btn");
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const filter = button.getAttribute("data-filter");
      let visible = 0;
      document.querySelectorAll(".featured-card").forEach(card => {
        const show = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = show ? "block" : "none";
        if (show) {
          card.animate?.([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
            { duration: 420, delay: visible++ * 70, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
        }
      });
    });
  });
}

// --- Portfolio filters + search ---
function initProjectFilters() {
  const buttons = document.querySelectorAll(".pfilter-btn");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    projectFilter = btn.dataset.pfilter;
    renderOtherProjects();
  }));

  const search = document.getElementById("project-search");
  let t;
  search?.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => { projectQuery = search.value; renderOtherProjects(); }, 140);
  });
}

// --- Cosmic Particle Canvas (Interactive constellations) ---
function initSpaceCanvas() {
  const canvas = document.getElementById("space-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height;
  let mouseX = -9999, mouseY = -9999;
  let stars = [];
  let bursts = [];
  let shootingStars = [];

  const starPalettes = [
    "rgba(100, 255, 218, ", // Mint
    "rgba(56, 189, 248, ",  // Sky Cyan
    "rgba(168, 85, 247, ",  // Cosmic Purple
    "rgba(240, 246, 252, "  // White Starlight
  ];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const starCount = Math.min(220, Math.floor((width * height) / 9000));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.6 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.005,
      drift: (Math.random() - 0.5) * 0.015,
      colorPrefix: starPalettes[Math.floor(Math.random() * starPalettes.length)]
    }));
  }
  resize();

  function spawnShootingStar() {
    if (document.hidden || Math.random() > 0.45) return;
    shootingStars.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * (height * 0.45),
      len: Math.random() * 120 + 70,
      speed: Math.random() * 6 + 5,
      alpha: 1,
      angle: Math.PI / 5
    });
  }
  if (!prefersReducedMotion) setInterval(spawnShootingStar, 2600);

  const LINK_RADIUS = 140;

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    const scrollShift = window.scrollY * 0.04;
    const near = [];

    stars.forEach(star => {
      const tw = 0.65 + Math.sin(time * 0.0015 + star.twinkle) * 0.35;
      let sx = star.x;
      let sy = (star.y - scrollShift * star.speed * 20 + height) % height;

      // Gentle repulsion from the cursor
      const dx = sx - mouseX, dy = sy - mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < LINK_RADIUS) {
        const push = (1 - dist / LINK_RADIUS) * 10;
        sx += (dx / (dist || 1)) * push;
        sy += (dy / (dist || 1)) * push;
        near.push({ x: sx, y: sy, d: dist });
      }

      ctx.beginPath();
      ctx.arc(sx, sy, star.radius * (dist < LINK_RADIUS ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fillStyle = `${star.colorPrefix}${(star.alpha * tw).toFixed(3)})`;
      ctx.fill();

      if (!prefersReducedMotion) {
        star.y -= star.speed;
        star.x += star.drift;
        if (star.y < -5) { star.y = height + 5; star.x = Math.random() * width; }
        if (star.x < -5 || star.x > width + 5) star.x = Math.random() * width;
      }
    });

    // Constellation lines around the cursor
    near.forEach(s => {
      const a = (1 - s.d / LINK_RADIUS) * 0.45;
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(100, 255, 218, ${a.toFixed(3)})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
        if (d < 70) {
          ctx.beginPath();
          ctx.moveTo(near[i].x, near[i].y);
          ctx.lineTo(near[j].x, near[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${((1 - d / 70) * 0.35).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Shooting stars
    shootingStars = shootingStars.filter(s => s.alpha > 0.05);
    shootingStars.forEach(s => {
      const tx = s.x - Math.cos(s.angle) * s.len;
      const ty = s.y - Math.sin(s.angle) * s.len;
      const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
      grad.addColorStop(0.3, `rgba(100, 255, 218, ${s.alpha * 0.8})`);
      grad.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.012;
    });

    // Click bursts
    bursts = bursts.filter(p => p.life > 0);
    bursts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.96; p.vy *= 0.96;
      p.life -= 0.02;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life + 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.max(p.life, 0).toFixed(3)})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("pointermove", e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { mouseX = mouseY = -9999; });
  window.addEventListener("resize", resize);

  // Click on empty space → stardust burst
  if (!prefersReducedMotion) {
    window.addEventListener("pointerdown", e => {
      if (e.target.closest("a, button, input, .glass-panel, .hero-profile-card")) return;
      for (let i = 0; i < 26; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 3.2 + 0.8;
        bursts.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
          r: Math.random() * 2 + 0.8, life: 1,
          color: starPalettes[Math.floor(Math.random() * starPalettes.length)]
        });
      }
    });
  }

  requestAnimationFrame(animate);
}

// --- Cursor Glow Effect ---
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || !finePointer) return;

  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
  let currentX = targetX, currentY = targetY;

  window.addEventListener("pointermove", e => { targetX = e.clientX; targetY = e.clientY; }, { passive: true });

  function animateGlow() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  glow.style.left = "0px";
  glow.style.top = "0px";
  animateGlow();
}

// --- 3D tilt + spotlight on cards, magnetic buttons ---
const TILT_SELECTOR = ".glass-panel, .hero-profile-card";
const MAGNET_SELECTOR = ".btn, .logo-hexagon, .side-socials a, .live-more";

function initInteractiveCards() {
  if (!finePointer || prefersReducedMotion) return;

  let activeCard = null;
  let activeMagnet = null;

  function resetCard(card) {
    if (!card) return;
    card.style.transform = "";
    card.classList.remove("is-tilting");
  }
  function resetMagnet(el) {
    if (el) el.style.transform = "";
  }

  document.addEventListener("pointermove", e => {
    const card = e.target.closest(TILT_SELECTOR);
    if (card !== activeCard) { resetCard(activeCard); activeCard = card; }
    if (card && !card.classList.contains("reveal")) {
      if (!card.querySelector(":scope > .card-spotlight")) {
        const spot = document.createElement("span");
        spot.className = "card-spotlight";
        spot.setAttribute("aria-hidden", "true");
        card.appendChild(spot);
        if (getComputedStyle(card).position === "static") card.style.position = "relative";
      }
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      // Larger cards tilt less so text stays readable
      const max = r.width > 520 ? 2.5 : 6;
      card.classList.add("is-tilting");
      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      card.style.transform =
        `perspective(1000px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translateY(-4px)`;
    }

    const magnet = e.target.closest(MAGNET_SELECTOR);
    if (magnet !== activeMagnet) { resetMagnet(activeMagnet); activeMagnet = magnet; }
    if (magnet) {
      const r = magnet.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      magnet.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
    }
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    resetCard(activeCard); resetMagnet(activeMagnet);
    activeCard = activeMagnet = null;
  });
}

// --- Typewriter Effect for Hero Subtitle ---
function initTypewriter() {
  const subtitleEl = document.getElementById("hero-subtitle");
  if (!subtitleEl) return;

  const phrases = [
    "Conecto la teoría económica con Ciencia de Datos y Machine Learning.",
    "Arquitecturas modernas: Monorepos, FastAPI y Next.js.",
    "Visión por computadora para rutas de emergencia.",
    "Liderando Project Fénix: renacimiento y modernización de software."
  ];

  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  subtitleEl.textContent = phrases[0];
  subtitleEl.appendChild(cursor);
  if (prefersReducedMotion) return;

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = true;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    charIndex += isDeleting ? -1 : 1;

    subtitleEl.textContent = currentPhrase.substring(0, charIndex);
    subtitleEl.appendChild(cursor);

    let delay = isDeleting ? 22 : 42 + Math.random() * 30;

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = 2800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }
    setTimeout(type, delay);
  }

  // Keep the first message readable on initial load, then begin cycling.
  setTimeout(type, 3200);
}

// --- Counters ---
function countUp(el, end, { duration = 1200, decimals = 0, suffix = "" } = {}) {
  if (prefersReducedMotion) { el.textContent = end.toFixed(decimals) + suffix; return; }
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (end * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function animateAboutStats() {
  document.querySelectorAll(".stat-val").forEach(el => {
    const target = el.getAttribute("data-target");
    if (!target) return;
    countUp(el, parseFloat(target), {
      decimals: target.includes(".") ? 1 : 0,
      suffix: target.replace(/[\d.]/g, "")
    });
  });
}

// --- Live local clock (Cartagena, COT) ---
function initLocalClock() {
  const el = document.getElementById("local-clock");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "America/Bogota"
  });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 1000);
}

// --- Scroll progress bar ---
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// --- Mobile Nav Toggle System ---
function closeMobileNav() {
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("nav-overlay");
  const navToggle = document.getElementById("nav-toggle");
  const toggleIcon = document.getElementById("nav-toggle-icon");

  if (navMenu) navMenu.classList.remove("nav-menu--open");
  if (overlay) overlay.classList.remove("nav-overlay--visible");
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  if (toggleIcon) {
    toggleIcon.classList.remove("fa-xmark");
    toggleIcon.classList.add("fa-bars");
  }
}

function openMobileNav() {
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("nav-overlay");
  const navToggle = document.getElementById("nav-toggle");
  const toggleIcon = document.getElementById("nav-toggle-icon");

  if (navMenu) navMenu.classList.add("nav-menu--open");
  if (overlay) overlay.classList.add("nav-overlay--visible");
  if (navToggle) navToggle.setAttribute("aria-expanded", "true");
  if (toggleIcon) {
    toggleIcon.classList.remove("fa-bars");
    toggleIcon.classList.add("fa-xmark");
  }
}

function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("nav-overlay");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navMenu.classList.contains("nav-menu--open") ? closeMobileNav() : openMobileNav();
  });

  // Close when tapping the overlay
  overlay && overlay.addEventListener("click", closeMobileNav);

  // Close when a nav link is clicked
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMobileNav();
  });
}

// --- Navbar scroll shadow ---
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

// --- Scroll indicator click ---
function initScrollIndicator() {
  const indicator = document.getElementById("scroll-indicator");
  if (!indicator) return;
  indicator.addEventListener("click", () => {
    const live = document.querySelector(".tech-marquee");
    live ? live.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" }) : navigateTo("about");
  });
}

// --- Initialize App & Event Listeners ---
window.addEventListener("hashchange", handleHashChange);

document.addEventListener("DOMContentLoaded", () => {
  initTechMarquee();
  initSpaceCanvas();
  initCursorGlow();
  initInteractiveCards();
  initTypewriter();
  initMobileNav();
  initNavbarScroll();
  initScrollIndicator();
  initScrollProgress();
  initLocalClock();
  initFeaturedFilters();
  initProjectFilters();
  handleHashChange();
  loadProjects();
});
