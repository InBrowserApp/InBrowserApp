## Converta pastas de trabalho antigas do Excel no navegador

Abra ou solte um arquivo XLS local. Escolha uma planilha, inspecione os dados das células e baixe uma pasta de trabalho XLSX. Você pode navegar pela prévia ou inserir o endereço da célula do canto superior esquerdo para ir a outra área. A janela de prévia não limita a exportação: todas as planilhas e suas células importadas são incluídas.

Os nomes e a ordem das planilhas, as planilhas vazias, os estados de ocultação das planilhas, os textos, os números, os valores booleanos, os erros da planilha, os formatos numéricos compatíveis, as células mescladas, as alturas das linhas, as larguras das colunas e as linhas e colunas ocultas são preservados quando o analisador do arquivo de origem oferece suporte. Os identificadores de texto mantêm os zeros à esquerda. As datas preservam os números de série do Excel e o sistema de datas da pasta de trabalho.

## Fórmulas e compatibilidade

As expressões de fórmulas compatíveis e seus resultados salvos são preservados. O navegador não recalcula fórmulas nem atualiza dados externos. Uma fórmula sem resultado salvo aparece com um aviso na prévia; sua expressão permanece no arquivo de saída para que um aplicativo de planilhas possa calculá-la. Expressões de fórmulas não compatíveis ou referências externas podem não ser preservadas corretamente na conversão.

Esta é uma conversão de dados, não uma reprodução fiel de todos os recursos da pasta de trabalho. Gráficos, imagens, macros, recursos de tabelas dinâmicas e estilos avançados não são preservados. A prévia não reproduz o layout das células mescladas nem a formatação. Verifique a pasta de trabalho baixada no seu aplicativo de planilhas, especialmente quando as fórmulas ou o layout forem importantes. Folhas de macros, folhas de gráfico, arquivos criptografados, arquivos danificados e arquivos apenas renomeados para .xls não são compatíveis.

## Processamento local

Sua pasta de trabalho é processada neste navegador sem enviar seu conteúdo. As macros não são executadas e os recursos vinculados não são carregados. Substituir ou fechar a pasta de trabalho descarta o resultado; cancelar interrompe a conversão. Não há limite fixo de tamanho de arquivo ou quantidade de planilhas, embora pastas de trabalho grandes ainda dependam da memória disponível no navegador.

Para explorar outros formatos de planilha, abra o [Visualizador de planilhas](../xlsx-viewer/).
