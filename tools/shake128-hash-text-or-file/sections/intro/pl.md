## Czym jest SHAKE128 (FIPS 202)?

SHAKE128 (FIPS 202) to funkcja o rozszerzalnej długości wyjścia (XOF) z rodziny SHA-3. W przeciwieństwie do funkcji skrótu o stałej długości może zwracać dowolną liczbę bitów wyjściowych, zachowując 128-bitowy poziom bezpieczeństwa. Jest standaryzowana przez NIST w FIPS 202 i oparta na konstrukcji gąbki Keccak.

Ta elastyczność ma znaczenie, gdy protokół, format pliku lub wewnętrzna reguła sumy kontrolnej wymagają konkretnej długości skrótu. W tym narzędziu możesz haszować zwykły tekst lub przesłane pliki i wybierać długość wyjścia w bitach, o ile jest wielokrotnością 8.

Typowe zastosowania obejmują haszowanie protokołów, wyprowadzanie kluczy, kryptograficzne skróty o zmiennej długości oraz przepływy pracy związane z integralnością danych, w których te same dane wejściowe i ta sama długość wyjścia muszą zawsze dawać ten sam wynik.
