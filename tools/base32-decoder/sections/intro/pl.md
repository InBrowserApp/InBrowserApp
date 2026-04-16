## Czym jest Base32?

Base32 jest przydatny, gdy kanał tekstowy albo kanał niewrażliwy na wielkość liter musi przenosić dane binarne, takie jak sekrety OTP, tokeny bezpieczne dla DNS czy wyeksportowane wartości konfiguracji. To warstwa kodowania, a nie warstwa bezpieczeństwa.

## Kiedy go używać

- Dekodowanie sekretów lub tokenów Base32 z powrotem do ich oryginalnych bajtów.
- Sprawdzanie wartości skopiowanych z konfiguracji TOTP, eksportów integracji lub plików konfiguracyjnych.
- Weryfikowanie, czy wklejone dane Base32 mają prawidłowe znaki i poprawne padding przed użyciem.

## O czym warto pamiętać

- Base32 zwiększa rozmiar danych bardziej niż Base64.
- Nie szyfruje ani nie ukrywa oryginalnej wartości.
- Niektóre systemy pomijają padding `=`, ale nieprawidłowe znaki nadal powodują błędy dekodowania.
