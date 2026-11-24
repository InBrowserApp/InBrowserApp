## Generer en DNSLink TXT-post for IPFS

DNSLink peker et domene eller underdomene til en innholdssti. Skriv inn domenet ditt og lim inn en IPFS-CID eller en IPFS- eller IPNS-sti. Kopier det genererte **Navn** og den genererte **TXT-verdi** til en ny TXT-post hos DNS-leverandøren din. Domenet `www.example.com` bruker for eksempel postnavnet `_dnslink.www.example.com`. Hvis DNS-editoren legger til `example.com` automatisk, skriver du `_dnslink.www` i navnefeltet.

## Kontroller hvor DNSLink peker

Velg **Kontroller publisert post** for å se TXT-svarene fra Cloudflare og Google. La målet stå tomt for å slå opp et eksisterende oppsett, eller skriv inn ønsket mål for å sammenligne det med den publiserte verdien. Etter en endring kan oppslagstjenere returnere en eldre verdi til hurtigbufferen utløper. Den viste TTL-verdien angir hvor lenge et mottatt DNS-svar kan lagres i hurtigbufferen.

## Oppdater et IPFS-nettsted bak et eget domene

Bruk en IPFS-CID for å peke direkte til en fast versjon av filene dine, eller bruk en IPNS-sti for å følge et navn som kan oppdateres. DNSLink forteller kompatible klienter og gatewayer hvilket innhold de skal slå opp. For å levere innholdet på ditt eget HTTPS-domene må du konfigurere en gateway som støtter DNSLink og peke domenet ditt til den. [IPFS-dokumentasjon om egne domener og DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
