## Converter um arquivo Plist binário em JSON

Escolha **Abrir Plist binário** ou solte um arquivo `.plist` binário da Apple. Confira o JSON formatado, copie-o ou baixe um arquivo `.json`. As listas de propriedades binárias começam com a assinatura `bplist00` e aparecem em pacotes de apps da Apple, preferências e dados arquivados. O exemplo mostra como os valores de uma lista de propriedades aparecem no JSON.

## Converter JSON em uma lista de propriedades binária da Apple

Escolha **JSON para Plist**, cole JSON ou abra um arquivo `.json` e selecione **Converter em Plist binário**. Baixe o arquivo `.plist` gerado. Strings, booleanos, números, arrays e objetos são convertidos nos tipos correspondentes da lista de propriedades. Substitua `null` por um valor ou omita a chave correspondente. Os arquivos e o texto colado são processados no seu navegador.

## Preservar datas, bytes e inteiros grandes

JSON não tem tipos nativos para datas, dados binários ou UIDs de arquivos com chaves. O conversor usa tags explícitas `$plist` para preservar o significado desses valores na conversão em ambos os sentidos.

| Valor Plist                       | Exemplo em JSON                                        |
| --------------------------------- | ------------------------------------------------------ |
| Data em UTC                       | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bytes em Base64                   | `{"$plist":"data","value":"AQID"}`                     |
| Inteiro grande como texto decimal | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID de um arquivo com chaves      | `{"$plist":"uid","value":42}`                          |

Mantenha as tags ao converter de volta para Plist. Para inteiros fora do intervalo seguro do JSON, use a tag de inteiro e escreva o valor decimal entre aspas. Se um dicionário tiver a mesma estrutura de uma tag, o conversor o envolve em uma tag `dictionary` para preservar suas chaves. A conversão preserva a estrutura e os valores compatíveis. A ordem dos objetos Plist, o espaço usado para armazenar números e os bytes originais podem mudar.

[Estrutura e tipos das listas de propriedades da Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
