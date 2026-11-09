# 📖 Manual de Usuario: Nexo Ágora (V16.2 PRO)

Bienvenido a la terminal pública de la Zona Ágora. Este portal te permite consultar reportes de inteligencia en tiempo real, acceder a la Biblioteca Soberana, interactuar con corresponsales globales y conectar tu propio cerebro local de IA para generar investigaciones bajo demanda.

---

## 1. Inicio Rápido en tu Computadora

En la carpeta raíz del portal encontrarás dos accesos directos principales:

1. **`INICIAR_PORTAL.bat`**: Inicia el frontend del portal en tu navegador en `http://localhost:5173`. Si es la primera vez que lo abres, instalará las dependencias necesarias de forma transparente.
2. **`INICIAR_ECOSISTEMA_COMPLETO.bat`**: Si tienes instalado el backend local en `F:\Gravity_AI_bridge`, este archivo levanta en simultáneo tanto el servidor de IA (`http://localhost:7860`) como el portal web, conectándolos al instante.

---

## 2. La Biblioteca Soberana y Lector Cuántico

En la sección **Biblioteca** (`/books`), encontrarás tomos y ensayos exportados por el motor de Gravity AI:

* **Categorías:** Filtra entre Ensayos, Ficción y Libros de Investigación.
* **Lector Cuántico (`/book/:id`):** Al presionar *Leer Tomo*, se abrirá una interfaz optimizada para lectura nocturna con soporte para dispositivos táctiles y modo lectura ininterrumpida.
* **Descarga Offline:** Cada tomo dispone de un botón de descarga para guardar el archivo HTML limpio y leerlo sin conexión a internet.
* **Guardados:** Puedes marcar cualquier tomo con el botón de marcador (icono de bandera) para guardarlo en tu pestaña personal de *Guardados*.

---

## 3. Radar Geopolítico Reactivo

En la pestaña **Geopolítica** (`/geopolitica`):

* Explora noticias clasificadas por regiones geográficas: *Global, Norteamérica, Latinoamérica, Perú, Eurasia, Medio Oriente, África*.
* **Sincronización en Caliente:** Cualquier noticia o reporte recién redactado por la IA se inyectará de inmediato en el radar sin necesidad de recargar la página.
* **Navegación por Teclado:** Puedes navegar por todas las tarjetas usando la tecla `Tab` y abrirlas pulsando `Enter` o la `Barra Espaciadora`.

---

## 4. Conexión Cognitiva e Investigador en Vivo

En la columna lateral de la página de Inicio encontrarás el panel de **Conexión Cognitiva**:

1. **Indicador de Estado:**
   * 🟢 **Online:** Conectado exitosamente a tu Gravity AI Bridge local (`:7860`).
   * 🔴 **Offline:** El backend local no está corriendo o la conexión fue interrumpida.
   * 🟡 **SSL Bloqueado:** Detectado bloqueo por contenido mixto en conexiones móviles seguras.
2. **Generar un Reporte con IA:**
   * Escribe el tema a investigar en la caja de texto (ej. *"Transición energética y control de divisas"*).
   * Pulsa **Iniciar Investigación**.
   * El Bridge seleccionará el modelo óptimo disponible (LM Studio, Groq o Nvidia NIM) y redactará un análisis periodístico que se insertará al tope de tu página.
3. **Panel de Homeostasis del Vigía:**
   * Si el Bridge está activo, el panel lateral muestra en vivo las métricas de entropía, errores consecutivos y presupuesto restante de tu motor autónomo.

---

## 5. Conexión desde el Teléfono Móvil (Solución a Contenido Mixto)

Al ingresar a la web pública (`https://gravitynewsportal.netlify.app`) desde tu smartphone, el navegador bloqueará por seguridad cualquier petición a tu IP local `http://192.168.x.x:7860` (Bloqueo de Mixed Content).

Para solucionarlo:

* **Opción A (Recomendada con Ngrok / Cloudflare Tunnel):**
  1. En tu PC donde corre el Bridge, ejecuta: `ngrok http 7860`.
  2. Copia la URL HTTPS que te entrega (ej. `https://xxxx.ngrok-free.app`).
  3. En tu teléfono, abre la página del portal y pega esa URL segura en la configuración del panel Bridge.
* **Opción B (Habilitar contenido no seguro en Chrome móvil):**
  1. Toca el candado o icono de ajustes al lado de la barra de direcciones en Chrome.
  2. Selecciona *Configuración de sitios* ➔ *Contenido no seguro*.
  3. Cambia la opción a **Permitir** y recarga la página.
