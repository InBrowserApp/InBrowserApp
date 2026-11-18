## Como a ferramenta infere os campos

O conversor analisa todos os itens do array. Neste exemplo, só o primeiro registro tem o campo `active`, que passa a ser opcional. Os dois registros têm o campo `name`, com uma string em um e `null` no outro. Por isso, o campo é obrigatório e tem o tipo `string | null`.

```json
[
  { "id": 1, "name": "Ada", "active": true },
  { "id": 2, "name": null }
]
```

```ts
export type ApiResponse = Array<{
  id: number
  name: string | null
  active?: boolean
}>
```

Se um array estiver vazio no exemplo, o tipo dos elementos será `unknown`. Inclua registros que representem as diferentes estruturas retornadas pela sua API para obter um resultado mais fiel.

## Quando usar TypeScript ou Zod

Use **TypeScript** para verificações no editor e em tempo de compilação. Use **Zod** para validar os dados recebidos em tempo de execução com `apiResponseSchema.safeParse(data)`. O arquivo Zod gerado também exporta o tipo TypeScript. Se o contrato da API exigir, acrescente regras específicas, como valores permitidos ou formatos de string.
