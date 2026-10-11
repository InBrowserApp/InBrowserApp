## Exporta un cuaderno Jupyter guardado

Abre un cuaderno IPYNB y elige HTML, Markdown o código. HTML y Markdown mantienen las celdas en el orden guardado, incluidas las salidas guardadas compatibles. Todo permanece en tu navegador. No se inicia ningún kernel ni se ejecutan código o widgets.

## Elige un formato de salida útil

HTML es una copia de lectura independiente con texto seleccionable, imágenes incluidas compatibles y tablas legibles. Markdown proporciona contenido reutilizable; las tablas pueden contener HTML seguro y las imágenes usan URL de datos incrustadas, que algunas aplicaciones de Markdown no muestran. El diseño y el formato originales pueden cambiar.

La exportación de código conserva las celdas de código en orden y omite Markdown, las celdas de texto sin procesar y las salidas guardadas. Si se reconoce el lenguaje del cuaderno, este determina la extensión del script; si no, se usa TXT. Los comandos mágicos del cuaderno y la sintaxis de shell se conservan tal como están escritos, por lo que el código exportado puede requerir ajustes manuales o el kernel original del cuaderno. Un cuaderno sin celdas de código produce un archivo de código vacío.

## Resultados guardados y compatibilidad

El conversor lee el formato de cuaderno 4. Los resultados proceden del archivo guardado y pueden estar desactualizados. Se indican el contenido enriquecido no compatible y las imágenes no disponibles. No se descargan recursos remotos, no se ejecutan scripts ni widgets y no se reproducen audio ni vídeo. LaTeX se conserva como texto fuente, y las celdas de texto sin procesar o desconocidas aparecen como texto legible en las exportaciones de documentos.

Los recursos del navegador determinan los límites prácticos; no hay un límite fijo para el tamaño de archivo ni el número de celdas. Para consultar el cuaderno original, usa el [Visor de cuadernos Jupyter](/tools/notebook-viewer/).
