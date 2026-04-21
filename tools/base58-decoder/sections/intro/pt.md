## Para que serve esta ferramenta

Use esta ferramenta para decodificar cadeias Base58 ou arquivos de texto e
recuperar os bytes originais diretamente no navegador. Ela e util quando voce
precisa inspecionar dados copiados de APIs, carteiras, logs, fluxos com QR ou
etapas de importacao e exportacao sem enviar o conteudo para um servidor.

## Quando trocar o alfabeto

Base58 nao tem um alfabeto universal unico. Bitcoin, Flickr e Ripple usam
ordens de caracteres diferentes. Se um valor falhar na validacao ou for
decodificado com o resultado errado, troque o alfabeto e tente novamente com o
formato usado pelo sistema de origem.

## O que observar

O painel de saida mostra uma previa em UTF-8 quando os bytes decodificados podem
ser lidos como texto. Para dados binarios ou conteudo nao textual, e mais seguro
baixar o arquivo .bin para revisar os bytes originais. Espacos e quebras de
linha colados sao ignorados, entao valores quebrados em emails, documentos ou
terminais ainda podem ser decodificados.
