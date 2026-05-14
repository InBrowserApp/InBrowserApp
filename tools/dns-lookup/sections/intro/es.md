Búsqueda DNS comprueba los registros DNS públicos devueltos para un nombre
de dominio. Es útil cuando verificas el lanzamiento de un sitio nuevo,
depuras la entrega de correo, revisas cambios en una CDN o un balanceador
de carga, o confirmas si las respuestas relacionadas con DNSSEC se ven
distintas entre resolvedores.

## Cuándo usarla

Usa esta herramienta cuando necesites una respuesta rápida desde el navegador
para tipos de registro DNS comunes. Los registros A y AAAA muestran destinos
IPv4 e IPv6, los registros CNAME muestran alias, los registros MX identifican
intercambiadores de correo, los registros TXT suelen contener SPF o tokens de
verificación, y los registros NS/SOA/CAA/SRV/HTTPS/SVCB exponen pistas de
delegación, autoridad, certificado, servicio y endpoints modernos.

## Cómo funciona

La consulta se ejecuta en tu navegador con DNS sobre HTTPS. Elige un
resolvedor, selecciona uno o más tipos de registro y envía un dominio o URL.
Las URL se normalizan a su hostname antes de enviar la consulta, así que pegar
`https://www.example.com/path` consulta `www.example.com`.

## Leer los resultados

Cada tipo de registro se muestra por separado con el código de respuesta DNS,
los indicadores del resolvedor, las filas de respuesta y el JSON sin procesar.
`NoError` significa que el servidor DNS respondió correctamente, pero aun así
puede devolver cero filas de respuesta para un tipo específico. `NXDomain`,
`ServFail` o `Refused` suele significar que el nombre no existe, que el
resolvedor no pudo completar la consulta o que la política del resolvedor
bloqueó la solicitud.

## Privacidad y limitaciones

Las consultas se envían al resolvedor DNS sobre HTTPS seleccionado, no a un
servidor de InBrowser.App. El comportamiento del resolvedor, el estado de la
caché, la validación DNSSEC y el filtrado de la red local pueden afectar los
resultados. Esta herramienta no reemplaza comprobaciones autoritativas con
`dig` desde varias redes, pero es una forma rápida de inspeccionar lo que
devuelven los resolvedores DoH públicos desde tu navegador actual.
