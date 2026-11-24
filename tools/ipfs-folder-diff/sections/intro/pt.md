## Comparar os CID de duas pastas do IPFS

Cole o endereço da pasta original em **Pasta anterior** e o da versão atualizada em **Pasta mais recente**. Em seguida, selecione **Comparar pastas**. Cada campo aceita um CID, um endereço `ipfs://` ou uma ligação HTTP de um gateway. Inclua um caminho para comparar duas subpastas. Abra um resultado para ver os respetivos CID, utilize **Filtrar por caminho** para restringir a lista ou selecione **Descarregar JSON** para guardar a comparação.

## Quando é que um caminho é considerado adicionado, removido ou alterado?

Um caminho que só existe numa das pastas é marcado como adicionado ou removido. Uma subpasta adicionada ou removida na íntegra aparece como um único caminho. Quando ambas as versões contêm uma subpasta com CID diferentes, a ferramenta compara os caminhos no seu interior. A lista de caminhos alterados inclui ficheiros ou ligações simbólicas com CID diferentes e caminhos cujo tipo de entrada mudou. Os ficheiros importados com definições de segmentação ou codificação diferentes podem ter CID diferentes mesmo quando o conteúdo visível é igual.

## Comparar versões do IPFS sem descarregar todos os ficheiros

O navegador lê blocos verificados do IPFS através de gateways públicos e ignora os ramos cujos CID já coincidem. Isto permite comparar versões de um site, de um conjunto de dados publicado ou de uma cópia de segurança através dos endereços imutáveis das respetivas pastas. É possível comparar as ligações alteradas sem descarregar os ficheiros completos. Se uma entrada não estiver disponível, o resultado indica os caminhos que não foi possível comparar.

Saiba mais sobre o [endereçamento por conteúdo e as versões de conjuntos de dados](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
