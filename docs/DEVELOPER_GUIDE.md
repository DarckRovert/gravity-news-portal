# ⚙️ Guía de Desarrollo: Nexo Ágora V16.2 PRO

Este documento establece las instrucciones de desarrollo, pruebas locales y directrices de contribución para el código base de **Gravity News Portal**.

---

## 1. Configuración del Entorno Local

Asegúrate de contar con Node.js (v18 o superior) y Python 3.10+ para los scripts de sincronización.

### Inicio Rápido con Lanzadores Nativos (.bat)

En la raíz del proyecto se incluyen lanzadores para simplificar la inicialización:

```cmd
:: Opción A: Iniciar solo el Frontend (Vite)
INICIAR_PORTAL.bat

:: Opción B: Iniciar Ecosistema Completo (Bridge Backend en :7860 + Frontend en :5173)
INICIAR_ECOSISTEMA_COMPLETO.bat
```

### Ejecución Manual vía Consola

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo con HMR
npm run dev

# 3. Compilación de producción (PWA)
npm run build

# 4. Auditoría estricta de linter (0 advertencias permitidas)
npm run lint
```

---

## 2. Sincronización de Libros y Archivos

Para actualizar el catálogo de la biblioteca desde los manuscritos fuente:

```bash
python sync_books.py
```

* `sync_books.py` procesa los archivos en `public/books/`, normaliza los caracteres acentuados mediante `NFKD` (evitando nombres corruptos como `la-f-sica-del-poder.html`) y actualiza `src/data/books.json`.
* **Nota Técnica:** `vite.config.js` ignora la ruta `**/public/books/**` en su observador de archivos para evitar errores `EBUSY: resource busy or locked` en sistemas Windows.

---

## 3. Estándar de Accesibilidad (WCAG 2.2)

Todo componente interactivo debe respetar las siguientes normas:

1. **Interactividad de Tarjetas:** Toda tarjeta de artículo o ensayo implementada como `motion.article` o `div` con `onClick` debe incluir:
   ```jsx
   tabIndex={0}
   role="button"
   aria-label={`Leer artículo: ${item.title}`}
   onKeyDown={(e) => {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       handleOpenArticle(item);
     }
   }}
   ```
2. **Transferencia de Foco:** Acciones globales como el botón "Volver arriba" (`ScrollToTopFAB`) no deben llamar a `.blur()`. Deben transferir el foco a `<main id="main" tabIndex={-1}>`.
3. **Cargas Asíncronas:** Los indicadores de carga deben declarar `role="status"` y `aria-live="polite"`.

---

## 4. Reglas de Estado y Ciclo de Vida (React 19)

1. **Prohibición de `setState` Síncrono en `useEffect`:**
   No utilices `useEffect` para sincronizar estados derivados de propiedades o contextos. Aplica el patrón oficial de React 19 de actualización en fase de render:
   ```jsx
   const [localVal, setLocalVal] = useState(propVal);
   const [prevPropVal, setPrevPropVal] = useState(propVal);

   if (propVal !== prevPropVal) {
     setPrevPropVal(propVal);
     setLocalVal(propVal);
   }
   ```
2. **Page Visibility en Polling:**
   Todo temporizador de sondeo hacia APIs debe pausarse cuando la pestaña no esté visible:
   ```jsx
   const handleVisibility = () => {
     if (!document.hidden) fetchData();
   };
   document.addEventListener('visibilitychange', handleVisibility);
   ```
3. **AbortControllers en Efectos de Red:**
   Todo `fetch` dentro de un `useEffect` debe recibir un `signal: controller.signal` y abortarse en la función de limpieza (`return () => controller.abort()`).

---

## 5. Política de Costo $0 en CI/CD

Queda estrictamente prohibido commitear flujos de trabajo de GitHub Actions (`.github/workflows/*.yml`) con runners de pago o minutos consumibles. Toda verificación debe ejecutarse localmente con `npm run lint` y `npm run build` antes de realizar `git push`. Netlify gestiona los despliegues de producción automáticamente a costo $0.
