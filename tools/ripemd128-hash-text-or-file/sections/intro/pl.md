## Czym jest RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) to kryptograficzna funkcja skrótu, która produkuje wartość skrótu 128-bitową (16 bajtów), zwykle przedstawianą jako 32-znakową liczbę szesnastkową. Jest częścią rodziny RIPEMD opracowanej w Europie jako alternatywa dla MD4/MD5.

**Kluczowe cechy:**

- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót
- **Szybkie obliczenia**: Szybkie do obliczenia dla dowolnego danego wejścia
- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia
- **Stały rozmiar wyjścia**: Zawsze produkuje 128-bitowy skrót niezależnie od rozmiaru wejścia
- **Jednokierunkowa**: Odzyskanie oryginalnego wejścia ze skrótu jest obliczeniowo niepraktyczne

**Powszechne zastosowania:**

- Kontrole integralności danych
- Fingerprinting i deduplikacja
- Zgodność ze starszymi systemami
