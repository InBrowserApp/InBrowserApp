## Convierte texto OpenDocument localmente

Abre un documento OpenDocument `.odt` o una plantilla `.ott`, convierte el archivo a PDF, revisa las páginas resultantes y descarga el mismo PDF que se muestra en la vista previa. Para leer sin convertir, usa el [Visor de ODT](../odt-viewer/).

## Apariencia del PDF y compatibilidad

El motor de conversión representa los estilos de página, tamaños de papel, orientación, encabezados, pies de página, columnas, tablas e imágenes incrustadas. Las páginas mantienen el orden resultante de la representación, incluidas las páginas en blanco insertadas por los estilos de página. El texto compatible sigue siendo seleccionable; no se añade OCR al texto escaneado. Las fuentes que faltan se sustituyen por las incluidas, por lo que los saltos de línea, el espaciado y la paginación pueden cambiar. Los diseños complejos pueden diferir de la aplicación original. Comprueba cada página antes de confiar en el PDF.

El PDF es una exportación estática. Los controles de formulario se muestran como en la impresión. Los comentarios, las macros y las firmas digitales no se conservan ni se verifican. No se admiten objetos incrustados, contenido multimedia ni recursos externos del documento. Los documentos protegidos, los paquetes dañados o el contenido ausente detectado generan un error sin ofrecer una descarga incompleta. Cambiar la extensión no cambia el formato real del archivo.

## Privacidad y recursos del navegador

La conversión se ejecuta en tu dispositivo. La primera conversión descarga unos 90 MB de archivos del motor y fuentes que tu navegador puede almacenar en caché; el documento en sí nunca se sube. El motor solo se carga después de elegir un archivo. Se necesita un navegador actualizado compatible con WebAssembly y memoria compartida. Los documentos grandes o complejos pueden requerir tiempo y memoria. Puedes cancelar la conversión, cerrar el archivo o reemplazarlo. No hay un límite fijo de tamaño de archivo ni de número de páginas.
