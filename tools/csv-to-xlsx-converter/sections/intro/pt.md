## Converta texto delimitado para Excel

Abra ou solte um arquivo CSV ou TSV local, inspecione as células e baixe uma pasta de trabalho XLSX com uma planilha chamada Sheet1. Escolha o separador e a codificação de texto se a detecção automática não corresponder ao arquivo. Arquivos TSV usam tabulações por padrão. A janela de prévia não limita os dados exportados.

## Preserve identificadores e o texto original

CSV e TSV não armazenam os tipos de células de planilhas. Este conversor mantém todos os campos como texto, incluindo zeros à esquerda, identificadores longos, números que parecem decimais, datas e textos que começam com um sinal de igual. Ele não infere números ou datas nem executa fórmulas. Separadores entre aspas, aspas escapadas, Unicode, quebras de linha dentro dos campos, campos vazios e registros em branco são preservados. Linhas mais curtas deixam células em branco. Uma quebra de linha no final encerra o último registro em vez de adicionar outra linha.

A configuração da primeira linha permite escolher entre dados comuns e um cabeçalho com filtros do Excel. Ambas as opções mantêm a linha exatamente como foi escrita, incluindo cabeçalhos duplicados ou vazios. A codificação automática aceita UTF-8 e UTF-16 com marca de ordem de bytes. Outras codificações podem ser selecionadas manualmente. Uma instrução sep= no início é omitida apenas quando a detecção automática do separador está selecionada ou quando seu separador corresponde ao separador escolhido.

Campos com aspas malformadas, codificação de texto inválida e dados que excedem os limites de linhas, colunas ou texto por célula do Excel geram um erro em vez de uma pasta de trabalho truncada. Verifique os valores importantes em um aplicativo de planilhas após baixar o arquivo.

## Processamento local

A conversão acontece neste navegador sem enviar o arquivo. Alterar as configurações de importação, substituir ou fechar o arquivo descarta o resultado anterior. Cancelar interrompe a tarefa em segundo plano. Não há um limite fixo de tamanho de arquivo; a memória disponível no navegador determina quais arquivos podem ser processados.

Para explorar arquivos de planilha, abra o [Visualizador de planilhas](../xlsx-viewer/).
