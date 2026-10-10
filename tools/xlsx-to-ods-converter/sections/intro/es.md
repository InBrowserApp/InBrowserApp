## Convierte libros de Excel a OpenDocument

Abre o suelta un archivo XLSX local, revisa sus celdas y descarga un libro ODS. Se incluyen los nombres y el orden de las hojas de cálculo, las hojas vacías y ocultas, las posiciones de las celdas, texto, números, booleanos, fechas y resultados guardados de fórmulas. La ventana de vista previa no limita los datos exportados. Las hojas muy ocultas pasan a ser hojas ocultas normales.

## Valores guardados y compatibilidad

Las fórmulas se convierten en sus valores guardados. Cuando faltan resultados, las celdas quedan en blanco y se informa de ello; el navegador no recalcula fórmulas ni actualiza datos externos. Los resultados de error de la hoja de cálculo se convierten en texto sin formato. Los identificadores con ceros iniciales, los caracteres no latinos y el texto literal que empieza por un signo igual siguen siendo texto.

Las fechas respetan el sistema de fechas de 1900 o 1904 del libro y usan un formato estándar de fecha y hora. Los valores que solo contienen una hora y las duraciones usan un formato básico de duración. Los porcentajes y los valores monetarios conservan su valor numérico sin el formato original ni la etiqueta de moneda. La fecha ficticia de Excel del 29 de febrero de 1900 y los formatos de fecha personalizados no compatibles producen un error en lugar de desplazar la fecha.

No se reproducen los estilos, las dimensiones de filas y columnas, la disposición de las celdas combinadas, los gráficos, las imágenes, los comentarios, los enlaces, las macros ni la configuración del libro. Los valores almacenados en áreas combinadas permanecen en sus posiciones de celda originales. Este conversor admite XLSX, pero no XLS, XLSB ni XLSM. Los archivos cifrados, los archivos comprimidos no válidos, los tipos de hoja no compatibles y los datos que no se pueden representar en ODS producen un error claro. Revisa los resultados importantes en tu aplicación de hojas de cálculo después de descargarlos.

## Procesamiento local

La conversión se ejecuta en este navegador sin subir el documento. Al reemplazar o cerrar el archivo se descarta el resultado anterior preparado para descargar; al cancelar se detiene el proceso en segundo plano. No hay un límite fijo de tamaño de archivo ni de número de hojas de cálculo. La memoria disponible del navegador sigue determinando qué libros se pueden procesar.

Para explorar Excel y otros formatos de hojas de cálculo, abre el [Visor de hojas de cálculo](../xlsx-viewer/).
