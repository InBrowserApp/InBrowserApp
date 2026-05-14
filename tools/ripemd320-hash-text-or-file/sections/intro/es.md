## ¿Qué es RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) es una función hash criptográfica que produce un valor hash de 320 bits (40 bytes), normalmente representado como un número hexadecimal de 80 caracteres. Es parte de la familia RIPEMD desarrollada en Europa como alternativa a MD4/MD5.

Usa esta herramienta cuando necesites calcular un resumen RIPEMD-320 para texto pegado, datos de configuración copiados o un archivo local. El cálculo se ejecuta en tu navegador, por lo que el contenido del archivo no necesita subirse a un servidor.

**Características clave:**

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Computación rápida**: Rápido de calcular para cualquier entrada dada
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Tamaño de salida fijo**: Siempre produce un hash de 320 bits independientemente del tamaño de la entrada
- **Unidireccional**: Es computacionalmente inviable recuperar la entrada original desde el hash

**Usos comunes:**

- Comprobaciones de integridad de datos
- Huellas digitales y deduplicación
- Compatibilidad con sistemas heredados

**Nota de seguridad:**

RIPEMD-320 es útil principalmente cuando un protocolo, archivo, lista de sumas de verificación o sistema heredado ya lo especifica. Para nuevos diseños sensibles a la seguridad, prefiere una función hash actualmente estandarizada como SHA-256, SHA-512, SHA-3 o BLAKE3, a menos que se requiera compatibilidad con RIPEMD.
