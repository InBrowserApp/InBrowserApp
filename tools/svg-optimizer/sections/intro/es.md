## Qué hace esta herramienta

Este optimizador de SVG comprime un archivo SVG local o un documento SVG pegado
en tu navegador. Usa pasadas de limpieza de SVGO para eliminar comentarios,
metadatos, atributos redundantes, precisión innecesaria y otro marcado que no
cambia la imagen visible.

## Por qué ayuda

Los archivos SVG exportados desde herramientas de diseño suelen contener
metadatos del editor, rutas verbosas, IDs sin usar y comentarios. Optimizarlos
puede reducir el tamaño de descarga, mejorar la carga de la página y hacer que
el código SVG en línea sea más fácil de revisar antes de publicarlo en un sitio
web, app, correo electrónico o página de documentación.

## Cómo funciona

Sube un archivo `.svg` o pega marcado SVG, elige el preajuste seguro o ajusta
las pasadas individuales de SVGO y luego ejecuta la optimización. La herramienta
muestra las vistas previas original y optimizada, el ahorro de bytes y el
marcado final para que puedas copiarlo o descargar un archivo `.optimized.svg`.
El SVG nunca tiene que salir de tu dispositivo.

## Notas prácticas

- Mantén el preajuste seguro cuando el SVG dependa de CSS externo, IDs con
  scripts o referencias de símbolos que no puedas inspeccionar fácilmente.
- Usa el preajuste agresivo para iconos, logotipos e ilustraciones exportados
  simples, donde eliminar dimensiones e insertar estilos en línea sea aceptable.
- Previsualiza la imagen optimizada antes de reemplazar el arte de origen,
  especialmente cuando el origen use máscaras, degradados, filtros o recursos
  vinculados.
