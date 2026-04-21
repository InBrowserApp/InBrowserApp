## Czym jest xxHash (XXH3 128)?

XXH3 to nowoczesny algorytm xxHash zaprojektowany z myślą o bardzo wysokiej szybkości i świetnym rozkładzie wartości. XXH3 128 generuje 128-bitową (16-bajtową) wartość skrótu, zwykle prezentowaną jako 32-znakowy ciąg szesnastkowy. Jest to skrót niekryptograficzny i obsługuje opcjonalne ziarno, aby uzyskać powtarzalne wyniki.

**Najważniejsze cechy:**

- **Bardzo szybki**: Zoptymalizowany pod kątem wydajności przy dużych danych wejściowych
- **Deterministyczny**: To samo wejście i to samo ziarno zawsze dają ten sam skrót
- **Niekryptograficzny**: Nie nadaje się do celów bezpieczeństwa
- **Dobry rozkład**: Przydatny w tablicach haszujących i indeksowaniu
- **Obsługa ziarna**: Opcjonalne ziarno pomaga różnicować wyniki skrótu

**Typowe zastosowania:**

- Tablice haszujące i struktury danych
- Sprawdzanie integralności plików (bez zastosowań bezpieczeństwa)
- Deduplikacja danych i chunking
- Klucze cache oraz indeksowanie baz danych
- Potoki danych o wysokiej przepustowości
