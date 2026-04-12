## Was ist JSON Schema?

JSON Schema ist ein Standard, um die Struktur von JSON-Daten zu beschreiben. Damit lassen sich Feldtypen, verschachtelte Strukturen, Pflichtschlüssel und validierungsfreundliche Einschränkungen maschinenlesbar ausdrücken.

### Was dieser Generator macht

Fügen Sie Beispiel-JSON ein, und das Tool leitet ein erstes Schema für Objekte, Arrays, Zahlen, Booleans, null-Werte und häufige String-Formate ab. Das Ergebnis können Sie kopieren, herunterladen und weiter verfeinern.

### Beispiel

Zum Beispiel mit diesem Beispieldatensatz:

**Beispieleingabe**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Generiertes Schema**

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

### Tipps

- Verwenden Sie möglichst repräsentative Beispieldaten, besonders in Arrays, damit optionale Felder besser erkannt werden.
- Deaktivieren Sie „Infer required properties“, wenn Ihre Eingabe nur ein unvollständiges Beispiel ist.
- Deaktivieren Sie „Allow additional properties“, wenn standardmäßig ein strengeres Schema entstehen soll.
- Lassen Sie die Formaterkennung aktiv, um email, URI, UUID und date-time automatisch zu erkennen.
