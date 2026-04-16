## ¿Qué es SHA3-512 (FIPS 202)?

SHA3-512 (FIPS 202) (Algoritmo de Hash Seguro de 512 bits) es una función hash criptográfica que produce un valor hash de 512 bits (64 bytes), típicamente representado como un número hexadecimal de 128 caracteres. Es parte de la familia de funciones hash SHA-3 estandarizadas por el NIST (FIPS 202).

**Características clave:**

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Computación rápida**: Rápido de calcular para cualquier entrada dada
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Irreversible**: Es computacionalmente inviable revertir el hash para encontrar la entrada original
- **Resistente a colisiones**: Muy difícil encontrar dos entradas diferentes que produzcan el mismo hash

**Usos comunes:**

- Firmas digitales y certificados
- Blockchain y criptomonedas (algunos sistemas usan SHA3-512 (FIPS 202))
- Almacenamiento de contraseñas (con salado apropiado)
- Verificación de integridad de archivos
- Algoritmos de prueba de trabajo
