# 🏛 Arquitectura Desacoplada (Decoupled Sync V16.2)

El portal de noticias soluciona uno de los mayores problemas de la IA local: **¿Cómo mantengo un sitio web vivo 24/7 si mi PC de IA (Backend) se apaga en la noche?**

### Solución: Repositorio Estático Sincronizado

El portal fue construido utilizando React 18 / Vite y es hospedado en Netlify (plataforma sin servidor).
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
- **Resiliencia ChunkLoadError:** Inyección de un `<ErrorBoundary>` enraizado bajo la arquitectura de `AnimatePresence` que intercepta fallos de red cuando la CDN despliega una nueva versión en segundo plano.\n