## Wat is een IPv6 Link-Local adres?

IPv6 Link-Local adressen zijn speciale IPv6-adressen die automatisch worden geconfigureerd op elke IPv6-ingeschakelde interface. Ze beginnen altijd met het prefix fe80::/10 en worden gebruikt voor communicatie tussen apparaten op hetzelfde netwerksegment. Deze adressen zijn niet routeerbaar buiten de lokale link en worden vaak gebruikt voor buurontdekking, routerontdekking en andere lokale netwerkprotocollen. Link-local adressen kunnen worden gegenereerd uit het MAC-adres van een apparaat met behulp van het EUI-64-formaat.

### Wanneer dit handig is

Gebruik dit wanneer u het deterministische link-local-adres nodig hebt dat EUI-64 van een apparaat-MAC-adres afleidt.

### Hoe de EUI-64-mapping werkt

1. Normaliseer het MAC-adres naar 48 bits.
2. Draai de `U/L bit` in het eerste byte om.
3. Voeg in het midden `ff:fe` in om een 64-bits interface-id te maken.
4. Zet er het voorvoegsel `fe80::/10` voor.

### Ondersteunde invoerformaten

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Optioneel interface-achtervoegsel

Voeg `%eth0`, `%en0` of een andere zone-index alleen toe wanneer een lokaal commando moet weten welke interface gebruikt moet worden.
