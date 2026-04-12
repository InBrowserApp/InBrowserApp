## Wat is JSON Schema?

JSON Schema is een standaard om de structuur van JSON-gegevens te beschrijven. Je kunt er veldtypen, geneste structuren, verplichte sleutels en validatievriendelijke beperkingen mee vastleggen.

### Wat deze generator doet

Plak voorbeeld-JSON en het hulpmiddel leidt een eerste schema af voor objecten, arrays, getallen, booleans, null-waarden en veelvoorkomende stringformaten. Het resultaat kun je kopiëren, downloaden en verder verfijnen.

### Voorbeeld

Bijvoorbeeld met deze voorbeelddataset:

**Voorbeeldinvoer**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Gegenereerd schema**

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

- Gebruik representatieve voorbeelddata, vooral in arrays, zodat optionele velden beter worden herkend.
- Schakel “Infer required properties” uit als je invoer slechts een gedeeltelijk voorbeeld is.
- Schakel “Allow additional properties” uit als je standaard een strenger schema wilt.
- Laat formaatdetectie aanstaan om email, URI, UUID en date-time automatisch te herkennen.
