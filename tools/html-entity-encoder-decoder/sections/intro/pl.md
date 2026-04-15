## Co robi to narzędzie

- Koduje zwykły tekst jako nazwane, dziesiętne lub szesnastkowe encje HTML.
- Dekoduje zakodowane fragmenty z powrotem do czytelnego tekstu.
- Wszystko działa lokalnie w przeglądarce, więc dane nie opuszczają urządzenia.

## Kiedy go używać

- Escapować znaki specjalne przed wklejeniem HTML do dokumentacji, szablonów
  lub dem.
- Sprawdzać skopiowany markup zawierający `&amp;`, `&#60;` lub `&#x3C;`.
- Porównywać nazwane, dziesiętne i szesnastkowe encje pod kątem zgodności.

## Uwagi o formatach encji

- Nazwane encje są najbardziej czytelne, ale nie każdy znak ma nazwany
  odpowiednik.
- Encje dziesiętne i szesnastkowe mogą reprezentować dowolny znak Unicode,
  w tym emoji.
- Nieznane lub nieprawidłowe encje pozostają bez zmian podczas dekodowania.
