## Convierte un documento AsciiDoc localmente

Abre un documento local `.adoc` o `.asciidoc`, revisa las páginas generadas y descarga el PDF que se muestra en la vista previa. Se genera un archivo PDF directamente, sin necesidad de un cuadro de diálogo de impresión. Se admiten documentos fuente en UTF-8 y UTF-16 con marca de orden de bytes. Para leer sin convertir, usa el [Visor de AsciiDoc](../asciidoc-viewer/).

## Resultado de impresión y documentos fuente compatibles

El documento se representa con un tema de impresión fijo en páginas A4 en orientación vertical con márgenes de 18 mm y después se captura como páginas de imágenes a 150 DPI. Se incluyen los títulos, las secciones, los párrafos, las listas, las tablas, el código, los avisos, las llamadas explicativas, las notas al pie, los saltos de página explícitos y las imágenes de mapa de bits incrustadas compatibles. Las tablas anchas y el código se redistribuyen al ancho de la página. El texto del PDF no se puede seleccionar y no se añaden OCR ni enlaces interactivos. Las fuentes, el espaciado y la paginación pueden diferir de otras herramientas de AsciiDoc. Comprueba cada página antes de confiar en el resultado.

Los archivos incluidos, los recursos de imagen o estilo ausentes, las imágenes ilegibles, las advertencias del analizador y los atributos sin resolver detienen la conversión sin permitir una descarga parcial. Primero reúne el contenido fuente necesario en un único documento autocontenido. Las macros personalizadas, los diagramas, las extensiones, los temas de proyecto y las fuentes incrustadas no son compatibles; la notación no compatible puede permanecer como texto. Se omiten los scripts, los formularios, las aplicaciones incrustadas, SVG y MathML. Se elimina el contenido activo del HTML sin procesar. Los tamaños de papel del documento fuente se sustituyen por el diseño A4 fijo.

## Privacidad y recursos del navegador

Tu documento permanece en este navegador. Nunca se obtienen archivos fuente, imágenes ni otros recursos de tu equipo o de la red, y el contenido de los archivos nunca se sube. Los datos de imágenes de mapa de bits incrustadas se leen del documento seleccionado. Los archivos grandes pueden requerir tiempo y memoria porque cada página se representa como una imagen. Puedes cancelar, cerrar o reemplazar el documento. No hay un límite fijo de tamaño de archivo ni de número de páginas; los fallos reales de recursos del navegador generan un error cuando se pueden detectar.
