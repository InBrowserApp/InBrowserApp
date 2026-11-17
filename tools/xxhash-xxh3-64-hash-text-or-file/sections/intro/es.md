## ¿Qué es xxHash (XXH3 64)?

XXH3 es el algoritmo moderno de xxHash, diseñado para ofrecer una velocidad muy alta y una excelente distribución. XXH3 64 produce un valor hash de 64 bits (8 bytes), normalmente representado como una cadena hexadecimal de 16 caracteres. Es un hash no criptográfico y admite una semilla opcional para obtener resultados reproducibles.

**Características principales:**

- **Extremadamente rápido**: Optimizado para procesar grandes volúmenes de datos
- **Determinista**: La misma entrada y la misma semilla siempre producen el mismo hash
- **No criptográfico**: No es adecuado para fines de seguridad
- **Buena distribución**: Ideal para tablas hash e indexación
- **Con semilla**: Permite utilizar una semilla opcional para diversificar los resultados hash

**Usos habituales:**

- Tablas hash y estructuras de datos
- Comprobaciones de integridad de archivos sin fines de seguridad
- Eliminación de duplicados y fragmentación de datos
- Claves de caché e indexación de bases de datos
- Flujos de procesamiento de datos de alto rendimiento
