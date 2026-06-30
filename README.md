# Élite Estates — Luxury Homes &amp; Supercars

Landing page de lujo (casas + autos) con:
- Puerta 3D de entrada (Three.js + GSAP)
- Cámara recorriendo la mansión al hacer scroll (5 habitaciones, GSAP ScrollTrigger)
- Partículas doradas ambientales en el hero (Three.js)
- Galería de autos arrastrable + scroll-jacking horizontal
- Sección cinematográfica con partículas de ceniza dorada (canvas 2D)
- Cursor personalizado dorado
- Totalmente responsive

## ⚠️ IMPORTANTE — Cómo probarlo

**Este sitio NO funciona abriendo `index.html` con doble clic / "Abrir con navegador" en tu teléfono.**

¿Por qué? Porque carga los componentes (`components/*.jsx`) como archivos separados vía `<script src="...">`, y los navegadores bloquean por seguridad (CORS) que un archivo HTML local cargue otros archivos locales así. Esto es una protección del navegador, no un error del código.

**Solución: esto SÍ funciona perfecto en GitHub Pages**, porque ahí el sitio se sirve desde un servidor real (https://tu-usuario.github.io/...), no desde el sistema de archivos local. GitHub Pages resuelve esto automáticamente.

## Cómo subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub (o usa uno existente)
2. Sube **todos los archivos y carpetas tal cual están** (mantén la carpeta `components/` con sus 10 archivos `.jsx`, junto con `index.html` y `styles.css` en la raíz del repo)
3. Ve a **Settings → Pages**
4. En "Source", elige la rama (normalmente `main`) y la carpeta `/ (root)`
5. Guarda y espera 1-3 minutos
6. Tu sitio estará en `https://tu-usuario.github.io/nombre-del-repo/`

## Estructura de archivos

```
├── index.html              ← punto de entrada, carga todo
├── styles.css               ← todos los estilos
└── components/
    ├── CustomCursor.jsx      ← cursor dorado personalizado
    ├── DoorIntro.jsx         ← puerta 3D de entrada
    ├── Navbar.jsx            ← navegación + menú móvil
    ├── Hero.jsx              ← hero con video + partículas
    ├── Marquee.jsx           ← cinta dorada animada
    ├── MansionTour.jsx       ← tour de la mansión (scroll camera)
    ├── PropertiesGrid.jsx    ← grid de propiedades
    ├── GarageScroller.jsx    ← galería de autos
    ├── CinematicShowcase.jsx ← sección de video + modal
    ├── ContactFooter.jsx     ← contacto + footer
    └── App.jsx               ← componente raíz que une todo
```

## Tecnologías (todas vía CDN, sin instalar nada)

- React 18 (UMD)
- Babel Standalone (transpila JSX en el navegador)
- Three.js r128
- GSAP 3.12.5 + ScrollTrigger

## Personalización rápida

- **Cambiar el video de fondo:** busca `VIDEO_URL` en `components/App.jsx`
- **Cambiar las propiedades de lujo:** edita el array `PROPERTIES` en `components/PropertiesGrid.jsx`
- **Cambiar los autos:** edita el array `CARS` en `components/GarageScroller.jsx`
- **Cambiar las habitaciones del tour:** edita el array `ROOMS` en `components/MansionTour.jsx`
- **Colores:** todas las variables de color están en `:root` al inicio de `styles.css`
