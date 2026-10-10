## Exporte uma planilha para um formato portátil

Abra um arquivo local .xlsx, .xlsm, .xltx ou .xltm ou solte-o no exportador. Escolha uma planilha pelo nome original, incluindo as planilhas ocultas, e selecione CSV, TSV, JSON ou Markdown. Visualize o resultado, copie-o ou baixe um arquivo UTF-8 com um nome baseado na pasta de trabalho e na planilha. Substituir ou fechar o arquivo cancela o trabalho pendente e remove os resultados anteriores disponíveis para download. O Visualizador de planilhas também oferece a ação Exportar planilha para a planilha atual.

O intervalo de células padrão é o menor retângulo que contém valores salvos ou fórmulas. As células e linhas vazias dentro desse retângulo permanecem no resultado. Você pode inserir outro intervalo, como A1:D20, e escolher Aplicar intervalo. Uma planilha vazia gera um arquivo de texto vazio ou um array JSON vazio, a menos que você escolha um intervalo explicitamente.

## Escolha como os valores e cabeçalhos são representados

O texto formatado segue os formatos numéricos compatíveis, preservando a exibição de datas e os formatos numéricos com zeros à esquerda quando disponíveis. Os formatos que dependem da configuração regional podem diferir do Excel. Os valores armazenados preservam números e booleanos; as datas permanecem como números de série do Excel, sem receber um fuso horário. As células de texto mantêm seu texto nos dois modos. As fórmulas usam seus resultados salvos sem recálculo. Quando não há resultado salvo, a célula fica em branco e um aviso aparece na interface. Os erros da planilha permanecem como strings legíveis, como #DIV/0!.

CSV e TSV colocam entre aspas os campos que contêm separadores, aspas ou quebras de linha. JSON é um array que contém um array por linha: a primeira linha permanece nos dados, cabeçalhos duplicados ou vazios não se tornam chaves de objetos e células vazias usam null. Markdown pode tratar a primeira linha como cabeçalho ou adicionar um cabeçalho vazio acima de todas as linhas de dados. A pontuação do Markdown, HTML, barras verticais e quebras de linha nas células recebem escape ou são representados de forma segura. Os downloads usam UTF-8 sem marca de ordem de bytes; escolha UTF-8 ao importar em outro aplicativo.

## Processamento local e compatibilidade

Sua pasta de trabalho permanece neste navegador e não é enviada nem salva pela ferramenta. Macros e scripts não são executados, e conexões com dados externos não são atualizadas. Linhas e colunas ocultas são incluídas no intervalo selecionado. Células mescladas não são expandidas para repetir valores. Gráficos, imagens, comentários e estilos da pasta de trabalho não fazem parte desses formatos de texto.

Pastas de trabalho criptografadas, danificadas ou não compatíveis apresentam uma mensagem de erro clara. Não há limites fixos de tamanho de arquivo, número de planilhas, linhas ou colunas, mas uma exportação grande pode exceder a memória do navegador. Esta ferramenta exporta dados salvos; ela não edita a pasta de trabalho nem garante que outro aplicativo de planilhas interprete os campos de texto simples da mesma forma.
