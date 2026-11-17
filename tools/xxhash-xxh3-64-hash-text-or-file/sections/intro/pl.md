## Czym jest xxHash (XXH3 64)?

XXH3 to nowoczesny algorytm xxHash zaprojektowany z myślą o bardzo dużej szybkości i doskonałym rozkładzie wyników. XXH3 64 zwraca 64-bitową (8-bajtową) wartość skrótu, zwykle przedstawianą jako 16-znakowy ciąg szesnastkowy. Jest to niekryptograficzna funkcja skrótu z obsługą opcjonalnego ziarna, które pozwala uzyskiwać powtarzalne wyniki.

**Główne cechy:**

- **Wyjątkowa szybkość**: Zoptymalizowany pod kątem wydajności dla dużych danych wejściowych
- **Deterministyczność**: Te same dane wejściowe i ziarno zawsze dają ten sam skrót
- **Niekryptograficzny charakter**: Nie nadaje się do zastosowań związanych z bezpieczeństwem
- **Dobry rozkład**: Świetnie sprawdza się w tablicach mieszających i indeksowaniu
- **Obsługa ziarna**: Opcjonalne ziarno pozwala różnicować wyniki haszowania

**Typowe zastosowania:**

- Tablice mieszające i struktury danych
- Kontrola integralności plików (bez zastosowań związanych z bezpieczeństwem)
- Deduplikacja danych i dzielenie na bloki
- Klucze pamięci podręcznej i indeksowanie baz danych
- Potoki przetwarzania danych o wysokiej przepustowości
