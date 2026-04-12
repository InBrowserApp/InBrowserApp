## Czym jest JSON Schema?

JSON Schema to standard opisywania struktury danych JSON. Pozwala zapisać typy pól, zagnieżdżone struktury, wymagane klucze i ograniczenia przydatne podczas walidacji.

### Co robi ten generator

Wklej przykładowy JSON, a narzędzie wywnioskuje początkowy schema dla obiektów, tablic, liczb, wartości logicznych, null i typowych formatów tekstowych. Wynik można potem skopiować, pobrać i dopracować.

### Przykład

Na przykład dla takiego przykładowego ładunku:

**Przykładowe wejście**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Wygenerowany schema**

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

### Wskazówki

- Używaj reprezentatywnych danych przykładowych, zwłaszcza w tablicach, aby łatwiej wykryć pola opcjonalne.
- Wyłącz „Infer required properties”, jeśli wejście jest tylko częściowym przykładem.
- Wyłącz „Allow additional properties”, jeśli domyślnie chcesz bardziej restrykcyjny schema.
- Pozostaw wykrywanie formatów włączone, aby rozpoznawać email, URI, UUID i date-time.
