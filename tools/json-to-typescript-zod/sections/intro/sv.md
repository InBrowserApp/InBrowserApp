## Så här härleds fälten

Konverteraren tittar på alla element i en array. I det här exemplet har bara den första posten `active`, så fältet blir valfritt. Båda posterna har `name`, med en sträng i den ena och `null` i den andra. Fältet blir därför obligatoriskt och får typen `string | null`.

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

Om en array saknar exempelvärden får dess element typen `unknown`. Ta med poster som visar de olika strukturer som ditt API returnerar för att få ett mer representativt resultat.

## När ska du använda TypeScript eller Zod?

Använd **TypeScript** för kontroller i kodredigeraren och vid kompilering. Använd **Zod** för att validera inkommande data vid körning med `apiResponseSchema.safeParse(data)`. Den genererade Zod-filen exporterar också TypeScript-typen. Lägg till API-specifika regler, till exempel tillåtna värden eller strängformat, när ditt API-kontrakt kräver det.
