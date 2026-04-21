## ¿Qué es xxHash (XXH3 128)?

XXH3 es el algoritmo xxHash moderno, diseñado para ofrecer una velocidad muy alta y una excelente distribución. XXH3 128 genera un valor hash de 128 bits (16 bytes), normalmente mostrado como una cadena hexadecimal de 32 caracteres. Es un hash no criptográfico y admite una semilla opcional para obtener resultados reproducibles.

**Características principales:**

- **Extremadamente rápido**: Optimizado para rendir bien con entradas grandes
- **Determinista**: La misma entrada y la misma semilla siempre producen el mismo hash
- **No criptográfico**: No es adecuado para fines de seguridad
- **Buena distribución**: Útil para tablas hash e indexación
- **Con semilla**: La semilla opcional ayuda a diversificar las salidas hash

**Usos comunes:**

- Tablas hash y estructuras de datos
- Verificación de integridad de archivos (sin fines de seguridad)
- Deduplicación y fragmentación de datos
- Claves de caché e indexación de bases de datos
- Canalizaciones de datos de alto rendimiento
