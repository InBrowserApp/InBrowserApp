El descifrado AES restaura el texto sin cifrar a partir de datos cifrados con el mismo material de clave AES. Esta herramienta está diseñada para el contenedor JSON producido por el Cifrador AES de InBrowser.App. El contenedor mantiene juntos el algoritmo, la configuración de derivación de clave, la sal, el IV, el texto cifrado y los metadatos del texto sin cifrar, mientras que la contraseña o la clave sin procesar permanecen aparte.

Todo el trabajo ocurre localmente con la Web Crypto API del navegador. El JSON cifrado, la contraseña, la clave sin procesar y el resultado descifrado no se suben.

## Cuándo usar esta herramienta

Úsala cuando alguien te dé un contenedor JSON `inbrowser-aes-v1` o cuando necesites recuperar una nota, un token, un fragmento de configuración o un archivo que cifraste antes con la página correspondiente del Cifrador AES.

Si el contenedor se creó con una contraseña, introduce la misma contraseña y la herramienta reutilizará el hash de PBKDF2, el número de iteraciones, la sal, el modo AES y la longitud de clave guardados. Si el contenedor se creó con una clave sin procesar, pega la clave hexadecimal exacta con la longitud registrada en el contenedor.

## Notas prácticas

AES-GCM autentica los datos cifrados, por lo que las claves incorrectas o el JSON modificado deberían fallar en lugar de devolver texto sin cifrar alterado. AES-CBC y AES-CTR pueden descifrar contenedores compatibles, pero no autentican el texto cifrado por sí solos.

Mantén la contraseña o la clave sin procesar separada del contenedor JSON. Cualquier persona que tenga tanto el contenedor como el material de clave puede recuperar el texto sin cifrar. En los contenedores de archivo, la descarga recuperada usa el nombre de archivo original y el tipo de medio guardados en el JSON.
