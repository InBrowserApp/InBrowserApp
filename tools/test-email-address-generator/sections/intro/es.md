## Generar un lote de direcciones de correo electrónico de prueba

Elige un dominio, introduce la cantidad y selecciona **Generar**. Elige **Cualquier dominio de ejemplo** para mezclar dominios en un mismo lote. Cada dirección aparece una sola vez por lote. Copia los resultados en un formulario o una hoja de cálculo, o descarga un archivo de texto UTF-8 con una dirección por línea para tus datos de prueba.

## ¿Qué dominios de correo electrónico puedo usar?

Faker.js genera direcciones en `example.com`, `example.net` y `example.org`. Estos [dominios de ejemplo reservados](https://www.iana.org/help/example-domains) se usan en documentación y datos de ejemplo. En `alex.morgan42@example.com`, la parte anterior a `@` es la parte local y `example.com` es el dominio. Usa un solo dominio si tu prueba espera un valor fijo, o mezcla dominios para probar filtros e importaciones.

## ¿Qué puedo probar con estas direcciones?

Usa estos ejemplos para probar los campos de formularios de registro, el formato de las direcciones de correo, las listas de cuentas o la deduplicación en una base de datos. El generador produce texto con direcciones, sin crear buzones. Para probar la entrega o un enlace de verificación, usa un buzón que controles o el entorno de pruebas de correo de tu entorno de desarrollo.
