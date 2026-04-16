## Czym jest xxHash (XXH32)?

xxHash to niezwykle szybki nie-kryptograficzny algorytm skrótu, który skupia się na szybkości i wydajności, zachowując jednocześnie dobre właściwości dystrybucji. XXH32 to 32-bitowa wersja, która produkuje 32-bitową (4-bajtową) wartość skrótu, zazwyczaj wyświetlaną jako 8-znakowa liczba szesnastkowa.

**Kluczowe cechy:**

- **Niezwykle szybki**: Zoptymalizowany pod kątem szybkości, znacznie szybszy niż kryptograficzne funkcje skrótu
- **Deterministyczny**: To samo wejście zawsze produkuje ten sam skrót
- **Dobra dystrybucja**: Zapewnia doskonałą dystrybucję skrótu dla tabel skrótu
- **Nie-kryptograficzny**: Nieodpowiedni do celów bezpieczeństwa, zaprojektowany dla wydajności
- **Małe wyjście**: 32-bitowy skrót zapewnia kompaktową reprezentację
- **Zoptymalizowany pod platformę**: Używa instrukcji SIMD gdy dostępne dla maksymalnej szybkości

**Powszechne zastosowania:**

- Tabele skrótu i struktury danych
- Kontrole integralności plików (nie-bezpieczeństwo)
- Deduplikacja danych
- Sumy kontrolne dla transmisji danych
- Aplikacje krytyczne dla wydajności
- Indeksowanie baz danych
- Generowanie kluczy cache
