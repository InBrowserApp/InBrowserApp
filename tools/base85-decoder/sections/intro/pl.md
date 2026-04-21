## Dlaczego dekodowanie Base85 ma znaczenie

Base85 pojawia się wtedy, gdy dane binarne muszą przejść przez systemy tekstowe z mniejszym narzutem niż przy zapisie szesnastkowym lub Base64. Można je spotkać w strumieniach PostScript lub PDF, ładunkach Z85 w ZeroMQ, zrzutach debugowania, zarchiwizowanych eksportach i narzędziach, które wymagają znaków drukowalnych zamiast surowych bajtów binarnych.

## W czym pomaga ten dekoder

To narzędzie zamienia tekst ASCII85 lub Z85 z powrotem na oryginalne bajty bezpośrednio w przeglądarce. Możesz wkleić zakodowane dane, zaimportować plik, przełączyć alfabet tak, aby pasował do systemu źródłowego, podejrzeć wynik dekodowania i pobrać odzyskany plik binarny bez wysyłania czegokolwiek na serwer.

## O czym warto pamiętać

- ASCII85 i Z85 nie są zamienne. Wybranie niewłaściwego alfabetu zwykle powoduje błąd dekodowania albo uszkodzony wynik.
- Base85 to format kodowania, a nie szyfrowanie. Zdekodowany wynik może być zwykłym tekstem, skompresowaną zawartością albo dowolnymi danymi binarnymi.
- Z85 wymaga pełnych grup po 5 znaków, natomiast ASCII85 może również zawierać delimitery oraz skróty takie jak `z` dla bloków zerowych.
