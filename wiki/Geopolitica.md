# Radar Geopolítico (V16.1)

La sección de Geopolítica (Radar) es una adición a la versión V16.1 PRO del ecosistema Gravity. Permite mapear y visualizar noticias basándose en el vector de región inferido directamente por el LLM.

## Funcionamiento del pipeline

1. **Inferencia en el Motor (Backend)**: En el puente (`Gravity_AI_bridge`), los prompts de `reporter.json` exigen al Sintetizador extraer y definir una `"region"` para cada noticia interceptada (e.g., Eurasia, Latinoamérica, etc.).
2. **Normalización**: El JSON estructurado viaja desde el LLM, pasa por la validación del esquema y se incrusta en `news.json`.
3. **Consumo en el Portal (Frontend)**: El portal (React) consume `news.json` en `src/pages/Geopolitics.jsx`. Extrae dinámicamente el Set de regiones únicas e hidrata la UI con Filtros por región (chips interactivos).
4. **Diseño Visual**: Cada `BentoGrid` despliega una etiqueta visible (`badge`) para demostrar al usuario a qué área geográfica corresponde la anomalía detectada, con el diseño clásico "Zero-Trust Dark Mode".

## Optimización Computacional

La introducción de la etiqueta geográfica sustituye a las pesadas rutinas de generación de video MP4 (`crear_tiktok`), permitiendo que el Agente cierre su ciclo e indexe el repositorio de forma casi instantánea tras redactar la síntesis.
