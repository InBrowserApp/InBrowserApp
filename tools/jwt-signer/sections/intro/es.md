## ¿Qué es un firmador de JWT?

Un firmador de JWT crea un JSON Web Token compacto al serializar un encabezado y un payload, y luego firmarlos con un secreto o una clave privada. El resultado es el token de tres partes `header.payload.signature` que utilizan muchos sistemas de API, OAuth y sesiones.

## Cuándo usar esta herramienta

- Crea tokens de prueba locales para desarrollo de API, entornos de staging y demos.
- Compara cómo distintos algoritmos cambian el encabezado y la firma del token.
- Agrega claims como `sub`, `iss`, `aud`, `exp`, `iat`, `scope` o campos personalizados de la aplicación sin escribir un script temporal.
- Genera tokens con secretos compartidos HMAC o con claves privadas RSA/ECDSA en formato PKCS#8 PEM o JWK.

## Qué comprobar antes de usar un token firmado

- Haz coincidir el algoritmo con el tipo de clave: `HS*` usa un secreto compartido, `RS*` y `PS*` usan claves privadas RSA, y `ES*` usa claves privadas EC.
- Agrega claims de expiración y audiencia cuando el servicio receptor las espere.
- Mantén las claves privadas de producción fuera de navegadores y máquinas compartidas. Esta herramienta se ejecuta localmente, pero no puede proteger las claves de un dispositivo que ya está comprometido.
- Recuerda que firmar no es cifrar. Cualquier persona que reciba el token puede decodificar el encabezado y el payload.
