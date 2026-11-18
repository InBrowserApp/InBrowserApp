## Generer et /48-prefiks for IPv6 ULA

Kopier det genererte `fd`-prefikset til hjemmenettverket, testmiljøet eller VPN-et ditt. Lagre det valgte `/48`-prefikset sammen med nettverkskonfigurasjonen, så kan du bruke det igjen når du legger til subnett. Velg **Generer nytt prefiks** når du trenger et nytt prefiks.

## Beregn et /64-subnett

Skriv inn en heksadesimal **Subnett-ID** fra `0000` til `ffff`. For eksempel gir ID-en `00a0` innenfor `fd12:3456:789a::/48` subnettet `fd12:3456:789a:a0::/64`. Et `/48`-prefiks gir 65 536 mulige `/64`-subnett, slik at du kan tildele egne prefikser til lokalnett, trådløst gjestenett eller VPN.

## Hvor fd-prefikset kommer fra

RFC 4193 definerer unike lokale adresser i `fc00::/7`. Halvparten som tildeles lokalt, `fd00::/8`, begynner med `fd`. Generatoren legger til en tilfeldig global ID på 40 biter fra nettleserens Web Crypto API for å lage `/48`-prefikset.

## Når du bruker en unik lokal adresse

Bruk ULA for stabile IPv6-adresser i et nettverk eller mellom lokasjoner som er koblet sammen med VPN. En enhet kan også bruke en global IPv6-adresse til offentlig Internett-trafikk og beholde ULA-adressen til interne tjenester.
