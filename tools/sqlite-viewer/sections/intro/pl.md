## Przeglądaj bazy SQLite w przeglądarce

Otwórz bazę SQLite 3, aby przeglądać tabele i widoki, sprawdzać kolumny, indeksy, klucze obce oraz instrukcje CREATE lub wykonać zapytanie SQL tylko do odczytu. Wypróbuj przykładową bazę, aby poznać obszar roboczy. Plik jest przetwarzany lokalnie i nigdy nie jest modyfikowany.

## Wykonuj zapytania i eksportuj wyniki

Wybierz tabelę lub widok, aby załadować wiersze, a następnie edytuj SQL, by filtrować, sortować lub łączyć dane. Wykonaj jedną instrukcję SELECT, WITH lub EXPLAIN przyciskiem **Wykonaj zapytanie** lub skrótem **Ctrl/⌘ + Enter**. Kliknij komórkę, aby sprawdzić i skopiować jej pełną wartość.

Wybierz limit wyników wynoszący 100, 1000 lub 10 000 wierszy i przeglądaj wynik po 50 wierszy na stronie. Zapytania mają limit 10 sekund, a wyniki — limit rozmiaru 5 MiB. Eksport CSV i JSON obejmuje wszystkie załadowane wiersze ze wszystkich stron.

JSON używa oddzielnych tablic nazw kolumn i wierszy, aby zachować powtarzające się nazwy i wartości NULL. Liczby całkowite są dokładnymi ciągami dziesiętnymi, a wartości BLOB zawierają szesnastkową wartość `$blob`. CSV zawiera wiersz nagłówka, zapisuje NULL jako puste pola i dodaje apostrof przed tekstem przypominającym formuły.

## Obsługiwane pliki SQLite

Otwórz nieszyfrowany plik `.db`, `.sqlite` lub `.sqlite3` o rozmiarze do 50 MiB. W przypadku bazy używającej WAL utwórz kopię po wykonaniu checkpointu przed jej otwarciem; pliki pomocnicze WAL i journal nie są ładowane. Niestandardowe rozszerzenia SQLite nie są obsługiwane. Pliki i zapytania nie są automatycznie zapisywane.
