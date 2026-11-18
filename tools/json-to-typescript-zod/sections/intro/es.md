## Cómo se infieren los campos

El convertidor examina todos los elementos de un array. En este ejemplo, solo el primer registro tiene el campo `active`, por lo que se vuelve opcional. Ambos registros tienen `name`: uno contiene una cadena y el otro, `null`. Por eso, el campo es obligatorio y su tipo es `string | null`.

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

Si un array del ejemplo está vacío, el tipo de sus elementos es `unknown`. Para obtener un resultado más representativo, incluye registros que muestren las distintas estructuras que devuelve tu API.

## Cuándo usar TypeScript o Zod

Usa **TypeScript** para comprobar los tipos en el editor y durante la compilación. Usa **Zod** para validar los datos entrantes en tiempo de ejecución con `apiResponseSchema.safeParse(data)`. El archivo de Zod generado también exporta el tipo de TypeScript. Si el contrato de tu API lo requiere, añade reglas específicas, como valores permitidos o formatos de cadena.
