## Converter JSON em uma planilha do Excel

Cole um array JSON ou abra um arquivo `.json` local, confira a prévia e clique em **Baixar XLSX**. O conversor cria uma planilha com uma linha de cabeçalho. Cada objeto ocupa uma linha, e todos os campos presentes no array viram colunas. Você pode usar a ferramenta com registros de APIs, listas de produtos e dados exportados. Se a resposta de uma API trouxer os registros dentro de um campo como `data`, cole o array contido nesse campo.

## Expandir campos JSON aninhados em colunas

A opção **Expandir campos aninhados** vem ativada. Por exemplo, os dois registros abaixo geram as colunas `name`, `contact.city` e `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Com a opção desativada, `contact` fica em uma só coluna, como texto JSON do tipo `{"city":"Oslo"}`. Nos dois modos, cada array fica em uma única célula, então `tags` não cria linhas extras. Campos ausentes ou com valor `null` aparecem como células em branco.

## Como o Excel preserva os valores do JSON

Normalmente, números e booleanos se tornam números e valores lógicos do Excel. Números fora da precisão ou do intervalo de valores do Excel ficam como texto para conservar seus dígitos. Strings JSON continuam como texto, então identificadores como `"00123"`, datas escritas como strings e textos que começam com `=` mantêm os caracteres originais.

## Prévia e download no navegador

A prévia mostra o início da planilha. O arquivo XLSX baixado inclui todos os registros e colunas. A conversão acontece no navegador, e seus dados JSON ficam no seu dispositivo. Para exportar como texto simples, use o [Conversor JSON → CSV](../json-to-csv-converter/).
