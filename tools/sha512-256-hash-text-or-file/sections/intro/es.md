## ¿Qué es SHA-512/256 (FIPS 180-4)?

SHA-512/256 (FIPS 180-4) es una función hash criptográfica de la familia SHA-2 que produce un resumen de 256 bits (32 bytes), normalmente representado como una cadena hexadecimal de 64 caracteres. Se basa en SHA-512 con valores iniciales distintos y una salida truncada, lo que proporciona un resumen más corto conservando la estructura interna de SHA-512.

**Características principales:**

- **Determinista**: La misma entrada siempre produce el mismo hash
- **Cálculo rápido**: Se calcula rápidamente para cualquier entrada
- **Efecto avalancha**: Pequeños cambios en la entrada producen resultados muy diferentes
- **Irreversible**: Es computacionalmente inviable revertir el hash para encontrar la entrada original
- **Resistente a colisiones**: Es muy difícil encontrar dos entradas distintas que produzcan el mismo hash

**Usos habituales:**

- Firmas y certificados digitales
- Comprobaciones de integridad y sumas de verificación
- Construcciones HMAC
- Verificación de archivos y flujos de procesamiento de datos
- Protocolos que requieren hashes de 256 bits
