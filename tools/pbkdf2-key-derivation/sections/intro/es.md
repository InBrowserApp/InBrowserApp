## ¿Qué es PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) deriva una clave criptográfica a partir de una contraseña usando una sal y muchas iteraciones. Ralentiza los ataques de fuerza bruta y produce claves diferentes cuando la sal cambia.

**Puntos clave:**

- Usa HMAC con un hash elegido (SHA-1/SHA-256/etc.)
- Más iteraciones aumentan el costo de cómputo
- La longitud de salida es configurable

**Buenas prácticas:**

- Use una sal única y aleatoria
- Prefiera más iteraciones dentro del rendimiento aceptable
- Para sistemas nuevos, considere KDF con memoria como Argon2 o scrypt
