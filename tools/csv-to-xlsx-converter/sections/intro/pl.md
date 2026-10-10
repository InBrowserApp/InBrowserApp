## Konwertuj tekst z separatorami na Excel

Otwórz lub upuść lokalny plik CSV lub TSV, sprawdź komórki i pobierz skoroszyt XLSX z jednym arkuszem o nazwie Sheet1. Wybierz separator i kodowanie tekstu, jeśli automatyczne wykrywanie nie pasuje do pliku. Pliki TSV domyślnie używają tabulatorów. Okno podglądu nie ogranicza eksportowanych danych.

## Zachowaj identyfikatory i oryginalny tekst

CSV i TSV nie przechowują typów komórek arkusza kalkulacyjnego. Ten konwerter zachowuje każde pole jako tekst, w tym zera wiodące, długie identyfikatory, wartości wyglądające jak liczby dziesiętne, daty i tekst zaczynający się od znaku równości. Nie interpretuje pól jako liczb ani dat i nie wykonuje formuł. Separatory w polach ujętych w cudzysłowy, cudzysłowy zapisane jako sekwencje ucieczki, Unicode, podziały wiersza wewnątrz pól, puste pola i puste rekordy są zachowywane. Krótsze wiersze pozostawiają puste komórki. Końcowy znak końca wiersza zamyka ostatni rekord zamiast dodawać kolejny wiersz.

Ustawienie pierwszego wiersza pozwala wybrać zwykłe dane lub nagłówek z filtrami programu Excel. Obie opcje zachowują wiersz dokładnie w zapisanej postaci, w tym powtórzone lub puste nagłówki. Automatyczne kodowanie obsługuje UTF-8 i UTF-16 ze znacznikiem kolejności bajtów. Inne kodowania można wybrać ręcznie. Początkowa instrukcja sep= jest pomijana tylko wtedy, gdy wybrano automatyczne wykrywanie separatora lub gdy podany w niej separator odpowiada wybranemu separatorowi.

Pola z nieprawidłowymi cudzysłowami, nieprawidłowe kodowanie tekstu i dane przekraczające limity programu Excel dotyczące wierszy, kolumn lub tekstu w komórce powodują błąd zamiast utworzenia obciętego skoroszytu. Po pobraniu sprawdź ważne wartości w programie do arkuszy kalkulacyjnych.

## Przetwarzanie lokalne

Konwersja odbywa się w tej przeglądarce bez przesyłania pliku na serwer. Zmiana ustawień importu, zastąpienie lub zamknięcie pliku usuwa poprzedni wynik. Anulowanie zatrzymuje zadanie w tle. Nie ma stałego limitu rozmiaru pliku; dostępna pamięć przeglądarki decyduje, które pliki można przetworzyć.

Aby przeglądać pliki arkuszy kalkulacyjnych, otwórz narzędzie [Przeglądarka arkuszy kalkulacyjnych](../xlsx-viewer/).
