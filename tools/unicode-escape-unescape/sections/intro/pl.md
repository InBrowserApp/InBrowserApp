## Czym jest kodowanie Unicode?

Kodowanie Unicode (escaping) polega na zamianie znaków na zakodowane sekwencje reprezentujące ich punkty kodowe Unicode. Jest to niezbędne, gdy kod źródłowy, pliki konfiguracyjne lub formaty danych nie mogą bezpośrednio zawierać niektórych znaków.

**Popularne formaty kodowania:**

- `\uXXXX` — JavaScript / JSON, stosowany w większości języków programowania
- `\u{XXXXX}` — ES6+ JavaScript, obsługuje znaki uzupełniające bez par zastępczych (surrogate pairs)
- `&#xXXXX;` / `&#DDDD;` — encje HTML w formie szesnastkowej lub dziesiętnej
- `U+XXXX` — standardowa notacja Unicode używana w dokumentacji
- `\xXX` / `%XX` — kodowanie na poziomie bajtów UTF-8, popularne w adresach URL i językach typu C
- `\UXXXXXXXX` — 8-cyfrowy format Pythona dla dowolnego punktu kodowego
- `0xXXXX` — notacja literałów szesnastkowych

## Kiedy używać tego narzędzia

- Osadzanie znaków spoza ASCII w kodzie źródłowym lub plikach konfiguracyjnych wymagających kodowania zgodnego z ASCII
- Debugowanie zniekształconego tekstu poprzez inspekcję bazowych punktów kodowych Unicode
- Konwersja między różnymi notacjami kodowania przy przenoszeniu kodu między językami lub formatami
- Przygotowywanie tekstu dla kontekstów JSON, HTML lub URL wymagających kodowania encji

## Jak to działa

Wpisz lub wklej zwykły tekst po lewej stronie, a narzędzie zakoduje znaki spoza ASCII w wybranym formacie. Wklej zakodowany tekst po prawej stronie, a narzędzie automatycznie wykryje i odkoduje wszystkie obsługiwane formaty jednocześnie. Wszystko działa lokalnie w przeglądarce.
