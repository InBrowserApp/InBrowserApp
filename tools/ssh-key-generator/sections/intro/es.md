## ¿Qué es un par de claves SSH?

Un par de claves SSH es una clave pública y una clave privada que se usan para autenticarse en servidores, hosts Git, sistemas de despliegue y otros servicios basados en SSH. La clave pública se puede compartir. La clave privada debe mantenerse en secreto.

Este generador crea claves Ed25519 o RSA con formato OpenSSH completamente en tu navegador. También muestra la huella SHA-256, que es el valor compacto que OpenSSH suele mostrar cuando verificas una clave.

## Cuándo usar esta herramienta

- Crea una clave de desarrollo para un servidor de prueba, remoto Git, contenedor o entorno de laboratorio temporal.
- Genera una clave Ed25519 cuando necesites un valor predeterminado moderno y compacto para un nuevo acceso SSH.
- Genera una clave RSA cuando un servicio antiguo no admita Ed25519.
- Copia una clave pública en `authorized_keys` manteniendo la clave privada en tu dispositivo.

## Cómo elegir un algoritmo

Ed25519 es el mejor valor predeterminado para la mayoría de las claves SSH nuevas porque es pequeña, rápida y ampliamente compatible con las versiones actuales de OpenSSH. RSA es útil para la compatibilidad con dispositivos antiguos, servidores Git heredados o requisitos de política que aún esperan claves RSA.

Para RSA, 4096 bits es un valor predeterminado conservador. Las claves más pequeñas de 2048 bits son más rápidas y siguen siendo habituales, pero muchos equipos ahora prefieren 3072 o 4096 bits para claves nuevas de larga duración.

## Qué debes tener en cuenta

- La clave privada producida aquí no está cifrada. Agrega una frase de contraseña con `ssh-keygen -p -f <key-file>` si necesitas una.
- Guarda la clave privada con permisos restrictivos, como `chmod 600 <key-file>`.
- No pegues claves privadas en tickets, chats, registros ni páginas web desconocidas.
- Rota las claves cuando pueda haberse expuesto un portátil, un secreto de CI o una copia de seguridad que contenga la clave privada.
