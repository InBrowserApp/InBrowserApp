## ¿Qué es un hash de texto o archivo?

Una función hash convierte texto o bytes de archivo en un resumen de longitud fija. La misma entrada y el mismo algoritmo siempre producen el mismo resumen, por lo que los hashes son útiles cuando necesitas una huella repetible sin subir datos privados.

## Cuándo usar esta herramienta

Usa esta herramienta para verificar sumas de comprobación de descargas, comparar si dos archivos son idénticos, registrar una huella rápida de un fragmento de texto o depurar sistemas que publican resúmenes SHA. Al importar un archivo, se calcula el hash de sus bytes directamente, mientras que el modo de texto calcula el hash del texto UTF-8 que aparece en el editor.

## Cómo elegir un algoritmo

SHA-256 es una opción predeterminada sólida para nuevas comprobaciones de integridad. SHA-384 y SHA-512 proporcionan resúmenes SHA-2 más largos cuando otro sistema espera esos formatos. SHA-1 se incluye para comparaciones con sistemas heredados, pero no debe usarse en nuevos diseños sensibles a la seguridad.

## Privacidad y limitaciones

El cálculo del hash se ejecuta localmente en tu navegador mediante Web Crypto y los archivos no se suben. Un hash no es cifrado: no puede proteger un secreto por sí solo, y el almacenamiento de contraseñas necesita una función dedicada de hash de contraseñas con sal y factor de trabajo.
