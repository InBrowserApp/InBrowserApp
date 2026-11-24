## Genera un registro TXT de DNSLink para IPFS

DNSLink dirige un dominio o subdominio a una ruta de contenido. Introduce tu dominio y pega un CID de IPFS o una ruta de IPFS o IPNS. Copia el **Nombre** y el **Valor TXT** generados en un nuevo registro TXT de tu proveedor de DNS. Por ejemplo, para el dominio `www.example.com`, el nombre del registro es `_dnslink.www.example.com`. Si el editor de DNS añade `example.com` automáticamente, escribe `_dnslink.www` en el campo del nombre.

## Comprueba adónde apunta tu DNSLink

Selecciona **Comprobar registro publicado** para ver las respuestas TXT de Cloudflare y Google. Deja el destino en blanco para consultar una configuración existente, o introduce el destino que quieres usar para compararlo con el valor publicado. Después de un cambio, los resolutores pueden devolver un valor anterior hasta que caduque su caché. El TTL indica cuánto tiempo puede permanecer en caché la respuesta DNS recibida.

## Actualiza un sitio IPFS con un dominio personalizado

Usa un CID de IPFS para apuntar directamente a una versión fija de tus archivos, o una ruta de IPNS para seguir un nombre que se puede actualizar. DNSLink indica a los clientes y pasarelas compatibles qué contenido deben resolver. Para servir ese contenido desde tu propio dominio por HTTPS, configura una pasarela compatible con DNSLink y haz que tu dominio apunte a ella. [Dominios personalizados y DNSLink en IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
