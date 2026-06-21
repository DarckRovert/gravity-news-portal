import os

BASE_DIR = r"f:\gravity-news-portal"

files_to_create = {
    "README.md": """<div align="center">
  <img src="https://img.shields.io/badge/GRAVITY_NEWS-PORTAL-fff?style=for-the-badge&logo=react&color=07090e" alt="Gravity News Portal"/>
  <br><br>

  [![Autor](https://img.shields.io/badge/Author-DarckRovert-818cf8.svg?style=flat-square)](https://github.com/DarckRovert)
  [![Licencia](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)](LICENSE)
  [![Release](https://img.shields.io/badge/Release-V16.0_Frontend-6366f1.svg?style=flat-square)]()
  [![Twitch](https://img.shields.io/badge/Twitch-DarckRovert-9146ff.svg?style=flat-square&logo=twitch)](https://twitch.tv/darckrovert)

  <p align="center">
     <i><strong>Nexo Ágora: El Portal de Noticias de la Resistencia.</strong><br>
     Frontend Desacoplado operando en Zero-Trust y mantenido de manera autónoma por el <strong>Agente Periodístico de Gravity AI</strong>.<br>
     Renderización Glassmorphism · Vite/React · Actualización Continua.</i><br><br>
     🛡️ <b>Auditoría V16.0 PRO: Cero Vulnerabilidades XSS - Zero-Trust Arquitectónico</b>
   </p>
</div>

---

## 🏛 Arquitectura Frontend V16.0 PRO

El **Gravity News Portal** no es un portal de noticias ordinario. Es la interfaz pública "Cloud-Side" de tu **Gravity AI Bridge**.
Funciona de manera *Decoupled* (Desacoplada).

1. **El Motor Local:** Un daemon invisible (`news_daemon.py`) corre en tu PC ejecutando LLMs locales (Llama 3, Qwen) u online (Nvidia NIM).
2. **Web Search & Redacción:** El agente busca información de contingencia global, la redacta en formato periodístico con un tono materialista/geopolítico y genera JSON estructurados.
3. **Despliegue Continuo (CI/CD):** El agente empuja (`git push`) automáticamente las noticias e imágenes a este repositorio.
4. **Hosting Reactivo:** Netlify / Vercel detectan el *commit*, compilan el proyecto con Vite y despliegan la página en segundos.

### 📰 Características del Portal
- **Zero-Trust Dark Mode:** Diseño Premium en Deep Onyx y Neón Cyan, inspirado en Glassmorphism.
- **Sincronización Cuántica:** Capacidad para comunicarse directamente vía REST API con tu Bridge local a través de `http://localhost:7860` para generar noticias **en tiempo real** (cuando la PC está encendida).
- **Auto-Mantenimiento:** Limpieza de librerías y portadas de libros automáticas (Script `sync_books.js`).

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
> Ecosistema público V16.0 Frontend.
> [**📖 WIKI CORPORATIVA**](./wiki/Home.md) | [📜 CONTRIBUCIÓN](./CONTRIBUTING.md) | [🔒 SEGURIDAD](./SECURITY.md)

<br>

<div align="center">
  <sub><i>© 2026 DarckRovert · Gravity News Portal V16.0 PRO.</i></sub>
</div>
""",
    
    os.path.join("wiki", "Home.md"): """# 📖 Wiki Corporativa: Nexo Ágora (News Portal)

Bienvenido a la Wiki técnica del Frontend de Gravity AI.

### Índice de Contenidos

| Documento | Descripción |
|---|---|
| [Home](./Home.md) | Índice general |
| [Arquitectura Desacoplada](./Arquitectura.md) | Cómo se comunica Netlify con el PC Local |

---
*Para ver la Wiki del Backend y Motor Central, dirígete al repositorio de [Gravity AI Bridge](https://github.com/DarckRovert/Gravity_AI_bridge).*
""",

    os.path.join("wiki", "Arquitectura.md"): """# 🏛 Arquitectura Desacoplada (Decoupled Sync)

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
""",

    "CONTRIBUTING.md": """# 📜 Guía de Contribución

Gravity News Portal es un proyecto de código cerrado y **privado**, mantenido exclusivamente por DarckRovert y sus agentes autónomos. 

No se aceptan Pull Requests externos a menos que hayan sido negociados previamente con la entidad corporativa.
""",

    "SECURITY.md": """# 🔒 Política de Seguridad

### Reportar Vulnerabilidades

Si has encontrado una vulnerabilidad de XSS, inyección o un fallo en el túnel REST (`http://localhost:7860`) del portal, por favor envía un reporte directo a los canales oficiales de DarckRovert. No abras un Issue público.

### Endpoints Protegidos
 El portal jamás almacena llaves de API (Nvidia NIM, DeepSeek) en su código fuente (React). Toda la carga cognitiva se hace **localmente** en el entorno seguro de Gravity AI Bridge. El frontend solo consume JSON estáticos o peticiones localhost directas al orquestador.
 
 ### Auditoría V16.0 Frontend
 El repositorio en su iteración V16 ha pasado por una rigurosa auditoría manual de infraestructura. Se verificó el encapsulamiento seguro de `dangerouslySetInnerHTML` utilizando un modelo de ingesta local estática de alto rendimiento, logrando inmunidad ante XSS público.
"""
}

def create_files():
    # Asegurarnos de que el directorio wiki exista
    os.makedirs(os.path.join(BASE_DIR, "wiki"), exist_ok=True)
    
    for filename, content in files_to_create.items():
        path = os.path.join(BASE_DIR, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"Creado: {filename}")

if __name__ == "__main__":
    create_files()
