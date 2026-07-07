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
     Renderización Glassmorphism · Vite/React 19 · Actualización Continua y Telemetría en Tiempo Real.</i><br><br>
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
| [Guía de Contribución](../CONTRIBUTING.md) | Políticas de PRs y código cerrado |
| [Políticas de Seguridad](../SECURITY.md) | Reporte de vulnerabilidades |

---
*Para ver la Wiki del Backend y Motor Central, dirígete al repositorio de [Gravity AI Bridge](https://github.com/DarckRovert/Gravity_AI_bridge).*""",

    "wiki/Arquitectura.md": """# 🏛 Arquitectura Desacoplada (Decoupled Sync V16.2)

El portal de noticias soluciona uno de los mayores problemas de la IA local: **¿Cómo mantengo un sitio web vivo 24/7 si mi PC de IA (Backend) se apaga en la noche?**

### Solución: Repositorio Estático Sincronizado

El portal fue construido utilizando **React 19 + Vite** y es hospedado en Netlify (plataforma sin servidor).
Esto significa que el portal **nunca** se apaga, incluso si tu PC está apagada.

**El Flujo Estático (Offline):**
1. Tu PC enciende. El Daemon `news_daemon.py` despierta.
2. Descarga noticias, el LLM procesa y escribe la noticia.
3. Se actualiza el archivo `src/data/news.json` y se descargan las imágenes.
4. El Agente hace un `git push` a este repositorio.
5. Netlify hace un *build* de 30 segundos y la web queda actualizada estáticamente.

**Modo Híbrido en Tiempo Real (Telemetría Activa):**
Cuando tu PC está encendida, el frontend React detecta el nodo en `http://localhost:7860`. Automáticamente activa el **Live Feed**:
1. **Dynamic News Fetch:** Se fusionan los artículos del backend sin necesidad de esperar el deploy de Netlify.
2. **Terminal Feed:** Se visualizan los logs de los subagentes en la UI en vivo.
3. **Vigía Dashboard:** El panel lateral expone métricas como entropía, hardware y estado del orquestador.
Si el túnel local se cae, la interfaz realiza un _graceful degradation_ al modo Offline (cinemático) sin romper la UI.

---

### Despliegue en Netlify (Vite SPA)

Para evitar el error de *MIME Type* o pantallas blancas al desplegar, el portal incluye un archivo `netlify.toml` en la raíz. Esto le ordena a Netlify que enrute todo el tráfico a través de la carpeta `dist` compilada, soportando correctamente el enrutamiento del lado del cliente (Client-Side Routing) propio de React.

### Integración Táctica (Bypass de Redes Sociales)

Para integrar *Live Streams* de plataformas cerradas (como TikTok) que prohíben estrictamente el uso de etiquetas `<iframe>` para proteger su ecosistema, el portal utiliza **"Enlaces Terrestres" (Field Reporters)**. 
En lugar de forzar un iframe que resultará en un error `X-Frame-Options: SAMEORIGIN`, se inyecta un HUD Holográfico con la metadata del reportero (ubicación, hora local, estado activo). Esto atrae la atención del usuario simulando un radar en tiempo real, brindándole un botón de intercepción directo para abrir el live original.

---

### Actualizaciones de Rendimiento (V16.2 PRO)

La V16.2 ha introducido la filosofía de diseño *Zero-Bottleneck* y tolerancia asíncrona:
- **Prevención de Render Storms:** Los buscadores usan *Render-Phase updates* para evitar que el árbol de DOM colapse al tipear rápidamente.
- **ScrollTracker en GPU:** Todo rastreo visual de scroll bypassa el motor de React, inyectándose directamente en la GPU a través de `framer-motion`.
- **Resiliencia ChunkLoadError:** Inyección de un `<ErrorBoundary>` enraizado bajo la arquitectura de `AnimatePresence` que intercepta fallos de red cuando la CDN despliega una nueva versión en segundo plano.""",

    "wiki/Geopolitica.md": """# Radar Geopolítico (V16.2)

La sección de Geopolítica (Radar) es una adición consolidada en la versión V16.2 PRO del ecosistema Gravity. Permite mapear y visualizar noticias basándose en el vector de región inferido directamente por el LLM.

## Funcionamiento del pipeline

1. **Inferencia en el Motor (Backend)**: En el puente (`Gravity_AI_bridge`), los prompts de `reporter.json` exigen al Sintetizador extraer y definir una `"region"` para cada noticia interceptada (e.g., Eurasia, Latinoamérica, etc.).
2. **Normalización**: El JSON estructurado viaja desde el LLM, pasa por la validación del esquema y se incrusta en `news.json`.
3. **Consumo en el Portal (Frontend)**: El portal (React) consume `news.json` en `src/pages/Geopolitics.jsx`. Extrae dinámicamente el Set de regiones únicas e hidrata la UI con Filtros por región (chips interactivos).
4. **Diseño Visual**: Cada `BentoGrid` despliega una etiqueta visible (`badge`) para demostrar al usuario a qué área geográfica corresponde la anomalía detectada, con el diseño clásico "Zero-Trust Dark Mode".

## Optimización Computacional

La introducción de la etiqueta geográfica sustituye a las pesadas rutinas de generación de video MP4 (`crear_tiktok`), permitiendo que el Agente cierre su ciclo e indexe el repositorio de forma casi instantánea tras redactar la síntesis.""",

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

    "docs/ARCHITECTURE.md": """# 🏗️ Arquitectura del Nexo Ágora (V16.2 PRO)

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
El monitoreo del scroll (`ScrollTracker`) se realiza **fuera del ciclo de renderizado de React**, interceptando los deltas directamente hacia la GPU mediante `useScroll` y `useMotionValueEvent`, manteniendo la interfaz perpetuamente a 60 FPS.""",

    "docs/DEVELOPER_GUIDE.md": """# ⚙️ Guía de Desarrollo: Nexo Ágora V16.2

Si deseas clonar, mejorar o auditar el código fuente del Portal Gravity, es obligatorio adherirse a los siguientes estándares técnicos inquebrantables.

## 1. Configuración del Entorno Local

Asegúrate de contar con Node.js v18+ instalado.

```bash
npm install
npm run dev
npm run build # Validar siempre antes de empujar código
npm run lint  # Cero advertencias permitidas
```

## 2. Reglas de Accesibilidad (Estricto WCAG 2.2)

Todo PR que rompa las reglas de accesibilidad será rechazado.
- **Etiquetas Semánticas y Foco**: Todo componente interactivo debe contener un `aria-label`. 
- **Componentes Dinámicos**: Los *Loaders* o actualizaciones de estado deben utilizar `aria-live="polite"` y `role="status"`.
- **Skip Links & FAB**: El botón de "Saltar al contenido" y el "Volver arriba" JAMÁS deben abandonar al usuario usando un simple `.blur()`. El foco debe transferirse programáticamente a un contenedor navegable (`<main id="main" tabIndex={-1}>`).

## 3. Manejo de Estado y Rendimiento (Render Storm Prevention)

**PROHIBICIÓN ESTRICTA**: No llamar a `setState` de manera síncrona dentro de un `useEffect` si el objetivo es sincronizar un estado derivado. Esto provoca *cascading renders*.
Utiliza el patrón de *Render-Phase update* oficial de React 19:
```jsx
const [localVal, setLocalVal] = useState(globalVal);
const [prevGlobalVal, setPrevGlobalVal] = useState(globalVal);

if (globalVal !== prevGlobalVal) {
  setPrevGlobalVal(globalVal);
  setLocalVal(globalVal); // Actúa antes de que el repintado ocurra
}
```
*Además, todos los inputs de texto global deben usar debounce de al menos 300ms.*

## 4. Animaciones y GPU

No utilizar *Event Listeners* atados al estado de React para observar eventos de ventana (`scroll`, `mousemove`). Se debe utilizar **Framer Motion** (`useScroll`, `useMotionValueEvent`) para inyectar los valores delta directamente en las variables CSS o transformaciones de los elementos `motion.div`.""",

    "docs/USER_MANUAL.md": """# 📖 Manual de Usuario: Nexo Ágora

Bienvenido a la terminal pública de la Zona Ágora. Este portal actúa como tu central para acceder a los archivos de investigación, leer los tomos profundos de Gravity y pedirle a tu propio cerebro local que investigue acontecimientos en el tejido global.

## 1. La Biblioteca Soberana

En la pestaña **Biblioteca**, encontrarás todos los tomos y ensayos exportados por el sistema Gravity AI.
- Utiliza las **pestañas de categorías** (Ensayo, Ficción, Libro) para filtrar la vista.
- Para leer un libro, presiona **Leer Tomo**. Esto abrirá nuestro **Lector Cuántico**, que está optimizado para dispositivos móviles y escritorio.
- Dentro del Lector, puedes modificar el tamaño de la letra, alternar entre tipografía Serif y Sans, y cambiar la paleta de colores (Oscuro, Sepia, Claro) para tu comodidad.
- Si prefieres llevarte el archivo fuera de línea, utiliza el botón **Descargar**.

## 2. Nexo Multimedia (Películas y Documentales)

El **Nexo Multimedia** se encuentra en la parte superior de la página de Noticias. Es una cartelera inteligente que filtra contenido global:
- Usa las pestañas **Monitoreo Global**, **Cine de Resistencia** y **Archivos Desclasificados** para navegar entre noticieros en vivo, películas de ciencia ficción y filosofía, o documentales de inteligencia.
- Haz clic en cualquier tarjeta para iniciar la reproducción al instante.
- Utiliza el botón de **pantalla completa** (icono de flechas expansivas) en cualquier video para una experiencia inmersiva.
- Usa el botón inferior **CARGAR MÁS ARCHIVOS** para ver el resto del catálogo (diseñado con "Carga Perezosa" para no saturar tu RAM).

## 3. Investigador en Vivo (Conexión Cognitiva)

En la página principal de **Noticias**, verás a la derecha (o al final si estás en tu móvil) el panel de **Conexión Cognitiva**.

Este panel te conecta directamente al motor inteligente de Gravity ejecutándose en tu ordenador.
1. Confirma que el indicador muestra estado **Online** (luz cian).
2. En el recuadro negro, escribe el tema que deseas investigar (ej. *"Censura algorítmica en X"*).
3. Presiona **Iniciar Investigación**.
4. Espera unos segundos. Gravity hará la búsqueda, aplicará sus modelos filosófico-analíticos para redactar la pieza y la inyectará en tiempo real en la pantalla.

> **Aviso:** Si el indicador marca **Offline**, asegúrate de haber ejecutado el puente de IA en tu computadora local.

---

## ⚠️ Cómo conectar la IA desde tu Celular (Contenido Mixto)

Un problema común al acceder desde un teléfono celular a la página (`https://gravitynewsportal.netlify.app`) es que el panel marcará permanentemente "Offline" si intentas poner la IP local de tu casa (por ejemplo: `http://192.168.1.75:7860`).

Esto **no es un fallo de la página**. Sucede porque la página es muy segura (`https://`), pero tu IP local no lo es (`http://`). A esto se le llama bloqueo de "Mixed Content" (Contenido Mixto) y Chrome o Safari bloquean la comunicación para "protegerte".

Para evitar esta limitación, tienes **dos opciones**:

### Opción A: Desactivar la seguridad en tu navegador móvil (Recomendado para uso casero)
1. Abre el portal de noticias en el navegador de tu celular (Google Chrome).
2. Toca el **icono del candadito** (o ícono de "Sitio seguro") que aparece en la barra superior al lado del enlace.
3. Entra en la **Configuración de este sitio**.
4. Busca el permiso llamado **Contenido Inseguro** o **Insecure Content**.
5. Cambia el valor de *Bloquear* a **Permitir**.
6. Refresca la página y verás que el panel se conecta instantáneamente.

### Opción B: Usar Ngrok (Para conexiones seguras)
1. En la computadora principal donde corre el Bridge, descarga **Ngrok**.
2. Abre la consola y ejecuta: `ngrok http 7860`.
3. Ngrok te entregará un enlace seguro (ej. `https://xxxx.ngrok-free.app`).
4. Abre la web del portal en tu celular, pega ese enlace de ngrok en la caja de URL de la Conexión Cognitiva y listo.

---

## 4. Resiliencia y Anomalías de Conexión (V16.2)

Debido a que el portal se actualiza constantemente de forma desatendida, es posible que tu navegador intente acceder a un archivo que acaba de ser reemplazado por la IA.
Si esto ocurre, no verás una pantalla blanca o un fallo crítico. El sistema interceptará el fallo y mostrará una pantalla segura de **"Anomalía en la Conexión"**.
Simplemente presiona el botón **Reestablecer Conexión** para resincronizar el enlace con la nube y cargar la versión más reciente del Nexo.""",

}


for file_path, content in files_to_create.items():
    full_path = os.path.join(BASE_DIR, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")
    print(f"Creado: {full_path}")

print("Toda la documentacion generada.")
