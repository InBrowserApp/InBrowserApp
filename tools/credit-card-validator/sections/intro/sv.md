## Vad är Kreditkortsvalidering?

Kreditkortsvalidering är en process för att kontrollera om ett kortnummer är potentiellt giltigt innan en transaktion behandlas. Den använder Luhn-algoritmen och kortmärkesidentifikation för att verifiera formatet.

### Luhn-algoritmen

Luhn-algoritmen (även känd som Mod 10) är en kontrollsummeformel som används för att validera identifikationsnummer. Så här fungerar det:

1. Börja från den högra siffran, dubbla varannan siffra
2. Om dubbleringen resulterar i ett tal större än 9, subtrahera 9 från resultatet
3. Summera alla siffror. Om summan är delbar med 10 är numret giltigt

### Stödda Kortmärken

Kortmärken identifieras av deras BIN (bankidentifikationsnummer) eller IIN (utfärdaridentifikationsnummer), som är de första siffrorna i kortnumret.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
