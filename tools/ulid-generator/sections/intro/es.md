Genera ULID localmente en tu navegador para registros, eventos, logs, fixtures y sistemas distribuidos que necesitan identificadores compactos con prefijos ordenables por tiempo. Cada valor se crea en este dispositivo y se puede copiar o descargar sin enviar el lote a otro servicio.

## Por Qué Usar ULID

ULID significa Universally Unique Lexicographically Sortable Identifier. Combina una marca de tiempo Unix en milisegundos de 48 bits con 80 bits de aleatoriedad y luego codifica el resultado como una cadena Crockford Base32 de 26 caracteres. Esta forma hace que los ULID sean seguros para URL, adecuados para bases de datos y ordenables de manera natural por hora de creación.

## Hora Actual O Personalizada

Usa la hora actual para registros normales de aplicaciones, claves de importación y datos de prueba que deban reflejar cuándo se crearon. Cambia a una marca de tiempo personalizada cuando necesites muestras de aspecto determinista, filas rellenadas a posteriori, eventos reproducidos o fixtures que deban ordenarse alrededor de un momento específico.

## Lotes Monotónicos

Cuando el modo de lote monotónico está activado, los ID generados para el mismo milisegundo incrementan su segmento aleatorio para que el lote permanezca ordenado lexicográficamente de arriba abajo. Desactívalo cuando quieras que cada fila use un segmento aleatorio nuevo. Ambos modos mantienen la marca de tiempo visible en los primeros diez caracteres.
