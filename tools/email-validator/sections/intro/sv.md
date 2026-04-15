## Vad är e-postvalidering?

E-postvalidering kontrollerar om en adress följer vanliga syntaxregler för lokal del, `@`-tecken, domänetiketter och toppdomän. Det är användbart för formulärtester, städning av exempeldata och för att hitta uppenbara skrivfel innan du skickar.

### Vad den här valideraren kontrollerar

- Ett enda `@` som skiljer lokal del från domän
- Längdgränser för hela adressen, lokal del och domän
- Tillåtna tecken, punktplacering, bindestrecksregler och TLD-struktur
- Ett normaliserat resultat där domänen görs gemen för enklare jämförelse

### Exempel

- Giltig: `name@example.com`
- Giltig: `first.last+news@example.co.uk`
- Ogiltig: `name..dots@example.com`
- Ogiltig: `user@-example.com`

Internationaliserade domäner bör anges i Punycode-ASCII, till exempel `user@xn--bcher-kva.example`.

### Vad det här verktyget inte kontrollerar

- Om brevlådan finns eller kan ta emot e-post
- DNS-, MX-, SMTP- eller engångsleverantörskontroller
- Om en webbplats accepterar adressen enligt sina egna affärsregler
