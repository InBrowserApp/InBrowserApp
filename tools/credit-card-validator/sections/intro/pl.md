## Czym jest Walidacja Karty Kredytowej?

Walidacja karty kredytowej to proces sprawdzania, czy numer karty jest potencjalnie prawidłowy przed przetworzeniem transakcji. Wykorzystuje algorytm Luhna i identyfikację marki karty do weryfikacji formatu.

### Algorytm Luhna

Algorytm Luhna (znany również jako Mod 10) to formuła sumy kontrolnej używana do walidacji numerów identyfikacyjnych. Oto jak działa:

1. Zaczynając od najbardziej prawej cyfry, podwój co drugą cyfrę
2. Jeśli podwojenie daje liczbę większą niż 9, odejmij 9 od wyniku
3. Zsumuj wszystkie cyfry. Jeśli suma jest podzielna przez 10, numer jest prawidłowy

### Obsługiwane Marki Kart

Marki kart są identyfikowane przez ich BIN (Numer Identyfikacji Banku) lub IIN (Numer Identyfikacji Wydawcy), które są pierwszymi cyframi numeru karty.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
