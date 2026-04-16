## Hva er en HTTP-statuskode?

HTTP-statuskoder er tresifrede responskoder som en server returnerer for a vise hva som skjedde med en foresporsel. Du ser dem ofte i nettleserens utviklerverktoy, API-svar, serverlogger, oppetidsovervaking og dashbord for reverse proxy.

### Slik leser du de viktigste statuskodefamiliene

- **1xx Informasjon:** Serveren har mottatt foresporselen, og behandlingen fortsetter.
- **2xx Vellykket:** Foresporselen ble fullfort.
- **3xx Omdirigering:** Klienten ma folge en annen plassering eller gjenbruke et bufret resultat.
- **4xx Klientfeil:** Selve foresporselen har et problem, for eksempel manglende ressurs, ugyldig inndata eller mislykket autentisering.
- **5xx Serverfeil:** Serveren eller en upstream-avhengighet feilet under behandling av en gyldig foresporsel.

### Nar denne lookupen er nyttig

Bruk dette verktoy nar du trenger a bekrefte hva en kode betyr, sammenligne like koder som 401 og 403 eller 502 og 504, eller soke etter en frase fra en feilmelding. Soket fungerer pa kode, statusnavn og lokalisert beskrivelse.

### Hvorfor riktig tolkning betyr noe

Under feilsoking er statuskoden ofte det raskeste hintet. En 4xx-respons peker vanligvis mot foresporselen, legitimasjonen eller malressursen. En 5xx-respons peker vanligvis mot applikasjonen, gatewayen eller en upstream-tjeneste. A lese kategorien forst hjelper deg a velge riktig neste steg.
