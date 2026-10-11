## Convierte archivos web guardados de forma local

Abre un archivo local `.mhtml` o `.mht`, revisa las páginas generadas y descarga el PDF que aparece en la vista previa. Se genera un archivo PDF directamente; no hace falta un cuadro de diálogo de impresión. El documento principal utiliza las imágenes y los estilos incluidos en el archivo. Para leer sin convertir, usa el [Visor de MHTML](../mhtml-viewer/). Los documentos HTML simples requieren el [Conversor de HTML a PDF](../html-to-pdf-converter/); los correos guardados se abren en el [Visor de correo electrónico](../email-viewer/).

## Resultado de impresión y capturas compatibles

El documento principal archivado se redistribuye en páginas A4 en orientación vertical con márgenes de 18 mm y se captura como páginas de imágenes a 150 DPI. Se incluyen los encabezados, los párrafos, las listas, las tablas, el código, los saltos de página explícitos, los estilos básicos y las imágenes de mapa de bits incrustadas que sean compatibles. Las tablas anchas y el código se redistribuyen al ancho de la página. El texto del PDF no se puede seleccionar y no se añaden OCR ni enlaces interactivos. Las fuentes, el espaciado y la paginación pueden diferir de la página guardada. Comprueba cada página antes de confiar en el resultado.

Los archivos incompletos, las codificaciones de texto no compatibles, los recursos ausentes, las imágenes ilegibles y el contenido de impresión no compatible detienen la conversión sin ofrecer una descarga parcial. Los archivos que contienen marcos incrustados o páginas adicionales deben guardarse primero como un documento principal independiente. Se omiten los scripts, los formularios, las aplicaciones incrustadas, SVG y MathML. Los diseños web complejos y las fuentes incrustadas no son compatibles. Los estilos adaptables específicos para pantallas no controlan las páginas impresas y los tamaños de papel de origen se sustituyen por el diseño A4 fijo.

## Privacidad y recursos del navegador

Tu archivo permanece en este navegador. Los recursos incluidos se leen del archivo; nunca se descarga contenido ausente o remoto ni se contacta con el sitio web original. El contenido de los archivos nunca se sube. Los archivos grandes pueden requerir tiempo y memoria porque cada página se representa como una imagen. Puedes cancelar, cerrar o reemplazar el archivo. No hay un límite fijo de tamaño de archivo ni de número de páginas; los fallos reales de recursos del navegador generan un error cuando se pueden detectar.
