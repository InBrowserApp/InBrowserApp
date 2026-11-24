## Valida metadatos JSON de NFT antes de acuñar

Elige **Archivos locales** para comprobar archivos JSON individuales o una carpeta de la colección en tu dispositivo. Elige directamente archivos numerados como `1` o `42`. El validador detecta JSON no válido y problemas comunes en los metadatos de cada elemento, como nombres vacíos, imágenes ausentes, descripciones no válidas y atributos mal formados. Usa **Requieren revisión** para encontrar las entradas que debes corregir o descarga el informe completo en JSON.

## Comprueba URI de tokens por lotes

En **URI de tokens**, pega una dirección de metadatos por línea. Para colecciones numeradas, usa **Patrón de URI** con un marcador como `https://example.com/metadata/{id}.json`. Indica el primer y el último ID para comprobar el intervalo, incluidos ambos extremos. El formato decimal usa el ID tal como lo introduces. **Hexadecimal ERC-1155** representa cada ID con 64 caracteres hexadecimales en minúsculas y ceros a la izquierda, según las reglas de sustitución de `{id}` de ERC-1155. El validador también sustituye `{id}` en los valores de metadatos, como los enlaces a imágenes.

## Comprueba enlaces de imágenes y animaciones de NFT

Activa **Comprobar la disponibilidad de los medios** para comprobar los enlaces de `image` y `animation_url`. Selecciona toda la carpeta local para incluir los recursos con rutas relativas. Una ruta que empieza por `/` se resuelve desde el nivel superior de la carpeta seleccionada. El navegador también puede comprobar recursos de HTTP, IPFS y Arweave. Un error de pasarela, el agotamiento del tiempo de espera o una restricción entre orígenes pueden impedir que se confirme un enlace. Revisa esos enlaces en la pasarela o el mercado que utilices. Los archivos locales se comprueban en el navegador. Para comprobar URI, el navegador se conecta al servidor o a la pasarela correspondientes.

Consulta las definiciones de los campos y la sustitución de URI de tokens en la [guía de metadatos de OpenSea](https://docs.opensea.io/docs/metadata-standards) y en la [especificación de metadatos ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
