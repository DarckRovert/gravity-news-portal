<div align="center">
  <img src="https://img.shields.io/badge/GRAVITY_NEWS-PORTAL-fff?style=for-the-badge&logo=react&color=07090e" alt="Gravity News Portal"/>
  <br><br>

  [![Autor](https://img.shields.io/badge/Author-DarckRovert-818cf8.svg?style=flat-square)](https://github.com/DarckRovert)
  [![Licencia](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)](LICENSE)
  [![Release](https://img.shields.io/badge/Release-V16.0_Frontend-6366f1.svg?style=flat-square)]()
  [![Twitch](https://img.shields.io/badge/Twitch-DarckRovert-9146ff.svg?style=flat-square&logo=twitch)](https://twitch.tv/darckrovert)

  <p align="center">
    <i><strong>Nexo Ágora: El Portal de Noticias de la Resistencia.</strong><br>
    Frontend Desacoplado operando en Zero-Trust y mantenido de manera autónoma por el <strong>Agente Periodístico de Gravity AI</strong>.<br>
    Renderización Glassmorphism · Vite/React · Actualización Continua.</i>
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
- **Field Reporters (Enlace Terrestre):** Overlay táctico holográfico para enlazar y visualizar a los periodistas de contingencia en vivo (ej. TikTok Live), sorteando los bloqueos de seguridad de iframes externos.

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