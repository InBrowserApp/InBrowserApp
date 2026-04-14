## Hva er JSON Schema?

JSON Schema er en standard for å beskrive strukturen i JSON-data. Den lar deg uttrykke felttyper, nestede strukturer, obligatoriske nøkler og begrensninger som passer for validering.

### Hva denne generatoren gjør

Lim inn eksempel-JSON, så utleder verktøyet et første schema for objekter, arrayer, tall, boolske verdier, null og vanlige strengformater. Resultatet kan kopieres, lastes ned og finjusteres videre.

### Eksempel

For eksempel med disse eksempeldataene:

**Eksempelinndata**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Generert schema**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Tips

- Bruk representative eksempeldata, spesielt inne i arrayer, slik at valgfrie felt blir lettere å oppdage.
- Slå av “Infer required properties” hvis inndataene bare er et delvis eksempel.
- Slå av “Allow additional properties” hvis du vil ha et strengere schema som standard.
- La formatgjenkjenning være aktiv for å gjenkjenne email, URI, UUID og date-time.
