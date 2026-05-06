## ¿Qué es una huella de clave pública SSH?

Una huella de clave pública SSH es un resumen corto del blob de clave pública. Te da un valor compacto para comparar antes de confiar en una clave en `authorized_keys`, un inventario de servidores o un flujo de despliegue.

OpenSSH suele mostrar huellas SHA-256 como `SHA256:...`. La documentación antigua y algunas auditorías todavía usan huellas MD5 separadas por dos puntos. Esta herramienta muestra ambas para que puedas compararlas con la salida moderna de SSH y con registros heredados sin enviar la clave a ningún sitio.

Pega una sola clave pública, varias líneas de `authorized_keys` o un bloque de clave pública SSH2. El analizador omite comentarios y opciones de authorized_keys, lee el blob real de la clave SSH y calcula las huellas localmente en tu navegador.

- Verifica que una clave pública copiada coincida con la huella compartida por un compañero.
- Compara entradas de `authorized_keys` con una lista de acceso del servidor.
- Inspecciona el tipo de clave, el tamaño de clave, la curva y el comentario antes de copiar una huella.
