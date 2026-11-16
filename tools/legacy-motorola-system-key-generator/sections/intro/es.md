## ¿Qué es una clave de sistema Motorola de formato antiguo?

Una clave de sistema por software es un archivo `.KEY` que el software de programación Motorola compatible utiliza para permitir la edición de los ajustes protegidos de un sistema troncalizado. Este generador reproduce el formato antiguo derivado de BatLabs para un ID del sistema. Una clave de sistema es distinta de una clave de cifrado del tráfico de radio y, por sí sola, no concede acceso a una red de radio.

## Cómo usar este generador

1. Introduce un ID del sistema con 1–4 dígitos hexadecimales (`0–9`, `A–F`), sin el prefijo `0x`. Se aceptan letras minúsculas, y los ID cortos se rellenan con ceros a la izquierda: `ab` se convierte en `00AB`.
2. Comprueba el ID normalizado, el nombre de archivo y la vista previa hexadecimal.
3. Descarga el archivo binario `.KEY` y cárgalo en un software de programación antiguo compatible. El archivo tiene 27 bytes; el ID del sistema `1234` produce `SYS01234.KEY`.

## Límites de compatibilidad

Esta herramienta sigue un formato antiguo publicado; la compatibilidad depende del software de programación. No es compatible con ASTRO 25 Portable CPS (incluido XTS5000), APX CPS ni Advanced System Keys (ASK). Que el formato de bytes coincida con la referencia no confirma la compatibilidad con una radio o una versión de CPS concretas.

## Privacidad

La generación, la validación y las vistas previas de los archivos se ejecutan localmente en tu navegador. Tu ID del sistema y la clave generada no se envían a ningún servidor.
