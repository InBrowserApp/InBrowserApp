## Slik kobler du til en Bluetooth Low Energy-enhet

Slå på Bluetooth og sett enheten i en modus som tillater tilkobling. Velg **Koble til enhet** og velg deretter periferienheten i nettleseren. Utforskeren ber om tilgang til vanlige GATT-tjenester som Battery Service, Device Information, Heart Rate og Environmental Sensing. For en egendefinert GATT-tjeneste må du skrive inn UUID-en før du åpner enhetsvelgeren. Bruk en 16-biters UUID som `180F` eller en fullstendig 128-biters UUID fra dokumentasjonen til enheten.

## Slik leser du GATT-karakteristikker

Utvid en tjeneste for å se karakteristikkene og operasjonene de støtter. Velg **Les** for å hente den gjeldende verdien. Hex viser bytene nøyaktig slik de ble mottatt, mens UTF-8 er nyttig for karakteristikker som inneholder tekst. Batterinivå, målinger og andre binære verdier må kanskje tolkes ved hjelp av spesifikasjonen for den aktuelle karakteristikken.

## Slik registrerer du Bluetooth-varsler

Velg **Abonner** på en karakteristikk som støtter Notify eller Indicate. Oppdateringer vises med tidspunkt og karakteristikkens UUID. Last ned de siste 100 varslene som en JSON-fil for å undersøke dem senere, eller velg **Avslutt abonnement** for å stoppe strømmen. Siden lagrer loggen lokalt.

## Hvorfor ser jeg ikke enheten eller tjenestene dens?

Støtte for Web Bluetooth avhenger av nettleseren og operativsystemet. Bruk en støttet nettleser over HTTPS, hold enheten i nærheten og koble den fra andre apper hvis den bare tillater én tilkobling. Nettleseren gir tilgang til godkjente GATT-tjenester på Bluetooth LE-periferienheter. Bluetooth Classic-enheter, som hodetelefoner som bare tilbyr lydprofiler, krever et annet grensesnitt.
