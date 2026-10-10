## Convierte hojas de cálculo OpenDocument a Excel

Abre o suelta un archivo ODS local, revisa sus celdas y descarga un libro XLSX. Se incluyen los nombres y el orden de las hojas de cálculo, las hojas ocultas, texto, números, booleanos, fechas, resultados guardados de fórmulas y celdas combinadas. Se conservan las hojas vacías y los huecos entre celdas. La ventana de vista previa no limita los datos exportados.

## Valores guardados y compatibilidad

Las fórmulas se convierten en sus valores guardados, no en fórmulas de Excel. Cuando faltan resultados guardados, las celdas quedan en blanco y se informa de ello. El navegador no recalcula fórmulas ni actualiza datos externos. Los resultados de error se convierten en errores genéricos de hoja de cálculo. El texto literal, incluidos los identificadores con ceros iniciales, los caracteres no latinos y el texto que empieza por un signo igual, sigue siendo texto.

Las fechas usan un formato estándar de fecha y hora; cuando se especifica una zona horaria, se normalizan a UTC. Las duraciones siguen siendo números de días y los porcentajes usan un formato básico de porcentaje. Los valores monetarios conservan su valor numérico sin la etiqueta de moneda ni el formato original. No se reproducen los estilos, las dimensiones de filas y columnas, los gráficos, las imágenes, los comentarios, los enlaces, las macros ni la configuración del libro.

Los archivos cifrados, los archivos comprimidos no válidos, los datos no compatibles y los valores o nombres de hojas fuera de los límites que admite Excel producen un error claro. Este conversor no admite archivos OpenDocument plano (.fods). Revisa los resultados importantes en tu aplicación de hojas de cálculo después de descargarlos.

## Procesamiento local

La conversión se ejecuta en este navegador sin subir el documento. Al reemplazar o cerrar el archivo se descarta el resultado anterior preparado para descargar; al cancelar se detiene el proceso en segundo plano. No hay un límite fijo de tamaño de archivo ni de número de hojas de cálculo. La memoria disponible del navegador sigue determinando qué libros se pueden procesar.

Para explorar ODS y otros formatos de hojas de cálculo, abre el [Visor de hojas de cálculo](../xlsx-viewer/).
