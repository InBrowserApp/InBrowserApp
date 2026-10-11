## Converta um documento AsciiDoc localmente

Abra um documento local `.adoc` ou `.asciidoc`, confira as páginas geradas e baixe o PDF mostrado na prévia. Isso gera um arquivo PDF diretamente, sem precisar de uma caixa de diálogo de impressão. São compatíveis documentos-fonte em UTF-8 e UTF-16 com marca de ordem de bytes (BOM). Para ler sem converter, use o [Visualizador de AsciiDoc](../asciidoc-viewer/).

## Resultado da impressão e conteúdo compatível

O documento é renderizado com um tema fixo de impressão em páginas A4 na orientação retrato com margens de 18 mm e depois capturado como páginas de imagem a 150 DPI. São incluídos títulos, seções, parágrafos, listas, tabelas, código, avisos, chamadas de anotação, notas de rodapé, quebras de página explícitas e imagens rasterizadas incorporadas compatíveis. Tabelas largas e código são redistribuídos para caber na largura da página. O texto no PDF não é selecionável, e OCR e links interativos não são adicionados. As fontes, o espaçamento e a paginação podem diferir de outras ferramentas AsciiDoc. Confira cada página antes de confiar no resultado.

Inclusões de arquivos, recursos de imagem ou estilo ausentes, imagens ilegíveis, avisos de análise e atributos não resolvidos interrompem a conversão sem disponibilizar um download parcial. Primeiro, reúna o conteúdo-fonte necessário em um único documento autossuficiente. Macros personalizadas, diagramas, extensões, temas de projeto e fontes incorporadas não são compatíveis; a notação não compatível pode permanecer como texto. Scripts, formulários, aplicativos incorporados, SVG e MathML são omitidos. O conteúdo ativo no HTML inserido diretamente é removido. Os tamanhos de papel do documento original são substituídos pelo layout A4 fixo.

## Privacidade e recursos do navegador

Seu documento fica neste navegador. Arquivos-fonte, imagens e outros recursos nunca são buscados no seu computador ou na rede, e o conteúdo dos arquivos nunca é enviado. Os dados de imagens rasterizadas incorporadas são lidos do documento selecionado. Arquivos grandes podem consumir tempo e memória, pois cada página é renderizada como imagem. Você pode cancelar, fechar ou substituir o documento. Não há limite fixo de tamanho de arquivo ou número de páginas; falhas reais nos recursos do navegador geram um erro quando podem ser detectadas.
