## Hoe IPv6 naar MAC-adres te converteren

U kunt alleen een MAC-adres uit een IPv6-adres terughalen wanneer de
IPv6-interface-id met de EUI-64-methode uit dat MAC-adres is afgeleid. Dit
komt het meest voor bij oudere link-local-adressen die met `fe80::` beginnen
en bij sommige stateless automatisch geconfigureerde adressen.

### Wanneer het werkt

Deze omgekeerde omzetting werkt wanneer de laatste 64 bits van het IPv6-adres
nog steeds een EUI-64-interface-id bevatten.

- De interface-id is opgebouwd uit een 48-bits MAC-adres.
- De middelste bytes zijn nog steeds `ff:fe`.
- Het adres is niet gemaakt met privacy-extensies of een ander
  randomisatieschema.

### Hoe de omzetting werkt

De converter bouwt het MAC-adres opnieuw op met deze stappen:

1. Lees de laatste 64 bits van het IPv6-adres.
2. Verwijder de ingevoegde bytes `ff:fe` uit het midden van de interface-id.
3. Draai de universal/local-bit in de eerste byte om.
4. Formatteer de resterende 48 bits als een standaard MAC-adres.

### Waarom er geen MAC verschijnt

U krijgt mogelijk geen resultaat om verschillende redenen:

- Het IPv6-adres is syntactisch ongeldig.
- Het adres is geldig, maar niet via EUI-64 uit een MAC-adres gegenereerd.
- Het adres gebruikt privacy, stable-random, DHCPv6 of een andere
  toewijzingsmethode die niet op een MAC-adres is gebaseerd.
