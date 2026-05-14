## Czym jest CityHash64?

CityHash64 to szybki niekryptograficzny algorytm haszujący od Google, który tworzy 64-bitową (8-bajtową) wartość. Przydaje się, gdy potrzebujesz zwartego, deterministycznego odcisku dla tekstu lub plików, a szybkość jest ważniejsza niż bezpieczeństwo kryptograficzne.

**Kluczowe cechy:**

- **Szybki i deterministyczny**: Te same dane wejściowe i seed zawsze dają ten sam 64-bitowy hash
- **Niekryptograficzny**: Nie używaj CityHash64 do haseł, podpisów, tokenów ani odpornych na manipulacje kontroli integralności
- **Obsługuje seed**: Pozostaw seed pusty dla standardowego CityHash64 albo wpisz seed dziesiętny lub szesnastkowy z prefiksem `0x`, gdy potrzebujesz osobnej przestrzeni hashy z seedem
- **Przetwarzanie lokalne**: Tekst i pliki są hashowane w przeglądarce; przesłane pliki nie są wysyłane na serwer
- **Wiele kodowań**: Wyniki są pokazywane jako wartości szesnastkowe, Base64, dziesiętne i binarne

**Typowe zastosowania:**

- Tabele hashujace i struktury danych
- Odciski plików niezwiązane z bezpieczeństwem
- Deduplikacja i grupowanie danych
- Klucze cache i klucze shardingu
- Dane testowe regresji dla systemów, które już używają CityHash64
- Indeksowanie baz danych
