CIDR Parser gjør en blokk som `10.24.8.19/21` eller `2001:db8:abcd::123/64` om til nettverket du faktisk mener. Den normaliserer host-adresse-inndata, viser det kanoniske subnettet og synliggjør grensene du vanligvis trenger når du skriver brannmurregler, dokumenterer områder eller sjekker om en tildeling er større enn planlagt.

## Hva den viser

Resultatet starter med en rask oversikt og bryter deretter blokken ned i praktiske detaljer: kanonisk CIDR, totalt og brukbart antall adresser, områdestart og -slutt, samt heltallsverdiene bak blokken. For IPv4 får du også nettmaske, wildcard-maske og broadcast-adresse. For IPv6 er arbeidsflyten den samme, men felt som ikke gjelder skjules.

## Hvorfor kanonisering betyr noe

Mange innlimte CIDR-verdier inneholder host-biter. Det er greit for mennesker, men rutere, ACLs og dokumentasjon trenger vanligvis den kanoniske nettverksadressen. Ved å skrive om blokken før du kopierer noe, hjelper verktøyet deg å oppdage off-by-one-antakelser før de havner i konfigurasjon.

## Praktiske merknader

- IPv4-blokker `/31` og `/32` behandles som fullt brukbare, i tråd med moderne point-to-point- og host-route-bruk.
- IPv6-blokker rapporterer hele adresserommet og brukbart område uten å finne opp et broadcast-konsept.
- Alt kjører lokalt i nettleseren, så interne subnett forlater ikke siden mens du inspiserer dem.
