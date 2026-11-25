## Gerar VINs aleatórios para testes

Escolha uma quantidade de `1` a `1000` e selecione **Gerar**. Cada linha contém um número de identificação do veículo (VIN) com 17 caracteres. Selecione **Copiar tudo** para colar o lote em um formulário de teste ou em uma planilha, ou **Baixar TXT** para salvar um arquivo de texto com um VIN por linha.

## Entender o VIN e seu dígito verificador

Os três primeiros caracteres formam o identificador do fabricante. Do quarto ao oitavo caractere, há informações que descrevem o veículo, e o nono é o dígito verificador. Os últimos oito caracteres formam a seção de identificação do veículo. As letras `I`, `O` e `Q` são omitidas para evitar confusão com algarismos. O dígito verificador é calculado a partir dos outros 16 caracteres e pode ser um dígito de `0` a `9` ou `X`. Em `1M8GDM9AXKP042788`, por exemplo, o nono caractere é `X`.

## Usar um VIN de exemplo em um conjunto de testes

Use os VINs gerados para testar campos obrigatórios, importações em lote ou a validação do formato e do dígito verificador. Para testar a rejeição, altere apenas o nono caractere para outro dígito e envie o valor novamente. O gerador produz VINs sintéticos; portanto, campos que parecem indicar fabricante, ano do modelo ou número de série devem ser tratados como dados de exemplo. Para registro, busca de peças ou histórico do veículo, use o VIN registrado no veículo ou em seus documentos.
