## Exporta una hoja de cálculo a un formato portátil

Abre un archivo .xlsx, .xlsm, .xltx o .xltm local o suéltalo en el exportador. Elige una hoja de cálculo por su nombre original, incluidas las hojas ocultas, y selecciona CSV, TSV, JSON o Markdown. Previsualiza el resultado, cópialo o descarga un archivo UTF-8 cuyo nombre incluya el del libro y el de la hoja de cálculo. Reemplazar o cerrar el archivo cancela el trabajo pendiente y elimina los resultados anteriores disponibles para descargar. El Visor de hojas de cálculo también ofrece la opción Exportar hoja de cálculo para la hoja actual.

El rango de celdas predeterminado es el rectángulo más pequeño que contiene valores guardados o fórmulas. Las celdas y filas vacías dentro de ese rectángulo permanecen en el resultado. Puedes introducir otro rango, como A1:D20, y elegir Aplicar rango. Una hoja vacía produce un archivo de texto vacío o una matriz JSON vacía, a menos que elijas un rango explícitamente.

## Elige cómo se representan los valores y los encabezados

El texto con formato sigue los formatos numéricos compatibles y conserva las fechas tal como se muestran y los formatos numéricos con ceros iniciales cuando están disponibles. Los formatos que dependen de la configuración regional pueden diferir de Excel. Los valores almacenados conservan los números y los booleanos; las fechas siguen siendo números de serie de Excel, sin adquirir una zona horaria. Las celdas de texto conservan su texto en ambos modos. Las fórmulas usan sus resultados guardados sin recalcularse. Si falta un resultado guardado, la celda queda en blanco y aparece un aviso en la interfaz. Los errores de la hoja de cálculo permanecen como cadenas legibles, como #DIV/0!.

CSV y TSV entrecomillan los campos que contienen separadores, comillas o saltos de línea. JSON es una matriz que contiene una matriz por fila: la primera fila permanece en los datos, los encabezados duplicados o vacíos no se convierten en claves de objetos y las celdas vacías usan null. Markdown puede tratar la primera fila como encabezado o añadir un encabezado vacío sobre todas las filas de datos. La puntuación de Markdown, el HTML, las barras verticales y los saltos de línea de las celdas se escapan o se representan de forma segura. Las descargas usan UTF-8 sin marca de orden de bytes; elige UTF-8 al importar en otra aplicación.

## Procesamiento local y compatibilidad

Tu libro permanece en este navegador y la herramienta no lo sube ni lo guarda. Las macros, los scripts y las conexiones de datos externas no se ejecutan ni se actualizan. Las filas y columnas ocultas se incluyen en el rango seleccionado. Las celdas combinadas no se expanden en valores repetidos. Los gráficos, las imágenes, los comentarios y los estilos del libro no forman parte de estos formatos de texto.

Los libros cifrados, dañados o no compatibles muestran un error claro. No hay límites fijos de tamaño de archivo, hojas de cálculo, filas o columnas, pero una exportación grande puede superar la memoria del navegador. Esta herramienta exporta los datos guardados; no edita el libro ni garantiza que otra aplicación de hojas de cálculo interprete los campos de texto sin formato de la misma manera.
