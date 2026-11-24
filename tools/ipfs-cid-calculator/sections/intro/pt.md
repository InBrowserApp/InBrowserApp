## Calcular o CID de um ficheiro ou de uma pasta

Escolha um ficheiro ou uma pasta no seu dispositivo e selecione **Calcular CID**. Copie o identificador de conteúdo (CID) para o guardar num manifesto ou comparar com o de uma importação anterior do IPFS. O cálculo é feito no navegador e os ficheiros ficam no seu dispositivo.

## Por que razão pode o mesmo ficheiro ter diferentes CID do IPFS?

O IPFS pode dividir um ficheiro em blocos e guardar as ligações entre eles com o UnixFS. O CID de raiz depende de como esses blocos são divididos, codificados e organizados. Para reproduzir um CID, utilize o mesmo tamanho de segmento, a mesma definição de blocos folha e a mesma estrutura de pastas da importação original. O CID de uma pasta também inclui os nomes das suas entradas. O seletor de pastas do navegador omite as subpastas vazias.

## Reproduzir o CID com o Kubo

Abra as **Definições de importação** para alterar a versão do CID, o tamanho dos segmentos, o formato dos blocos folha ou o envolvimento numa pasta. A versão predefinida é CIDv1. Utilize CIDv0 para reproduzir uma importação antiga que tenha usado essa versão. **Envolver numa pasta** acrescenta uma pasta exterior para poder aceder ao ficheiro pelo nome a partir do CID de raiz.

Copie o comando `ipfs add --only-hash` apresentado para repetir o cálculo no Kubo com o mesmo ficheiro ou pasta. Se tiver um CID de uma importação anterior, cole-o no campo de comparação. Um CIDv0 e um CIDv1 equivalentes coincidem porque identificam o mesmo bloco. [Documentação do IPFS sobre identificadores de conteúdo](https://docs.ipfs.tech/concepts/content-addressing/)
