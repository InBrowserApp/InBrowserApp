## Czym jest SHA-1?

SHA-1 (Secure Hash Algorithm 1) to kryptograficzna funkcja skrótu, która produkuje 160-bitową (20-bajtową) wartość skrótu, zazwyczaj przedstawianą jako 40-znakową liczbę szesnastkową. Została zaprojektowana przez NSA i opublikowana przez NIST w 1995 roku jako część Digital Signature Standard.

**Kluczowe cechy:**

- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót
- **Szybkie obliczenia**: Szybkie do obliczenia dla dowolnego danego wejścia
- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia
- **Nieodwracalna**: Obliczeniowo niemożliwe do odwrócenia skrótu w celu znalezienia oryginalnego wejścia
- **Podatna na kolizje**: Znane podatności umożliwiają znalezienie kolizji

**Status bezpieczeństwa:**
⚠️ **SHA-1 jest kryptograficznie złamane i nie powinno być używane do aplikacji krytycznych dla bezpieczeństwa**. Ataki teoretyczne zostały zademonstrowane w 2005 roku, a praktyczne ataki kolizyjne zostały osiągnięte w 2017 roku.

**Powszechne zastosowania (historyczne):**

- Podpisy cyfrowe i certyfikaty (przestarzałe)
- System kontroli wersji Git (dla kompatybilności)
- Starsze systemy wymagające SHA-1
- Weryfikacja integralności plików (niekrytyczna dla bezpieczeństwa)
- Algorytmy proof-of-work (niektóre starsze kryptowaluty)

**Zalecane alternatywy:**

- SHA-256 lub SHA-3 dla nowych aplikacji
- SHA-512 dla wysokich wymagań bezpieczeństwa
