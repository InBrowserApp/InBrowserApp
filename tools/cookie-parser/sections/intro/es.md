## ¿Qué analiza esta herramienta?

Pega un encabezado Cookie de solicitud o una o varias cabeceras Set-Cookie de respuesta. El analizador extrae nombres, valores y fragmentos mal formados en JSON estructurado para revisarlos rápidamente.

## Cookie frente a Set-Cookie

Usa Cookie para el encabezado que el navegador envía de vuelta al servidor. Usa Set-Cookie para cabeceras de respuesta que definen atributos como Path, Max-Age, SameSite, Secure o HttpOnly.

## Consejos para obtener resultados más claros

- Puedes pegar líneas completas de encabezado o pares cookie sin prefijo.
- Se admiten varias líneas Set-Cookie.
- Los fragmentos no válidos se listan por separado para detectar pares o atributos mal formados.
