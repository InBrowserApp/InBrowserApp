## ¿Qué es Basic Auth?

Basic Auth coloca `username:password` en el encabezado `Authorization` después de codificarlo en Base64. Es simple y ampliamente compatible, pero Base64 solo es una codificación, no un cifrado.

## Qué genera esta herramienta

- Un encabezado `Authorization: Basic ...` que puedes pegar en clientes de API.
- Un ejemplo de `curl` listo para ejecutar en pruebas rápidas.
- Todo se ejecuta localmente en el navegador.

## Qué debes tener en cuenta

- Usa HTTPS siempre que envíes credenciales Basic Auth.
- Cualquiera que vea el encabezado puede decodificar el usuario y la contraseña originales.
- Basic Auth es útil para herramientas internas, entornos de staging y comprobaciones rápidas de API.
