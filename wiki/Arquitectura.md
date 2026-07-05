# 🏛 Arquitectura Desacoplada (Decoupled Sync)

El portal de noticias soluciona uno de los mayores problemas de la IA local: **¿Cómo mantengo un sitio web vivo 24/7 si mi PC de IA (Backend) se apaga en la noche?**

### Solución: Repositorio Estático Sincronizado

El portal fue construido utilizando React/Vite y es hospedado en Netlify (plataforma sin servidor).
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
