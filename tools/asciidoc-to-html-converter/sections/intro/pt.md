## Converta um documento AsciiDoc localmente

Abra um arquivo local `.adoc` ou `.asciidoc`, confira o documento renderizado e baixe um arquivo HTML independente em UTF-8. O arquivo abre offline e mantém o texto selecionável. Para conferir avisos do documento-fonte ou inclusões indisponíveis antes da conversão, use o [Visualizador de AsciiDoc](../asciidoc-viewer/).

## Resultado e compatibilidade

Títulos, listas, tabelas, blocos de código, notas, citações, notas de rodapé, links e imagens rasterizadas incorporadas compatíveis são preservados com um tema fixo de leitura. Marcadores internos e notas de rodapé permanecem no documento; links externos só abrem quando selecionados. Blocos de código e tabelas largos têm rolagem horizontal. O zoom da prévia não altera o arquivo baixado. As fontes e o espaçamento podem diferir de outras ferramentas AsciiDoc.

Use um documento-fonte autossuficiente em UTF-8 ou UTF-16 com marca de ordem de bytes (BOM). Arquivos incluídos e recursos externos de imagem ou estilo não são carregados. Inclusões indisponíveis, avisos de análise, atributos não resolvidos e recursos ausentes ou ilegíveis interrompem a exportação sem disponibilizar um download parcial. Imagens incorporadas, incluindo imagens de fundo em CSS, precisam ser decodificadas com sucesso. Macros personalizadas, diagramas, extensões e fontes incorporadas não são compatíveis. Scripts, formulários, aplicativos incorporados, SVG e MathML são omitidos. A sintaxe não compatível do documento-fonte pode permanecer como texto comum.

## Privacidade e recursos do navegador

Os arquivos ficam neste navegador. Recursos ausentes nunca são buscados no seu computador nem em um site, e o conteúdo dos arquivos nunca é enviado. O HTML gerado bloqueia scripts e o carregamento automático de recursos externos. Seguir um link externo é uma ação separada que pode acessar esse site. Você pode cancelar, fechar ou substituir o documento-fonte. Não há limite fixo de tamanho de arquivo ou número de páginas; documentos grandes dependem da memória disponível no navegador, e falhas de recursos são informadas quando detectáveis.
