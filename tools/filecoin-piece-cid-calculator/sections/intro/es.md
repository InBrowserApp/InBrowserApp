## Calcula un Piece CID de un archivo CAR o de cualquier otro archivo

Elige el archivo exacto que vas a enviar a un proveedor de almacenamiento de Filecoin. Selecciona **Calcular Piece CID** y copia el identificador que necesites. La herramienta también muestra en bytes el tamaño de la pieza tras el relleno. El navegador lee el archivo en tu dispositivo y lo procesa por fragmentos, de modo que el contenido permanece en el dispositivo.

## ¿Qué formato debo usar?

**Piece CID (v2)** sigue [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Por lo general, empieza por `bafkzci` e incluye la información sobre el tamaño de los datos que necesitan las herramientas más recientes de Filecoin. **CommP anterior (v1)** suele empezar por `baga6ea4` y se usa en los acuerdos de almacenamiento tradicionales de Filecoin. Si tu flujo de trabajo pide un Piece CID anterior y el tamaño de la pieza tras el relleno, copia el compromiso anterior y usa el tamaño que se muestra junto a él. Puedes pegar cualquiera de los dos formatos para verificar un compromiso existente con tu archivo.

## ¿Por qué mi CID de IPFS tiene otro aspecto?

Un CID raíz de IPFS identifica un bloque o la raíz de un archivo o directorio. Un Piece CID de Filecoin es un compromiso criptográfico sobre los bytes exactos de los datos que se van a almacenar, tras aplicar las reglas de relleno y de cálculo de hash de Filecoin. Si los datos son un archivo CAR, calcula el compromiso a partir del propio archivo. Dos archivos CAR pueden tener el mismo CID raíz de IPFS y guardar los bloques en un orden distinto, lo que puede cambiar el Piece CID. Al enviar un acuerdo de almacenamiento, usa el mismo archivo con el que hiciste el cálculo.

Consulta las reglas de formato y relleno en la [especificación de piezas de Filecoin](https://spec.filecoin.io/systems/filecoin_files/piece/).
