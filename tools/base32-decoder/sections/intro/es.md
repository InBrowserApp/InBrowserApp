## ¿Qué es Base32?

Base32 es útil cuando un canal solo de texto o que no distingue mayúsculas de minúsculas necesita transportar datos binarios, como secretos OTP, tokens seguros para DNS o valores de configuración exportados. Es una capa de codificación, no una capa de seguridad.

## Cuándo usarlo

- Decodificar secretos o tokens Base32 y recuperar sus bytes originales.
- Inspeccionar valores copiados desde la configuración de TOTP, exportaciones de integraciones o archivos de configuración.
- Comprobar si los datos Base32 pegados tienen caracteres válidos y padding correcto antes de usarlos.

## Qué debes tener en cuenta

- Base32 aumenta el tamaño más que Base64.
- No cifra ni oculta el valor original.
- Algunos sistemas omiten el padding `=`, pero los caracteres no válidos siguen provocando errores de decodificación.
