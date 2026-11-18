## Come vengono dedotti i campi

Il convertitore esamina tutti gli elementi di un array. In questo esempio, solo il primo record contiene il campo `active`, che quindi diventa facoltativo. Entrambi i record contengono `name`, con una stringa nel primo e `null` nel secondo. Il campo è quindi obbligatorio e di tipo `string | null`.

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

Se un array nell’esempio è vuoto, il tipo dei suoi elementi è `unknown`. Per ottenere un risultato più rappresentativo, includi record che mostrino le diverse strutture restituite dalla tua API.

## Quando usare TypeScript o Zod

Usa **TypeScript** per i controlli nell’editor e in fase di compilazione. Usa **Zod** per convalidare i dati in ingresso in fase di esecuzione con `apiResponseSchema.safeParse(data)`. Il file Zod generato esporta anche il tipo TypeScript. Aggiungi regole specifiche, come i valori consentiti o i formati delle stringhe, se il contratto dell’API lo richiede.
