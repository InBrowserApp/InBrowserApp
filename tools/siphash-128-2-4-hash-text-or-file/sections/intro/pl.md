## Czym jest SipHash-128-2-4?

SipHash-128-2-4 to szybka funkcja haszująca z kluczem, zaprojektowana do krótkich wiadomości i ochrony tablic haszujących. Używa 128-bitowego tajnego klucza i tworzy 128-bitowy wynik, zwykle wyświetlany jako 32-znakowa wartość szesnastkowa.

## Kiedy go używać

- Chroń tablice haszujące po stronie serwera przed atakami hash-flooding, gdy klucz pozostaje prywatny.
- Twórz deterministyczne sumy kontrolne z kluczem dla kluczy pamięci podręcznej, shardingu lub wewnętrznych tablic wyszukiwania.
- Porównuj fragmenty tekstu lub pliki przy użyciu tego samego klucza, gdy uwierzytelnianie kryptograficzne nie jest wymagane.

## Format klucza

Wprowadź klucz jako dokładnie 16 bajtów danych szesnastkowych, na przykład `0x000102030405060708090a0b0c0d0e0f`. Prefiks `0x` jest opcjonalny, a narzędzie akceptuje spacje, dwukropki, łączniki i podkreślenia, aby długie klucze były łatwiejsze do odczytania.

## Uwagi dotyczące bezpieczeństwa

SipHash-128-2-4 nie zastępuje HMAC, podpisów cyfrowych ani haszowania haseł. Używaj go do przepływów pracy z tablicami haszującymi chronionymi kluczem i sumami kontrolnymi, a nie do potwierdzania autentyczności między systemami wymagającymi kryptograficznych gwarancji bezpieczeństwa.
