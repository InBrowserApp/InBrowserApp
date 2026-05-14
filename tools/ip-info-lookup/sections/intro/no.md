## Hva dette verktøyet slår opp

IP Info Lookup løser en IPv4-adresse, IPv6-adresse, et domene eller en URL og
viser offentlige metadata som internetttjenester kan rapportere for hver
adresse. Det er nyttig når du trenger å undersøke hvor et domene peker, hvilket
nettverk som eier en adresse, hvilket reverse DNS-vertsnavn som finnes, eller om
IPv4- og IPv6-poster leder til ulike leverandører.

## Slik fungerer domene- og URL-oppslag

Når du skriver inn et domene eller en URL, trekker verktøyet ut vertsnavnet og
spør den valgte DNS-over-HTTPS-resolveren etter både A- og AAAA-poster. Hver
returnerte adresse berikes deretter separat, slik at dual-stack-domener kan vise
ulike land, ASN-er, ISP-er, vertsnavn eller tidssoner for IPv4 og IPv6.

## Hva resultatene betyr

Lokasjons- og ISP-felt kommer fra offentlige IP-metadataleverandører som geojs.io
og ip.sb, mens vertsnavn kommer fra reverse DNS PTR-oppslag når de er
tilgjengelige. Disse postene beskriver hvordan offentlige databaser ser
adressen, ikke den nøyaktige fysiske lokasjonen til en person eller enhet.

## Merknader om personvern og nøyaktighet

Oppslaget kjører i nettleseren din og sender DNS- og IP-metadataforespørsler til
tredjepartstjenester. VPN-er, proxyer, CDN-er, mobilnettverk og skyplattformer
kan gjøre at rapportert lokasjon eller organisasjon skiller seg fra sluttbrukeren
eller serveren du forventet. Tomme felt er normalt for private, reserverte, nylig
tildelte eller sparsomt dokumenterte adresser.
