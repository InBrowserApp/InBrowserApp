## Czym jest Base85?

Base85 to kodowanie binarne-na-tekst, które zamienia 4 bajty na 5 znaków drukowalnych. Jest gęstsze niż Base64, a to narzędzie pozwala wybrać ASCII85 lub Z85 zależnie od formatu oczekiwanego przez odbiorcę.

## Kiedy go używać?

- Gdy chcesz zakodować surowe bajty, tekst lub pliki do kanałów tekstowych i zachować względnie zwięzły wynik.
- Użyj ASCII85, gdy potrzebujesz elastycznego formatu Base85 obsługującego niepełne końcowe bajty.
- Użyj Z85, gdy potrzebujesz tekstu Base85 zgodnego z ZeroMQ, a długość wejścia jest dokładną wielokrotnością 4 bajtów.

## O czym pamiętać?

- Base85 to format kodowania, a nie szyfrowanie.
- ASCII85 i Z85 używają różnych alfabetów, więc nie są zamienne.
- Z85 odrzuca dane, których długość w bajtach nie dzieli się przez 4, podczas gdy ASCII85 potrafi zakodować częściowe bloki końcowe.
