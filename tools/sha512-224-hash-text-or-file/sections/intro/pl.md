## Czym jest SHA-512/224 (FIPS 180-4)?

SHA-512/224 (FIPS 180-4) to kryptograficzna funkcja skrótu z rodziny SHA-2, która zwraca 224-bitowy (28-bajtowy) skrót, zwykle przedstawiany jako 56-znakowy ciąg szesnastkowy. Opiera się na SHA-512, ale używa innych wartości początkowych i skraca wynik, zapewniając krótszy skrót przy zachowaniu wewnętrznej struktury SHA-512.

**Główne cechy:**

- **Deterministyczność**: Te same dane wejściowe zawsze dają ten sam skrót
- **Szybkie obliczanie**: Skrót można szybko obliczyć dla dowolnych danych wejściowych
- **Efekt lawinowy**: Małe zmiany danych wejściowych prowadzą do radykalnie różnych wyników
- **Nieodwracalność**: Odtworzenie oryginalnych danych wejściowych na podstawie skrótu jest obliczeniowo niewykonalne
- **Odporność na kolizje**: Bardzo trudno znaleźć dwa różne zestawy danych wejściowych dające ten sam skrót

**Typowe zastosowania:**

- Podpisy cyfrowe i certyfikaty
- Kontrola integralności i sumy kontrolne
- Konstrukcje HMAC
- Weryfikacja plików i potoki przetwarzania danych
- Protokoły wymagające 224-bitowych skrótów
