## Qué hace

Verifica si una contraseña en texto plano coincide con un hash bcrypt de contraseña. Esto resulta útil cuando depuras código de inicio de sesión, revisas registros de usuarios importados o confirmas que una migración de contraseñas mantuvo los hashes compatibles.

## Entrada aceptada

Pega un hash bcrypt estándar como `$2b$10$...` e ingresa la contraseña candidata que quieres probar. El verificador acepta los prefijos `$2a$`, `$2b$` y `$2y$` con valores de costo desde `04` hasta `31`.

## Interpretar el resultado

Un resultado coincidente significa que bcrypt aceptó la contraseña para ese hash, incluidos la sal y el costo incrustados en la cadena del hash. Una falta de coincidencia significa que la contraseña no se verificó; no demuestra que el hash en sí sea inseguro. Los errores de hash no válido suelen indicar que el prefijo, el costo, la longitud o los caracteres base64 de bcrypt están mal formados.

## Notas de privacidad y seguridad

- La verificación se ejecuta localmente en tu navegador.
- Las contraseñas y los hashes no se almacenan en el almacenamiento local.
- bcrypt está diseñado para almacenar contraseñas, no como suma de comprobación de archivos de propósito general.
- Usa esta herramienta para depuración y validación, no como la única auditoría de un sistema de autenticación de producción.
