# 🏛 Arquitectura Desacoplada (Decoupled Sync V16.2)

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
Para evitar el error de *MIME Type* o pantallas blancas, el portal incluye un `netlify.toml` que enruta todo el tráfico a través de la carpeta `dist`, soportando el enrutamiento del cliente. A esto se le suma un `<ErrorBoundary>` enraizado bajo la arquitectura de `AnimatePresence` que intercepta caídas de red asíncronas (`ChunkLoadError`) de forma elegante.
