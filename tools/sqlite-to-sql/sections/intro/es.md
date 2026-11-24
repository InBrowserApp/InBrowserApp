## Cómo exportar SQLite a un archivo SQL

Abre o arrastra un archivo de base de datos SQLite 3, como `.db`, `.sqlite` o `.sqlite3`. La herramienta genera un volcado SQL automáticamente. Activa **Solo el esquema** para exportar la estructura sin las filas de las tablas y elige **Descargar .sql** para guardar el script completo. Prueba con la base de datos de ejemplo para ver el resultado.

## Qué contiene un volcado SQL de SQLite

Un volcado SQL es un script de texto que permite recrear una base de datos. Incluye sentencias `CREATE` para tablas, índices, vistas y disparadores. La exportación completa añade sentencias `INSERT` para las filas de las tablas. Puedes usarlo para revisar cambios del esquema en Git, conservar una copia de seguridad legible o trasladar la base de datos a otro entorno SQLite.

El archivo original se queda en tu dispositivo. Si la base de datos usa un registro de escritura anticipada (WAL), exporta una copia independiente. Utiliza la aplicación de origen o el comando de copia de seguridad de SQLite para incluir los cambios confirmados del registro.

## Cómo restaurar el volcado SQL

Ejecuta este comando para importar el script en una base de datos SQLite nueva.

```sh
sqlite3 restored.sqlite < database.sql
```

Sustituye `database.sql` por el nombre del archivo que descargaste. El script usa la sintaxis de SQLite. Si la base de datos utiliza tablas virtuales o extensiones, restáurala en una instalación de SQLite con los módulos necesarios.

Para explorar tablas o exportar resultados de consultas a CSV o JSON, abre el [Visor de SQLite](../sqlite-viewer/). Para crear una base de datos a partir de hojas de cálculo, usa el [Conversor de CSV y Excel a SQLite](../csv-excel-to-sqlite/).
