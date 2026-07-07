# ⚙️ Guía de Desarrollo: Nexo Ágora V16.2

Si deseas clonar, mejorar o auditar el código fuente del Portal Gravity, es obligatorio adherirse a los siguientes estándares técnicos inquebrantables.

## 1. Configuración del Entorno Local

Asegúrate de contar con Node.js v18+ instalado.

```bash
npm install
npm run dev
npm run build # Validar siempre antes de empujar código
npm run lint  # Cero advertencias permitidas
```

## 2. Reglas de Accesibilidad (Estricto WCAG 2.2)

Todo PR que rompa las reglas de accesibilidad será rechazado.
- **Etiquetas Semánticas y Foco**: Todo componente interactivo debe contener un `aria-label`. 
- **Componentes Dinámicos**: Los *Loaders* o actualizaciones de estado deben utilizar `aria-live="polite"` y `role="status"`.
- **Skip Links & FAB**: El botón de "Saltar al contenido" y el "Volver arriba" JAMÁS deben abandonar al usuario usando un simple `.blur()`. El foco debe transferirse programáticamente a un contenedor navegable (`<main id="main" tabIndex={-1}>`).

## 3. Manejo de Estado y Rendimiento (Render Storm Prevention)

**PROHIBICIÓN ESTRICTA**: No llamar a `setState` de manera síncrona dentro de un `useEffect` si el objetivo es sincronizar un estado derivado. Esto provoca *cascading renders*.
Utiliza el patrón de *Render-Phase update* oficial de React 19:
```jsx
const [localVal, setLocalVal] = useState(globalVal);
const [prevGlobalVal, setPrevGlobalVal] = useState(globalVal);

if (globalVal !== prevGlobalVal) {
  setPrevGlobalVal(globalVal);
  setLocalVal(globalVal); // Actúa antes de que el repintado ocurra
}
```
*Además, todos los inputs de texto global deben usar debounce de al menos 300ms.*

## 4. Animaciones y GPU

No utilizar *Event Listeners* atados al estado de React para observar eventos de ventana (`scroll`, `mousemove`). Se debe utilizar **Framer Motion** (`useScroll`, `useMotionValueEvent`) para inyectar los valores delta directamente en las variables CSS o transformaciones de los elementos `motion.div`.\n