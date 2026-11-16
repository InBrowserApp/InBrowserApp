## Como Funciona a Detecção de Tipo de Arquivo

Esta ferramenta lê até os primeiros 64 KiB de um arquivo local e verifica sua
assinatura binária com [file-type](https://github.com/sindresorhus/file-type). O
resultado inclui um tipo MIME detectado, as extensões esperadas e uma prévia dos
primeiros 256 bytes em hexadecimal e ASCII. Nada é enviado.

## Por Que uma Extensão Pode Divergir

Renomear um arquivo muda seu nome, não seu conteúdo. Um PNG chamado photo.jpg
continua tendo uma assinatura PNG. Extensões equivalentes comuns, como .jpg e
.jpeg, são aceitas. O MIME informado pelo navegador é exibido separadamente
porque costuma seguir o nome do arquivo em vez de inspecionar os bytes.

## Limites da Detecção

As assinaturas são indicações, não uma prova de que o arquivo é válido ou seguro.
Formatos de texto, como TXT, CSV e SVG, podem não ser reconhecidos. Uma amostra
curta pode identificar ZIP ou outro contêiner sem confirmar seu subtipo, como um
documento do Office. A prévia hexadecimal mostra o conteúdo bruto do arquivo,
não uma soma de verificação criptográfica.
