## Explora bases de datos SQLite en tu navegador

Abre una base de datos SQLite 3 para explorar tablas y vistas, inspeccionar columnas, índices, claves foráneas y sentencias CREATE, o ejecutar una consulta SQL de solo lectura. Prueba la base de datos de ejemplo para explorar el área de trabajo. Tu archivo se procesa localmente y nunca se modifica.

## Consulta y exporta resultados

Selecciona una tabla o vista para cargar sus filas y edita el SQL para filtrar, ordenar o combinar datos. Ejecuta una sentencia SELECT, WITH o EXPLAIN con **Ejecutar consulta** o **Ctrl/⌘ + Intro**. Haz clic en una celda para inspeccionar y copiar su valor completo.

Elige un límite de resultados de 100, 1.000 o 10.000 filas y explora el resultado de 50 en 50 filas. Las consultas tienen un límite de 10 segundos y de 5 MiB para el tamaño del resultado. Las exportaciones CSV y JSON incluyen todas las filas cargadas de todas las páginas.

JSON usa nombres de columna y matrices de filas por separado para conservar los nombres duplicados y los valores NULL. Los enteros son cadenas decimales exactas y los BLOB contienen un valor hexadecimal `$blob`. CSV incluye una fila de encabezado, usa campos vacíos para NULL y antepone un apóstrofo al texto que parece una fórmula.

## Archivos SQLite admitidos

Abre un archivo `.db`, `.sqlite` o `.sqlite3` sin cifrar de hasta 50 MiB. Para una base de datos que use WAL, crea una copia con un punto de control aplicado antes de abrirla; no se cargan los archivos auxiliares WAL y journal. No se admiten extensiones personalizadas de SQLite. Los archivos y las consultas no se guardan automáticamente.
