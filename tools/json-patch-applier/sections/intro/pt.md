## Como aplicar um JSON Patch

Cole o documento JSON original no primeiro editor e um array JSON Patch RFC 6902 no segundo. Selecione **Aplicar patch** para visualizar e copiar o JSON atualizado. Para gerar um patch, compare os documentos original e modificado no [Comparador de JSON por caminho](../json-diff-path/) e copie a saída **JSON Patch**. Aplique o patch ao mesmo documento original.

## Exemplo de JSON Patch

O documento original contém um status e uma tag.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

O patch verifica o status original, atualiza esse valor e acrescenta uma tag.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

O resultado é `{"status":"published","tags":["api","release"]}`.

## Operações compatíveis e sintaxe do JSON Pointer

- `add` cria ou sobrescreve uma propriedade de um objeto, insere um item no array ou substitui o documento na raiz.
- `remove` exclui um valor existente. `replace` substitui um valor existente por um novo.
- `move` retira um valor existente do caminho `from` e o insere em `path`. `copy` insere uma cópia independente.
- `test` verifica se o valor em `path` corresponde ao `value` fornecido sem modificar o documento.

Os caminhos usam a sintaxe JSON Pointer do RFC 6901. Os índices de arrays começam em zero. O caminho `/tags/0` aponta para a primeira tag, e `/tags/-` acrescenta um valor ao final do array em operações de inserção. Use `~1` para uma barra e `~0` para um til dentro de uma chave. Por exemplo, `/a~1b` aponta para a chave `a/b`. O caminho vazio `""` aponta para o documento inteiro, e `/` aponta para uma propriedade de chave vazia.

## Por que uma operação de JSON Patch falha

As operações são executadas na ordem do array. Cada operação usa o resultado das anteriores. Se um destino não existir, um índice estiver fora dos limites do array ou um valor de `test` for diferente do esperado, a ferramenta destaca a primeira falha e para. A prévia do JSON só aparece quando o patch inteiro é aplicado com sucesso. Um patch com um array vazio `[]` devolve o documento original.

O navegador aplica o patch localmente. O JSON original e o patch ficam no seu navegador.
