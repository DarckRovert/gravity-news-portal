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
     Renderización Glassmorphism · Vite 8 / React 19 · Telemetría en Tiempo Real y Máxima Resiliencia.</i><br><br>
     🛡️ <b>Auditoría V16.2 PRO: Sanitización XSS Estricta · Page Visibility Polling · WCAG 2.2 Global · Lanzadores Nativos de Ecosistema</b>
   </p>
 </div>

---

## 🏛 Arquitectura Frontend V16.2 PRO

El **Gravity News Portal** es la interfaz pública desacoplada ("Cloud-Side") del ecosistema **Gravity AI Bridge**.
Opera bajo el paradigma de **Soberanía y Desacoplamiento Absoluto (Zero-Trust)**:

1. **El Motor Local (Backend):** Un servidor local multi-sesión (`bridge_server.py`) corre en `http://localhost:7860` orquestando modelos LLM (LM Studio, Groq, Nvidia NIM), motores de reportería geopolítica y el núcleo homeostático del Vigía.
2. **Web Search & Redacción:** Los reporteros analizan la coyuntura internacional mediante el prisma del *Sustrato Primordial* y *La Física del Poder*, emitiendo artículos estructurados en JSON.
3. **Despliegue Continuo Soberano (CI/CD Costo $0):** Los artículos se sincronizan hacia este repositorio sin workflows de GitHub Actions de pago, preservando la cuota de minutos a costo permanente de $0.00.
4. **Hosting Reactivo:** Netlify detecta los commits mediante webhooks nativos, compila la PWA con Vite y actualiza la CDN global en segundos.

---

## 🚀 Inicio Rápido (Lanzadores Nativos)

Para máxima comodidad en entornos Windows, se han integrado lanzadores de consola nativos en la raíz del proyecto:

| Lanzador | Descripción | Destino |
|---|---|---|
| [`INICIAR_PORTAL.bat`](./INICIAR_PORTAL.bat) | Arranca el servidor Vite del Frontend, instala dependencias si faltan y abre el navegador automáticamente. | `http://localhost:5173` |
| [`INICIAR_ECOSISTEMA_COMPLETO.bat`](./INICIAR_ECOSISTEMA_COMPLETO.bat) | **Orquestador Total:** Arranca en paralelo el Backend (`Gravity_AI_bridge` en `:7860`) y el Frontend (`:5173`) con un solo clic. | Ambos servicios en paralelo |

```bash
# O inicio manual vía terminal:
npm install
npm run dev
```

---

## 🛡️ Fortificaciones y Mejoras V16.2 PRO

### 1. Seguridad y Sanitización XSS Estricta
* **Escape Seguro de Markdown:** [`TypewriterMarkdown.jsx`](./src/components/TypewriterMarkdown.jsx) pre-escapa entidades HTML crudas antes del renderizado de tokens Markdown para neutralizar inyecciones de script.
* **Lector Aislado con DOMParser:** [`Reader.jsx`](./src/pages/Reader.jsx) higieniza los tomos HTML cargados dinámicamente mediante `DOMParser`, eliminando scripts ejecutables, enlaces externos sospechosos y atributos `on*` antes de montarlos en el DOM.

### 2. Ahorro de Recursos & Page Visibility API
* **Polling Inteligente:** Los sondeos de logs (`TerminalFeed.jsx`), telemetría del Vigía (`Sidebar.jsx`) y noticias del Bridge (`Home.jsx`) se suspenden automáticamente cuando la pestaña pasa a segundo plano (`document.hidden`), reduciendo a cero el consumo de red y ciclos de CPU innecesarios.
* **AbortControllers Integrados:** Toda petición HTTP cancela sus canales al desmontar componentes o cambiar de ruta, erradicando advertencias de actualización de estado en componentes desmontados.

### 3. Sincronización Reactiva de Noticias
* **Radar Geopolítico Reactivo:** [`Geopolitics.jsx`](./src/pages/Geopolitics.jsx) se sincroniza en caliente con eventos `gravity-news-updated` y `localStorage`, reflejando instantáneamente cualquier artículo generado por el Bridge sin recargar.
* **Ticker Dinámico Real:** [`NewsTicker.jsx`](./src/components/NewsTicker.jsx) fusiona las noticias locales con las del catálogo estático en tiempo real.

### 4. Audio TTS Ininterrumpido
* **Prevención de Garbage Collection en Chromium:** [`ArticleModal.jsx`](./src/components/ArticleModal.jsx) implementa un `utteranceRef` persistente que previene el corte abrupto de audio a los 15 segundos causado por el recolector de basura de Chrome/Edge.

### 5. Estándar WCAG 2.2 Global
* Navegación por teclado completa con `tabIndex={0}`, `role="button"`, `aria-label` y atajos para las teclas `Enter` y `Espacio` en las tarjetas de [`Home.jsx`](./src/pages/Home.jsx), [`Science.jsx`](./src/pages/Science.jsx), [`Essays.jsx`](./src/pages/Essays.jsx) y [`Geopolitics.jsx`](./src/pages/Geopolitics.jsx).
* Enfoque accesible mediante `main-content` con `tabIndex={-1}` y skip-links de recuperación.

### 6. Aislamiento del Watcher de Vite en Windows
* [`vite.config.js`](./vite.config.js) excluye `**/public/books/**` de la observación de archivos, eliminando el fallo crítico `EBUSY: resource busy or locked` durante ejecuciones de [`sync_books.py`](./sync_books.py).

---

## 📚 Enlaces de Documentación

* [🏗️ **Arquitectura del Nexo Ágora**](./docs/ARCHITECTURE.md)
* [⚙️ **Guía de Desarrollo**](./docs/DEVELOPER_GUIDE.md)
* [📖 **Manual de Usuario y Conexión Móvil**](./docs/USER_MANUAL.md)
* [📜 **Wiki Corporativa**](./wiki/Home.md)
* [🔒 **Políticas de Seguridad**](./SECURITY.md)
* [🤝 **Guía de Contribución**](./CONTRIBUTING.md)

---

<div align="center">
  <sub><i>© 2026 DarckRovert · Gravity News Portal V16.2 PRO. Soberanía Digital y Zero-Trust.</i></sub>
</div>
