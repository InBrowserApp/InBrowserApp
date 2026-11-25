## Como converter um notebook Jupyter em PDF

Abra ou arraste um arquivo `.ipynb` salvo no Jupyter, Google Colab ou VS Code. Confira a pré-visualização, escolha A4 ou US Letter e selecione **Salvar como PDF**. Na janela de impressão do navegador, escolha **Salvar como PDF** como destino. Você também pode escolher uma impressora nessa janela. Por exemplo, `analysis.ipynb` se torna um PDF que você pode anexar a um e-mail ou entregar com um relatório.

## O que o PDF inclui

O PDF segue a ordem das células do notebook. Ele inclui títulos e tabelas em Markdown, código-fonte e saídas salvas compatíveis, como texto do console, tabelas e imagens de gráficos incorporadas. Linhas longas de código são quebradas para caber no papel. Células longas podem continuar em outra página e o texto continua selecionável no navegador.

Para obter os resultados mais recentes, salve o notebook com suas saídas antes da conversão. O conversor lê o arquivo salvo localmente e nunca executa as células. Widgets precisam de uma representação estática salva para aparecer. O código-fonte LaTeX permanece como texto, e imagens remotas e outros recursos externos não são carregados.

## Outras formas de usar o notebook

Use o [visualizador de Jupyter Notebook](../notebook-viewer/) para ler células e saídas salvas de forma interativa. Use o [conversor de Jupyter Notebook](../notebook-export/) se precisar de HTML, Markdown ou um script de código.
