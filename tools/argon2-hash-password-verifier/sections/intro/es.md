## ¿Qué es la verificación de Argon2?

La verificación de Argon2 comprueba si una contraseña sin formato produce el mismo hash Argon2 codificado que se almacenó anteriormente. El hash codificado contiene la variante de Argon2, los parámetros de coste, la sal y el digest, por lo que un verificador puede repetir el mismo trabajo sin necesitar ajustes separados.

## Cuándo usar esta herramienta

- Confirmar que una contraseña copiada y un hash Argon2 almacenado corresponden entre sí
- Depurar problemas de inicio de sesión o migración al mover registros de contraseñas entre sistemas
- Inspeccionar la variante y los parámetros de coste dentro de un hash Argon2 codificado
- Probar hashes que usan un secreto opcional del lado del servidor, a menudo llamado pepper

## Cómo verificar de forma segura

1. Pega la contraseña que quieres comprobar.
2. Pega el hash codificado completo, como una cadena que empiece por `$argon2id$`.
3. Introduce el secreto solo si el hash original se creó con uno.
4. Ejecuta la verificación y lee el resultado de coincidencia, no coincidencia o hash no válido.

## Notas de seguridad

La verificación ocurre localmente en tu navegador, pero las contraseñas y los hashes pegados pueden permanecer en la memoria del navegador hasta que restablezcas el formulario o cierres la pestaña. Evita usar credenciales de producción en dispositivos compartidos. Para sistemas nuevos de almacenamiento de contraseñas, Argon2id suele ser la variante de Argon2 preferida porque equilibra la resistencia frente a canales laterales y GPU.
