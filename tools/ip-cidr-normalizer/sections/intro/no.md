## Hva dette verktøyet normaliserer

Dette verktøyet konverterer IPv4-adresser, IPv6-adresser og CIDR-områder til kanonisk notasjon direkte i nettleseren. Den fjerner unødvendig IPv4-polstring, komprimerer IPv6 til standard forkortet form, og bevarer den opprinnelige adressefamilien.

## Hvordan CIDR-normalisering fungerer

Når du skriver inn en CIDR-blokk, omskriver verktøyet adressen til den faktiske nettverksadressen for det prefikset. Vertsbiter slettes, så `192.168.0.15/24` blir `192.168.0.0/24`, og `2001:db8::1234/64` blir `2001:db8::/64`.

## Når dette er nyttig

Bruk den før du sammenligner brannmurregler, tilgangskontrollister, rutetabeller, VPN-godkjenningslister eller importerte konfigurasjonsfiler. Normalisert input gjør duplikatdeteksjon, anmeldelser og kopier og lim inn i nettverksverktøy mer pålitelig.

## Hvorfor input kan bli avvist

Verktøyet avviser feilaktige IPv4- eller IPv6-adresser, ugyldige CIDR-prefikser og adresse- eller prefikskombinasjoner som ikke samsvarer med protokollfamilien. Hvis verdien ikke kan analyseres entydig, er det tryggere å avvise den enn å normalisere feil nettverk.
