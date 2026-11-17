## Inspecione arquivos Parquet no navegador

Abra ou solte um arquivo `.parquet` para navegar pelos dados e inspecionar o tipo físico, a anotação lógica e a repetição de cada campo. Os grupos aninhados permanecem visíveis no esquema. O resumo mostra a quantidade de linhas, as colunas, os grupos de linhas, a compressão e o criador do arquivo, quando disponível. Você pode experimentar o exemplo incluído sem escolher um arquivo.

## Navegue pelos dados e exporte CSV ou JSON

Os dados são carregados uma página por vez. Use os controles de página para navegar pelo arquivo e selecione uma célula para ler seu valor completo. Alterne para **Esquema** para inspecionar os campos. Use **Exportar dados** para baixar a página atual ou todas as linhas como CSV em UTF-8 ou um array JSON. As exportações do arquivo inteiro são preparadas em lotes e podem ser canceladas.

CSV inclui os nomes das colunas e coloca entre aspas os valores com vírgulas, aspas e quebras de linha. Valores null tornam-se campos CSV vazios e permanecem `null` em JSON. Valores aninhados usam JSON; valores binários usam texto hexadecimal. Para preservar inteiros de 64 bits, JSON os escreve como strings. Datas e carimbos de data/hora usam texto ISO, com precisão de milissegundos. Decimais seguem a precisão numérica do leitor; por isso, este visualizador não é uma ferramenta de conversão sem perdas para decimais ou carimbos de data/hora de alta precisão.

## Processamento local

Seu arquivo é lido localmente em um worker em segundo plano e nunca é enviado. O visualizador lê primeiro o rodapé e, depois, apenas os intervalos de linhas necessários para a navegação. A decodificação de grupos de linhas Parquet ainda pode exigir bastante memória; o tamanho da exportação é limitado pela memória disponível no navegador. Dados sem compressão e os codecs Snappy, Gzip, Brotli, Zstandard e LZ4 são compatíveis com hyparquet e seu pacote de compressores. Arquivos Parquet criptografados não são compatíveis.
