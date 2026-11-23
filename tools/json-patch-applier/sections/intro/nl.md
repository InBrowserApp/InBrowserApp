## Een JSON Patch toepassen

Plak het oorspronkelijke JSON-document in de eerste editor en de RFC 6902 JSON Patch-array in de tweede. Kies **Patch toepassen** om de bijgewerkte JSON te bekijken en te kopiëren. Als je een patch wilt maken, vergelijk je het oorspronkelijke en het gewijzigde document in [JSON-verschillen per pad](../json-diff-path/) en kopieer je de uitvoer onder **JSON Patch**. Pas de patch vervolgens toe op hetzelfde oorspronkelijke document.

## Voorbeeld van een JSON Patch

Het oorspronkelijke document bevat een status en één tag.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Deze patch controleert de oorspronkelijke status, werkt die bij en voegt een tag toe.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Het resultaat is `{"status":"published","tags":["api","release"]}`.

## Ondersteunde bewerkingen en JSON Pointer-syntaxis

- `add` maakt of overschrijft een objectveld, voegt een item in een array in of vervangt het hele document via het hoofdpad.
- `remove` verwijdert een bestaande waarde. `replace` vervangt een bestaande waarde door een nieuwe.
- `move` haalt een bestaande waarde op via de pointer `from` en voegt die in op `path`. `copy` voegt een onafhankelijke kopie in.
- `test` vergelijkt de waarde op `path` met de opgegeven `value` zonder het document te wijzigen.

De paden volgen de JSON Pointer-syntaxis van RFC 6901. Array-indexen beginnen bij nul. Zo verwijst `/tags/0` naar de eerste tag en voegt `/tags/-` bij een toevoegbewerking een waarde toe aan het einde van de array. Gebruik in een objectsleutel `~1` voor een schuine streep en `~0` voor een tilde. Zo verwijst `/a~1b` naar de sleutel `a/b`. Het lege pad `""` verwijst naar het hele document. Het pad `/` verwijst naar een veld met een lege sleutel.

## Waarom een JSON Patch-bewerking mislukt

Bewerkingen worden uitgevoerd in de volgorde van de array. Elke bewerking gebruikt het resultaat van de voorgaande bewerkingen. Als een doel ontbreekt, een index buiten de array valt of een `test`-waarde afwijkt, markeert de tool de eerste mislukte bewerking en stopt de verwerking. Je krijgt alleen een JSON-voorbeeld als de hele patch slaagt. Een lege patch-array `[]` geeft het oorspronkelijke document terug.

De browser past de patch lokaal toe. De oorspronkelijke JSON en de patch blijven in je browser.
