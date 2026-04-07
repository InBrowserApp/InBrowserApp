## Wat is Base64?

Base64 is handig wanneer een tekstkanaal binair-vriendelijke payloads moet vervoeren, zoals e-mailinhoud, JSON-blobs of kleine data URL's. Het is een coderingslaag, geen beveiligingslaag.

## Wanneer te gebruiken

- Snelle foutopsporing wanneer een API Base64-strings retourneert of verwacht.
- Browsertekst omzetten naar een veilig transportformaat voor logs of payloads.
- Controleren of een geplakte Base64-blob decodeert naar de inhoud die je verwacht.

## Waar je op moet letten

- Base64 vergroot de omvang met ongeveer een derde.
- Het versleutelt of verbergt de originele waarde niet.
- Ongeldige padding of een onderbroken kopieer-plakactie verschijnt meestal als een decodeerfout.
