## Vad är JSON Schema?

JSON Schema är en standard för att beskriva strukturen i JSON-data. Den gör det möjligt att uttrycka fälttyper, nästlade strukturer, obligatoriska nycklar och valideringsvänliga begränsningar.

### Vad den här generatorn gör

Klistra in exempel-JSON så härleder verktyget ett första schema för objekt, arrayer, tal, booleska värden, null och vanliga strängformat. Resultatet kan sedan kopieras, laddas ner och förfinas.

### Exempel

Till exempel med den här exempelposten:

**Exempelinmatning**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Genererat schema**

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

- Använd representativa exempeldata, särskilt i arrayer, så blir det lättare att upptäcka valfria fält.
- Stäng av “Infer required properties” om indata bara är ett delvis exempel.
- Stäng av “Allow additional properties” om du vill ha ett striktare schema från början.
- Låt formatdetektering vara aktiverad för att känna igen email, URI, UUID och date-time.
