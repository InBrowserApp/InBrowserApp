## Exporte um notebook Jupyter salvo

Abra um notebook IPYNB e escolha HTML, Markdown ou código. HTML e Markdown mantêm as células na ordem em que foram salvas, incluindo as saídas salvas compatíveis. Tudo fica no seu navegador. Nenhum kernel, código ou ambiente de execução de widgets é iniciado.

## Escolha uma saída útil

O HTML é uma cópia independente para leitura com texto selecionável, imagens incluídas compatíveis e tabelas legíveis. O Markdown fornece conteúdo de documento reutilizável; as tabelas podem conter HTML seguro e as imagens usam URLs de dados incorporadas, que alguns aplicativos de Markdown não exibem. O layout e a formatação originais podem mudar.

A exportação de código mantém as células de código em ordem e omite Markdown, células de texto bruto e saídas salvas. Uma linguagem de notebook reconhecida determina a extensão do script; linguagens desconhecidas usam TXT. Os comandos mágicos do notebook e a sintaxe de shell permanecem como foram escritos, portanto o código exportado pode exigir ajustes manuais ou o kernel original do notebook. Um notebook sem células de código produz um arquivo de código vazio.

## Resultados salvos e compatibilidade

O conversor lê o formato de notebook 4. Os resultados vêm do arquivo salvo e podem estar desatualizados. Conteúdo avançado incompatível e imagens indisponíveis são identificados. Recursos remotos não são buscados; scripts, widgets, áudio e vídeo não são executados nem reproduzidos. LaTeX permanece como texto-fonte, e células de texto bruto ou desconhecidas aparecem como texto legível nas exportações de documentos.

Os recursos do navegador determinam os limites práticos; não há uma cota fixa de tamanho de arquivo ou quantidade de células. Para examinar o notebook original, use o [Visualizador de Jupyter Notebook](/tools/notebook-viewer/).
