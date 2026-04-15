## Hva er Kredittkortvalidering?

Kredittkortvalidering er en prosess for å sjekke om et kortnummer er potensielt gyldig før en transaksjon behandles. Den bruker Luhn-algoritmen og kortmerkeidentifikasjon for å verifisere formatet.

### Luhn-algoritmen

Luhn-algoritmen (også kjent som Mod 10) er en kontrollsumformel som brukes til å validere identifikasjonsnumre. Slik fungerer det:

1. Start fra det høyre sifferet, doble annethvert siffer
2. Hvis dobling gir et tall større enn 9, trekk fra 9 fra resultatet
3. Summer alle sifrene. Hvis totalen er delelig med 10, er nummeret gyldig

### Støttede Kortmerker

Kortmerker identifiseres av deres BIN (bankidentifikasjonsnummer) eller IIN (utstederidentifikasjonsnummer), som er de første sifrene i kortnummeret.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
