## Hva dette verktøyet gjør

Dette verktøyet kombinerer CIDR-blokker til det minste tilsvarende settet, og trekker deretter fra eventuelle CIDR-blokker du legger i utelukkingslisten. Det støtter IPv4 og IPv6 i samme kjøring, og all behandling skjer lokalt i nettleseren din.

## Slik fungerer fletting og utelukking

Flettelisten normaliseres først: vertsbiter nullstilles, overlappende nettverk slås sammen, og tilstøtende nettverk slås sammen når de kan representeres av en kortere CIDR-blokk. Deretter trekkes utelukkingslisten fra de flettede områdene. Det endelige resultatet utvides tilbake til den minimale CIDR-listen som dekker nøyaktig det som gjenstår.

## Når dette er nyttig

Bruk det når du rydder i brannmurregler, klargjør oppføringer for skysikkerhetsgrupper, gjennomgår VPN-tillatelseslister, oppsummerer rutingtabeller eller fjerner reserverte områder fra en større tildeling. Det er spesielt nyttig når kopiert konfigurasjon inneholder overlappende blokker, eller når et bredt nettverk må få noen mindre områder fjernet.

## Inndatanotater

Skriv inn én CIDR per linje, eller skill flere CIDR-er med komma. IPv4- og IPv6-blokker kan limes inn sammen, men utelukkinger gjelder bare blokker fra samme adressefamilie. Ugyldige oppføringer rapporteres med liste og linjenummer, slik at du kan rette store innlimte inndata uten å gjette.
