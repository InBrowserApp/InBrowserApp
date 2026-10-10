## Convierte texto delimitado a Excel

Abre o suelta un archivo CSV o TSV local, revisa las celdas y descarga un libro XLSX con una hoja de cálculo llamada Sheet1. Elige el delimitador y la codificación del texto si la detección automática no coincide con el archivo. Los archivos TSV usan tabulaciones de forma predeterminada. La ventana de vista previa no limita los datos exportados.

## Conserva los identificadores y el texto original

CSV y TSV no almacenan los tipos de las celdas de una hoja de cálculo. Este conversor conserva todos los campos como texto, incluidos los ceros iniciales, los identificadores largos, los números que parecen decimales, las fechas y el texto que empieza por un signo igual. No deduce números ni fechas ni ejecuta fórmulas. Se conservan los separadores entre comillas, las comillas escapadas, Unicode, los saltos de línea dentro de los campos, los campos vacíos y los registros en blanco. Las filas más cortas dejan celdas en blanco. Un salto de línea final termina el último registro en lugar de añadir otra fila.

La opción de primera fila permite elegir entre datos normales o un encabezado con filtros de Excel. Ambas opciones conservan la fila exactamente como está escrita, incluidos los encabezados duplicados o vacíos. La codificación automática admite UTF-8 y UTF-16 con marca de orden de bytes. Las demás codificaciones se pueden seleccionar manualmente. Una directiva sep= inicial solo se omite si está seleccionada la detección automática del delimitador o si su separador coincide con el delimitador seleccionado.

Los campos entre comillas mal formados, la codificación del texto no válida y los datos que superan los límites de filas, columnas o texto por celda de Excel producen un error en lugar de un libro truncado. Revisa los valores importantes en una aplicación de hojas de cálculo después de descargar el archivo.

## Procesamiento local

La conversión se ejecuta en este navegador sin subir el archivo. Al cambiar los ajustes de importación, reemplazar o cerrar el archivo se descarta el resultado anterior. Al cancelar se detiene el proceso en segundo plano. No hay un límite fijo de tamaño de archivo; la memoria disponible del navegador determina qué archivos se pueden procesar.

Para explorar archivos de hojas de cálculo, abre el [Visor de hojas de cálculo](../xlsx-viewer/).
