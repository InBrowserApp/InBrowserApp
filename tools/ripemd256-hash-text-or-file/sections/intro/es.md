## ¿Qué es RIPEMD-256?

RIPEMD-256 (RACE Integrity Primitives Evaluation Message Digest) es una función hash criptográfica que produce un valor hash de 256 bits (32 bytes), normalmente representado como un número hexadecimal de 64 caracteres. Es parte de la familia RIPEMD desarrollada en Europa como alternativa a MD4/MD5.

**Características clave:**

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Computación rápida**: Rápido de calcular para cualquier entrada dada
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Tamaño de salida fijo**: Siempre produce un hash de 256 bits independientemente del tamaño de la entrada
- **Unidireccional**: Es computacionalmente inviable recuperar la entrada original desde el hash

**Usos comunes:**

- Comprobaciones de integridad de datos
- Huellas digitales y deduplicación
- Compatibilidad con sistemas heredados
