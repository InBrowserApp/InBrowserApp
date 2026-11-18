## Slik utledes feltene

Verktøyet ser på alle elementene i en array. I dette eksemplet har bare den første posten `active`, så feltet blir valgfritt. Begge postene har `name`, med en streng i den ene og `null` i den andre. Feltet blir derfor obligatorisk og får typen `string | null`.

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

Hvis en array er tom i eksemplet, får elementene typen `unknown`. Ta med poster som viser de ulike strukturene API-et ditt returnerer, for å få et mer representativt resultat.

## Når bør du bruke TypeScript eller Zod?

Bruk **TypeScript** til kontroller i kodeeditoren og ved kompilering. Bruk **Zod** til å validere innkommende data ved kjøring med `apiResponseSchema.safeParse(data)`. Den genererte Zod-filen eksporterer også TypeScript-typen. Legg til API-spesifikke regler, som tillatte verdier eller strengformater, når API-kontrakten krever det.
