## ¿Qué es Base64?

Base64 es útil cuando un canal basado en texto necesita transportar cargas binarias, como cuerpos de correo electrónico, bloques JSON o pequeñas data URL. Es una capa de codificación, no de seguridad.

## Cuándo usarlo

- Depuración rápida cuando una API devuelve o espera cadenas Base64.
- Convertir texto del navegador a un formato de transporte seguro para registros o cargas útiles.
- Comprobar si un bloque Base64 pegado se decodifica al contenido que esperas.

## Qué tener en cuenta

- Base64 aumenta el tamaño en aproximadamente un tercio.
- No cifra ni oculta el valor original.
- Un relleno incorrecto o un copiar y pegar incompleto suele manifestarse como un error de decodificación.
