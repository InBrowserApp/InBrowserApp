Un enlace magnet identifica un torrent de BitTorrent mediante su hash. También puede incluir un nombre para mostrar, direcciones de rastreadores, semillas web o una fuente de metadatos. Para consultar los nombres y tamaños de los archivos, el cliente debe obtener los metadatos del torrent.

## Cómo inspeccionar un enlace magnet

Pega un enlace `magnet:?` y pulsa «Buscar metadatos». El visor muestra el hash y, si el enlace los incluye, el nombre y las direcciones de los rastreadores. Cuando WebTorrent obtiene los metadatos, el visor muestra el nombre del torrent, las rutas y tamaños de los archivos, el tamaño total y la información sobre las piezas. Puedes filtrar la lista de archivos y copiar el hash.

## Por qué algunos enlaces magnet no funcionan

En el navegador, WebTorrent necesita pares accesibles que admitan WebRTC. Suele encontrarlos mediante un rastreador WebSocket. Algunos enlaces también incluyen una fuente de metadatos HTTPS a la que el navegador puede acceder. Un enlace que funciona en un cliente de escritorio quizá no se resuelva a tiempo aquí. Si tienes el archivo `.torrent`, ábrelo en el visor de archivos torrent para consultar los metadatos de inmediato.

## A qué se conecta la búsqueda

La búsqueda se ejecuta en tu navegador. WebTorrent puede contactar con rastreadores, pares o una fuente de metadatos del torrent que has solicitado. Esos servicios pueden ver tu dirección IP y el torrent que consultas. El visor solicita los metadatos sin descargar los archivos que aparecen en ellos. Los enlaces magnet requieren un hash de BitTorrent v1 (`btih`), incluidos los enlaces que también identifican un torrent v2.
