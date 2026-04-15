## Wat is Creditcardvalidatie?

Creditcardvalidatie is een proces om te controleren of een kaartnummer potentieel geldig is voordat een transactie wordt verwerkt. Het gebruikt het Luhn-algoritme en kaartmerkidentificatie om het formaat te verifiëren.

### Luhn-algoritme

Het Luhn-algoritme (ook bekend als Mod 10) is een checksum-formule die wordt gebruikt om identificatienummers te valideren. Zo werkt het:

1. Beginnend bij het meest rechtse cijfer, verdubbel elk tweede cijfer
2. Als verdubbeling resulteert in een getal groter dan 9, trek 9 af van het resultaat
3. Tel alle cijfers op. Als het totaal deelbaar is door 10, is het nummer geldig

### Ondersteunde Kaartmerken

Kaartmerken worden geïdentificeerd door hun BIN (Bankidentificatienummer) of IIN (Uitgeveridentificatienummer), de eerste cijfers van het kaartnummer.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
