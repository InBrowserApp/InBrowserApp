## What is a JWT decoder and verifier?

Un JSON Web Token es una cadena compacta con tres segmentos base64url: un encabezado, una carga y una firma. Esta herramienta decodifica el encabezado y la carga en tu navegador para que puedas inspeccionar la estructura del token sin enviarlo a un servidor.

La verificación de firma comprueba si el token se firmó con la clave y el algoritmo que esperas. Usa un secreto compartido para tokens HS256, HS384 o HS512. Usa una clave pública PEM, JWK o JWKS para tokens RS, PS y ES.

## When to use it

Usa el decodificador al depurar flujos de autenticación, comprobar claims de OAuth u OpenID Connect, comparar entornos o confirmar que un backend emite los valores esperados de audiencia, emisor, sujeto, expiración e identificador de clave.

Usa la verificación cuando tengas el secreto o la clave pública correspondiente y necesites confirmar que el encabezado, la carga y la firma todavía pertenecen al mismo token. La herramienta también resalta `exp`, `nbf` e `iat` para que los problemas comunes de reloj y expiración sean visibles de inmediato.

## Security notes

Las cargas de JWT solo están codificadas, no cifradas. Cualquier persona con el token puede leer sus claims, a menos que el token sea un JWE cifrado independiente, que esta herramienta no procesa.

No pegues tokens de producción ni secretos privados en máquinas compartidas. La herramienta se ejecuta localmente en tu navegador y no almacena el token ni el material de verificación, pero el flujo de trabajo más seguro sigue siendo usar tokens de prueba de corta duración y claves públicas siempre que sea posible.
