## Sprawdzaj pliki SQLite lokalnie

Otwórz bazę SQLite 3, aby przeglądać jej tabele i widoki, sprawdzać definicje kolumn, indeksy, klucze obce oraz instrukcje CREATE lub wykonać zapytanie SQL tylko do odczytu. Wypróbuj przykładową bazę, aby poznać obszar roboczy bez wybierania pliku. Pliki i zapytania pozostają w przeglądarce i nie są automatycznie zapisywane.

## Wykonuj zapytania i eksportuj wyniki

Wybierz tabelę, aby wyświetlić jej wiersze. Edytuj SQL i użyj przycisku **Wykonaj zapytanie** lub skrótu **Ctrl/⌘ + Enter**, aby wykonać jedną instrukcję SELECT, WITH lub EXPLAIN. Limit wyników ogranicza liczbę załadowanych wierszy; każda strona wyświetla 50 wierszy. Zapytanie może też zostać zatrzymane po osiągnięciu limitu 5 MiB wyników lub po 10 sekundach. Anulowanie pozwala zachować płynność interfejsu i powoduje ponowne załadowanie migawki bazy przy następnym zapytaniu.

Eksport CSV i JSON zawiera załadowany wynik, w tym wiersze z innych stron. JSON przechowuje nazwy kolumn i tablice wierszy oddzielnie, zachowując powtarzające się nazwy oraz wartości NULL. Liczby całkowite SQLite stają się dokładnymi ciągami dziesiętnymi, a wartości BLOB — obiektami z szesnastkową wartością `$blob`. CSV używa pustych pól dla NULL, ujmuje znaki specjalne w cudzysłowy i dodaje apostrof przed tekstem przypominającym formuły, aby bezpieczniej otwierać dane w arkuszu kalkulacyjnym.

## Obsługiwane bazy i limity

Otwórz nieszyfrowany plik `.db`, `.sqlite` lub `.sqlite3` o rozmiarze do 50 MiB. Oryginalny plik nigdy nie jest modyfikowany. Narzędzie ładuje migawkę do pamięci, więc zużycie pamięci może przekraczać rozmiar pliku. Pliki pomocnicze WAL i journal nie są importowane; przed otwarciem bazy tutaj utwórz w swojej aplikacji bazodanowej czystą kopię po wykonaniu checkpointu. Szyfrowane bazy, niestandardowe rozszerzenia SQLite i edycja baz nie są obsługiwane.
