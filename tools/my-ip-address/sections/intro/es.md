## Lo que muestra esta herramienta

Esta herramienta busca las direcciones IPv4 e IPv6 públicas que los servicios externos pueden ver desde su sesión actual del navegador. Si el navegador también puede exponer candidatos de interfaz local a través de WebRTC, la herramienta los enumera por separado.

## Por qué los resultados de IPv4, IPv6 y WebRTC pueden ser diferentes

Su dirección IPv4 y su dirección IPv6 pueden provenir de diferentes rutas de red, ISP o configuraciones de túnel. Los candidatos a WebRTC pueden incluir direcciones LAN privadas, direcciones de interfaz IPv6 temporales o rutas relacionadas con VPN que los sitios web normales no siempre muestran directamente.

## Cómo funciona la búsqueda

La herramienta consulta proveedores de IP públicos como Cloudflare, geojs.io, ip.sb e ipify.org, luego enriquece la dirección detectada con nombre de host, ASN, organización, país, zona horaria y metadatos de coordenadas cuando estén disponibles. Esto significa que la herramienta necesita una conexión a Internet activa y depende de la calidad de respuesta de esos servicios de terceros.

## Por qué podría faltar una dirección

Es posible que una dirección no aparezca si su red bloquea una familia de protocolos, su VPN o proxy filtra la solicitud, su navegador desactiva la exposición a WebRTC o el servicio de búsqueda ascendente no está disponible temporalmente. Si IPv6 no está disponible en su red, es normal ver solo IPv4.
