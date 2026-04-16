## Wat is IBAN?

IBAN (International Bank Account Number) is een gestandaardiseerde identifier voor bankrekeningen die wordt gebruikt bij internationale betalingen.

### IBAN-structuur

Een IBAN begint met een tweeletterige landcode, twee controlecijfers en een landspecifieke BBAN.

### Checksum-validatie

De geldigheid van IBAN wordt gecontroleerd met het ISO 13616 mod-97-algoritme.

1. Verwijder spaties en verplaats de eerste vier tekens naar het einde
2. Zet letters om naar cijfers (A=10, B=11, ..., Z=35)
3. Bereken mod 97; een geldige IBAN laat rest 1

Elk land definieert een vaste lengte en structuur voor het BBAN-deel.
