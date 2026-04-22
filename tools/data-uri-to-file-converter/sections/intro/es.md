## Por qué aparecen los Data URI

Los Data URI empaquetan un archivo y sus metadatos en una sola cadena, por eso aparecen en HTML, CSS, SVG, plantillas de correo, respuestas de API y exportaciones del navegador. Son prácticos para recursos pequeños, pero resulta difícil inspeccionarlos cuando solo tienes el valor codificado.

## Qué te da este convertidor

Pega un `data:` URI completo para decodificarlo localmente en el navegador. La herramienta muestra el tipo MIME, indica si la carga usa Base64 o codificación URL, previsualiza texto, imágenes, audio o video cuando el navegador puede renderizarlos y propone un nombre de archivo según el tipo de medio.

## Qué revisar antes de guardar

Un Data URI válido todavía puede traer un tipo MIME incorrecto o una extensión engañosa. Compara el panel de detalles con lo que esperabas, revisa la vista previa cuando exista y renombra el archivo antes de descargarlo si necesitas otro nombre.
