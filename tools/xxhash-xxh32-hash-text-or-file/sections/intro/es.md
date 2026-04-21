## ¿Qué es xxHash (XXH32)?

xxHash es un algoritmo de hash no criptográfico extremadamente rápido que se enfoca en la velocidad y el rendimiento mientras mantiene buenas propiedades de distribución. XXH32 es la variante de 32 bits que produce un valor hash de 32 bits (4 bytes), típicamente mostrado como un número hexadecimal de 8 caracteres.

**Características clave:**

- **Extremadamente rápido**: Optimizado para velocidad, mucho más rápido que las funciones hash criptográficas
- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Buena distribución**: Proporciona excelente distribución hash para tablas hash
- **No criptográfico**: No es adecuado para propósitos de seguridad, diseñado para rendimiento
- **Salida pequeña**: El hash de 32 bits proporciona representación compacta
- **Optimizado para plataforma**: Usa instrucciones SIMD cuando están disponibles para máxima velocidad

**Usos comunes:**

- Tablas hash y estructuras de datos
- Verificaciones de integridad de archivos (no seguridad)
- Deduplicación de datos
- Checksums para transmisión de datos
- Aplicaciones críticas de rendimiento
- Indexación de bases de datos
- Generación de claves de caché
