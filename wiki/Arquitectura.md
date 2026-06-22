# 🏛 Arquitectura Desacoplada (Decoupled Sync)

El portal de noticias soluciona uno de los mayores problemas de la IA local: **¿Cómo mantengo un sitio web vivo 24/7 si mi PC de IA (Backend) se apaga en la noche?**

### Solución: Repositorio Estático Sincronizado

El portal fue construido utilizando React/Vite y es hospedado en Netlify (plataforma sin servidor).
Esto significa que el portal **nunca** se apaga, incluso si tu PC está apagada.

**El Flujo:**
1. Tu PC enciende. El Daemon `news_daemon.py` despierta.
2. Descarga noticias, el LLM procesa y escribe la noticia.
3. Se actualiza el archivo `src/data/news.json` y se descargan las imágenes.
4. El Agente hace un `git push` a este repositorio.
5. Netlify hace un *build* de 30 segundos y la web queda actualizada.

**Modo Híbrido (Tiempo Real):**
 Si el visitante hace clic en "Generar Reporte Directo" desde el portal, el frontend intenta conectarse a `http://localhost:7860`. Si tu PC está prendida, el portal mostrará cómo la IA te responde en tiempo real a través del túnel. Si falla, el portal es resiliente y cambiará a modo estático sin interrupciones visuales, demostrando su naturaleza Zero-Trust.
 
 **Renderizado Seguro:**
 La limpieza de libros utiliza Regex locales para remover estilos y garantizar que el contenido Markdown/HTML generado por el Bridge no rompa la estructura del portal, manteniendo la interfaz segura y elegante bajo cualquier eventualidad.

### Escalabilidad Extrema de Medios (Media Nexus Lazy Loading)
Para evitar los bloqueos por falta de memoria (OOM Crashes) originados al incrustar demasiados recursos externos (como Iframes de YouTube), el Nexo Multimedia (`LiveFeeds.jsx`) implementa un modelo de **Lazy Loading Extremo**:
1. Extrae los datos desde una base de datos estática aislada (`media.json`), separando el contenido de la lógica del componente.
2. En lugar de incrustar `<iframe>`s pesados al cargar la página, inyecta estáticamente la miniatura de alta resolución (extraída de `img.youtube.com/...`).
3. El `<iframe>` original solo se adjunta al DOM y se reproduce en el milisegundo exacto en el que el usuario hace clic sobre la miniatura holográfica. Esto reduce la carga inicial de memoria en un ~95%, permitiendo escalabilidad "infinita" en el listado de películas.

---

### Despliegue en Netlify (Vite SPA)

Para evitar el error de *MIME Type* o pantallas blancas al desplegar, el portal incluye un archivo `netlify.toml` en la raíz. Esto le ordena a Netlify que enrute todo el tráfico a través de la carpeta `dist` compilada, soportando correctamente el enrutamiento del lado del cliente (Client-Side Routing) propio de React.

### Integración Táctica (Bypass de Redes Sociales)

Para integrar *Live Streams* de plataformas cerradas (como TikTok) que prohíben estrictamente el uso de etiquetas `<iframe>` para proteger su ecosistema, el portal utiliza **"Enlaces Terrestres" (Field Reporters)**. 
En lugar de forzar un iframe que resultará en un error `X-Frame-Options: SAMEORIGIN`, se inyecta un HUD Holográfico con la metadata del reportero (ubicación, hora local, estado activo). Esto atrae la atención del usuario simulando un radar en tiempo real, brindándole un botón de intercepción directo para abrir el live original.