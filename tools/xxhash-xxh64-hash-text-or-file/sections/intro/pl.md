## Czym jest xxHash (XXH64)?

xxHash to niezwykle szybki nie-kryptograficzny algorytm skrótu, który skupia się na szybkości i wydajności, zachowując jednocześnie dobre właściwości dystrybucji. XXH64 to 64-bitowa wersja, która produkuje 64-bitową (8-bajtową) wartość skrótu, zazwyczaj wyświetlaną jako 16-znakowa liczba szesnastkowa.

**Kluczowe cechy:**

- **Niezwykle szybki**: Zoptymalizowany pod kątem szybkości, znacznie szybszy niż kryptograficzne funkcje skrótu
- **Deterministyczny**: To samo wejście zawsze produkuje ten sam skrót
- **Dobra dystrybucja**: Zapewnia doskonałą dystrybucję skrótu dla tabel skrótu
- **Nie-kryptograficzny**: Nieodpowiedni do celów bezpieczeństwa, zaprojektowany dla wydajności
- **Większe wyjście**: 64-bitowy skrót zapewnia lepszą odporność na kolizje niż warianty 32-bitowe
- **Zoptymalizowany pod platformę**: Używa instrukcji SIMD gdy dostępne dla maksymalnej szybkości

**Powszechne zastosowania:**

- Tabele skrótu i struktury danych
- Kontrole integralności plików (nie-bezpieczeństwo)
- Deduplikacja danych
- Sumy kontrolne dla transmisji danych
- Aplikacje krytyczne dla wydajności
- Indeksowanie baz danych
- Generowanie kluczy cache
