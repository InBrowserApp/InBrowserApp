## Slik dannes adressen

Modifisert EUI-64 setter inn `ff:fe` mellom de to halvdelene av MAC-adressen og snur U/L-biten (universell/lokal) i første byte. For eksempel blir `00:11:22:33:44:55` til grensesnitt-ID-en `211:22ff:fe33:4455`. Med prefikset `2001:db8:1:2::/64` blir adressen `2001:db8:1:2:211:22ff:fe33:4455`.

Skriv inn `fe80::/64` for å få en link-local-adresse. For å legge til et grensesnittnavn kan du bruke [konvertereren for link-local-adresser](/no/tools/mac-address-to-ipv6-link-local-address-converter/). Hvis du skal ta en unicast-adresse i bruk, velger du et /64-prefiks som er tildelt nettverket ditt. Eksemplet bruker et dokumentasjonsprefiks.
