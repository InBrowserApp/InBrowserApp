## Vad är Base85?

Base85 är en binär-till-text-kodning som omvandlar 4 byte till 5 utskrivbara tecken. Den är tätare än Base64, och med det här verktyget kan du välja ASCII85 eller Z85 beroende på vad mottagaren förväntar sig.

## När ska du använda det?

- När du vill koda råbyte, text eller filer för textbaserade kanaler och samtidigt hålla utdata relativt kompakt.
- Använd ASCII85 när du behöver ett flexibelt Base85-format som kan hantera ofullständiga slutbyte.
- Använd Z85 när du behöver ZeroMQ-kompatibel Base85-text och inmatningslängden är ett exakt multipel av 4 byte.

## Vad bör du tänka på?

- Base85 är ett kodningsformat, inte kryptering.
- ASCII85 och Z85 använder olika alfabet och kan därför inte blandas fritt.
- Z85 avvisar data vars bytelängd inte är delbar med 4, medan ASCII85 kan koda partiella avslutande block.
