## Czym jest BLAKE3?

BLAKE3 to nowoczesna funkcja skrótu kryptograficznego wywodząca się z BLAKE2. Została zaprojektowana z myślą o bardzo wysokiej wydajności i równoległości przy zachowaniu silnego bezpieczeństwa. Domyślnie generuje skrót 256-bitowy i obsługuje rozszerzalną długość wyjścia (XOF).

**Kluczowe cechy:**

- **Rozszerzalna długość wyjścia**: Może generować skróty o dowolnej długości
- **Wysoka wydajność**: Szybka i możliwa do równoleglenia na nowoczesnych CPU
- **Deterministyczna**: To samo wejście zawsze generuje ten sam skrót
- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia
- **Nieodwracalna**: Obliczeniowo niemożliwe jest odwrócenie skrótu w celu znalezienia oryginalnego wejścia
- **Odporna na kolizje**: Bardzo trudno znaleźć dwa różne wejścia dające ten sam skrót
- **Hashing z kluczem**: Obsługuje opcjonalny 32-bajtowy klucz dla funkcji MAC
- **Wyprowadzanie kluczy**: Może wyprowadzać podklucze z materiału klucza i kontekstu

**Powszechne zastosowania:**

- Weryfikacja integralności plików
- Przechowywanie adresowane treścią i deduplikacja
- Podpisy cyfrowe i certyfikaty
- Przechowywanie i uwierzytelnianie haseł
- Protokoły i systemy kryptograficzne
