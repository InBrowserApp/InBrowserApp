## Slik leser du en DNS-sonefil

Åpne en DNS-eksport i BIND-format eller lim inn teksten. Last inn eksempelet for å se en SOA-post, IPv4- og IPv6-adresseposter, e-postposter og en TXT-streng. For hver rad viser parseren postnavn, klasse, type, levetid (TTL) i sekunder og postdata. Filtrer på navn, en type som MX eller en del av en verdi. Kopier deretter de synlige postene som JSON for kartlegging eller migrering.

## Slik behandles startdomene, TTL og postdata

Når $ORIGIN er satt til example.com., blir det relative postnavnet «www» til www.example.com. Navnet @ viser til gjeldende sonedomene. En innrykket post arver navnet fra forrige post. Hvis filen mangler $ORIGIN, oppgir du domenet i feltet Startdomene. En standardverdi på 1h for $TTL tilsvarer 3 600 sekunder. En post med egen TTL bruker den verdien. Anførselstegn, escape-sekvenser og relative målnavn beholdes i postdataene. Dermed forblir «hello; world» én enkelt TXT-verdi, og «mail» i en MX-post forblir «mail».

## Dette viser resultatene

Parseren leser kommentarer, tekst i anførselstegn og poster over flere linjer. Merknader viser hvilken linje et problem gjelder. Poster som kunne leses, vises fortsatt. Hvis sonen bruker $INCLUDE eller $GENERATE, må du utvide direktivene før du limer inn de fullstendige postene. Verktøyet behandler inndataene lokalt. Det kontakter ingen DNS-servere og tester ikke om en bestemt leverandør kan laste inn sonen.
