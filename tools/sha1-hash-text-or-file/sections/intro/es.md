## ¿Qué es SHA-1?

SHA-1 (Algoritmo de Hash Seguro 1) es una función hash criptográfica que produce un valor hash de 160 bits (20 bytes), típicamente representado como un número hexadecimal de 40 caracteres. Fue diseñado por la NSA y publicado por NIST en 1995 como parte del Estándar de Firma Digital.

**Características clave:**

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Computación rápida**: Rápido de calcular para cualquier entrada dada
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Irreversible**: Es computacionalmente inviable revertir el hash para encontrar la entrada original
- **Vulnerable a colisiones**: Las vulnerabilidades conocidas hacen posible encontrar colisiones

**Estado de seguridad:**
⚠️ **SHA-1 está criptográficamente roto y no debe usarse para aplicaciones críticas de seguridad**. Los ataques teóricos se demostraron en 2005, y los ataques prácticos de colisión se lograron en 2017.

**Usos comunes (históricos):**

- Firmas digitales y certificados (obsoleto)
- Sistema de control de versiones Git (por compatibilidad)
- Sistemas heredados que requieren SHA-1
- Verificación de integridad de archivos (no crítico para seguridad)
- Algoritmos de prueba de trabajo (algunas criptomonedas más antiguas)

**Alternativas recomendadas:**

- SHA-256 o SHA-3 para nuevas aplicaciones
- SHA-512 para requisitos de alta seguridad
