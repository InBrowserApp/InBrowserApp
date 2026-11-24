## Consulta metadatos NFT con la dirección del contrato y el ID del token

Pega la dirección de un contrato de la red principal de Ethereum en **Dirección del contrato** e introduce el **ID del token**. Después, selecciona **Ver metadatos**. El ID del token puede ser un número decimal, como `1`, o un número hexadecimal, como `0x1`. Selecciona **Probar un ejemplo** para ver una consulta completa. El visor realiza una solicitud RPC de solo lectura a Ethereum desde tu navegador, por lo que puedes consultar un token público sin conectar una cartera.

## Encuentra el URI del token, la imagen, los rasgos y el JSON

El visor lee `tokenURI` para ERC-721 o `uri` para ERC-1155. El **URI del token** es la cadena que devuelve el contrato. El visor lee los metadatos a los que apunta y muestra la imagen, el nombre y los rasgos cuando esos campos están disponibles. Usa **JSON sin modificar** para examinar o copiar la respuesta original. Admite URI de IPFS, HTTP y Arweave, así como URI de datos con JSON integrado.

## Cómo funciona la sustitución del ID del token ERC-1155

Un contrato ERC-1155 puede devolver un patrón compartido por varios tokens. El visor sustituye `{id}` por el ID del token representado con 64 dígitos hexadecimales en minúsculas, con ceros a la izquierda y sin el prefijo `0x`. Al aplicar la sustitución, **URI resuelto** muestra la dirección consultada para ese token. La misma sustitución se aplica a campos de la vista previa, como el enlace a la imagen.

## ¿Qué pasa si aparece el URI del token sin imagen?

Un contrato puede devolver un URI aunque su servidor web o su pasarela IPFS no estén disponibles temporalmente. El visor mantiene el URI disponible para copiarlo aunque no pueda cargar los metadatos. Si el JSON está disponible, examina el campo `image` y prueba la fuente directamente. Los servidores HTTP también pueden restringir las solicitudes entre orígenes, lo que afecta a los datos que puede leer el navegador.

Consulta los campos que suelen usar las aplicaciones de NFT en el [estándar ERC-721](https://eips.ethereum.org/EIPS/eip-721), la [especificación de metadatos ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) y la [guía de metadatos de OpenSea](https://docs.opensea.io/docs/metadata-standards).
