## Consultar metadados de NFT pelo endereço do contrato e pelo ID do token

Cole um endereço da rede principal do Ethereum em **Endereço do contrato** e introduza o **ID do token**. Em seguida, selecione **Ver metadados**. O ID do token pode ser um número decimal, como `1`, ou hexadecimal, como `0x1`. Selecione **Experimentar um exemplo** para ver uma consulta completa. O visualizador faz um pedido RPC ao Ethereum no seu navegador apenas para consultar dados. Assim, pode consultar um token público sem ligar uma carteira.

## Encontrar o URI do token, a imagem, as características e o JSON

O visualizador lê `tokenURI` para ERC-721 ou `uri` para ERC-1155. O **URI do token** é a sequência de caracteres devolvida pelo contrato. O visualizador lê os metadados para os quais o URI aponta e mostra a imagem, o nome e as características quando esses campos estão disponíveis. Utilize **JSON em bruto** para examinar ou copiar a resposta sem alterações. São suportados URI de IPFS, HTTP e Arweave, bem como URI de dados com JSON incorporado.

## Como funciona a substituição do ID do token ERC-1155

Um contrato ERC-1155 pode devolver um modelo comum a vários tokens. O visualizador substitui `{id}` pelo ID do token com 64 dígitos hexadecimais em minúsculas, zeros à esquerda e sem o prefixo `0x`. Se o modelo mudar com a substituição, **URI resolvido** mostra o endereço consultado para esse token. A mesma substituição é aplicada aos campos de pré-visualização, como a ligação para a imagem.

## O que fazer se o URI do token aparecer sem imagem?

Um contrato pode devolver um URI mesmo quando o servidor web ou o gateway IPFS está temporariamente indisponível. O visualizador permite copiar o URI mesmo quando não consegue carregar os metadados. Se o JSON estiver disponível, examine o campo `image` e experimente abrir a fonte diretamente. Os servidores HTTP também podem restringir pedidos entre origens, o que limita os dados que o navegador consegue ler.

Consulte o [padrão ERC-721](https://eips.ethereum.org/EIPS/eip-721), a [especificação de metadados ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) e o [guia de metadados da OpenSea](https://docs.opensea.io/docs/metadata-standards) para conhecer os campos utilizados habitualmente pelas aplicações de NFT.
