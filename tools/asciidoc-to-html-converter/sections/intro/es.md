## Convierte AsciiDoc localmente

Abre un archivo local `.adoc` o `.asciidoc`, revisa el documento representado y descarga un archivo HTML independiente en UTF-8. El archivo se abre sin conexión y conserva el texto seleccionable. Para revisar las advertencias del documento fuente o los archivos incluidos no disponibles antes de la conversión, usa el [Visor de AsciiDoc](../asciidoc-viewer/).

## Resultado y compatibilidad

Los encabezados, las listas, las tablas, los bloques de código, las notas, las citas, las notas al pie, los enlaces y las imágenes de mapa de bits incrustadas compatibles se conservan con un tema de lectura fijo. Los marcadores internos y las notas al pie permanecen en el documento; los enlaces externos solo se abren al seleccionarlos. El código y las tablas anchos se desplazan horizontalmente. El zoom de la vista previa no cambia la descarga. Las fuentes y el espaciado pueden diferir de otras herramientas de AsciiDoc.

Usa un documento fuente autocontenido en UTF-8 o UTF-16 con marca de orden de bytes. No se cargan archivos incluidos ni recursos externos de imagen o estilo. Los archivos incluidos no disponibles, las advertencias del analizador, los atributos sin resolver y los recursos ausentes o ilegibles detienen la exportación sin ofrecer una descarga parcial. Las imágenes incrustadas, incluidas las imágenes de fondo CSS, deben decodificarse correctamente. Las macros personalizadas, los diagramas, las extensiones y las fuentes incrustadas no son compatibles. Se omiten los scripts, los formularios, las aplicaciones incrustadas, SVG y MathML. La sintaxis no compatible del documento fuente puede permanecer como texto normal.

## Privacidad y recursos del navegador

Los archivos permanecen en este navegador. Los recursos ausentes nunca se obtienen de tu ordenador ni de un sitio web, y el contenido de los archivos nunca se sube. El HTML generado bloquea los scripts y la carga automática de recursos externos. Seguir un enlace externo es una acción independiente que puede contactar con ese sitio. Puedes cancelar, cerrar o reemplazar el documento fuente. No hay un límite fijo de tamaño de archivo ni de número de páginas; los documentos grandes dependen de la memoria disponible del navegador, y los fallos de recursos se notifican cuando se pueden detectar.
