Omvendt IP-oppslag gjør en IPv4- eller IPv6-adresse om til det omvendte DNS-navnet og spør den tilsvarende `PTR`-posten. Det hjelper deg å kontrollere hvilket vertsnavn en adresseeier publiserer for e-postservere, nettverksenheter, skyinstanser og feilsøkingsnotater.

## Hva det sjekker

For IPv4 snur verktøyet oktettene og spør et `in-addr.arpa`-navn. For IPv6 utvider det adressen til 32 heksadesimale sifre, snur dem og spør det tilsvarende `ip6.arpa`-navnet. Resultatet viser det nøyaktige omvendte DNS-domenet, DNS-statuskoden, oppløseren, adressefamilien og eventuelle returnerte vertsnavn med TTL-verdiene deres.

## Slik kjøres spørringen

Oppslaget kjøres fra nettleseren din med DNS-over-HTTPS. Du kan velge Cloudflare, Google eller AliDNS som oppløser, og nettleseren sender en standard `PTR`-spørring til det endepunktet. Ingen InBrowser.App-oppslagstjeneste på serversiden er involvert.

## Slik leser du manglende resultater

Et manglende PTR-svar er vanlig. Mange private, skybaserte, interne eller nylig tildelte adresser publiserer ikke omvendte DNS-poster. Et vellykket DNS-svar uten vertsnavn beviser ikke at adressen er ubrukt; det betyr bare at den omvendte sonen ikke returnerte en brukbar `PTR`-post gjennom den valgte oppløseren.

## Praktiske merknader

- Omvendt DNS knytter en IP-adresse til et vertsnavn; det er noe annet enn å finne alle domener som ligger på samme adresse.
- PTR-poster styres av IP-adresseeieren eller oppstrømsleverandøren, ikke bare av domeneeieren.
- E-post- og sikkerhetssystemer sammenligner ofte forover- og omvendt DNS, så en PTR-post bør vanligvis peke til et vertsnavn som løser tilbake til samme adresse.
