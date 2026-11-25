## Gerar códigos UPC-A aleatórios

Defina uma quantidade de `1` a `1000` e selecione **Gerar**. Cada linha contém um código UPC-A de 12 dígitos. Selecione **Copiar tudo** para colar o lote em um formulário de teste ou planilha, ou **Baixar TXT** para salvar os códigos como texto.

## Entender o dígito verificador e os zeros à esquerda

Um código de barras UPC-A representa um identificador de produto de 12 dígitos chamado `GTIN-12`. O último dígito é o dígito verificador, calculado a partir dos 11 primeiros. Em `084044127435`, o `0` à esquerda faz parte do código e o `5` final é seu dígito verificador. Ele faz com que a soma ponderada dos 12 dígitos seja um múltiplo de dez.

## Usar os códigos para testes no varejo

Use esses códigos de exemplo para testar formulários de produtos, importações de estoque ou validação de UPC. Armazene-os como texto para preservar os zeros à esquerda. Para imprimir uma imagem de código de barras de teste, cole um código gerado no [Gerador de Código de Barras](/pt/tools/barcode-generator/) e escolha `UPC`. Para um anúncio de produto real ou uma embalagem, use o GTIN atribuído ao produto.
