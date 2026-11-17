## Sprawdzaj pliki Parquet w przeglądarce

Otwórz lub upuść plik `.parquet`, aby przeglądać dane oraz sprawdzać typ fizyczny, adnotację logiczną i powtarzalność każdego pola. Zagnieżdżone grupy pozostają widoczne w schemacie. Podsumowanie pokazuje liczbę wierszy, kolumny, grupy wierszy, kompresję oraz program, który utworzył plik, jeśli ta informacja jest dostępna. Możesz wypróbować dołączony przykład bez wybierania pliku.

## Przeglądaj dane i eksportuj CSV lub JSON

Dane są wczytywane strona po stronie. Używaj elementów sterujących stronami, aby poruszać się po pliku, i wybierz komórkę, aby odczytać jej pełną wartość. Przejdź do karty **Schemat**, aby sprawdzić pola. Użyj opcji **Eksportuj dane**, aby pobrać bieżącą stronę lub wszystkie wiersze jako CSV w UTF-8 albo tablicę JSON. Eksport całego pliku jest przygotowywany partiami i można go anulować.

CSV zawiera nazwy kolumn i ujmuje w cudzysłowy wartości zawierające przecinki, cudzysłowy oraz znaki nowego wiersza. Wartości null stają się pustymi polami CSV i pozostają `null` w JSON. Wartości zagnieżdżone używają JSON, a dane binarne tekstu szesnastkowego. Aby zachować 64-bitowe liczby całkowite, JSON zapisuje je jako ciągi znaków. Daty i znaczniki czasu używają tekstu ISO z dokładnością do milisekund. Liczby dziesiętne korzystają z precyzji numerycznej czytnika, dlatego ta przeglądarka nie umożliwia bezstratnej konwersji liczb dziesiętnych ani znaczników czasu o wysokiej precyzji.

## Przetwarzanie lokalne

Plik jest odczytywany lokalnie przez proces roboczy w tle i nigdy nie jest wysyłany. Przeglądarka najpierw odczytuje stopkę, a następnie tylko zakresy wierszy potrzebne do przeglądania. Dekodowanie grup wierszy Parquet może jednak wymagać znacznej ilości pamięci; rozmiar eksportu jest ograniczony pamięcią dostępną w przeglądarce. Biblioteka hyparquet i jej pakiet kompresorów obsługują dane nieskompresowane oraz kodeki Snappy, Gzip, Brotli, Zstandard i LZ4. Zaszyfrowane pliki Parquet nie są obsługiwane.
