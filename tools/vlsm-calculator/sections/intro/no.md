## Slik planlegger du IPv4-subnett med VLSM

Oppgi en overordnet blokk i CIDR-notasjon, for eksempel 192.168.10.0/24. Legg til en rad for hvert nettverk og oppgi hvor mange brukbare vertsadresser det trenger. Ta med adressen til standard gateway og eventuelle reserver for vekst. Når du beregner planen, ser du tildelt nettverk, nettmaske, brukbart adresseområde og broadcast-adresse for hvert subnett. Ledige CIDR-blokker kan brukes senere.

Med nettmasker med variabel lengde (VLSM) kan du dele et nettverk inn i subnett av ulik størrelse. Kalkulatoren velger den minste blokken som dekker hvert behov og tildeler de største blokkene først, på gyldige CIDR-grenser. I et standard subnett er nettverksadressen og broadcast-adressen reservert. For eksempel får 50 verter plass i en /26-blokk med 62 brukbare adresser.

Velg /31 bare for en IPv4-punkt-til-punkt-forbindelse som støtter to brukbare adresser. Velg /32 for en enkeltadresse, for eksempel til et loopback-grensesnitt på en ruter. Ingen av alternativene har en broadcast-adresse. Beregningen og subnettnavnene forblir i nettleseren.
