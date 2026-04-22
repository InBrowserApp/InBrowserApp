## ¿Qué es MD5?

MD5 (Algoritmo de Resumen de Mensaje 5) es una función hash criptográfica ampliamente utilizada que produce un valor hash de 128 bits (16 bytes), típicamente representado como un número hexadecimal de 32 caracteres. Fue diseñado por Ron Rivest en 1991 como sucesor de MD4.

**Características clave:**

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Computación rápida**: Rápido de calcular para cualquier entrada dada
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Tamaño de salida fijo**: Siempre produce un hash de 128 bits independientemente del tamaño de entrada
- **Vulnerable a colisiones**: Las vulnerabilidades conocidas hacen posible encontrar colisiones

**Estado de seguridad:**
⚠️ **MD5 está criptográficamente roto y no debe usarse para aplicaciones críticas de seguridad**. Los ataques de colisión se demostraron en 2004, y la generación práctica de colisiones se hizo factible con el poder computacional moderno.

**Usos comunes (actuales e históricos):**

- Verificación de integridad de archivos (no crítico para seguridad)
- Sumas de verificación para detección de corrupción de datos
- Sistemas heredados que requieren MD5
- Generación de claves de base de datos (no criptográfico)
- Algunos protocolos y sistemas más antiguos

**Alternativas recomendadas:**

- SHA-256 o SHA-3 para nuevas aplicaciones
- SHA-512 para requisitos de alta seguridad
- BLAKE2 para aplicaciones de alto rendimiento
