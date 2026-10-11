## Konwertuj dokument AsciiDoc lokalnie

Otwórz lokalny plik `.adoc` lub `.asciidoc`, obejrzyj wyrenderowany dokument i pobierz samodzielny plik HTML w kodowaniu UTF-8. Plik otwiera się offline, a tekst pozostaje możliwy do zaznaczenia. Aby przejrzeć ostrzeżenia dotyczące źródła lub niedostępnych dołączanych plików przed konwersją, użyj narzędzia [Przeglądarka AsciiDoc](../asciidoc-viewer/).

## Plik wynikowy i zgodność

Nagłówki, listy, tabele, bloki kodu, uwagi, cytaty, przypisy, linki i obsługiwane osadzone obrazy rastrowe są zachowywane ze stałym motywem czytania. Wewnętrzne zakładki i przypisy pozostają w dokumencie; linki zewnętrzne otwierają się tylko po ich wybraniu. Szerokie bloki kodu i tabele przewijają się w poziomie. Powiększenie podglądu nie zmienia pobieranego pliku. Czcionki i odstępy mogą różnić się od innych narzędzi AsciiDoc.

Używaj samodzielnego źródła w kodowaniu UTF-8 lub UTF-16 ze znacznikiem BOM. Dołączane pliki oraz zewnętrzne zasoby obrazów i stylów nie są wczytywane. Niedostępne dołączane pliki, ostrzeżenia parsera, nierozwiązane atrybuty oraz brakujące lub nieczytelne zasoby zatrzymują eksport bez możliwości pobrania częściowego pliku. Osadzone obrazy, w tym obrazy tła CSS, muszą zostać poprawnie zdekodowane. Własne makra, diagramy, rozszerzenia i osadzone czcionki nie są obsługiwane. Skrypty, formularze, osadzone aplikacje, SVG i MathML są pomijane. Nieobsługiwana składnia źródła może pozostać zwykłym tekstem.

## Prywatność i zasoby przeglądarki

Pliki pozostają w tej przeglądarce. Brakujące zasoby nigdy nie są pobierane z Twojego komputera ani z witryny, a zawartość plików nigdy nie jest przesyłana. Wygenerowany plik HTML blokuje skrypty i automatyczne wczytywanie zasobów zewnętrznych. Otwarcie linku zewnętrznego jest osobną czynnością, która może nawiązać połączenie z daną witryną. Możesz anulować konwersję, zamknąć lub zastąpić dokument źródłowy. Nie ma stałego limitu rozmiaru pliku ani liczby stron; duże dokumenty zależą od dostępnej pamięci przeglądarki, a błędy zasobów są zgłaszane, gdy można je wykryć.
