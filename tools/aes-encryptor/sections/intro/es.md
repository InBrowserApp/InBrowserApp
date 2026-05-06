# ¿Qué es el cifrado AES?

AES es un algoritmo de cifrado simétrico, lo que significa que se usa el mismo secreto para cifrar y descifrar los datos. Esta herramienta se ejecuta por completo en tu navegador y usa la Web Crypto API, por lo que el texto sin cifrar, las contraseñas y los archivos seleccionados no se suben.

El modo predeterminado es AES-GCM porque cifra y autentica la salida. La autenticación importa: si el texto cifrado, la sal o el IV cambian más adelante, el descifrado debería fallar en lugar de devolver datos alterados. AES-CBC y AES-CTR están disponibles por compatibilidad, pero no autentican el texto cifrado por sí solos.

## Cuándo usar esta herramienta

Úsala cuando necesites proteger una nota, un token, un fragmento de configuración o un archivo pequeño antes de almacenarlo o compartirlo por otro canal. La salida es un contenedor JSON que incluye el modo, la configuración de derivación de clave, la sal, el IV y el texto cifrado, de modo que esos parámetros permanecen juntos para el paso de descifrado correspondiente.

Para el cifrado basado en contraseña, la contraseña se procesa con PBKDF2 y una sal aleatoria. Aumenta el número de iteraciones cuando puedas tolerar un cifrado y descifrado más lentos. Para el cifrado con clave sin procesar, pega una clave hexadecimal con exactamente la longitud seleccionada: 32 caracteres hexadecimales para 128 bits, 48 para 192 bits o 64 para 256 bits.

## Notas prácticas

Mantén la contraseña o la clave sin procesar separada del JSON cifrado. Cualquier persona con el JSON y el material de clave puede descifrar los datos. Si cifras un archivo, descarga el resultado JSON y conserva el nombre original del archivo por separado si ese contexto importa.

No reutilices un IV manual con la misma clave. Esta herramienta genera un IV y una sal nuevos en cada ejecución, que es el valor predeterminado más seguro. Prefiere AES-GCM salvo que otro sistema requiera específicamente AES-CBC o AES-CTR.
