# 🔒 Política de Seguridad

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
- Zero-Trust: Incluso sin conexión al Bridge, la experiencia de usuario se mantiene intacta.
