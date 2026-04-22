## Vad är en IPv6 Link-Local adress?

IPv6 Link-Local adresser är speciella IPv6-adresser som automatiskt konfigureras på varje IPv6-aktiverat gränssnitt. De börjar alltid med prefixet fe80::/10 och används för kommunikation mellan enheter på samma nätverkssegment. Dessa adresser är inte routningsbara utanför den lokala länken och används vanligtvis för grannupptäckt, routerupptäckt och andra lokala nätverksprotokoll. Link-local adresser kan genereras från en enhets MAC-adress med EUI-64-formatet.

### När det är användbart

Använd detta när du vill få den deterministiska link-local-adress som EUI-64 härleder från en enhets MAC-adress.

### Så fungerar EUI-64-mappningen

1. Normalisera MAC-adressen till 48 bitar.
2. Vänd `U/L bit` i den första byten.
3. Infoga `ff:fe` i mitten för att skapa ett 64-bitars gränssnitts-id.
4. Lägg till prefixet `fe80::/10`.

### Inmatningsformat som stöds

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Valfritt gränssnittssuffix

Lägg bara till `%eth0`, `%en0` eller ett annat zonindex när ett lokalt kommando måste veta vilket gränssnitt som ska användas.
