# 📖 Manual de Usuario: Nexo Ágora

Bienvenido a la terminal pública de la Zona Ágora. Este portal actúa como tu central para acceder a los archivos de investigación, leer los tomos profundos de Gravity y pedirle a tu propio cerebro local que investigue acontecimientos en el tejido global.

## 1. La Biblioteca Soberana

En la pestaña **Biblioteca**, encontrarás todos los tomos y ensayos exportados por el sistema Gravity AI.
- Utiliza las **pestañas de categorías** (Ensayo, Ficción, Libro) para filtrar la vista.
- Para leer un libro, presiona **Leer Tomo**. Esto abrirá nuestro **Lector Cuántico**, que está optimizado para dispositivos móviles y escritorio.
- Dentro del Lector, puedes modificar el tamaño de la letra, alternar entre tipografía Serif y Sans, y cambiar la paleta de colores (Oscuro, Sepia, Claro) para tu comodidad.
- Si prefieres llevarte el archivo fuera de línea, utiliza el botón **Descargar**.

## 2. Investigador en Vivo (Conexión Cognitiva)

En la página principal de **Noticias**, verás a la derecha (o al final si estás en tu móvil) el panel de **Conexión Cognitiva**.

Este panel te conecta directamente al motor inteligente de Gravity ejecutándose en tu ordenador.
1. Confirma que el indicador muestra estado **Online** (luz cian).
2. En el recuadro negro, escribe el tema que deseas investigar (ej. *"Censura algorítmica en X"*).
3. Presiona **Iniciar Investigación**.
4. Espera unos segundos. Gravity hará la búsqueda, aplicará sus modelos filosófico-analíticos para redactar la pieza y la inyectará en tiempo real en la pantalla.

> **Aviso:** Si el indicador marca **Offline**, asegúrate de haber ejecutado el puente de IA en tu computadora local.

---

## ⚠️ Cómo conectar la IA desde tu Celular (Contenido Mixto)

Un problema común al acceder desde un teléfono celular a la página (`https://gravitynewsportal.netlify.app`) es que el panel marcará permanentemente "Offline" si intentas poner la IP local de tu casa (por ejemplo: `http://192.168.1.75:7860`).

Esto **no es un fallo de la página**. Sucede porque la página es muy segura (`https://`), pero tu IP local no lo es (`http://`). A esto se le llama bloqueo de "Mixed Content" (Contenido Mixto) y Chrome o Safari bloquean la comunicación para "protegerte".

Para evitar esta limitación, tienes **dos opciones**:

### Opción A: Desactivar la seguridad en tu navegador móvil (Recomendado para uso casero)
1. Abre el portal de noticias en el navegador de tu celular (Google Chrome).
2. Toca el **icono del candadito** (o ícono de "Sitio seguro") que aparece en la barra superior al lado del enlace.
3. Entra en la **Configuración de este sitio**.
4. Busca el permiso llamado **Contenido Inseguro** o **Insecure Content**.
5. Cambia el valor de *Bloquear* a **Permitir**.
6. Refresca la página y verás que el panel se conecta instantáneamente.

### Opción B: Usar Ngrok (Para conexiones seguras)
1. En la computadora principal donde corre el Bridge, descarga **Ngrok**.
2. Abre la consola y ejecuta: `ngrok http 7860`.
3. Ngrok te entregará un enlace seguro (ej. `https://xxxx.ngrok-free.app`).
4. Abre la web del portal en tu celular, pega ese enlace de ngrok en la caja de URL de la Conexión Cognitiva y listo.
