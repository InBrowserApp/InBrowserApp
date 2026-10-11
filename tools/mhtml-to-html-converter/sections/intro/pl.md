## Konwertuj zapisane archiwum strony lokalnie

Otwórz lokalne archiwum `.mhtml` lub `.mht`, sprawdź przekonwertowaną stronę główną i pobierz samodzielny plik HTML w kodowaniu UTF-8. Dołączone zasoby pozostają w pliku, dzięki czemu można go otworzyć offline. Aby czytać odzyskane lub niekompletne archiwa, użyj [Przeglądarki MHTML](../mhtml-viewer/).

## Plik wynikowy i zgodność

Obsługiwane odwołania content-location i content-ID są rozpoznawane wewnątrz archiwum. Tekst, podstawowe formatowanie, tabele, linki, dołączone obrazy rastrowe i obsługiwane style są zachowywane w czytelnym, statycznym dokumencie. Tekst nadal można zaznaczać. Wewnętrzne zakładki pozostają w dokumencie, a linki zewnętrzne otwierają się tylko po ich wybraniu. Powiększenie podglądu nie zmienia pobieranego pliku. Czcionki i złożone układy mogą różnić się od oryginalnej zapisanej strony.

Skrypty, formularze, przekierowania, osadzone aplikacje, SVG i MathML są pomijane. Sesje witryny i funkcje interaktywne nie są przywracane. Niekompletne archiwa, nieobsługiwane kodowania tekstu, dodatkowe strony i brakujące zasoby zatrzymują konwersję bez możliwości pobrania częściowego pliku. Osadzone obrazy, w tym obrazy tła CSS, muszą zostać poprawnie zdekodowane. Jeśli konwersja się nie powiedzie, zapisz kompletną kopię samego głównego dokumentu. Wiadomości e-mail i zwykłe pliki HTML wymagają odpowiednich narzędzi.

## Prywatność i zasoby przeglądarki

Pliki pozostają w tej przeglądarce. Brakujące zasoby nigdy nie są pobierane z Twojego komputera ani z działającej witryny, a zawartość plików nigdy nie jest przesyłana. Wygenerowany plik HTML blokuje skrypty i wczytywanie zasobów zewnętrznych po otwarciu offline. Otwarcie linku zewnętrznego jest osobną czynnością, która może nawiązać połączenie z daną witryną. Możesz anulować operację, zamknąć archiwum lub je zastąpić. Nie ma stałego limitu rozmiaru pliku ani liczby stron; duże archiwa zależą od dostępnej pamięci przeglądarki, a błędy zasobów są zgłaszane, gdy można je wykryć.
