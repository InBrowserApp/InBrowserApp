## Czytaj tekst i dzienniki lokalnie

Otwórz plik .txt, .text lub .log, aby czytać go z numerami wierszy, regulowanym rozmiarem tekstu, opcjonalnym zawijaniem i trybem skupienia. Przejdź do wiersza, początku lub końca pliku albo użyj funkcji Znajdź tekst, aby przeszukać cały plik. Wyszukiwanie jest dosłowne i rozróżnia wielkość liter; następne i poprzednie dopasowania są wyszukiwane cyklicznie.

## Duże pliki i długie wiersze

Przeglądarka wyświetla po jednej sekcji, aby ułatwić korzystanie z dużych plików. Każda sekcja pozostaje dostępna, łącznie z dalszym ciągiem bardzo długich wierszy. Zaznaczanie i polecenie Znajdź w przeglądarce obejmują bieżącą sekcję; funkcja Znajdź tekst w przeglądarce plików przeszukuje cały zdekodowany plik, również dopasowania przekraczające granice sekcji. Nie ma narzuconego limitu rozmiaru pliku ani liczby wierszy. Praktyczne ograniczenie nadal stanowi pamięć dostępna w przeglądarce.

Puste wiersze, tabulatory, mieszane zakończenia wierszy CRLF/CR/LF i tekst Unicode są zachowywane. Zakończenia wierszy są wyświetlane jako podziały wierszy. Znaczniki i sekwencje sterujące terminala pozostają nieaktywnym tekstem. Niektóre znaki sterujące nie mają widocznego glifu; przy plikach zawierających znaki NUL pojawia się informacja o możliwym pliku binarnym.

## Wybierz właściwe kodowanie

Tryb automatyczny rozpoznaje znaczniki kolejności bajtów UTF-8 i UTF-16, a w pozostałych przypadkach ściśle stosuje UTF-8. Możesz wybrać UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 lub Shift JIS. Błąd dekodowania zatrzymuje podgląd zamiast po cichu zastępować nieczytelne znaki. Spróbuj innego kodowania, jeśli plik jest nieczytelny lub znaki są zniekształcone; przeglądarka nie potrafi określić pierwotnego kodowania każdego pliku.

Pliki są przetwarzane na Twoim urządzeniu bez przesyłania, zdalnych zasobów i automatycznego zapisywania. Zamknięcie lub zastąpienie pliku zwalnia jego sesję odczytu. Ta przeglądarka nie edytuje plików, nie interpretuje HTML ani poleceń terminala i nie śledzi dziennika na żywo.
