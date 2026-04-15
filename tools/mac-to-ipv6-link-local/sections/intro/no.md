## Hva er en IPv6 Link-Local adresse?

IPv6 Link-Local adresser er spesielle IPv6-adresser som automatisk konfigureres på hvert IPv6-aktiverte grensesnitt. De starter alltid med prefikset fe80::/10 og brukes til kommunikasjon mellom enheter på samme nettverkssegment. Disse adressene er ikke rutbare utenfor den lokale lenken og brukes vanligvis til nabooppdagelse, ruteroppdagelse og andre lokale nettverksprotokoller. Link-local adresser kan genereres fra en enhets MAC-adresse ved hjelp av EUI-64-formatet.

### Inndataformater

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### EUI-64-utdata

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Grensesnittssuffiks

- `%eth0`
- `%en0`
- `%wlan0`
