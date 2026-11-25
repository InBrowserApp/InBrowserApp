## Jak wygenerować zestaw testowych adresów e-mail

Wybierz domenę, podaj liczbę adresów i kliknij **Generuj**. Opcja **Dowolna domena przykładowa** pozwala uzyskać w jednym zestawie adresy z różnych domen. Każdy adres pojawia się w zestawie tylko raz. Skopiuj wyniki do formularza lub arkusza kalkulacyjnego albo pobierz plik tekstowy w kodowaniu UTF-8 z jednym adresem w każdym wierszu i użyj go jako danych testowych.

## Z jakich domen pocztowych mogę korzystać?

Faker.js generuje adresy w domenach `example.com`, `example.net` i `example.org`. Te [zarezerwowane domeny przykładowe](https://www.iana.org/help/example-domains) służą do tworzenia dokumentacji i danych przykładowych. W adresie `alex.morgan42@example.com` fragment przed znakiem `@` to część lokalna, a `example.com` to domena. Wybierz jedną domenę, gdy test wymaga stałej wartości, lub wymieszaj domeny, aby sprawdzić filtrowanie i import.

## Co mogę przetestować przy użyciu tych adresów?

Użyj przykładowych adresów, aby przetestować pola formularzy rejestracyjnych, formatowanie adresów e-mail, listy kont lub usuwanie duplikatów w bazie danych. Generator tworzy adresy w postaci tekstu bez zakładania skrzynek pocztowych. Aby sprawdzić dostarczanie wiadomości lub działanie linków weryfikacyjnych, użyj skrzynki, do której masz dostęp, albo testowego środowiska pocztowego swojego projektu.
