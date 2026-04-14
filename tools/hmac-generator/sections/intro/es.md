## ¿Qué es HMAC?

HMAC (Código de Autenticación de Mensajes basado en Hash) es un mecanismo criptográfico que combina una clave secreta con una función hash para verificar tanto la integridad como la autenticidad de un mensaje.

**Cómo funciona:**

1. La clave secreta se combina con el mensaje
2. Una función hash (como SHA-256) procesa los datos combinados
3. El resultado es un código de autenticación de tamaño fijo

**Casos de uso comunes:**

- **Autenticación de API**: Firmar solicitudes de API para verificar el remitente
- **Tokens JWT**: Utilizado en algoritmos HS256/HS384/HS512
- **Verificación de Mensajes**: Asegurar que los datos no han sido manipulados
- **Firmas de Webhook**: Validar cargas útiles de webhook

**Notas de seguridad:**

- Siempre use una clave secreta fuerte y aleatoria
- Mantenga su clave secreta confidencial
- Se recomienda SHA-256 o superior para nuevas aplicaciones
- SHA-1 se considera débil y debe evitarse para usos críticos de seguridad
