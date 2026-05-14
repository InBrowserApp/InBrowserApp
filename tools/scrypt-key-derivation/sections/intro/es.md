## ¿Qué es scrypt?

scrypt es una función de derivación de claves basada en contraseñas (KDF) resistente por memoria. Convierte una contraseña y una sal en bytes de clave deterministas mientras consume deliberadamente tiempo de CPU y memoria, lo que encarece los intentos masivos de adivinar contraseñas frente al hashing simple.

**Puntos clave:**

- Usa `N` (factor de coste), `r` (tamaño de bloque) y `p` (paralelismo)
- Valores más altos de `N` y `r` aumentan el coste de memoria y cómputo
- Produce la misma clave derivada solo cuando coinciden la contraseña, la sal, los parámetros y la longitud de salida

**Buenas prácticas:**

- Usa una sal aleatoria única para cada contraseña o secreto
- Guarda `N`, `r`, `p`, el formato de la sal y la longitud de salida junto a la clave derivada
- Ajusta los parámetros en el dispositivo más lento que necesites admitir antes de usarlos en producción
