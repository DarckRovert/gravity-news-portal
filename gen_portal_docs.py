import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

files_to_create = {
    "README.md": """<div align="center">
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

1. **El Motor Local:** Un daemon invisible (`news_daemon.py`) corre en tu PC ejecutando LLMs locales (Llama 3, Qwen) u online (Nvidia NIM).
2. **Web Search & Redacción:** El agente busca información de contingencia global, la redacta en formato periodístico con un tono materialista/geopolítico y genera JSON estructurados.
3. **Despliegue Continuo (CI/CD):** El agente empuja (`git push`) automáticamente las noticias e imágenes a este repositorio.
4. **Hosting Reactivo:** Netlify / Vercel detectan el *commit* y despliegan la página en segundos.

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
</div>""",

    "wiki/Home.md": """# 📖 Wiki Corporativa: Nexo Ágora (News Portal)

Bienvenido a la Wiki técnica del Frontend de Gravity AI.

### Índice de Contenidos

| Documento | Descripción |
|---|---|
| [Home](./Home.md) | Índice general de la Wiki |
| [Arquitectura Desacoplada](./Arquitectura.md) | Cómo se comunica Netlify con el PC Local |
| [Geopolítica Analítica](./Geopolitica.md) | Enfoque materialista y de inteligencia para redacción |
| [Arquitectura Técnica](../docs/ARCHITECTURE.md) | Detalles del VDOM, Render-Phase y Mitigación de Red |
| [Guía de Desarrollo](../docs/DEVELOPER_GUIDE.md) | Estándares técnicos (WCAG 2.2, Anti-Storm) |
| [Manual de Usuario](../docs/USER_MANUAL.md) | Instrucciones de uso e intercepción de anomalías |

---
*Para ver la Wiki del Backend y Motor Central, dirígete al repositorio de [Gravity AI Bridge](https://github.com/DarckRovert/Gravity_AI_bridge).*""",

    "wiki/Arquitectura.md": """# 🏛 Arquitectura Desacoplada (Decoupled Sync V16.2)

El portal de noticias soluciona el problema de mantener un sitio web vivo 24/7 aunque el Backend local de IA se apague.

### Solución: Repositorio Estático Sincronizado

El portal fue construido utilizando **React 18 + Vite** y es hospedado en Netlify (plataforma sin servidor).
Esto significa que el portal **nunca** se apaga.

**El Flujo Estático (Offline):**
1. Tu PC enciende. El Daemon `news_daemon.py` despierta.
2. El LLM procesa contingencias y actualiza el archivo `src/data/news.json`.
3. El Agente hace un `git push` a este repositorio.
4. Netlify hace un *build* de 30 segundos y la web queda actualizada estáticamente.

**Modo Híbrido en Tiempo Real (Telemetría Activa):**
Cuando tu PC está encendida, el frontend React detecta el nodo en `http://localhost:7860`. Automáticamente activa el **Live Feed**:
1. **Dynamic News Fetch:** Se fusionan los artículos del backend sin esperar el deploy de Netlify.
2. **Terminal Feed:** Se visualizan los logs en la UI en vivo.

### Prevención de Cuellos de Botella (Render Storms)
La V16.2 ha introducido la filosofía de diseño *Zero-Bottleneck*:
- **Debounce y Local State:** Los buscadores usan *Render-Phase updates* para evitar que el árbol de DOM colapse al tipear rápidamente.
- **ScrollTracker en GPU:** Todo rastreo visual de scroll bypassa el motor de React, inyectándose directamente en la GPU a través de `framer-motion`.

### Despliegue SPA en Netlify
Para evitar el error de *MIME Type* o pantallas blancas, el portal incluye un `netlify.toml` que enruta todo el tráfico a través de la carpeta `dist`, soportando el enrutamiento del cliente. A esto se le suma un `<ErrorBoundary>` enraizado bajo la arquitectura de `AnimatePresence` que intercepta caídas de red asíncronas (`ChunkLoadError`) de forma elegante.""",

    "CONTRIBUTING.md": """# 📜 Guía de Contribución

Gravity News Portal es un proyecto de código cerrado y **privado**, mantenido exclusivamente por DarckRovert y sus agentes autónomos. 

No se aceptan Pull Requests externos a menos que hayan sido negociados previamente con la entidad corporativa.""",

    "SECURITY.md": """# 🔒 Política de Seguridad

### Reportar Vulnerabilidades

Si has encontrado una vulnerabilidad de XSS, inyección o un fallo en el túnel REST (`http://localhost:7860`) del portal, por favor envía un reporte directo a los canales oficiales de DarckRovert. No abras un Issue público.

### Endpoints Protegidos
El portal jamás almacena llaves de API (Nvidia NIM, DeepSeek) en su código fuente (React). Toda la carga cognitiva se hace **localmente** en el entorno seguro de Gravity AI Bridge. El frontend consume JSON estáticos (Offline) o se conecta por polling seguro a las rutas:
- `/v1/journalist/news`
- `/v1/journalist/log`
- `/v1/autonomy/status`

### Auditoría V16.2 Frontend
El repositorio en su iteración V16.2 ha pasado por una rigurosa auditoría manual de infraestructura. 
- Se verificó el encapsulamiento seguro de `dangerouslySetInnerHTML`.
- Se validaron los fallbacks (Graceful Degradation) para la telemetría en tiempo real, garantizando inmunidad ante XSS y Crashes (como la inyección robusta del `ErrorBoundary` dentro de `AnimatePresence`).
- Se anularon vulnerabilidades de memoria (Render Storms) mediante *Render-Phase Updates*.
- Zero-Trust: Incluso sin conexión al Bridge, la experiencia de usuario se mantiene intacta.""",

}


for file_path, content in files_to_create.items():
    full_path = os.path.join(BASE_DIR, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Creado: {full_path}")

print("Toda la documentacion generada.")
