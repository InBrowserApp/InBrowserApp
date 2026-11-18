## Wie das Tool die Felder ableitet

Das Tool berücksichtigt alle Elemente eines Arrays. In diesem Beispiel enthält nur der erste Datensatz das Feld `active`, daher wird es optional. Beide Datensätze enthalten `name`: einmal als Zeichenkette und einmal als `null`. Das Feld bleibt deshalb erforderlich und erhält den Typ `string | null`.

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

Ist ein Array im Beispiel leer, erhält es den Elementtyp `unknown`. Füge Datensätze mit unterschiedlichen Strukturen hinzu, die deine API tatsächlich zurückgibt. So bildet das Ergebnis die API besser ab.

## Wann sich TypeScript oder Zod eignet

Verwende **TypeScript** für Prüfungen im Editor und beim Kompilieren. Mit **Zod** validierst du eingehende Daten zur Laufzeit über `apiResponseSchema.safeParse(data)`. Die generierte Zod-Datei exportiert auch den TypeScript-Typ. Ergänze bei Bedarf Regeln aus deinem API-Vertrag, etwa zulässige Werte oder Formate für Zeichenketten.
