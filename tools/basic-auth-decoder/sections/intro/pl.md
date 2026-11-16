## Co robi to narzędzie

Zdekoduj nagłówek HTTP Basic Authorization, aby wyodrębnić nazwę użytkownika i hasło z Base64. Przydatne do debugowania i testowania API.

## Akceptowane dane wejściowe

Wklej coś w rodzaju: Basic dXNlcjpwYXNz
To narzędzie akceptuje również pełny wiersz `Authorization: Basic ...`.

## Uwagi

- Base64 jedynie koduje dane logowania; nie chroni ich.
- Dekoder dzieli tekst na pierwszym `:`, a resztę pozostawia w haśle.
- Wszystko działa lokalnie w przeglądarce.
