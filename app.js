/* ==========================================================================
   Dariem Garcia Portfolio - Multi-Page (SPA Router) & Canvas Interactivity
   ========================================================================== */

// --- Dataset of Secondary & Noteworthy Projects ---
const otherProjects = [
  {
    id: "yahoo-finance",
    title: "Yahoo Finance Technical Analysis",
    category: "econo",
    shortDesc: "Plataforma de análisis técnico de activos financieros evaluando volatilidad, RSI y osciladores MACD.",
    tech: ["Python", "Plotly", "yfinance", "Pandas"],
    repo: "https://github.com/Dmgar/Yahoo-Finance-Data-Visualization-Analysis"
  },
  {
    id: "coin-change",
    title: "Coin Change Algorithmic Solver",
    category: "web-auto",
    shortDesc: "Solucionador interactivo del problema de cambio de monedas (Voraz, Programación Dinámica y Backtracking).",
    tech: ["Python", "FastAPI", "Pytest", "Algorithms"],
    repo: "https://github.com/pxtroniwnl/coin-change"
  },
  {
    id: "sql-analytics",
    title: "SQL & Python Sales Analytics",
    category: "econo",
    shortDesc: "Pipeline analítico de ventas integrando consultas relacionales complejas SQL con análisis de cohortes en Python.",
    tech: ["SQL", "Python", "Pandas", "Jupyter"],
    repo: "https://github.com/Dmgar/sql-python-analytics-ventas"
  },
  {
    id: "neos-analysis",
    title: "Near Earth Objects (NEOs) Analysis",
    category: "astro",
    shortDesc: "Análisis de trayectorias orbitales y mapeo de riesgo de Objetos Cercanos a la Tierra con datos de la NASA.",
    tech: ["Python", "Astrophysics", "NASA API", "Plotly"],
    repo: "https://github.com/Jmyukopila/NEOs-Analysis"
  },
  {
    id: "experimentos-fisicos",
    title: "Simulaciones & Experimentos Físicos",
    category: "ds-ml",
    shortDesc: "Modelado computacional y simulación didáctica de sistemas físicos (péndulo simple y tiros parabólicos).",
    tech: ["Python", "R", "NumPy", "Matplotlib"],
    repo: "https://github.com/Dmgar/Experimentos-fisicos"
  }
];

// --- SPA Page Router System ---
const validPages = ["home", "about", "featured", "projects", "contact"];
let currentPage = null;

