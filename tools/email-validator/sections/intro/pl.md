## Czym jest walidacja e-mail?

Walidacja e-mail sprawdza, czy adres jest zgodny z typowymi regułami składni dla części lokalnej, znaku `@`, etykiet domeny i domeny najwyższego poziomu. Przydaje się podczas testowania formularzy, porządkowania przykładowych danych i wychwytywania oczywistych literówek przed wysłaniem.

### Co sprawdza ten walidator

- Pojedynczy znak `@` oddzielający część lokalną od domeny
- Limity długości dla całego adresu, części lokalnej i domeny
- Dozwolone znaki, położenie kropek, reguły myślników i strukturę TLD
- Znormalizowany wynik z domeną zapisaną małymi literami do porównania

### Przykłady

- Poprawny: `name@example.com`
- Poprawny: `first.last+news@example.co.uk`
- Niepoprawny: `name..dots@example.com`
- Niepoprawny: `user@-example.com`

Domeny międzynarodowe należy podawać w formacie Punycode ASCII, na przykład `user@xn--bcher-kva.example`.

### Czego to narzędzie nie sprawdza

- Czy skrzynka istnieje i może odbierać wiadomości
- Kontroli DNS, MX, SMTP ani dostawców tymczasowych adresów
- Czy dana strona zaakceptuje adres według własnych zasad biznesowych
