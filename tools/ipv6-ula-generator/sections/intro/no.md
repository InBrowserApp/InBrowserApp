## Hva er en unik lokal IPv6-adresse?

En unik lokal IPv6-adresse (ULA) er beregnet på kommunikasjon innenfor steder, private nettverk og sammenkoblede organisasjoner. Hele ULA-adresserommet er `fc00::/7`. Den åttende biten er **L-biten**: verdien `1` velger det lokalt tildelte `fd00::/8`-området som denne generatoren bruker, mens `fc00::/8`-halvdelen forblir reservert for en annen tildelingsmetode.

ULA-er er ikke globalt nåbare som standard, men «lokal» betyr ikke hemmelig eller automatisk sikker. De kan krysse rutede stedsgrenser, VPN-er og private sammenkoblinger når operatører konfigurerer disse rutene.

## Slik bygger denne RFC 4193-generatoren et /48-prefiks

Denne RFC 4193-generatoren ber Web Crypto API om nøyaktig 40 tilfeldige biter og kombinerer dem med `fd`. Resultatet er et statistisk unikt 48-bits stedsprefiks, for eksempel `fd12:3456:789a::/48`. Genereringen skjer i nettleseren: verktøyet samler ikke inn MAC-adresse, tidsstempel, enhetsidentifikator eller serversvar.

Det finnes `2^40` mulige globale ID-er – omtrent 1,1 billioner. Sikker tilfeldighet gjør utilsiktet gjenbruk lite sannsynlig, men kan ikke garantere at to uavhengig genererte prefikser aldri kolliderer. Registrer det valgte `/48`-prefikset i nettverksdokumentasjonen, og gjenbruk det konsekvent.

## Planlegging av de 65 536 tilgjengelige /64-subnettene

Etter `/48`-stedsprefikset kommer en 16-bits subnett-ID. Verdier fra `0000` til `ffff` gir 65 536 mulige `/64`-nettverk. Med subnett-ID-en `00a0` blir for eksempel `fd12:3456:789a::/48` til det kanoniske nettverket `fd12:3456:789a:a0::/64`.

De resterende 64 bitene er grensesnitt-ID-en. Dette verktøyet planlegger bare nettverksprefikser; det genererer ikke vertsadresser med `/128` eller avleder grensesnittidentifikatorer fra MAC-adresser.

## Hvor ULA-er hører hjemme – og hvor de ikke gjør det

ULA-er egner seg godt til stabil intern adressering, VPN-tilkoblede steder, laboratorienettverk og tjenester som bør beholde et internt prefiks samtidig som de bruker global unicast IPv6. De er ikke en brannmur eller en iboende sikkerhetsgrense. Bruk vanlige tilgangskontroller, filtrer uønsket ULA-trafikk ved stedsgrenser, og hold interne ULA-oppføringer utenfor offentlig DNS.

En vert kan bruke en ULA og en global unicast-adresse samtidig. Bruk den globale adressen for å nå Internett, og det varige ULA-prefikset for de private rutene som trenger det.
