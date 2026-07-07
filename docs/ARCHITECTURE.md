# 🏗️ Arquitectura del Nexo Ágora (V16.2 PRO)

Este documento describe la arquitectura de software de **Gravity News Portal** y sus mecanismos avanzados de renderizado y sincronización.

## 1. Topología del Ecosistema

El sistema opera bajo un modelo **Decoupled Sync (Zero-Trust)**:
- **Frontend React**: SPA estática (Vite + React 19) en Netlify.
- **Data Source**: Archivos locales estáticos (`news.json`, `books.json`).
- **Orquestador Backend (Offline/Online)**: El puente Python (`gravity_reporter.py`) hace `git push` en background para builds estáticos, o expone `/v1/journalist/news` para inyección de datos en tiempo real (Telemetría Activa).

## 2. Prevención de Bugs Arquitectónicos (El Estándar Mythos 5)

El archivo maestro `App.jsx` fue blindado mediante las siguientes implementaciones estrictas:

### A. Invulnerabilidad de Enrutamiento (`ChunkLoadError` Mitigation)
Se mitigó la caída asíncrona de la red al intentar cargar vistas con `React.lazy()` estableciendo una jerarquía inquebrantable:
```jsx
<AnimatePresence mode="wait">
  <ErrorBoundary key={location.pathname}>
    <Routes>
      <Route element={<Suspense fallback={<PageLoader />}> ... </Suspense>} />
```
1. Si un chunk falla, el `ErrorBoundary` captura el error SIN desmontar el `AnimatePresence`.
2. El uso de `key={location.pathname}` garantiza que, al navegar a otra ruta, el `ErrorBoundary` se destruya y reactive automáticamente, sin dejar al usuario bloqueado en el estado de error.
3. La recuperación manual exige `window.location.reload()` para purgar la caché nativa de promesas fallidas de Vite.

### B. Rendimiento Anti-Storm (Render-Phase Updates)
Se ha abolido el uso de `useEffect` para sincronizar estados derivados. En buscadores y contextos globales (ej. `searchTerm`), utilizar `setSearchTerm` directamente en cada pulsación del teclado (`onChange`) provocaría una *render storm* catastrófica. 
**La solución React 19:**
Implementación de un estado local con Debounce, sincronizado mediante **Render-Phase Updates** para no desatar re-renders en cascada (`react-hooks/set-state-in-effect` violation).

### C. Foco de Accesibilidad (WCAG 2.2)
Toda interacción que desplace el viewport (ej. `ScrollToTopFAB`) no abandona al usuario de teclado (`blur()`), sino que transfiere el foco de manera programática al nodo principal protegido (`<main id="main" tabIndex={-1}>`).

### D. Optimización GPU (Framer Motion)
El monitoreo del scroll (`ScrollTracker`) se realiza **fuera del ciclo de renderizado de React**, interceptando los deltas directamente hacia la GPU mediante `useScroll` y `useMotionValueEvent`, manteniendo la interfaz perpetuamente a 60 FPS.\n