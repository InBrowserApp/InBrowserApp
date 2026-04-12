## Che cos'è JSON Schema?

JSON Schema è uno standard per descrivere la struttura dei dati JSON. Permette di esprimere tipi di campo, strutture annidate, chiavi obbligatorie e vincoli utili alla validazione.

### Cosa fa questo generatore

Incolla un JSON di esempio e lo strumento deduce uno schema iniziale per oggetti, array, numeri, booleani, valori null e formati stringa comuni. Il risultato può poi essere copiato, scaricato e rifinito.

### Esempio

Per esempio, con questo payload di esempio:

**Input di esempio**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schema generato**

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

### Suggerimenti

- Usa dati di esempio rappresentativi, soprattutto negli array, per individuare meglio i campi facoltativi.
- Disattiva “Infer required properties” se l'input è solo un esempio parziale.
- Disattiva “Allow additional properties” se vuoi uno schema più rigoroso per impostazione predefinita.
- Mantieni attivo il rilevamento dei formati per riconoscere email, URI, UUID e date-time.
