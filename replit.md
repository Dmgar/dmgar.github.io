# Dariem Garcia Portfolio

## Overview
A static single-page application (SPA) portfolio site for Dariem Garcia — Economist & Data Scientist at Universidad Tecnológica de Bolívar (UTB).

**Stack:** Pure HTML + CSS + Vanilla JavaScript. No build step, no dependencies.

## Project Structure
```
index.html   — Main HTML (all 5 page views baked in, shown/hidden by router)
style.css    — All styles (CSS custom properties, animations, responsive)
app.js       — SPA router, canvas animation, typewriter, cursor glow, card stagger
favicon.svg  — Site favicon
```

## Running the App
The site is served with Python's built-in HTTP server:

```bash
python3 -m http.server 5000
```

This is configured as the **"Start application"** workflow on port 5000.

## Architecture
- **SPA Router:** Hash-based (`#home`, `#about`, `#featured`, `#projects`, `#contact`). `navigateTo()` manages page visibility and triggers `page-enter` CSS animation.
- **Canvas:** Animated star field with mouse parallax and random shooting stars.
- **Typewriter:** Rotates through 3 phrases on the hero subtitle with configurable speed.
- **Project cards:** Rendered dynamically by `renderOtherProjects()` with staggered `animate-in` class.
- **About stats:** Counter animation runs when the About page is shown.

## User Preferences
- Keep the dark navy + mint (`#64ffda`) color scheme.
- Maintain the existing file structure (one HTML, one CSS, one JS).
- Do not add a build system unless explicitly requested.
