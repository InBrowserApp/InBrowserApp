## Convierte texto enriquecido localmente

Abre un documento `.rtf` local, conviértelo a PDF, inspecciona las páginas resultantes y descarga el mismo PDF que se muestra en la vista previa. Para leer sin convertir, usa el [Visor de RTF](../rtf-viewer/).

## Apariencia del PDF y compatibilidad

El motor de conversión genera las páginas con sus tamaños, orientación, encabezados, pies de página, saltos de página, tablas e imágenes PNG/JPEG incrustadas compatibles. El texto compatible sigue siendo seleccionable. Las codificaciones de caracteres y las secuencias de escape Unicode originales del RTF se pasan al motor; no se añade OCR al texto escaneado. Las fuentes que faltan se sustituyen por fuentes incluidas, por lo que los saltos de línea, el espaciado y la paginación pueden cambiar. Los diseños complejos pueden diferir de la aplicación original. Comprueba cada página antes de confiar en el PDF.

El PDF es una exportación estática. Los controles de formulario usan su apariencia impresa. Los comentarios, las macros y las firmas digitales no se conservan ni se verifican. Se rechazan los objetos incrustados, los recursos externos del documento, los formatos de imagen no compatibles y las instrucciones de campo no compatibles. Los archivos dañados o ilegibles producen un error sin una descarga incompleta. Cambiar el nombre de la extensión no cambia el formato subyacente.

## Privacidad y recursos del navegador

La conversión se ejecuta en tu dispositivo. La primera conversión descarga unos 90 MB de archivos del motor y fuentes que tu navegador puede almacenar en caché; el documento en sí nunca se sube. El motor solo se carga después de que elijas un archivo. Se necesitan navegadores actuales compatibles con WebAssembly y memoria compartida. Los documentos grandes o complejos pueden requerir tiempo y memoria. Puedes cancelar, cerrar o reemplazar el archivo. No hay un límite fijo de tamaño de archivo ni de número de páginas.
