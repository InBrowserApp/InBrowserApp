## Inspecciona archivos SQLite localmente

Abre una base de datos SQLite 3 para explorar sus tablas y vistas, inspeccionar definiciones de columnas, índices, claves foráneas y sentencias CREATE, o ejecutar una consulta SQL de solo lectura. Prueba la base de datos de ejemplo para explorar el área de trabajo sin elegir un archivo. Los archivos y las consultas permanecen en tu navegador y no se guardan automáticamente.

## Consulta y exporta resultados

Selecciona una tabla para ver una vista previa de sus filas. Edita el SQL y usa **Ejecutar consulta** o **Ctrl/⌘ + Intro** para ejecutar una sentencia SELECT, WITH o EXPLAIN. El límite de resultados restringe el número de filas cargadas; la paginación muestra 50 filas cada vez. Una consulta también puede detenerse al alcanzar el límite de 5 MiB de resultados o después de 10 segundos. La cancelación mantiene la interfaz ágil y recarga la instantánea de la base de datos en la siguiente consulta.

Las exportaciones CSV y JSON contienen el resultado cargado, incluidas las filas de otras páginas. JSON almacena los nombres de las columnas y las matrices de filas por separado, conservando los nombres duplicados y los valores NULL. Los enteros de SQLite se convierten en cadenas decimales exactas y los BLOB, en objetos con un valor hexadecimal `$blob`. CSV usa campos vacíos para NULL, entrecomilla los caracteres especiales y antepone un apóstrofo al texto que parece una fórmula para un uso más seguro en hojas de cálculo.

## Bases de datos admitidas y límites

Abre un archivo `.db`, `.sqlite` o `.sqlite3` sin cifrar de hasta 50 MiB. El archivo original nunca se modifica. Esta herramienta carga una instantánea en memoria, por lo que el uso de memoria puede superar el tamaño del archivo. Los archivos auxiliares WAL y journal no se importan; crea una copia limpia con un punto de control aplicado desde tu aplicación de bases de datos antes de abrirla aquí. No se admiten bases de datos cifradas, extensiones personalizadas de SQLite ni la edición de bases de datos.
