## Converta texto formatado localmente

Abra um documento `.rtf` local, converta-o em PDF, confira as páginas resultantes e baixe o mesmo PDF exibido na prévia. Para ler sem converter, use o [Visualizador de RTF](../rtf-viewer/).

## Aparência e compatibilidade do PDF

O mecanismo de conversão renderiza tamanhos de página, orientação, cabeçalhos, rodapés, quebras de página, tabelas e imagens PNG/JPEG incorporadas compatíveis. O texto compatível continua selecionável. As codificações de caracteres originais do RTF e as sequências de escape Unicode são passadas ao mecanismo; OCR não é adicionado a textos digitalizados. As fontes ausentes são substituídas por fontes incluídas, por isso quebras de linha, espaçamento e paginação podem mudar. Layouts complexos podem diferir do aplicativo original. Confira cada página antes de confiar no PDF.

O PDF é uma exportação estática. Os controles de formulário usam sua aparência impressa. Comentários, macros e assinaturas digitais não são preservados nem verificados. Objetos incorporados, recursos externos do documento, formatos de imagem não compatíveis e instruções de campo não compatíveis são rejeitados. Arquivos danificados ou ilegíveis geram um erro sem disponibilizar um download incompleto. Renomear a extensão não altera o formato real do arquivo.

## Privacidade e recursos do navegador

A conversão é executada no seu dispositivo. A primeira conversão baixa cerca de 90 MB de arquivos do mecanismo e de fontes, que o navegador pode armazenar em cache; o documento em si nunca é enviado. O mecanismo só é carregado após você escolher um arquivo. É necessário um navegador atualizado com suporte a WebAssembly e memória compartilhada. Documentos grandes ou complexos podem consumir tempo e memória. Você pode cancelar, fechar ou substituir o arquivo. Não há limite fixo de tamanho de arquivo nem de número de páginas.
