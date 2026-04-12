## Czym jest SHA-256?

SHA-256 (Secure Hash Algorithm 256-bit) to kryptograficzna funkcja skrótu, która produkuje 256-bitową (32-bajtową) wartość skrótu, zazwyczaj przedstawianą jako 64-znakową liczbę szesnastkową. Jest częścią rodziny funkcji skrótu SHA-2 zaprojektowanych przez NSA i opublikowanych przez NIST.

**Kluczowe cechy:**

- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót
- **Szybkie obliczenia**: Szybkie do obliczenia dla dowolnego danego wejścia
- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia
- **Nieodwracalna**: Obliczeniowo niemożliwe do odwrócenia skrótu w celu znalezienia oryginalnego wejścia
- **Odporna na kolizje**: Bardzo trudno znaleźć dwa różne wejścia, które produkują ten sam skrót

**Powszechne zastosowania:**

- Podpisy cyfrowe i certyfikaty
- Blockchain i kryptowaluty (Bitcoin używa SHA-256)
- Przechowywanie haseł (z odpowiednim soleniem)
- Weryfikacja integralności plików
- Algorytmy proof-of-work
