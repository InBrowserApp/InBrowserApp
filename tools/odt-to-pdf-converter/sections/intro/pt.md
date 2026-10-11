## Converta texto OpenDocument localmente

Abra um documento OpenDocument `.odt` ou modelo `.ott`, converta o arquivo para PDF, confira as páginas resultantes e baixe o mesmo PDF exibido na prévia. Para ler sem converter, use o [Visualizador de ODT](../odt-viewer/).

## Aparência do PDF e compatibilidade

O mecanismo de conversão renderiza estilos de página, tamanhos de papel, orientação, cabeçalhos, rodapés, colunas, tabelas e imagens incorporadas. As páginas mantêm a ordem da renderização, inclusive as páginas em branco inseridas pelos estilos de página. O texto compatível continua selecionável; OCR não é adicionado ao texto digitalizado. As fontes ausentes são substituídas pelas fontes incluídas no aplicativo, por isso as quebras de linha, o espaçamento e a paginação podem mudar. Layouts complexos podem diferir do aplicativo original. Confira cada página antes de confiar no PDF.

O PDF é uma exportação estática. Os controles de formulário usam sua aparência impressa. Comentários, macros e assinaturas digitais não são preservados nem verificados. Objetos incorporados, mídia e recursos externos do documento não são compatíveis. Documentos protegidos, pacotes danificados ou conteúdo ausente detectado geram um erro sem disponibilizar um download incompleto. Renomear a extensão não altera o formato real do arquivo.

## Privacidade e recursos do navegador

A conversão é executada no seu dispositivo. A primeira conversão baixa cerca de 90 MB de arquivos do mecanismo e de fontes, que o navegador pode armazenar em cache; o documento em si nunca é enviado. O mecanismo só é carregado depois que você escolhe um arquivo. É necessário um navegador atualizado com suporte a WebAssembly e memória compartilhada. Documentos grandes ou complexos podem exigir tempo e memória. Você pode cancelar a conversão, fechar ou substituir o arquivo. Não há limite fixo de tamanho de arquivo ou número de páginas.
