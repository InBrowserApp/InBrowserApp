## Vad är en IPv6 Link-Local adress?

IPv6 Link-Local adresser är speciella IPv6-adresser som automatiskt konfigureras på varje IPv6-aktiverat gränssnitt. De börjar alltid med prefixet fe80::/10 och används för kommunikation mellan enheter på samma nätverkssegment. Dessa adresser är inte routningsbara utanför den lokala länken och används vanligtvis för grannupptäckt, routerupptäckt och andra lokala nätverksprotokoll. Link-local adresser kan genereras från en enhets MAC-adress med EUI-64-formatet.

### Inmatningsformat

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### EUI-64-utdata

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Gränssnittssuffix

- `%eth0`
- `%en0`
- `%wlan0`
