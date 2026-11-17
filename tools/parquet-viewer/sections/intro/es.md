## Inspecciona archivos Parquet en tu navegador

Abre o suelta un archivo `.parquet` para explorar sus datos e inspeccionar el tipo físico, la anotación lógica y la repetición de cada campo. Los grupos anidados permanecen visibles en el esquema. El resumen muestra el número de filas, las columnas, los grupos de filas, la compresión y el creador del archivo cuando está disponible. Puedes probar el ejemplo incluido sin elegir un archivo.

## Explora datos y exporta CSV o JSON

Los datos se cargan página a página. Usa los controles de paginación para recorrer el archivo y selecciona una celda para leer su valor completo. Cambia a **Esquema** para inspeccionar los campos. Usa **Exportar datos** para descargar la página actual o todas las filas como CSV en UTF-8 o una matriz JSON. Las exportaciones del archivo completo se preparan por lotes y se pueden cancelar.

CSV incluye los nombres de las columnas y entrecomilla las comas, las comillas y los saltos de línea. Los valores null se convierten en campos CSV vacíos y permanecen como `null` en JSON. Los valores anidados usan JSON; los valores binarios usan texto hexadecimal. Para conservar los enteros de 64 bits, JSON los escribe como cadenas. Las fechas y las marcas de tiempo usan texto ISO con precisión de milisegundos. Los decimales siguen la precisión numérica del lector, por lo que este visor no es una herramienta de conversión sin pérdida para datos decimales o marcas de tiempo de alta precisión.

## Procesamiento local

Tu archivo se lee localmente en un proceso en segundo plano y nunca se sube. El visor lee primero los metadatos al final del archivo y después solo los intervalos de filas necesarios para la exploración. Aun así, decodificar los grupos de filas de Parquet puede requerir bastante memoria; el tamaño de la exportación depende de la memoria disponible en tu navegador. hyparquet y su paquete de compresión admiten los códecs sin compresión, Snappy, Gzip, Brotli, Zstandard y LZ4. No se admiten archivos Parquet cifrados.
