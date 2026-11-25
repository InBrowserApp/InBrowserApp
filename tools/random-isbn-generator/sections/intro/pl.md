## Generowanie losowych numerów ISBN-10 lub ISBN-13

Wybierz `ISBN-13` do współczesnych formularzy katalogowych i sprzedażowych lub `ISBN-10` do starszych rekordów. Ustaw liczbę od `1` do `1000`, zdecyduj, czy uwzględnić łączniki, i wybierz **Generuj**. Skopiuj zestaw lub pobierz plik TXT z jednym numerem ISBN w każdym wierszu.

## Format i cyfra kontrolna

Międzynarodowy Znormalizowany Numer Książki (ISBN) identyfikuje wydanie i format książki. Wygenerowane numery `ISBN-13` mają prefiks `978` i kończą się cyfrą kontrolną. Numer `ISBN-10` może kończyć się znakiem `X`, który oznacza dziesięć w obliczeniu sumy kontrolnej. Przykłady to `978-0-306-40615-7` i `0-8044-2957-X`. Łączniki ułatwiają odczyt grup i nie zmieniają cyfry kontrolnej.

## Wykorzystanie wyników w danych testowych

Użyj tych przykładowych identyfikatorów do testowania formularzy katalogowych, importu i sprawdzania numerów ISBN. Aby wywołać błąd sumy kontrolnej, zastąp tylko ostatni znak inną cyfrą i ponów import. W arkuszu kalkulacyjnym lub bazie danych przechowuj numery ISBN jako tekst, aby zachować początkowe zero lub końcowy znak `X`. W przypadku opublikowanej książki weź numer ISBN z okładki danego wydania lub z rekordu wydawcy.
