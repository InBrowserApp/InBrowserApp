## How fields are inferred

The converter looks at every item in an array. In this example, only the first record has `active`, so the field becomes optional. Both records have `name`, with a string in one and `null` in the other, so the field is required and its type is `string | null`.

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

If an array has no sample items, its element type is `unknown`. Include records that show the different shapes your API returns to get a more representative result.

## When to use TypeScript or Zod

Use **TypeScript** for editor and compile-time checks. Use **Zod** to validate incoming data at runtime with `apiResponseSchema.safeParse(data)`. The generated Zod file also exports the TypeScript type. Add API-specific rules such as allowed values or string formats when your contract calls for them.
