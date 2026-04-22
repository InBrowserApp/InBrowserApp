## ¿Qué es el escape Unicode?

El escape Unicode convierte caracteres en secuencias codificadas que representan sus puntos de código Unicode. Esto es esencial cuando el código fuente, los archivos de configuración o los formatos de datos no pueden contener ciertos caracteres directamente.

**Formatos de escape comunes:**

- `\uXXXX` — JavaScript / JSON, utilizado en la mayoría de los lenguajes de programación
- `\u{XXXXX}` — JavaScript ES6+, admite caracteres suplementarios sin pares sustitutos
- `&#xXXXX;` / `&#DDDD;` — Entidades HTML en formato hexadecimal o decimal
- `U+XXXX` — Notación Unicode estándar utilizada en documentación
- `\xXX` / `%XX` — Codificación a nivel de bytes UTF-8, común en URLs y lenguajes tipo C
- `\UXXXXXXXX` — Formato de 8 dígitos de Python para cualquier punto de código
- `0xXXXX` — Notación literal hexadecimal

## Cuándo usar esta herramienta

- Incorporar caracteres no ASCII en código fuente o archivos de configuración que requieren codificación segura en ASCII
- Depurar texto ilegible inspeccionando los puntos de código Unicode subyacentes
- Convertir entre diferentes notaciones de escape al portar entre lenguajes o formatos
- Preparar texto para contextos JSON, HTML o URL que necesitan caracteres codificados como entidades

## Cómo funciona

Escribe o pega texto plano a la izquierda y la herramienta escapará los caracteres no ASCII usando el formato seleccionado. Pega texto escapado a la derecha y se auto-detectan y decodifican todos los formatos compatibles simultáneamente. Todo se ejecuta localmente en el navegador.
