## Czym jest MD5?

MD5 (Message Digest Algorithm 5) to szeroko używana kryptograficzna funkcja skrótu, która produkuje 128-bitową (16-bajtową) wartość skrótu, zazwyczaj przedstawianą jako 32-znakową liczbę szesnastkową. Została zaprojektowana przez Rona Rivesta w 1991 roku jako następca MD4.

**Kluczowe cechy:**

- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót
- **Szybkie obliczenia**: Szybkie do obliczenia dla dowolnego danego wejścia
- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia
- **Stały rozmiar wyjścia**: Zawsze produkuje 128-bitowy skrót niezależnie od rozmiaru wejścia
- **Podatna na kolizje**: Znane podatności umożliwiają znalezienie kolizji

**Status bezpieczeństwa:**
⚠️ **MD5 jest kryptograficznie złamane i nie powinno być używane do aplikacji krytycznych dla bezpieczeństwa**. Ataki kolizyjne zostały zademonstrowane w 2004 roku, a praktyczna generacja kolizji stała się możliwa dzięki nowoczesnej mocy obliczeniowej.

**Powszechne zastosowania (obecne i historyczne):**

- Weryfikacja integralności plików (niekrytyczna dla bezpieczeństwa)
- Sumy kontrolne do wykrywania uszkodzeń danych
- Starsze systemy wymagające MD5
- Generowanie kluczy bazy danych (niekryptograficzne)
- Niektóre starsze protokoły i systemy

**Zalecane alternatywy:**

- SHA-256 lub SHA-3 dla nowych aplikacji
- SHA-512 dla wysokich wymagań bezpieczeństwa
- BLAKE2 dla aplikacji o wysokiej wydajności
