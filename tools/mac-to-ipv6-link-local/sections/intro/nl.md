## Wat is een IPv6 Link-Local adres?

IPv6 Link-Local adressen zijn speciale IPv6-adressen die automatisch worden geconfigureerd op elke IPv6-ingeschakelde interface. Ze beginnen altijd met het prefix fe80::/10 en worden gebruikt voor communicatie tussen apparaten op hetzelfde netwerksegment. Deze adressen zijn niet routeerbaar buiten de lokale link en worden vaak gebruikt voor buurontdekking, routerontdekking en andere lokale netwerkprotocollen. Link-local adressen kunnen worden gegenereerd uit het MAC-adres van een apparaat met behulp van het EUI-64-formaat.

### Invoerformaten

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### EUI-64-uitvoer

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Interface-achtervoegsel

- `%eth0`
- `%en0`
- `%wlan0`
