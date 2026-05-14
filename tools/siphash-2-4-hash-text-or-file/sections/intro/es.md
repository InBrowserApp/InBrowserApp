## ¿Qué es SipHash-2-4?

SipHash-2-4 es una función hash rápida con clave diseñada para mensajes cortos y para proteger tablas hash. Usa una clave secreta de 128 bits y produce una salida de 64 bits, que normalmente se muestra como un valor hexadecimal de 16 caracteres.

## Cuándo usarlo

- Protege las tablas hash del servidor frente a ataques de inundación de hash cuando la clave se mantiene privada.
- Crea sumas de comprobación deterministas con clave para claves de caché, particionado o tablas de búsqueda internas.
- Compara fragmentos de texto o archivos con la misma clave cuando no se requiere autenticación criptográfica.

## Formato de la clave

Introduce la clave como exactamente 16 bytes de datos hexadecimales, por ejemplo `0x000102030405060708090a0b0c0d0e0f`. El prefijo `0x` es opcional, y la herramienta acepta espacios, dos puntos, guiones y guiones bajos para que las claves largas sean más fáciles de leer.

## Notas de seguridad

SipHash-2-4 no sustituye a HMAC, las firmas digitales ni el hash de contraseñas. Úsalo para flujos de trabajo de tablas hash con clave y sumas de comprobación, no para demostrar autenticidad entre sistemas que necesitan garantías de seguridad criptográfica.
