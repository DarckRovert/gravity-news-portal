# ⚙️ Guía de Desarrollo: Nexo Ágora

Si deseas clonar, mejorar o auditar el código fuente del Portal Gravity, sigue estas instrucciones.

## 1. Configuración del Entorno Local

Asegúrate de contar con Node.js v18+ instalado.

```bash
# Instalar dependencias
npm install

# Correr el servidor de desarrollo local
npm run dev

# Empaquetar para producción (auditoría)
npm run build
```

## 2. Base de Datos Estática (JSON)

Para no depender de un backend SQL y maximizar el tiempo de carga, la aplicación consume bases de datos en JSON puro. Si vas a insertar un libro manualmente (sin el automatizador Python), sigue estas estructuras en `src/data/`:

### Estructura de `books.json`
```json
{
  "id": "identificador-unico-del-libro",
  "title": "El Título Visible",
  "author": "DarckRovert (Gravity AI)",
  "category": "Ensayo | Ficción | Libro",
  "description": "Un resumen contundente.",
  "htmlUrl": "/books/identificador-unico.html",
  "cover": "https://picsum.photos/seed/id_del_libro/600/800"
}
```
*Asegúrate de subir el archivo HTML correspondiente en la carpeta `public/books/`.*

### Estructura de `news.json`
```json
{
  "id": "slug-url-amigable",
  "category": "Control Biométrico",
  "title": "Título del Artículo",
  "excerpt": "Breve subtítulo.",
  "fullText": "### Contenido estructurado\nCon párrafos en markdown ligero.",
  "date": "2026-06-18",
  "image": "https://picsum.photos/seed/id_noticia/800/600",
  "featured": true
}
```

## 3. Estilos y Estética (CSS)

Toda la aplicación obedece a un sistema de variables de CSS centralizado (`src/App.css` y el archivo global `index.css`).
Para modificar el tema general del portal, no necesitas reescribir hojas de estilo, simplemente cambia las variables clave:

```css
:root {
  --bg-primary: #08080a;     /* Fondo principal cibernético */
  --bg-surface: #101014;     /* Paneles de tarjetas */
  --accent-primary: #00f0ff; /* Color de botones primarios */
  --accent-secondary: #00f0ff; /* Resplandores y tipografías clave */
  --accent-glow: rgba(0, 240, 255, 0.4);
  --border-subtle: rgba(255, 255, 255, 0.08); /* Bordes Glassmorphism */
}
```

## 4. Integración con el Puente Python

El portal depende de `gravity_reporter.py` (que habita fuera de este repo, en tu bridge local). Ese script lee `news.json`, agrega un elemento en la posición 0 del array JSON, hace un `git push` de este repositorio y espera que **Netlify** detecte el webhook y auto-compile la web en 40 segundos.
