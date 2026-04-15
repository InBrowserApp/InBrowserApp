## Hva er en IPv6 Link-Local adresse?

IPv6 Link-Local adresser er spesielle IPv6-adresser som automatisk konfigureres på hvert IPv6-aktiverte grensesnitt. De starter alltid med prefikset fe80::/10 og brukes til kommunikasjon mellom enheter på samme nettverkssegment. Disse adressene er ikke rutbare utenfor den lokale lenken og brukes vanligvis til nabooppdagelse, ruteroppdagelse og andre lokale nettverksprotokoller. Link-local adresser kan genereres fra en enhets MAC-adresse ved hjelp av EUI-64-formatet.

### Når dette er nyttig

Bruk dette når du trenger den deterministiske link-local-adressen som EUI-64 utleder fra en enhets MAC-adresse.

### Slik fungerer EUI-64-tilordningen

1. Normaliser MAC-adressen til 48 bit.
2. Snu `U/L bit` i første byte.
3. Sett inn `ff:fe` i midten for å lage en 64-bits grensesnittidentifikator.
4. Legg til prefikset `fe80::/10`.

### Støttede inndataformater

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Valgfritt grensesnittssuffiks

Legg bare til `%eth0`, `%en0` eller en annen soneindeks når en lokal kommando må vite hvilket grensesnitt som skal brukes.
