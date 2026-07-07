<div align="center">
  <img src="https://img.shields.io/badge/GRAVITY_NEWS-PORTAL-fff?style=for-the-badge&logo=react&color=07090e" alt="Gravity News Portal"/>
  <br><br>

  [![Autor](https://img.shields.io/badge/Author-DarckRovert-818cf8.svg?style=flat-square)](https://github.com/DarckRovert)
  [![Licencia](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)](LICENSE.md)
  [![Release](https://img.shields.io/badge/Release-V16.2_PRO-6366f1.svg?style=flat-square)]()
  [![Twitch](https://img.shields.io/badge/Twitch-DarckRovert-9146ff.svg?style=flat-square&logo=twitch)](https://twitch.tv/darckrovert)

  <p align="center">
     <i><strong>Nexo Ágora: El Portal de Noticias de la Resistencia.</strong><br>
     Frontend Desacoplado operando en Zero-Trust y mantenido de manera autónoma por el <strong>Agente Periodístico de Gravity AI</strong>.<br>
     Renderización Glassmorphism · Vite/React 18 · Actualización Continua y Telemetría en Tiempo Real.</i><br><br>
     🛡️ <b>Auditoría V16.2 PRO: Arquitectura Anti-Render Storm - Resiliencia ChunkLoadError - Cumplimiento WCAG 2.2 Estricto</b>
   </p>
 </div>

---

## 🏛 Arquitectura Frontend V16.2 PRO

El **Gravity News Portal** no es un portal de noticias ordinario. Es la interfaz pública "Cloud-Side" de tu **Gravity AI Bridge**.
Funciona de manera *Decoupled* (Desacoplada).

1. **El Motor Local:** Un daemon invisible (`news_daemon.py`) corre en tu PC ejecutando LLMs locales (Llama 3, Qwen) u online (Nvidia NIM).
2. **Web Search & Redacción:** El agente busca información de contingencia global, la redacta en formato periodístico con un tono materialista/geopolítico y genera JSON estructurados.
3. **Despliegue Continuo (CI/CD):** El agente empuja (`git push`) automáticamente las noticias e imágenes a este repositorio.
4. **Hosting Reactivo:** Netlify / Vercel detectan el *commit*, compilan el proyecto con Vite y despliegan la página en segundos.

### 📰 Características del Portal (Actualización V16.2)
 - **Zero-Trust Dark Mode:** Diseño Premium Tactile Brutalism en Deep Onyx y Neón Cyan (Glassmorphism).
 - **Optimizaciones Anti-Storm (NUEVO):** Integración de *Render-Phase Updates* y *Debouncers* para proteger el hilo principal durante manipulaciones intensivas de búsquedas globales, previniendo caídas de 60FPS.
 - **WCAG 2.2 Strict Compliant (NUEVO):** Tab-index transfer, aria-live politeness, skip-link focus recovery y navegación estructural blindada.
 - **Resiliencia de Red Asíncrona (NUEVO):** ErrorBoundary anidado dentro de Framer Motion para capturar e invalidar de forma grácil errores transitorios de la CDN (`ChunkLoadError`) sin romper la UI.
 - **Sincronización Cuántica y Telemetría en Vivo:** Capacidad para comunicarse directamente vía REST API con tu Bridge local a través de `http://localhost:7860`. Cuando el Daemon local está activo, el portal intercepta:
   - *Live Terminal Feed* (`/v1/journalist/log`): Monitoreo de logs en tiempo real.
   - *Vigía Status Dashboard* (`/v1/autonomy/status`): Panel lateral que visualiza la salud del sistema y la entropía del periodista.
   - *Dynamic News Merging* (`/v1/journalist/news`): Las noticias generadas se transmiten inmediatamente al frontend antes de que ocurra el commit, eliminando el tiempo de espera del build.
 - **Resiliencia Offline:** Si la PC/Bridge falla o se apaga, el portal cambiará a modo offline (estático, cinemático y mostrando noticias cacheadas en `news.json`) sin interrupciones visuales, demostrando su naturaleza Zero-Trust.
 - **Renderizado Seguro:** La limpieza de libros utiliza Regex locales para remover estilos y garantizar que el contenido Markdown/HTML generado por el Bridge no rompa la estructura del portal.
 - **Auto-Mantenimiento:** Limpieza de librerías y portadas automáticas (Script `sync_books.py`).
 - **Field Reporters Context-Aware:** Sistema Zero-Trust que asigna dinámicamente corresponsales según la región (ej. Arquímedes para Norteamérica, RT para Eurasia).
 - **Resiliencia de Imágenes:** Componentes `ProgressiveImage` inyectan visuales Cyberpunk de emergencia si la IA de imágenes falla.

---

## 🚀 Despliegue Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/DarckRovert/gravity-news-portal.git

# 2. Entrar al directorio
cd gravity-news-portal

# 3. Instalar dependencias
npm install

# 4. Lanzar servidor local
npm run dev
```

---

> [!NOTE]
> Ecosistema público V16.2 Frontend.
> [**📖 WIKI CORPORATIVA**](./wiki/Home.md) | [📜 CONTRIBUCIÓN](./CONTRIBUTING.md) | [🔒 SEGURIDAD](./SECURITY.md) | [🏗️ ARQUITECTURA](./docs/ARCHITECTURE.md) | [🛠️ DESARROLLADORES](./docs/DEVELOPER_GUIDE.md) | [📘 MANUAL DE USUARIO](./docs/USER_MANUAL.md)

<br>

<div align="center">
  <sub><i>© 2026 DarckRovert · Gravity News Portal V16.2 PRO.</i></sub>
</div>\n