## Wat is Base32?

Base32 is handig wanneer een tekstkanaal of een kanaal zonder hoofdlettergevoeligheid binaire gegevens moet doorgeven, zoals OTP-geheimen, DNS-veilige tokens of geëxporteerde configuratiewaarden. Het is een coderingslaag, geen beveiligingslaag.

## Wanneer gebruik je het

- Bytes, tekst of bestanden naar Base32 coderen voordat je ze via tekstkanalen verstuurt.
- OTP-geheimen, geëxporteerde instellingen of binaire blobs voorbereiden voor systemen die Base32-invoer verwachten.
- Ruwe bestandsbytes omzetten naar een goed kopieerbare tekenreeks voor transport, logging of handmatige invoer.

## Waar je rekening mee moet houden

- Base32 vergroot gegevens meer dan Base64.
- Het versleutelt of verbergt de oorspronkelijke waarde niet.
- Sommige systemen vereisen `=`-padding, terwijl andere ongepaddede uitvoer accepteren, dus stem af op het ontvangende systeem.
