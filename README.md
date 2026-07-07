<div align="center">
  <img src="https://img.shields.io/badge/GRAVITY_NEWS-PORTAL-fff?style=for-the-badge&logo=react&color=07090e" alt="Gravity News Portal"/>
  <br><br>

  [![Autor](https://img.shields.io/badge/Author-DarckRovert-818cf8.svg?style=flat-square)](https://github.com/DarckRovert)
  [![Licencia](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)](LICENSE)
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

1. **El Motor Local:** Un daemon invisible (`news_daemon.py`) corre en tu PC ejecutando LLMs locales (Llama 3, Qwen) u online (Nvidia NIM).
2. **Web Search & Redacción:** El agente busca información de contingencia global y genera JSON estructurados.
3. **Despliegue Continuo (CI/CD):** El agente empuja (`git push`) automáticamente las noticias e imágenes a este repositorio.
4. **Hosting Reactivo:** Netlify / Vercel detectan el *commit* y despliegan la página en segundos.

### 📰 Características del Portal (Actualización V16.2)
 - **Zero-Trust Dark Mode:** Diseño Premium Tactile Brutalism en Deep Onyx y Neón Cyan (Glassmorphism).
 - **Optimizaciones Anti-Storm (NUEVO):** Integración de *Render-Phase Updates* y *Debouncers* para proteger el hilo principal durante manipulaciones intensivas de búsquedas globales, previniendo caídas de 60FPS.
 - **WCAG 2.2 Strict Compliant (NUEVO):** Tab-index transfer, aria-live politeness, skip-link focus recovery y navegación estructural blindada.
 - **Resiliencia de Red Asíncrona (NUEVO):** ErrorBoundary anidado dentro de Framer Motion para capturar e invalidar de forma grácil errores transitorios de la CDN (`ChunkLoadError`) sin romper la UI.
 - **Sincronización Cuántica y Telemetría en Vivo:** Comunicación directa vía REST API (`http://localhost:7860`) con interceptores para Live Terminal Feed y Vigía Status Dashboard.

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
> [**📖 WIKI CORPORATIVA**](./wiki/Home.md) | [📜 CONTRIBUCIÓN](./CONTRIBUTING.md) | [🔒 SEGURIDAD](./SECURITY.md) | [🏗️ ARQUITECTURA](./docs/ARCHITECTURE.md)

<br>

<div align="center">
  <sub><i>© 2026 DarckRovert · Gravity News Portal V16.2 PRO.</i></sub>
</div>
