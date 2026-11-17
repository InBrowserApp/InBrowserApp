## Åpne et HAR-opptak

Eksporter en HAR-fil (HTTP Archive) fra nettleserens nettverkspanel etter å ha registrert forespørslene du vil undersøke. Åpne eller slipp `.har`- eller `.json`-filen her, eller last inn eksempelet. Grensen er 20 MiB og 20 000 oppføringer.

## Finn trege eller mislykkede forespørsler

Søk etter URL, metode, status eller MIME-type, og sorter etter starttid, varighet eller overført datamengde. Forespørslene bruker samme tidsskala, målt fra den tidligste forespørselen. Velg en forespørsel for å undersøke HTTP-hoder, informasjonskapsler, parametere, meldingsinnhold og fasenes tidsbruk.

Filteret for mislykkede forespørsler inkluderer status 0, 4xx og 5xx. Status 0 betyr at ingen HTTP-svar ble registrert; 3xx-filteret inkluderer hurtigbuffersvar med status 304. TLS inngår i tilkoblingstiden.

## Les de registrerte dataene

Behandlingen skjer i nettleseren. Hvilke detaljer som er tilgjengelige, avhenger av eksporten. Ukjente størrelser utelates fra totalene; opptakets tidsrom er ikke tilgjengelig når varigheten til en forespørsel mangler. Fossefalldiagrammet bruker fortsatt registrerte starttider og kjente sluttider.

Forhåndsvisning av meldingsinnhold bevarer den registrerte teksten. Forhåndsvisninger og kopier av dem, samt enkeltverdier i felt, er begrenset til 100 000 tegn. Kodet meldingsinnhold forblir kodet.
