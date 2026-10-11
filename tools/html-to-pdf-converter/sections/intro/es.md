## Convierte HTML guardado de forma local

Abre un documento local `.html`, `.htm` o `.xhtml` bien formado, revisa las páginas generadas y descarga el PDF que aparece en la vista previa. Se genera un archivo PDF directamente, sin necesidad de abrir un cuadro de diálogo de impresión. Para leer sin convertir, usa el [Visor de HTML](../html-viewer/).

## Aspecto del PDF y compatibilidad

El contenido del documento se redistribuye en páginas A4 en orientación vertical con márgenes de 18 mm y después se captura como páginas de imágenes a 150 DPI. Se incluyen los encabezados, párrafos, listas, tablas, código, saltos de página explícitos, estilos básicos e imágenes de mapa de bits incrustadas compatibles. Las tablas anchas y el código se redistribuyen para ajustarse al ancho de la página. El texto del PDF no se puede seleccionar y no se añaden OCR ni enlaces interactivos. Las fuentes, el espaciado y la paginación pueden diferir de la página original. Comprueba cada página antes de utilizar el resultado.

Se omiten los scripts, los formularios, las aplicaciones incrustadas, SVG y MathML. No se cargan recursos remotos ni carpetas de recursos que acompañen al archivo. Los recursos de imagen o estilo ausentes, las imágenes ilegibles y el contenido de impresión no compatible detienen la conversión sin ofrecer una descarga parcial. Usa un documento autónomo con imágenes incrustadas; los diseños web complejos y las fuentes incrustadas no son compatibles. Los estilos adaptables específicos para pantallas no controlan las páginas impresas y los tamaños de papel del documento original se sustituyen por el diseño A4 fijo.

## Privacidad y recursos del navegador

Tu documento permanece en este navegador. El motor de representación solo se carga después de elegir un archivo y el contenido de los archivos nunca se sube. Los documentos grandes pueden necesitar tiempo y memoria porque cada página se representa como una imagen. Puedes cancelar, cerrar o reemplazar el documento. No hay un límite fijo de tamaño de archivo ni de número de páginas; los fallos reales de recursos del navegador generan un error cuando se pueden detectar.
