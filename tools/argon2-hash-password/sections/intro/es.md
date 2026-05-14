## ¿Qué es Argon2?

Argon2 es un algoritmo de hash de contraseñas diseñado para encarecer el descifrado de contraseñas sin conexión. Combina cálculo repetido con un coste de memoria configurable, de modo que los atacantes necesitan tiempo y memoria para cada intento de contraseña.

**Por qué Argon2id suele ser la opción predeterminada:**

- Equilibra la resistencia a ataques de canal lateral y al descifrado con GPU mejor que usar Argon2i o Argon2d en la mayoría de los sistemas de almacenamiento de contraseñas
- La salida codificada almacena el algoritmo, la versión, la memoria, la iteración, el paralelismo, la sal y el hash en una sola cadena portátil
- Una sal aleatoria única evita que contraseñas idénticas produzcan hashes almacenados idénticos
- Los ajustes de memoria e iteraciones pueden aumentarse a medida que tu entorno de verificación se vuelve más rápido

**Cómo usar esta herramienta:**

1. Introduce la contraseña que quieres convertir en hash.
2. Conserva la sal generada o crea una nueva sal aleatoria.
3. Elige la variante de Argon2 y ajusta la memoria, las iteraciones, el paralelismo y la longitud del hash para el sistema que verificará el hash.
4. Genera el hash codificado y almacena esa cadena completa en la base de datos de tu aplicación.

**Notas de seguridad:**

- No almacenes ni registres la contraseña en texto plano.
- Usa una nueva sal aleatoria para cada contraseña.
- Usa el secreto opcional solo si tu verificador también tiene ese mismo secreto; de lo contrario, el hash no podrá verificarse más adelante.
- Prefiere los ajustes de memoria e iteraciones más altos que mantengan una latencia de inicio de sesión aceptable para usuarios reales.
