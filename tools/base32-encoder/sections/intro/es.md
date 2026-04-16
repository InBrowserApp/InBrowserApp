## ¿Qué es Base32?

Base32 es útil cuando un canal solo de texto o que no distingue mayúsculas de minúsculas necesita transportar datos binarios, como secretos OTP, tokens seguros para DNS o valores de configuración exportados. Es una capa de codificación, no una capa de seguridad.

## Cuándo usarlo

- Codificar bytes, texto o archivos antes de enviarlos por canales solo de texto.
- Preparar secretos OTP, configuraciones exportadas o blobs binarios para sistemas que esperan entrada Base32.
- Convertir bytes de archivos sin procesar en una cadena fácil de copiar para transporte, registros o entrada manual.

## Qué debes tener en cuenta

- Base32 aumenta el tamaño más que Base64.
- No cifra ni oculta el valor original.
- Algunos sistemas exigen padding `=`, mientras que otros aceptan salida sin padding, así que conviene ajustarse al receptor.
