# 🔒 Política de Seguridad

### Reportar Vulnerabilidades

Si has encontrado una vulnerabilidad de XSS, inyección o un fallo en el túnel REST (`http://localhost:7860`) del portal, por favor envía un reporte directo a los canales oficiales de DarckRovert. No abras un Issue público.

### Endpoints Protegidos
El portal jamás almacena llaves de API (Nvidia NIM, DeepSeek) en su código fuente (React). Toda la carga cognitiva se hace **localmente** en el entorno seguro de Gravity AI Bridge. El frontend solo consume JSON estáticos o peticiones localhost directas al orquestador.