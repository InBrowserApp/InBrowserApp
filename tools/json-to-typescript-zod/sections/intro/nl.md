## Hoe de converter veldtypen afleidt

De converter bekijkt elk element in een array. In dit voorbeeld komt `active` alleen in het eerste record voor. Dat veld wordt daarom optioneel. Beide records bevatten `name`, met een tekenreeks in het ene record en `null` in het andere. Dat veld is dus verplicht en krijgt het type `string | null`.

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

Als een array geen voorbeeldelementen bevat, krijgt die het elementtype `unknown`. Voeg records met verschillende structuren uit je API-responsen toe voor een representatiever resultaat.

## Wanneer gebruik je TypeScript of Zod?

Gebruik **TypeScript** voor typecontroles in de editor en tijdens het compileren. Gebruik **Zod** om inkomende gegevens tijdens de uitvoering te valideren met `apiResponseSchema.safeParse(data)`. Het gegenereerde Zod-bestand exporteert ook het TypeScript-type. Voeg regels voor bijvoorbeeld toegestane waarden of tekenreeksformaten toe als je API-contract dat vereist.
