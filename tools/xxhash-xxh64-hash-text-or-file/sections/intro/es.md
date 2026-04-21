## ¿Qué es xxHash (XXH64)?

xxHash es un algoritmo de hash no criptográfico extremadamente rápido que se enfoca en la velocidad y el rendimiento mientras mantiene buenas propiedades de distribución. XXH64 es la variante de 64 bits que produce un valor hash de 64 bits (8 bytes), típicamente mostrado como un número hexadecimal de 16 caracteres.

**Características clave:**

- **Extremadamente rápido**: Optimizado para velocidad, mucho más rápido que las funciones hash criptográficas
- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Buena distribución**: Proporciona excelente distribución hash para tablas hash
- **No criptográfico**: No es adecuado para propósitos de seguridad, diseñado para rendimiento
- **Salida más grande**: El hash de 64 bits proporciona mejor resistencia a colisiones que las variantes de 32 bits
- **Optimizado para plataforma**: Usa instrucciones SIMD cuando están disponibles para máxima velocidad

**Usos comunes:**

- Tablas hash y estructuras de datos
- Verificaciones de integridad de archivos (no seguridad)
- Deduplicación de datos
- Checksums para transmisión de datos
- Aplicaciones críticas de rendimiento
- Indexación de bases de datos
- Generación de claves de caché
