## ¿Qué es un validador de UUID?

Un validador de UUID comprueba si un identificador está escrito con la forma UUID estándar de 36 caracteres, como `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Es útil cuando necesitas verificar IDs copiados de logs, APIs, bases de datos, fixtures de prueba o entradas de usuario antes de confiar en ellos en el código.

### Entrada admitida

Esta herramienta valida texto UUID canónico con cinco grupos hexadecimales en el diseño `8-4-4-4-12`. Se aceptan letras mayúsculas y se normalizan a minúsculas. El nil UUID (`00000000-0000-0000-0000-000000000000`) y el max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) se tratan como valores especiales válidos.

### Detalles de validación

Para los UUID estándar, el validador comprueba el dígito de versión y los bits de variante. Se reconocen las versiones 1 a 8, lo que cubre UUIDs heredados de RFC 4122 y diseños más recientes de RFC 9562 como UUID v6, v7 y v8. El panel de resultados también divide el UUID en sus cinco segmentos para que puedas inspeccionar los bytes exactos que se están validando.

### Privacidad

La validación se ejecuta por completo en tu navegador. El UUID que pegas no se sube, por lo que la herramienta es segura para usar con identificadores internos, claves de base de datos y logs de producción de ejemplo que deben permanecer locales.
