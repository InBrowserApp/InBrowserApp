## Jak konwerter określa typy pól

Konwerter sprawdza każdy element tablicy. W tym przykładzie pole `active` występuje tylko w pierwszym rekordzie, więc jest opcjonalne. Pole `name` występuje w obu rekordach, raz jako ciąg znaków, a raz jako `null`. Jest więc wymagane i ma typ `string | null`.

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

Jeśli tablica nie zawiera żadnych przykładowych elementów, konwerter przypisze im typ `unknown`. Uwzględnij rekordy o różnych strukturach zwracanych przez API, aby uzyskać dokładniejszy wynik.

## Kiedy używać TypeScript, a kiedy Zod

Użyj **TypeScript** do sprawdzania typów w edytorze i podczas kompilacji. **Zod** pozwala sprawdzać dane przychodzące w czasie działania programu za pomocą `apiResponseSchema.safeParse(data)`. Wygenerowany plik Zod eksportuje również typ TypeScript. Jeśli umowa API tego wymaga, dodaj reguły określające dozwolone wartości lub formaty ciągów znaków.
