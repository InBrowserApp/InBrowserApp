## ¿Qué es HighwayHash?

HighwayHash es una función hash rápida con clave diseñada por Google para huellas de alto rendimiento y comprobaciones de integridad. Usa una clave de 256 bits y puede producir salidas de 64, 128 o 256 bits a partir de la misma entrada de texto o archivo.

## Cuándo usarlo

- Crea sumas de comprobación deterministas con clave para claves de caché, ID de objetos, particionado o tablas de búsqueda internas.
- Compara archivos o cargas de texto con la misma clave cuando la velocidad importa más que la compatibilidad criptográfica amplia.
- Genera huellas de 128 o 256 bits cuando conviene un hash más grande que no sea para contraseñas en flujos de integridad.

## Opciones de clave y salida

Introduce la clave como exactamente 32 bytes de datos hexadecimales, por ejemplo `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. El prefijo `0x` es opcional, y la herramienta acepta espacios, dos puntos, guiones y guiones bajos para que las claves largas sean más fáciles de leer. Dejar la clave en blanco usa la clave predeterminada de la biblioteca, lo que resulta práctico para comprobaciones rápidas, pero no debe tratarse como secreta.

## Notas de seguridad

HighwayHash no sustituye a HMAC, las firmas digitales ni el hash de contraseñas. Úsalo para huellas rápidas con clave y flujos de sumas de comprobación, no para demostrar autenticidad entre sistemas que necesitan verificación criptográfica estándar.
