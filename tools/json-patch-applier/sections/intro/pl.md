## Jak zastosować JSON Patch

Wklej oryginalny dokument JSON do pierwszego edytora, a tablicę JSON Patch zgodną z RFC 6902 do drugiego. Wybierz **Zastosuj poprawkę**, aby wyświetlić podgląd i skopiować zmieniony JSON. Aby wygenerować poprawkę, użyj narzędzia [Porównywanie JSON według ścieżek](../json-diff-path/), porównaj oryginalny i zmieniony dokument, a następnie skopiuj wynik z karty **JSON Patch**. Zastosuj poprawkę do tego samego dokumentu oryginalnego.

## Przykład JSON Patch

Oryginalny dokument zawiera stan i jedną etykietę.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Poprawka sprawdza oryginalny stan, aktualizuje go i dodaje etykietę.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Wynikiem jest `{"status":"published","tags":["api","release"]}`.

## Obsługiwane operacje i składnia JSON Pointer

- `add` tworzy lub nadpisuje pole obiektu, wstawia element do tablicy albo zastępuje dokument w korzeniu.
- `remove` usuwa istniejącą wartość. `replace` zastępuje istniejącą wartość nową.
- `move` pobiera istniejącą wartość ze ścieżki `from` i wstawia ją pod ścieżkę `path`. Operacja `copy` wstawia niezależną kopię.
- `test` sprawdza, czy wartość pod ścieżką `path` jest równa podanej wartości `value`, bez zmiany dokumentu.

Ścieżki używają składni JSON Pointer z RFC 6901. Indeksy tablic zaczynają się od zera, dlatego `/tags/0` wskazuje pierwszą etykietę, a `/tags/-` podczas wstawiania dodaje wartość na końcu tablicy. W kluczu obiektu użyj `~1` zamiast ukośnika i `~0` zamiast tyldy. Na przykład `/a~1b` wskazuje klucz `a/b`. Pusta ścieżka `""` wskazuje cały dokument, a `/` wskazuje pole o pustym kluczu.

## Dlaczego operacja JSON Patch się nie powiodła

Operacje są wykonywane w kolejności, w jakiej występują w tablicy. Każda operacja korzysta z wyniku poprzednich. Jeśli cel nie istnieje, indeks wykracza poza zakres tablicy lub wartość sprawdzana przez `test` jest inna niż oczekiwana, narzędzie wyróżnia pierwszy błąd i przerywa działanie. Podgląd JSON pojawia się po pomyślnym zastosowaniu całej poprawki. Pusta tablica operacji `[]` zwraca oryginalny dokument.

Przeglądarka stosuje poprawkę lokalnie. Oryginalny JSON i poprawka pozostają w przeglądarce.
