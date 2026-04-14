## ¿Qué es Adler-32?

Adler-32 es un algoritmo de checksum rápido que produce un valor de 32 bits (normalmente 8 caracteres hexadecimales). Está diseñado para detectar errores accidentales, no para seguridad criptográfica.

**Puntos clave:**

- **Rápido y determinista**: La misma entrada siempre genera la misma salida
- **Verificación de integridad**: Útil para detectar corrupción en transferencia o almacenamiento
- **No criptográfico**: No usar para contraseñas, firmas ni protección antifraude

**Usos comunes:**

- Verificación de transferencia de archivos
- Verificación de paquetes/archivos comprimidos
- Comprobaciones ligeras de integridad
