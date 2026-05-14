## Czym jest SipHash-2-4?

SipHash-2-4 to szybka funkcja haszująca z kluczem, zaprojektowana do krótkich wiadomości i ochrony tablic haszujących. Używa tajnego klucza 128-bitowego i tworzy wynik 64-bitowy, zwykle wyświetlany jako 16-znakowa wartość szesnastkowa.

## Kiedy go używać

- Chroń tablice haszujące po stronie serwera przed atakami hash-flooding, gdy klucz pozostaje prywatny.
- Twórz deterministyczne sumy kontrolne z kluczem dla kluczy pamięci podręcznej, partycjonowania lub wewnętrznych tablic wyszukiwania.
- Porównuj fragmenty tekstu lub pliki przy użyciu tego samego klucza, gdy uwierzytelnianie kryptograficzne nie jest wymagane.

## Format klucza

Wprowadź klucz jako dokładnie 16 bajtów danych szesnastkowych, na przykład `0x000102030405060708090a0b0c0d0e0f`. Prefiks `0x` jest opcjonalny, a narzędzie akceptuje spacje, dwukropki, łączniki i podkreślenia, aby długie klucze były łatwiejsze do odczytania.

## Uwagi dotyczące bezpieczeństwa

SipHash-2-4 nie zastępuje HMAC, podpisów cyfrowych ani haszowania haseł. Używaj go do zastosowań z tablicami haszującymi chronionymi kluczem i sumami kontrolnymi, a nie do potwierdzania autentyczności między systemami wymagającymi kryptograficznych gwarancji bezpieczeństwa.
