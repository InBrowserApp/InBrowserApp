## Was ist Kreditkartenvalidierung?

Die Kreditkartenvalidierung ist ein Prozess, um zu überprüfen, ob eine Kartennummer potenziell gültig ist, bevor eine Transaktion verarbeitet wird. Sie verwendet den Luhn-Algorithmus und die Kartenmarkenidentifikation zur Formatüberprüfung.

### Luhn-Algorithmus

Der Luhn-Algorithmus (auch bekannt als Mod 10) ist eine Prüfsummenformel zur Validierung von Identifikationsnummern. So funktioniert es:

1. Beginnend mit der rechtesten Ziffer, verdoppeln Sie jede zweite Ziffer
2. Wenn das Verdoppeln eine Zahl größer als 9 ergibt, ziehen Sie 9 vom Ergebnis ab
3. Summieren Sie alle Ziffern. Wenn die Summe durch 10 teilbar ist, ist die Nummer gültig

### Unterstützte Kartenmarken

Kartenmarken werden durch ihre BIN (Bankidentifikationsnummer) oder IIN (Emittentenidentifikationsnummer) identifiziert, die die ersten Ziffern der Kartennummer sind.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