function navigateTo(pageId, updateHash = true) {
  const targetId = validPages.includes(pageId) ? pageId : "home";
  if (targetId === currentPage) return;
  currentPage = targetId;

  // Hide all page views
  document.querySelectorAll(".page-view").forEach(view => {
    view.classList.remove("active", "page-enter");
  });

  // Show and animate target page
  const activePageElement = document.getElementById(`page-${targetId}`);
  if (activePageElement) {
    activePageElement.classList.add("active");
    // Force a reflow so the animation triggers
    void activePageElement.offsetWidth;
    activePageElement.classList.add("page-enter");
  }

  // Update navbar links active status
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${targetId}`) {
      link.classList.add("active");
    }
  });

  // Update URL Hash without trigger loop
  if (updateHash) {
    window.location.hash = targetId;
  }

  // Close mobile nav menu if open
  const navMenu = document.getElementById("nav-menu");
  if (navMenu && window.innerWidth <= 600) {
    navMenu.style.display = "none";
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Trigger section-specific animations
  if (targetId === "projects") {
    setTimeout(() => animateProjectCards(), 50);
  }
  if (targetId === "about") {
    setTimeout(() => animateAboutStats(), 300);
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "");
  navigateTo(hash || "home", false);
}

// --- Render Secondary Projects Grid ---
function renderOtherProjects(filter = "all") {
  const grid = document.getElementById("other-projects-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = filter === "all"
    ? otherProjects
    : otherProjects.filter(p => p.category === filter);

  filtered.forEach((project, index) => {
    const card = document.createElement("div");
    const staggerClass = `stagger-${Math.min(index + 1, 5)}`;
    card.className = `project-card glass-panel ${staggerClass}`;
    card.id = `other-project-${project.id}`;

    const techHTML = project.tech.map(t => `<li>${t}</li>`).join("");

    card.innerHTML = `
      <div class="project-card-top">
        <div class="project-card-header">
          <i class="fa-regular fa-folder project-folder-icon"></i>
          <a href="${project.repo}" target="_blank" rel="noopener noreferrer" class="project-github-icon" aria-label="GitHub Repository">
            <i class="fa-brands fa-github"></i>
          </a>
        </div>
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-desc">${project.shortDesc}</p>
      </div>
      <ul class="project-card-tech">${techHTML}</ul>
    `;

    grid.appendChild(card);
  });
}

// --- Animate project cards when grid is visible ---
function animateProjectCards() {
  const cards = document.querySelectorAll("#other-projects-grid .project-card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, i * 70);
  });
}

// --- Category Filter Buttons ---
document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".side-cat-btn");
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const filter = button.getAttribute("data-filter");

      // Filter featured spotlight cards by data-category attribute
      const featuredCards = document.querySelectorAll(".featured-card");
      featuredCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        if (filter === "all" || cardCategory === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });

      renderOtherProjects(filter);
      setTimeout(() => animateProjectCards(), 50);
    });
  });
});

// --- Cosmic Particle Canvas (Interactive) ---
function initSpaceCanvas() {
  const canvas = document.getElementById("space-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouseX = width / 2;
  let mouseY = height / 2;

  const starCount = Math.floor((width * height) / 10000);
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.6 + 0.15,
      speed: Math.random() * 0.04 + 0.005,
      drift: (Math.random() - 0.5) * 0.015
    });
  }

  // Shooting star state
  let shootingStars = [];
  function spawnShootingStar() {
    if (Math.random() < 0.3) {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.5),
        len: Math.random() * 120 + 60,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        angle: Math.PI / 5
      });
    }
  }
  setInterval(spawnShootingStar, 3000);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw stars with subtle mouse parallax
    const parallaxStrength = 8;
    const offsetX = ((mouseX / width) - 0.5) * parallaxStrength;
    const offsetY = ((mouseY / height) - 0.5) * parallaxStrength;

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(
        star.x + offsetX * star.speed * 10,
        star.y + offsetY * star.speed * 10,
        star.radius,
        0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(100, 255, 218, ${star.alpha})`;
      ctx.fill();

      star.y -= star.speed;
      star.x += star.drift;

      if (star.y < -5) {
        star.y = height + 5;
        star.x = Math.random() * width;
      }
      if (star.x < -5 || star.x > width + 5) {
        star.x = Math.random() * width;
      }
    });

    // Draw shooting stars
    shootingStars = shootingStars.filter(s => s.alpha > 0.05);
    shootingStars.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      const grad = ctx.createLinearGradient(
        s.x, s.y,
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      grad.addColorStop(0, `rgba(100, 255, 218, ${s.alpha})`);
      grad.addColorStop(1, "rgba(100, 255, 218, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.012;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animate();
}

// --- Cursor Glow Effect ---
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener("mousemove", e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateGlow() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.left = currentX + "px";
    glow.style.top = currentY + "px";
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// --- Typewriter Effect for Hero Subtitle ---
function initTypewriter() {
  const subtitleEl = document.getElementById("hero-subtitle");
  if (!subtitleEl) return;

  const phrases = [
    "Conecto la teoría económica con Ciencia de Datos y Machine Learning.",
    "Econometría aplicada, análisis de exoplanetas y automatización.",
    "Construyendo soluciones donde los datos cuentan historias."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  // Add cursor element
  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  subtitleEl.innerHTML = "";
  subtitleEl.appendChild(cursor);

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    subtitleEl.innerHTML = currentPhrase.substring(0, charIndex);
    subtitleEl.appendChild(cursor);

    let delay = isDeleting ? 28 : 48;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full phrase
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, delay);
      }, 2600);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after hero subtitle animation completes
  setTimeout(type, 900);
}

// --- Animated Counter for About Stats ---
function animateAboutStats() {
  const statEls = document.querySelectorAll(".stat-val");
  statEls.forEach(el => {
    const target = el.getAttribute("data-target");
    if (!target) return;

    const isFloat = target.includes(".");
    const end = parseFloat(target);
    const suffix = target.replace(/[\d.]/g, "");
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = end * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// --- Mobile Nav Toggle ---
function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu   = document.getElementById("nav-menu");
  const overlay   = document.getElementById("nav-overlay");
  const toggleIcon = document.getElementById("nav-toggle-icon");

  if (!navToggle || !navMenu) return;

  function openMenu() {
    navMenu.classList.add("nav-menu--open");
    overlay && overlay.classList.add("nav-overlay--visible");
    navToggle.setAttribute("aria-expanded", "true");
    if (toggleIcon) {
      toggleIcon.classList.remove("fa-bars");
      toggleIcon.classList.add("fa-xmark");
    }
  }

  function closeMenu() {
    navMenu.classList.remove("nav-menu--open");
    overlay && overlay.classList.remove("nav-overlay--visible");
    navToggle.setAttribute("aria-expanded", "false");
    if (toggleIcon) {
      toggleIcon.classList.remove("fa-xmark");
      toggleIcon.classList.add("fa-bars");
    }
  }

  navToggle.addEventListener("click", () => {
    navMenu.classList.contains("nav-menu--open") ? closeMenu() : openMenu();
  });

  // Close when tapping the overlay
  overlay && overlay.addEventListener("click", closeMenu);

  // Close when a nav link is clicked (navigation handles page switch)
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });
}

// --- Navbar scroll shadow ---
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// --- Scroll indicator click ---
function initScrollIndicator() {
  const indicator = document.getElementById("scroll-indicator");
  if (!indicator) return;
  indicator.addEventListener("click", () => navigateTo("about"));
}

// --- Initialize App & Event Listeners ---
window.addEventListener("hashchange", handleHashChange);

document.addEventListener("DOMContentLoaded", () => {
  renderOtherProjects("all");
  initSpaceCanvas();
  initCursorGlow();
  initTypewriter();
  initMobileNav();
  initNavbarScroll();
  initScrollIndicator();
  handleHashChange();
});
