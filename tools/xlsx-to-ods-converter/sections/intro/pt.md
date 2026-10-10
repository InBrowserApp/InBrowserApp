## Converta pastas de trabalho do Excel para OpenDocument

Abra ou solte um arquivo XLSX local, inspecione suas células e baixe uma pasta de trabalho ODS. São incluídos os nomes e a ordem das planilhas, planilhas vazias e ocultas, posições das células, textos, números, valores booleanos, datas e resultados salvos de fórmulas. A janela de prévia não limita os dados exportados. Planilhas muito ocultas se tornam planilhas ocultas comuns.

## Valores salvos e compatibilidade

As fórmulas são convertidas em seus valores salvos. A ausência de resultados é informada e as células correspondentes permanecem em branco; o navegador não recalcula fórmulas nem atualiza dados externos. Os resultados com erro da planilha se tornam texto simples. Identificadores com zeros à esquerda, caracteres não latinos e textos literais que começam com um sinal de igual permanecem como texto.

As datas respeitam o sistema de datas de 1900 ou 1904 da pasta de trabalho e usam um formato padrão de data e hora. Os valores que contêm apenas horários e as durações usam um formato básico de duração. Porcentagens e valores monetários preservam o número sem a formatação original ou a identificação da moeda. A data fictícia de 29 de fevereiro de 1900 do Excel e os formatos de data personalizados não compatíveis geram um erro em vez de deslocar a data.

Estilos, dimensões de linhas e colunas, layout de células mescladas, gráficos, imagens, comentários, links, macros e configurações da pasta de trabalho não são reproduzidos. Os valores armazenados em áreas mescladas permanecem nas posições originais das células. Este conversor aceita XLSX, mas não XLS, XLSB ou XLSM. Arquivos criptografados, arquivos compactados inválidos, tipos de planilha não compatíveis e dados que não podem ser representados em ODS geram um erro claro. Verifique os resultados importantes no seu aplicativo de planilhas após baixar o arquivo.

## Processamento local

A conversão acontece neste navegador sem enviar o documento. Substituir ou fechar o arquivo descarta o resultado anterior preparado para download; cancelar interrompe a tarefa em segundo plano. Não há um limite fixo de tamanho de arquivo ou quantidade de planilhas. A memória disponível no navegador ainda determina quais pastas de trabalho podem ser processadas.

Para explorar Excel e outros formatos de planilha, abra o [Visualizador de planilhas](../xlsx-viewer/).
