## Wat is Base32?

Base32 is handig wanneer een tekstkanaal of een kanaal zonder hoofdlettergevoeligheid binaire gegevens moet doorgeven, zoals OTP-geheimen, DNS-veilige tokens of geëxporteerde configuratiewaarden. Het is een coderingslaag, geen beveiligingslaag.

## Wanneer gebruik je het

- Base32-geheimen of tokens terug decoderen naar hun oorspronkelijke bytes.
- Waarden inspecteren die zijn gekopieerd uit TOTP-instellingen, integratie-exports of configuratiebestanden.
- Controleren of geplakte Base32-gegevens geldige tekens en correcte padding hebben voordat je ze gebruikt.

## Waar je rekening mee moet houden

- Base32 vergroot gegevens meer dan Base64.
- Het versleutelt of verbergt de oorspronkelijke waarde niet.
- Sommige systemen laten de `=`-padding weg, maar ongeldige tekens veroorzaken nog steeds decodeerfouten.
