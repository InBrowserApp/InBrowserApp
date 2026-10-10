## Converta planilhas OpenDocument para Excel

Abra ou solte um arquivo ODS local, inspecione suas células e baixe uma pasta de trabalho XLSX. São incluídos os nomes e a ordem das planilhas, planilhas ocultas, textos, números, valores booleanos, datas, resultados salvos de fórmulas e células mescladas. As planilhas vazias e os espaços entre células são mantidos. A janela de prévia não limita os dados exportados.

## Valores salvos e compatibilidade

As fórmulas são convertidas em seus valores salvos, não em fórmulas do Excel. A ausência de resultados salvos é informada e as células correspondentes permanecem em branco. O navegador não recalcula fórmulas nem atualiza dados externos. Os resultados com erro se tornam erros genéricos de planilha. O texto literal permanece como texto, incluindo identificadores com zeros à esquerda, caracteres não latinos e textos que começam com um sinal de igual.

As datas usam um formato padrão de data e hora; datas com fuso horário explícito são convertidas para UTC. As durações permanecem como números de dias e as porcentagens usam um formato básico de porcentagem. Os valores monetários preservam o número, sem a identificação da moeda ou a formatação original. Estilos, dimensões de linhas e colunas, gráficos, imagens, comentários, links, macros e configurações da pasta de trabalho não são reproduzidos.

Arquivos criptografados, arquivos compactados inválidos, dados não compatíveis e valores ou nomes de planilhas fora dos limites aceitos pelo Excel geram um erro claro. Este conversor não aceita arquivos Flat OpenDocument (.fods). Verifique os resultados importantes no seu aplicativo de planilhas após baixar o arquivo.

## Processamento local

A conversão acontece neste navegador sem enviar o documento. Substituir ou fechar o arquivo descarta o resultado anterior preparado para download; cancelar interrompe a tarefa em segundo plano. Não há um limite fixo de tamanho de arquivo ou quantidade de planilhas. A memória disponível no navegador ainda determina quais pastas de trabalho podem ser processadas.

Para explorar ODS e outros formatos de planilha, abra o [Visualizador de planilhas](../xlsx-viewer/).
