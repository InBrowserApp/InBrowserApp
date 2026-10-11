## Convertir un documento Markdown localmente

Abre un documento local `.md`, `.markdown`, `.mdown` o `.txt`, inspecciona las páginas generadas y descarga el PDF que aparece en la vista previa. Se genera un archivo PDF directamente, sin necesidad de un diálogo de impresión. Se admite texto fuente en UTF-8 y UTF-16 con marca de orden de bytes. Para leer o editar el código fuente, usa la [Vista previa de Markdown](../markdown-previewer/).

## Resultado de impresión y contenido compatible

Se admite Markdown estándar y tablas, listas de tareas, texto tachado y bloques de código delimitados al estilo de GitHub. El documento se representa con un tema de impresión fijo en páginas A4 en orientación vertical con márgenes de 18 mm y después se captura como páginas de imágenes a 150 DPI. Los estados de las tareas permanecen visibles y los detalles contraídos se expanden. Las tablas anchas y el código se redistribuyen al ancho de la página. El texto del PDF no se puede seleccionar y no se añaden OCR ni enlaces interactivos. Las fuentes, el espaciado y la paginación pueden diferir de otras herramientas de Markdown. Comprueba cada página antes de confiar en el resultado.

Los recursos de imagen ausentes y las imágenes incrustadas ilegibles detienen la conversión sin ofrecer una descarga parcial. Usa imágenes de mapa de bits incrustadas en un documento autocontenido. El HTML en línea se sanea; se omiten los scripts, los estilos, los formularios, las aplicaciones incrustadas, SVG y MathML. No se renderizan el resaltado de sintaxis, las fórmulas matemáticas, los diagramas, las notas al pie ni otras extensiones de variantes de Markdown; la notación no compatible puede permanecer como texto.

## Privacidad y recursos del navegador

Tu documento permanece en este navegador. Las imágenes y otros recursos nunca se obtienen de tu equipo ni de la red, y el contenido de los archivos nunca se sube. Los datos de imágenes de mapa de bits incrustadas se leen del documento seleccionado. Los archivos grandes pueden requerir tiempo y memoria porque cada página se representa como una imagen. Puedes cancelar, cerrar o reemplazar el documento. No hay un límite fijo de tamaño de archivo ni de número de páginas; los fallos reales de recursos del navegador producen un error cuando pueden detectarse.
