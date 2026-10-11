## Konwertuj tekst formatowany lokalnie

Otwórz lokalny dokument `.rtf`, przekonwertuj go na PDF, sprawdź wynikowe strony i pobierz ten sam plik PDF, który widzisz w podglądzie. Do czytania bez konwersji użyj [Przeglądarki RTF](../rtf-viewer/).

## Wygląd pliku PDF i zgodność

Silnik konwersji renderuje rozmiary i orientację stron, nagłówki, stopki, podziały stron, tabele oraz obsługiwane osadzone obrazy PNG/JPEG. Obsługiwany tekst nadal można zaznaczać. Oryginalne kodowania znaków RTF i sekwencje ucieczki Unicode są przekazywane do silnika; rozpoznawanie tekstu (OCR) nie jest wykonywane dla zeskanowanego tekstu. Brakujące czcionki są zastępowane dołączonymi czcionkami, więc podział na wiersze, odstępy i podział na strony mogą się zmienić. Złożone układy mogą różnić się od tych w aplikacji źródłowej. Sprawdź każdą stronę, zanim zaczniesz polegać na pliku PDF.

PDF jest statycznym eksportem. Kontrolki formularzy mają wygląd jak na wydruku. Komentarze, makra i podpisy cyfrowe nie są zachowywane ani weryfikowane. Osadzone obiekty, zewnętrzne zasoby dokumentu, nieobsługiwane formaty obrazów i nieobsługiwane instrukcje pól są odrzucane. Uszkodzone lub nieczytelne pliki powodują błąd, a niekompletny plik nie jest udostępniany do pobrania. Zmiana rozszerzenia nie zmienia rzeczywistego formatu pliku.

## Prywatność i zasoby przeglądarki

Konwersja odbywa się na Twoim urządzeniu. Podczas pierwszej konwersji pobierane są pliki silnika i czcionek o łącznym rozmiarze około 90 MB, które przeglądarka może zapisać w pamięci podręcznej; sam dokument nigdy nie jest przesyłany na serwer. Silnik wczytuje się dopiero po wybraniu pliku. Wymagana jest aktualna przeglądarka obsługująca WebAssembly i pamięć współdzieloną. Duże lub złożone dokumenty mogą wymagać czasu i pamięci. Możesz anulować konwersję, zamknąć plik lub go zastąpić. Nie ma stałego limitu rozmiaru pliku ani liczby stron.
