## Qué Hace

Esta herramienta analiza encabezados Cookie y Set-Cookie sin procesar en JSON estructurado directamente en tu navegador. Puedes pegar una sola línea, varias líneas o solo valores sin los prefijos habituales.

## Cookie Vs. Set-Cookie

Un encabezado Cookie suele contener varios pares nombre/valor enviados por el cliente. Un encabezado Set-Cookie suele definir una sola cookie junto con atributos como Path, Secure, HttpOnly, SameSite, Expires o Max-Age.

## Notas

El analizador se ejecuta localmente y no sube encabezados a ningún servidor. Los segmentos no válidos se conservan en una lista separada para que puedas detectar cadenas de cookies mal formadas rápidamente.
