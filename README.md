# 🚀 Portafolio Web Interactivo - `dmgar.github.io`

Bienvenido al repositorio oficial del **Portafolio Web Personal de Dariem Garcia** (`https://dmgar.github.io`).

Este sitio web está diseñado con **HTML5 semántico, CSS3 moderno (Dark Mode, Glassmorphism) y JavaScript puro (ES6+)**, sin librerías pesadas ni procesos complejos de compilación, permitiendo una carga instantánea y despliegue continuo directo en **GitHub Pages**.

---

## 🛠️ Estructura del Proyecto

```text
dmgar.github.io/
├── index.html        # Estructura semántica, metadatos SEO y componentes de la UI
├── style.css         # Sistema de diseño, tokens de color, glassmorphism y animación
├── app.js            # Lógica interactiva (filtros de proyectos, modales, typing effect)
└── README.md         # Documentación y guía de despliegue en GitHub Pages
```

---

## 📌 Guía de Despliegue en GitHub Pages

Para publicar tu portafolio en tu dominio gratuito de GitHub `https://dmgar.github.io`, sigue estos sencillos pasos:

### 1. Crear el repositorio en GitHub
1. Ingresa a [GitHub New Repository](https://github.com/new).
2. Nombra el repositorio **exactamente** así: `dmgar.github.io`.
3. Asegúrate de que sea **Público**.
4. Haz clic en **Create repository**.

### 2. Inicializar Git y subir el código desde tu terminal

Abre la terminal en la carpeta de este proyecto (`c:\Users\darye\Desktop\Repos Git\dmgar.github.io`) y ejecuta:

```bash
git init
git add .
git commit -m "feat: inicializar portafolio web interactivo"
git branch -M main
git remote add origin https://github.com/Dmgar/dmgar.github.io.git
git push -u origin main
```

### 3. Activar GitHub Pages (si no se activa automáticamente)
1. Ve a tu repositorio en GitHub: `https://github.com/Dmgar/dmgar.github.io`.
2. Haz clic en **Settings** > **Pages** (en el menú lateral).
3. En la sección **Build and deployment**, verifica que **Source** sea `Deploy from a branch`.
4. En **Branch**, selecciona `main` y carpeta `/ (root)`, luego guarda.
5. En unos minutos, tu sitio web estará disponible mundialmente en **`https://dmgar.github.io`** 🎉!

---

## 🎨 Características Destacadas de la Web

* **Efectos de Escritura Dinámica:** Frases rotativas en la sección principal (*Hero*).
* **Filtros por Categorías:** Clasificación en vivo de proyectos (*Data Science & ML*, *Economía*, *AstroData*, *Web & App*).
* **Ventanas Modales Interactivas:** Vista detallada de cada proyecto con arquitectura, métricas clave y accesos directos al código.
* **Copia Rápida de Email:** Botón interactivo para copiar dirección de contacto con notificación toast.
* **Diseño Glassmorphic Dark Mode:** Estética visual de alto nivel inspirada en interfaces modernas de IA y ciencia de datos.
