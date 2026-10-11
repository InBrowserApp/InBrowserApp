## Konwertuj dokument AsciiDoc lokalnie

Otwórz lokalny dokument `.adoc` lub `.asciidoc`, obejrzyj wygenerowane strony i pobierz plik PDF widoczny w podglądzie. Plik PDF jest generowany bezpośrednio; okno drukowania nie jest potrzebne. Obsługiwane są źródła w kodowaniu UTF-8 oraz UTF-16 ze znacznikiem BOM. Aby czytać bez konwersji, użyj narzędzia [Przeglądarka AsciiDoc](../asciidoc-viewer/).

## Wynik wydruku i obsługiwane źródła

Dokument jest renderowany ze stałym motywem wydruku na stronach A4 w orientacji pionowej z marginesami 18 mm, a następnie zapisywany jako obrazy stron w rozdzielczości 150 DPI. Uwzględniane są obsługiwane tytuły, sekcje, akapity, listy, tabele, kod, wyróżnione uwagi, oznaczenia z objaśnieniami, przypisy, jawne podziały stron i osadzone obrazy rastrowe. Szerokie tabele i kod są ponownie rozmieszczane, aby dopasować je do szerokości strony. Tekstu w pliku PDF nie można zaznaczać, rozpoznawanie tekstu (OCR) nie jest wykonywane, a linki interaktywne nie są dodawane. Czcionki, odstępy i podział na strony mogą różnić się od innych narzędzi AsciiDoc. Sprawdź każdą stronę przed wykorzystaniem wyniku.

Dołączane pliki, brakujące zasoby obrazów lub stylów, obrazy, których nie można odczytać, ostrzeżenia parsera i nierozwiązane atrybuty zatrzymują konwersję bez możliwości pobrania częściowego wyniku. Najpierw połącz wymaganą treść źródłową w jeden samodzielny dokument. Własne makra, diagramy, rozszerzenia, motywy projektu i osadzone czcionki nie są obsługiwane; nieobsługiwana notacja może pozostać tekstem. Skrypty, formularze, osadzone aplikacje, SVG i MathML są pomijane. Aktywna zawartość w przekazywanym bez przetwarzania kodzie HTML jest usuwana. Rozmiary papieru określone w źródle są zastępowane stałym układem A4.

## Prywatność i zasoby przeglądarki

Twój dokument pozostaje w tej przeglądarce. Pliki źródłowe, obrazy i inne zasoby nigdy nie są pobierane z komputera ani z sieci, a zawartość plików nigdy nie jest przesyłana. Osadzone dane rastrowe są odczytywane z wybranego dokumentu. Duże pliki mogą wymagać czasu i pamięci, ponieważ każda strona jest renderowana jako obraz. Możesz anulować konwersję, zamknąć lub zastąpić dokument. Nie ma stałego limitu rozmiaru pliku ani liczby stron; rzeczywiste problemy z zasobami przeglądarki powodują wyświetlenie błędu, gdy można je wykryć.
