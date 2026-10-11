## Konwertuj lokalnie tekst OpenDocument

Otwórz dokument OpenDocument `.odt` lub szablon `.ott`, przekonwertuj go na PDF, sprawdź wynikowe strony i pobierz ten sam plik PDF, który jest widoczny w podglądzie. Do czytania bez konwersji służy [Przeglądarka ODT](../odt-viewer/).

## Wygląd PDF i zgodność

Silnik konwersji renderuje style stron, rozmiary papieru, orientację, nagłówki, stopki, kolumny, tabele i osadzone obrazy. Strony zachowują kolejność ustaloną podczas renderowania, w tym puste strony wstawione przez style stron. Obsługiwany tekst nadal można zaznaczać; rozpoznawanie OCR nie jest wykonywane dla zeskanowanego tekstu. Brakujące czcionki są zastępowane dołączonymi czcionkami, więc podział na wiersze, odstępy i podział na strony mogą się zmienić. Złożone układy mogą różnić się od tych w aplikacji źródłowej. Sprawdź każdą stronę, zanim zaczniesz polegać na pliku PDF.

PDF jest statycznym wynikiem eksportu. Kontrolki formularzy wyglądają tak jak na wydruku. Komentarze, makra i podpisy cyfrowe nie są zachowywane ani weryfikowane. Osadzone obiekty, multimedia i zewnętrzne zasoby dokumentu nie są obsługiwane. Chronione dokumenty, uszkodzone pakiety lub wykryte braki treści powodują błąd bez udostępniania niekompletnego pliku do pobrania. Zmiana rozszerzenia nie zmienia rzeczywistego formatu pliku.

## Prywatność i zasoby przeglądarki

Konwersja odbywa się na Twoim urządzeniu. Podczas pierwszej konwersji pobierane są pliki silnika i czcionek o łącznym rozmiarze około 90 MB, które przeglądarka może zapisać w pamięci podręcznej; sam dokument nigdy nie jest przesyłany na serwer. Silnik jest wczytywany dopiero po wybraniu pliku. Wymagana jest aktualna przeglądarka obsługująca WebAssembly i pamięć współdzieloną. Duże lub złożone dokumenty mogą wymagać czasu i pamięci. Możesz anulować konwersję, zamknąć plik lub go zastąpić. Nie ma stałego limitu rozmiaru pliku ani liczby stron.
