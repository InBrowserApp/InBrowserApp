## Validar metadados JSON de NFT antes de cunhar

Escolha **Ficheiros locais** para verificar ficheiros JSON individuais ou uma pasta da coleção no seu dispositivo. O verificador mostra, em cada elemento, erros de JSON e problemas frequentes nos metadados, como nomes vazios, imagens em falta, descrições inválidas e atributos mal formados. Utilize **A rever** para encontrar as entradas a corrigir ou descarregue o relatório completo em JSON.

## Verificar URI de tokens em lote

Em **URI de tokens**, cole um endereço de metadados por linha. Para coleções numeradas, utilize **Padrão de URI** com um marcador como `https://example.com/metadata/{id}.json`. Indique o primeiro e o último ID para verificar o intervalo, incluindo ambos os limites. O formato decimal utiliza o ID tal como foi introduzido. **Hexadecimal ERC-1155** representa cada ID com 64 caracteres hexadecimais em minúsculas e zeros à esquerda, de acordo com as regras de substituição de `{id}` do ERC-1155.

## Verificar ligações para imagens e animações de NFT

Ative **Verificar acesso aos conteúdos multimédia** para verificar as ligações em `image` e `animation_url`. Selecione toda a pasta local para incluir os conteúdos multimédia referenciados por caminhos relativos. O navegador também pode verificar recursos HTTP, IPFS e Arweave. Um erro no gateway, um tempo de espera esgotado ou uma restrição entre origens podem impedir a confirmação de uma ligação. Verifique essas ligações no gateway ou mercado que utiliza. Os ficheiros locais são verificados no navegador. Para verificar URI, o navegador contacta o servidor ou gateway correspondente.

Consulte as definições dos campos e as regras de substituição nos URI de tokens no [guia de metadados da OpenSea](https://docs.opensea.io/docs/metadata-standards) e na [especificação de metadados ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
