## Konverter en MAC-adresse til IPv6

Skriv inn en 48-bits MAC-adresse med kolon, bindestreker, punktum eller uten skilletegn. Skriv så inn IPv6-nettverksprefikset på `/64` som du vil bruke. Du kan bruke komprimert eller fullstendig skrivemåte. Alle vertsbitene i prefikset må være null. IPv6-adressen oppdateres mens du skriver, og kan kopieres med én gang. **Prøv et eksempel** fyller ut begge feltene med eksempelverdier.

## Slik danner Modified EUI-64 adressen

I et `/64`-subnett utgjør nettverksprefikset de første 64 bitene og grensesnitt-ID-en de siste 64. Modified EUI-64 setter inn `ff:fe` mellom de to halvdelene av MAC-adressen og snur universell/lokal-biten i den første byten. MAC-adressen `00:11:22:33:44:55` gir for eksempel grensesnitt-ID-en `211:22ff:fe33:4455`. Med `2001:db8:1:2::/64` blir resultatet `2001:db8:1:2:211:22ff:fe33:4455`.

## Vanlige IPv6-prefikser

- **Link-local.** Bruk `fe80::/64` for kommunikasjon på samme nettverkslenke. **Bruk link-local-prefiks** fyller inn prefikset og beholder MAC-adressen din. Bruk [konvertereren for IPv6 link-local](/no/tools/mac-address-to-ipv6-link-local-address-converter/) for å legge til et grensesnittnavn som `%eth0`.
- **Unik lokal adresse (ULA).** **Bruk ULA-eksempel** fyller inn `fd12:3456:789a:1::/64`, et eksempel fra `fd00::/8` for interne nettverk. Med [IPv6 ULA-generatoren](/no/tools/ipv6-ula-generator/) kan du lage et unikt prefiks for ditt eget nettverk.
- **Global unicast.** Skriv inn et `/64`-subnett fra adresseblokken du har fått tildelt av internettleverandøren, skyleverandøren eller nettverksadministratoren.
- **Dokumentasjon.** `2001:db8:1:2::/64` ligger i området `2001:db8::/32`, som er reservert for dokumentasjon og eksempler.

## Stemmer resultatet med IPv6-adressen til enheten min?

Resultatet er adressen Modified EUI-64 gir med prefikset ditt. Enheten kan bruke en annen grensesnitt-ID, for eksempel en stabil eller midlertidig ID som er generert av hensyn til personvernet. Hvis du allerede har en IPv6-adresse med en grensesnitt-ID avledet fra MAC-adressen, kan du finne MAC-adressen med [konvertereren fra IPv6 til MAC](/no/tools/ipv6-address-to-mac-address-converter/).
