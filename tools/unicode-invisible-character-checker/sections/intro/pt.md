## Por que os caracteres invisíveis importam

É fácil deixar passar caracteres Unicode invisíveis porque eles não parecem estar incorretos em um editor comum. O problema só aparece depois: alterações no texto falham, identificadores deixam de coincidir, o layout apresenta quebras estranhas ou o texto passa a se comportar de forma diferente em contextos RTL.

## O que esta ferramenta detecta

Este verificador procura quatro grupos comuns: marcas de largura zero, controles bidirecionais, caracteres especiais de espaçamento e controles de formatação. Ele informa exatamente onde aparecem, oferece uma pré-visualização anotada e prepara uma versão limpa que você pode copiar ou exportar.

## Quando usar

Use-o depois de copiar texto de documentos, PDFs, planilhas, aplicativos de chat, editores de CMS ou ferramentas de design. É especialmente útil quando uma string parece normal, mas comparações, renderização ou etapas posteriores de processamento continuam apresentando comportamentos estranhos.
