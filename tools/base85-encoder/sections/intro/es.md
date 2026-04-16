## ¿Qué es Base85?

Base85 es una codificación de binario a texto que convierte 4 bytes en 5 caracteres imprimibles. Es más compacta que Base64, y esta herramienta te permite elegir entre ASCII85 y Z85 según el formato que necesite el destino.

## Cuándo usarlo

- Para codificar bytes, texto o archivos cuando deban viajar por canales solo de texto y quieras mantener una salida relativamente compacta.
- Usa ASCII85 cuando necesites un formato flexible que admita bytes finales incompletos.
- Usa Z85 cuando necesites texto Base85 compatible con ZeroMQ y la longitud de entrada sea exactamente múltiplo de 4 bytes.

## Qué debes tener en cuenta

- Base85 es un formato de codificación, no de cifrado.
- ASCII85 y Z85 usan alfabetos distintos, así que no son intercambiables.
- Z85 rechaza datos cuyo tamaño en bytes no sea divisible entre 4, mientras que ASCII85 sí puede codificar bloques finales parciales.
