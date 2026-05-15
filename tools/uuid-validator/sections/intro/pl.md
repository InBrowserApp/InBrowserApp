## Czym jest walidator UUID?

Walidator UUID sprawdza, czy identyfikator jest zapisany w standardowej 36-znakowej postaci UUID, takiej jak `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Przydaje się, gdy trzeba zweryfikować identyfikatory skopiowane z logów, API, baz danych, danych testowych lub danych wpisanych przez użytkownika, zanim użyjesz ich w kodzie.

### Obsługiwane dane wejściowe

To narzędzie waliduje kanoniczny tekst UUID z pięcioma grupami szesnastkowymi w układzie `8-4-4-4-12`. Wielkie litery są akceptowane i normalizowane do małych. nil UUID (`00000000-0000-0000-0000-000000000000`) i max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) są traktowane jako prawidłowe wartości specjalne.

### Szczegóły walidacji

Dla standardowych UUID walidator sprawdza półbajt wersji i bity wariantu. Rozpoznawane są wersje od 1 do 8, obejmujące starsze UUID z RFC 4122 oraz nowsze układy z RFC 9562, takie jak UUID v6, v7 i v8. Panel wyników dzieli też UUID na pięć segmentów, aby można było sprawdzić dokładne bajty poddawane walidacji.

### Prywatność

Walidacja działa w całości w przeglądarce. Wklejony UUID nie jest przesyłany, więc narzędzie jest bezpieczne do pracy z wewnętrznymi identyfikatorami, kluczami baz danych i przykładowymi logami produkcyjnymi, które powinny pozostać lokalnie.
