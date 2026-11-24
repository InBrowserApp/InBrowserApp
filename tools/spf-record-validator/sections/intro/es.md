## Cómo comprobar un registro SPF

Pega el valor de un solo registro TXT de DNS que empiece por `v=spf1` y selecciona Comprobar sintaxis. Si el valor aparece en DNS dividido en varias cadenas entre comillas, únelas en orden y conserva los espacios que contienen. El comprobador muestra cada mecanismo o modificador y señala los errores de sintaxis junto al texto que debes revisar. El valor que pegues permanece en tu navegador.

## Cómo funcionan los mecanismos y calificadores de SPF

SPF (Sender Policy Framework) permite que un dominio indique qué servidores pueden enviar correo en su nombre. El servidor receptor comprueba los mecanismos en orden. Por ejemplo, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` comprueba un bloque IPv4 y la política SPF de un proveedor antes del `-all` final. Los calificadores de un mecanismo indican éxito (`+`), fallo (`-`), fallo leve (`~`) o resultado neutro (`?`). El calificador predeterminado es `+`. Los modificadores como `redirect=` llevan un signo igual y carecen de calificador.

## Qué significa el recuento de consultas DNS

RFC 7208 permite evaluar hasta 10 términos que generen consultas DNS. El recuento muestra cuántos términos del registro que has pegado pueden generar esas consultas. Incluye `a`, `mx`, `include`, `exists`, `ptr` y un `redirect` activo. Un `include` o `redirect` puede añadir más términos, y una coincidencia puede detener la evaluación antes de tiempo. Para confirmar la política SPF en uso y el recuento completo, consulta el registro TXT publicado y los dominios a los que hace referencia.
