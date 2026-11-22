/**
 * Dariem Garcia · Modern Dark Portfolio Interactivity
 * Live GitHub repository sync, category filtering, instant search & micro-interactions
 */

(function () {
  'use strict';

  const GITHUB_USER = "Dmgar";
  const REPO_CACHE_KEY = "dg_portfolio_repos_v5";
  const REPO_CACHE_TTL = 60 * 60 * 1000; // 1h cache

  // Repos strictly excluded (including Sincro-App)
  const EXCLUDED_REPOS = new Set([
    "dmgar",
    "dmgar.github.io",
    "sincro",
    "sincro-app",
    "sincroapp"
  ]);

  const REPO_META = {
    "project_flowsense": {
      title: "FlowSense: Percepción Urbana & Prioridad",
      category: "ds-ml",
      badge: "COMPETICIÓN",
      badgeType: "comp",
      desc: "OpenCV AI Competition 2026 (AWS): percepción vehicular en tiempo real con OpenCV 5 y YOLOv8 para despeje semafórico dinámico de ambulancias y bomberos.",
      tech: ["Python", "OpenCV 5", "YOLOv8", "FastAPI", "OSMnx", "AWS"],
      homepage: "https://flowsense.duckdns.org"
    },
    "project_terra": {
      title: "Project Terra · Inteligencia agronómica",
      category: "econo",
      desc: "Inteligencia agronómica y clustering sobre matrices edafoclimáticas para recomendar cultivos sostenibles y planificar la siembra.",
      tech: ["Python", "Scikit-Learn", "PCA", "FastAPI", "React", "Vercel"],
      homepage: "https://terra-three-blush.vercel.app/"
    },
    "corporate-bi-dashboard": {
      title: "Corporate BI Studio",
      category: "econo",
      fenix: true,
      desc: "Dashboard de inteligencia comercial con motor OLAP embebido (DuckDB), drill-down multidimensional y alertas automáticas.",
      tech: ["Python", "DuckDB", "Streamlit", "Plotly"]
    },
    "colombia-pobreza-multidimensional": {
      title: "Colombia: Pobreza Multidimensional (IPM)",
      category: "econo",
      fenix: true,
      desc: "Inteligencia socioeconómica regional (OCDE/CEPAL) comparando Colombia vs 9 pares latinos con radar de 5 pilares.",
      tech: ["Python", "Dash", "Plotly", "PyShp", "OECD/CEPAL"]
    },
    "stochastica": {
      title: "Stochastica: Markov Chain Solver",
      category: "web-auto",
      desc: "Visualizador y resolutor analítico de cadenas de Markov en tiempo discreto con derivación simbólica exacta y grafos.",
      tech: ["TypeScript", "SymPy", "LaTeX", "Grafos"]
    },
    "yahoo-finance-data-visualization-analysis": {
      title: "Forex & Market Volatility",
      category: "econo",
      fenix: true,
      desc: "Monorepo de microservicios FastAPI (uv) + Next.js 15 que calcula ATR, MACD, RSI y series históricas de volatilidad.",
      tech: ["Next.js 15", "FastAPI", "uv", "Recharts"]
    },
    "exoplanet-outlier-detector": {
      title: "Exoplanet Outlier Detector",
      category: "astro",
      fenix: true,
      desc: "Pipeline estadístico para detección de tránsitos planetarios y outliers en curvas de luz Kepler, K2 y TESS.",
      tech: ["Python", "Lightkurve", "Astropy", "NumPy"]
    },
    "experimentos-fisicos": {
      title: "PhysLab / Experimentos Físicos",
      category: "astro",
      fenix: true,
      desc: "Monorepo computacional: simuladores RK4 (péndulo no lineal, proyectiles), tracking óptico OpenCV y frontend a 60 FPS.",
      tech: ["FastAPI", "React 19", "Vite", "OpenCV", "SciPy", "uv"]
    },
    "linkedin-personal-brand-agent": {
      title: "LinkedIn Personal Brand Agent",
      category: "web-auto",
      desc: "Asistente editorial Local-First con Google Antigravity, MCP y Playwright para inspeccionar repositorios reales y publicar vía API oficial.",
      tech: ["Python", "MCP", "Playwright", "Antigravity"]
    }
  };

  const EXTRA_REPOS = [
    {
      name: "bitminds",
      full_name: "toroc07/bitminds",
      html_url: "https://github.com/toroc07/bitminds",
      language: "Python",
      pushed_at: "2026-11-16T04:56:14Z",
      collab: true,
      meta: {
        title: "Nebo: El Cielo Infrarrojo de SPHEREx",
        category: "astro",
        badge: "NASA SPACE APPS · COLAB",
        badgeType: "comp",
        homepage: "https://nebo-app.earth/",
        desc: "Proyecto en colaboración para NASA Space Apps Challenge 2026: visor web interactivo para explorar el cielo infrarrojo de SPHEREx época por época.",
        tech: ["Next.js", "Python", "SPHEREx", "AstroData"]
      }
    },
    {
      name: "hackathon-30x",
      full_name: "toroc07/hackathon-30x",
      html_url: "https://github.com/toroc07/hackathon-30x",
      language: "Python",
      stargazers_count: 1,
      pushed_at: "2026-10-18T06:40:16Z",
      collab: true,
      meta: {
        title: "Agente de Pagos · Reto Blinka",
        category: "ds-ml",
        badge: "HACKATHON 30X · COLAB",
        badgeType: "comp",
        homepage: "https://bytestars-payment-agent.vercel.app",
        desc: "Hackathon 30x (equipo ByteStars): agente autónomo que audita facturas empresariales y decide pagar, frenar o escalar con reglas explicables.",
        tech: ["Python", "AI Agents", "FastAPI", "Vercel"]
      }
    },
    {
      name: "Veles",
      full_name: "JasenovichYukopila/Veles",
      html_url: "https://github.com/JasenovichYukopila/Veles",
      language: "Jupyter Notebook",
      pushed_at: "2026-08-30T20:05:29Z",
      collab: true,
      meta: {
        title: "Veles: Audio DSP & Genre Classifier",
        category: "ds-ml",
        badge: "SEMILLERO · COLAB",
        badgeType: "semillero",
        desc: "Proyecto de semillero en colaboración: clasificación de géneros musicales con extracción espectral MFCC (librosa), datos de Spotify y Scikit-Learn.",
        tech: ["Python", "Librosa", "Spotipy", "Scikit-Learn"]
      }
    },
    {
      name: "NEOs-Analysis",
      full_name: "JasenovichYukopila/NEOs-Analysis",
      html_url: "https://github.com/JasenovichYukopila/NEOs-Analysis",
      language: "Jupyter Notebook",
      stargazers_count: 1,
      pushed_at: "2026-09-26T21:26:52Z",
      collab: true,
      meta: {
        title: "Near Earth Objects (NEOs) Analysis",
        category: "astro",
        badge: "SEMILLERO · COLAB",
        badgeType: "semillero",
        desc: "Proyecto de semillero en colaboración: estudio de Objetos Cercanos a la Tierra (NEOs) mediante catálogos de aproximaciones cercanas y análisis orbital.",
        tech: ["Python", "NASA JPL", "Plotly", "Astrofísica"]
      }
    },
    {
      name: "coin-change",
      full_name: "pxtroniwnl/coin-change",
      html_url: "https://github.com/pxtroniwnl/coin-change",
      language: "HTML",
      pushed_at: "2026-05-25T16:56:13Z",
      collab: true,
      meta: {
        title: "Coin Change Algorithmic Solver",
        category: "web-auto",
        badge: "SEMILLERO · COLAB",
        badgeType: "semillero",
        desc: "Colaboración académica: comparativa visual de algoritmos voraces, programación dinámica y backtracking para el problema de cambio de monedas.",
        tech: ["Algoritmos", "Python", "FastAPI", "Web UI"]
      }
    }
  ];

  const SNAPSHOT_REPOS = [
    "project_Flowsense:Python",
    "Project_Terra:Jupyter Notebook",
    "corporate-bi-dashboard:Jupyter Notebook",
    "Colombia-pobreza-multidimensional:Python",
    "Yahoo-Finance-Data-Visualization-Analysis:Python",
    "Experimentos-fisicos:Jupyter Notebook",
    "exoplanet-outlier-detector:Python",
    "stochastica:TypeScript",
    "linkedin-personal-brand-agent:Python"
  ].map(function (entry) {
    const parts = entry.split(":");
    return {
      name: parts[0],
      full_name: GITHUB_USER + "/" + parts[0],
      html_url: "https://github.com/" + GITHUB_USER + "/" + parts[0],
      language: parts[1]
    };
  });

  const LANG_COLORS = {
    "Python": "#3572A5",
    "Jupyter Notebook": "#DA5B0B",
    "TypeScript": "#3178C6",
    "JavaScript": "#F1E05A",
    "CSS": "#563D7C",
    "HTML": "#E34C26",
    "R": "#198CE7",
    "SQL": "#E38C00"
  };

  let allProjects = [];
  let currentFilter = "all";
  let searchQuery = "";

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  function timeAgo(dateStr) {
    if (!dateStr) return "recientemente";
    const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
    const units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60]
    ];
    for (let i = 0; i < units.length; i++) {
      const unit = units[i][0];
      const secs = units[i][1];
      if (Math.abs(diff) >= secs) {
        return rtf.format(Math.round(diff / secs), unit);
      }
    }
    return "hace un momento";
  }

  function prettifyName(name) {
    return name.replace(/[_-]+/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function inferCategory(repo) {
    const haystack = (repo.name + " " + (repo.description || "") + " " + (repo.topics || []).join(" ")).toLowerCase();
    if (/astro|exoplanet|kepler|tess|nasa|f[ií]sic|physics/.test(haystack)) return "astro";
    if (/econ|finan|pobreza|sales|venta|market|bi\b|dashboard/.test(haystack)) return "econo";
    if (/ml|machine|learning|cluster|model|vision|opencv|neural|predict/.test(haystack)) return "ds-ml";
    return "web-auto";
  }

  function toProject(repo) {
    const key = repo.name.toLowerCase();
    const meta = repo.meta || REPO_META[key] || {};
    const topics = repo.topics || [];
    return {
      id: repo.full_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: repo.name,
      title: meta.title || prettifyName(repo.name),
      category: meta.category || inferCategory(repo),
      desc: meta.desc || repo.description || "Repositorio de investigación y código público en GitHub.",
      tech: meta.tech || [repo.language].concat(topics.slice(0, 3)).filter(Boolean),
      language: repo.language || "Python",
      stars: repo.stargazers_count || 0,
      pushedAt: repo.pushed_at || null,
      repo: repo.html_url,
      homepage: meta.homepage || repo.homepage || "",
      collab: !!repo.collab,
      fenix: !!meta.fenix,
      badge: meta.badge || (meta.fenix ? "FÉNIX" : ""),
      badgeType: meta.badgeType || (meta.fenix ? "fenix" : "")
    };
  }

  async function fetchGitHubRepos() {
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(REPO_CACHE_KEY));
    } catch (e) {
      cached = null;
    }

    if (cached && Date.now() - cached.t < REPO_CACHE_TTL) {
      return { repos: cached.data, source: "cache", at: cached.t };
    }

    try {
      const res = await fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=pushed", {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!res.ok) throw new Error("GitHub API status " + res.status);
      const data = (await res.json())
        .filter(function (r) { return !r.fork && !r.archived; })
        .map(function (r) {
          return {
            name: r.name,
            full_name: r.full_name,
            html_url: r.html_url,
            description: r.description,
            language: r.language,
            stargazers_count: r.stargazers_count,
            topics: r.topics || [],
            homepage: r.homepage,
            pushed_at: r.pushed_at
          };
        });

      try {
        localStorage.setItem(REPO_CACHE_KEY, JSON.stringify({ t: Date.now(), data: data }));
      } catch (e) {
        // quota
      }
      return { repos: data, source: "live", at: Date.now() };
    } catch (err) {
      console.warn("[portfolio] Fallback local:", err);
      if (cached) return { repos: cached.data, source: "stale", at: cached.t };
      return { repos: SNAPSHOT_REPOS, source: "snapshot", at: null };
    }
  }

  async function initProjects() {
    const result = await fetchGitHubRepos();
    const own = result.repos.filter(function (r) {
      return !EXCLUDED_REPOS.has(r.name.toLowerCase());
    });
    const seen = new Set(own.map(function (r) { return r.full_name.toLowerCase(); }));
    const extras = EXTRA_REPOS.filter(function (r) {
      return !seen.has(r.full_name.toLowerCase());
    });

    allProjects = own.concat(extras).map(toProject).sort(function (a, b) {
      if (a.collab !== b.collab) return a.collab ? 1 : -1;
      return new Date(b.pushedAt || 0) - new Date(a.pushedAt || 0);
    });

    updateCounters();
    renderArchive();
    renderSyncStatus(result.source, result.at);
  }

  function updateCounters() {
    const counts = {
      all: allProjects.length,
      "ds-ml": 0,
      econo: 0,
      astro: 0,
      "web-auto": 0
    };

    allProjects.forEach(function (p) {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    document.querySelectorAll(".js-repo-count").forEach(function (el) {
      el.textContent = allProjects.length + "+";
    });

    for (const key in counts) {
      const countEl = document.querySelector(".js-count-" + key);
      if (countEl) {
        countEl.textContent = String(counts[key]);
      }
    }
  }

  function renderSyncStatus(source, at) {
    const el = document.getElementById("repo-sync-status");
    if (!el) return;
    const count = allProjects.length;
    let label = "";
    if (source === "live") {
      label = "Sincronizado con GitHub · " + count + " repositorios";
    } else if (source === "cache") {
      label = "Sincronizado " + timeAgo(new Date(at).toISOString()) + " · " + count + " repos";
    } else {
      label = "Mostrando respaldo local · " + count + " repos";
    }
    el.innerHTML = '<span class="sync-dot" aria-hidden="true"></span> <span>' + escapeHTML(label) + '</span>';
  }

  function renderArchive() {
    const container = document.getElementById("repos-container");
    if (!container) return;

    const filtered = allProjects.filter(function (p) {
      const matchCat = currentFilter === "all" || p.category === currentFilter;
      if (!matchCat) return false;
      if (!searchQuery) return true;
      const haystack = (p.title + " " + p.name + " " + p.desc + " " + p.tech.join(" ")).toLowerCase();
      return haystack.includes(searchQuery.toLowerCase());
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="loading-state-card">No se encontraron repositorios que coincidan con la búsqueda.</div>';
      return;
    }

    container.innerHTML = filtered.map(function (p) {
      const langColor = LANG_COLORS[p.language] || "#6366f1";
      const techBadges = p.tech.slice(0, 4).map(function (t) {
        return '<span>' + escapeHTML(t) + '</span>';
      }).join("");

      const badgeClass = p.badgeType ? "repo-badge-cat badge-" + p.badgeType : "repo-badge-cat";
      const badgeText = p.badge ? p.badge + " // " + p.category.toUpperCase() : p.category.toUpperCase();
      const demoLink = p.homepage
        ? '<a href="' + escapeHTML(p.homepage) + '" target="_blank" rel="noopener noreferrer" class="repo-demo-link">Demo ↗</a>'
        : "";

      return (
        '<article class="repo-card">' +
          '<div class="repo-card-top">' +
            '<a href="' + escapeHTML(p.repo) + '" target="_blank" rel="noopener noreferrer" class="repo-card-title">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>' +
              '<span>' + escapeHTML(p.title) + '</span>' +
            '</a>' +
            '<span class="' + badgeClass + '">' + escapeHTML(badgeText) + '</span>' +
          '</div>' +
          '<p class="repo-desc">' + escapeHTML(p.desc) + '</p>' +
          '<div class="repo-tags">' + techBadges + '</div>' +
          '<div class="repo-footer">' +
            '<div class="repo-left-meta">' +
              '<span>' +
                '<span class="repo-lang-dot" style="background-color: ' + langColor + '"></span>' +
                '<span>' + escapeHTML(p.language) + '</span>' +
              '</span>' +
              '<span>★ ' + p.stars + '</span>' +
              demoLink +
            '</div>' +
            '<span>' + timeAgo(p.pushedAt) + '</span>' +
          '</div>' +
        '</article>'
      );
    }).join("");
  }

  function initFilterHandlers() {
    const filterTabs = document.querySelectorAll(".filter-tab");
    filterTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        filterTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        currentFilter = tab.getAttribute("data-filter") || "all";
        renderArchive();
      });
    });

    const searchInput = document.getElementById("repo-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        searchQuery = e.target.value.trim();
        renderArchive();
      });
    }
  }

  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", function () {
      const scrollY = window.scrollY;
      let activeId = "inicio";

      sections.forEach(function (section) {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          activeId = section.getAttribute("id");
        }
      });

      navLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === "#" + activeId) {
          link.classList.add("is-active");
        } else {
          link.classList.remove("is-active");
        }
      });
    }, { passive: true });
  }

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    if (!toggle || !navMenu) return;

    function closeMenu() {
      navMenu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProjects();
    initFilterHandlers();
    initScrollSpy();
    initMobileNav();
  });

})();
