## ¿Qué es chmod?

`chmod` ("change mode") es un comando de Unix/Linux para cambiar los permisos de archivos y directorios. Esta calculadora te permite pasar entre permisos numéricos como `755`, permisos simbólicos como `rwxr-xr-x` y la matriz de casillas sin hacer las cuentas a mano.

## Cómo funcionan los permisos numéricos

Cada dígito representa un rol: propietario, grupo y otros. Dentro de cada dígito, `4` significa lectura, `2` escritura y `1` ejecución. Suma esos valores para obtener el permiso deseado: `7 = rwx`, `6 = rw-`, `5 = r-x` y `4 = r--`. En directorios, el bit de ejecución también permite entrar en el directorio.

## Ejemplos comunes de chmod

- `chmod 755 script.sh` da acceso total al propietario y permite que los demás lean y ejecuten.
- `chmod 644 notes.txt` mantiene el archivo editable por el propietario mientras los demás solo pueden leerlo.
- `chmod 600 .env` es una opción habitual para secretos privados porque solo el propietario puede leer o escribir.
- `chmod 775 shared-folder` es útil para directorios compartidos cuando el grupo también debe poder crear y modificar archivos.
