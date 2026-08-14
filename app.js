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

function navigateTo(pageId, updateHash = true) {
  const targetPage = validPages.includes(pageId) ? pageId : "home";

  // Hide all page views
  document.querySelectorAll(".page-view").forEach(view => {
    view.classList.remove("active");
  });

  // Show target page view
  const activePageElement = document.getElementById(`page-${targetPage}`);
  if (activePageElement) {
    activePageElement.classList.add("active");
  }

  // Update navbar links active status
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${targetPage}`) {
      link.classList.add("active");
    }
  });

  // Update URL Hash without trigger loop
  if (updateHash) {
    window.location.hash = targetPage;
  }

  // Close mobile nav menu if open
  const navMenu = document.getElementById("nav-menu");
  if (navMenu && window.innerWidth <= 600) {
    navMenu.style.display = "none";
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
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

  filtered.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card glass-panel";
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

// --- Category Filter Buttons ---
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
  });
});

// --- Cosmic Particle Canvas (Sarah Drasner style) ---
function initSpaceCanvas() {
  const canvas = document.getElementById("space-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const stars = [];
  const starCount = Math.floor((width * height) / 12000);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.05 + 0.01
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${star.alpha})`;
      ctx.fill();

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animate();
}

// --- Mobile Nav Toggle ---
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    if (navMenu.style.display === "flex") {
      navMenu.style.display = "none";
    } else {
      navMenu.style.display = "flex";
      navMenu.style.flexDirection = "column";
      navMenu.style.position = "absolute";
      navMenu.style.top = "85px";
      navMenu.style.right = "25px";
      navMenu.style.background = "#112240";
      navMenu.style.padding = "1.5rem";
      navMenu.style.borderRadius = "8px";
      navMenu.style.border = "1px solid #233554";
    }
  });
}

// --- Initialize App & Event Listeners ---
window.addEventListener("hashchange", handleHashChange);

document.addEventListener("DOMContentLoaded", () => {
  renderOtherProjects("all");
  initSpaceCanvas();
  handleHashChange();
});
