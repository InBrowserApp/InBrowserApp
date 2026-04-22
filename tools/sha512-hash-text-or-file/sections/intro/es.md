## ¿Qué es SHA-512?

SHA-512 (Algoritmo de Hash Seguro de 512 bits) es una función hash criptográfica que produce un valor hash de 512 bits (64 bytes), típicamente representado como un número hexadecimal de 128 caracteres. Es parte de la familia de funciones hash SHA-2 diseñadas por la NSA y publicadas por el NIST.

**Características clave:**

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Computación rápida**: Rápido de calcular para cualquier entrada dada
- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes
- **Irreversible**: Es computacionalmente inviable revertir el hash para encontrar la entrada original
- **Resistente a colisiones**: Muy difícil encontrar dos entradas diferentes que produzcan el mismo hash

**Usos comunes:**

- Firmas digitales y certificados
- Blockchain y criptomonedas (Bitcoin usa SHA-256, pero SHA-512 se usa en otros sistemas)
- Almacenamiento de contraseñas (con salado apropiado)
- Verificación de integridad de archivos
- Algoritmos de prueba de trabajo
