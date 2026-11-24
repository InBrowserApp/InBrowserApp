## Convertir archivos CSV y Excel en una base de datos SQLite

Añade uno o varios archivos CSV o Excel (.xlsx o .xls). Cada archivo CSV y cada hoja de Excel que contenga datos se convierte en una tabla independiente dentro de la misma base de datos. Comprueba las columnas en la vista previa, cambia el nombre de las tablas si hace falta y pulsa **Crear base de datos SQLite**. La conversión se realiza en el navegador y los archivos se quedan en tu dispositivo.

## Cómo se importan los datos a las tablas

De forma predeterminada, los valores de la primera fila se usan como nombres de columna. Para importar esa fila como datos, desmarca **Usar la primera fila como encabezado** en la tabla. Se generarán nombres como `column_1`. Los nombres de tabla o columna repetidos reciben un sufijo numérico. Así puedes añadir otro archivo con el mismo nombre y conservar ambas tablas.

El conversor detecta las columnas numéricas y conserva los ceros iniciales de los identificadores de texto, como `00123`. Las celdas vacías se convierten en valores SQL `NULL`. Las fechas de Excel se guardan como texto en formato ISO, con o sin hora. Para las celdas con fórmulas se usan los resultados guardados en el libro. Si necesitas actualizar los resultados, recalcula las fórmulas y guarda el libro en Excel antes de importarlo.

## Consultar la base de datos con SQL

Selecciona **Abrir en el Visor de SQLite** para explorar las tablas y ejecutar consultas. También puedes descargar el archivo `.sqlite` y utilizarlo con SQLite desde la línea de comandos, con Python o con otra aplicación compatible. Por ejemplo, convierte `orders.csv` y un libro de Excel con una hoja llamada `customers`. La siguiente consulta cuenta los pedidos de cada cliente.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Para adaptar el ejemplo, usa los nombres de tabla y columna que aparecen en tu vista previa.
