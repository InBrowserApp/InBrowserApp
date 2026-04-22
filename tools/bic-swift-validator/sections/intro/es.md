## ¿Qué es BIC/SWIFT?

BIC (Bank Identifier Code), también llamado código SWIFT, identifica instituciones financieras en pagos internacionales.

### Estructura del BIC

Un BIC tiene 8 u 11 caracteres: código de banco (4 letras), código de país (2 letras), código de ubicación (2 alfanuméricos) y un código de sucursal opcional (3 alfanuméricos).

### Reglas de validación

La validación comprueba longitud, conjunto de caracteres y códigos de país ISO 3166.

1. Elimine espacios y guiones
2. Verifique que el formato tenga 8 u 11 caracteres
3. Analice los códigos de banco, país, ubicación y sucursal

El código de sucursal "XXX" o un BIC de 8 caracteres indica la oficina principal.

El segundo carácter del código de ubicación 0 indica BIC de prueba; 1 indica participante pasivo.
