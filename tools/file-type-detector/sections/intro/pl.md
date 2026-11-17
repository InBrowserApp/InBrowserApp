## Jak działa wykrywanie typu pliku

To narzędzie odczytuje do pierwszych 64 KiB lokalnego pliku i sprawdza jego
sygnaturę binarną za pomocą [file-type](https://github.com/sindresorhus/file-type).
Wynik obejmuje wykryty typ MIME, oczekiwane rozszerzenia oraz podgląd pierwszych
256 bajtów w zapisie szesnastkowym i ASCII. Nic nie jest przesyłane.

## Dlaczego rozszerzenie może być niezgodne

Zmiana nazwy pliku zmienia jego nazwę, a nie zawartość. Plik PNG o nazwie
photo.jpg nadal ma sygnaturę PNG. Popularne alternatywne rozszerzenia, takie jak
.jpg i .jpeg, są akceptowane. Typ MIME zgłoszony przez przeglądarkę jest
wyświetlany osobno, ponieważ często wynika z nazwy pliku, a nie z analizy bajtów.

## Ograniczenia wykrywania

Sygnatury są wskazówkami, a nie dowodem poprawności czy bezpieczeństwa pliku.
Formaty tekstowe, takie jak TXT, CSV i SVG, mogą nie zostać rozpoznane. Krótka
próbka może wskazać ZIP lub inny kontener, nie potwierdzając jego podtypu, na
przykład dokumentu Office. Podgląd szesnastkowy przedstawia surową zawartość
pliku, a nie kryptograficzną sumę kontrolną.
