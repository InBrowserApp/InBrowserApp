## Czym jest ID mieszkańca ChRL?

18-znakowy numer ID mieszkańca ChRL zawiera kod adresu, datę urodzenia, kod sekwencji i cyfrę kontrolną. Ten walidator sprawdza te elementy offline i pomaga zrozumieć strukturę numeru.

### Jak działa walidacja

- Usuwa spacje i myślniki oraz normalizuje ostatni znak do wielkiego `X`
- Wymaga dokładnie 18 znaków: 17 cyfr oraz ostatniej cyfry albo `X`
- Dopasowuje pierwsze 6 cyfr do zbioru podziału administracyjnego z 2023 roku i analizuje 8-cyfrową datę urodzenia
- Ponownie oblicza cyfrę kontrolną z pierwszych 17 cyfr i porównuje ją z ostatnim znakiem

### Co pokazuje wynik

- Rozbicie regionu: prowincja, miasto, dystrykt/powiat oraz surowy kod regionu
- Datę urodzenia, aktualny wiek, kod sekwencji oraz płeć wyprowadzoną z kodu sekwencji
- Znormalizowany identyfikator oraz oczekiwaną i rzeczywistą cyfrę kontrolną do debugowania

### Przykład

`110101199001010015` można odczytać tak:

- `110101` -> dzielnica Dongcheng, Pekin
- `19900101` -> data urodzenia `1990-01-01`
- `001` -> kod sekwencji
- `5` -> cyfra kontrolna

### Ważna uwaga

To narzędzie wykonuje wyłącznie offline walidację struktury i sumy kontrolnej. Numer, który przechodzi te kontrole, nie potwierdza istnienia rzeczywistej tożsamości ani aktualnej ważności dokumentu.

Nazwy regionów opierają się na zbiorze podziału administracyjnego z 2023 roku.
