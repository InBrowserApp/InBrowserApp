## Convertir una marca de tiempo Unix a una fecha

Pega una marca de tiempo para ver la fecha y la hora en la zona horaria de tu dispositivo, en UTC y en formato ISO 8601. También puedes ver cuánto tiempo ha pasado o cuánto falta. Por ejemplo, tanto `1704067200` segundos como `1704067200000` milisegundos corresponden a `2024-01-01T00:00:00.000Z` en ISO 8601.

## Convertir una fecha a una marca de tiempo Unix

Edita **Fecha y Hora** para convertir una fecha y hora locales a una marca de tiempo Unix en la unidad seleccionada. Pulsa **Ahora** para obtener la marca de tiempo actual. Para registros y API, usa el valor ISO 8601 que termina en `Z` cuando necesites indicar la hora UTC sin ambigüedad.

## Elegir segundos, milisegundos o nanosegundos

Las marcas de tiempo Unix miden el tiempo transcurrido desde el 1 de enero de 1970 a las 00:00:00 UTC. **Auto** interpreta hasta 10 dígitos como segundos, de 11 a 13 como milisegundos y los valores de más dígitos como nanosegundos. Selecciona la unidad manualmente si conoces el formato de origen, sobre todo si manejas valores antiguos en milisegundos o si la fecha obtenida no coincide con la esperada. La fecha se muestra con precisión de milisegundos.
