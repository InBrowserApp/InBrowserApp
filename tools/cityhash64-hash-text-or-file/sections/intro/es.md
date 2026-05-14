## ¿Qué es CityHash64?

CityHash64 es un algoritmo de hash no criptográfico rápido de Google que produce un valor de 64 bits (8 bytes). Es útil cuando necesitas una huella compacta y determinística para texto o archivos, y la velocidad importa más que la seguridad criptográfica.

**Características clave:**

- **Rápido y determinístico**: La misma entrada y semilla siempre producen el mismo hash de 64 bits
- **No criptográfico**: No uses CityHash64 para contraseñas, firmas, tokens ni comprobaciones de integridad a prueba de manipulación
- **Compatible con semilla**: Deja la semilla en blanco para CityHash64 estándar, o introduce una semilla decimal o hexadecimal `0x` cuando necesites un espacio de hash con semilla separado
- **Procesamiento local**: El texto y los archivos se procesan en el navegador; los archivos cargados no se envían a un servidor
- **Múltiples codificaciones**: Los resultados se muestran como valores hexadecimales, Base64, decimales y binarios

**Usos comunes:**

- Tablas hash y estructuras de datos
- Huellas de archivos no relacionadas con seguridad
- Deduplicación y agrupación de datos
- Claves de caché y claves de particionamiento
- Fixtures de regresión para sistemas que ya usan CityHash64
- Indexación de bases de datos
