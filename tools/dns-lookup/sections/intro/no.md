DNS-oppslag kontrollerer de offentlige DNS-postene som returneres for et domenenavn. Det er nyttig når du verifiserer en ny nettstedslansering, feilsøker e-postlevering, sjekker endringer i CDN eller lastbalanserer, eller bekrefter om DNSSEC-relaterte svar ser ulike ut på tvers av resolvere.

## Når du bør bruke det

Bruk dette verktøyet når du trenger et raskt svar i nettleseren for vanlige DNS-posttyper. A- og AAAA-poster viser IPv4- og IPv6-mål, CNAME-poster viser aliaser, MX-poster identifiserer e-postvekslere, TXT-poster inneholder ofte SPF- eller verifiseringstokener, og NS/SOA/CAA/SRV/HTTPS/SVCB-poster viser delegering, autoritet, sertifikat, tjeneste og moderne endepunkthint.

## Slik fungerer det

Oppslaget kjøres i nettleseren din med DNS over HTTPS. Velg en resolver, velg én eller flere posttyper, og send inn et domene eller en URL. URL-er normaliseres til vertsnavnet før spørringen sendes, så hvis du limer inn `https://www.example.com/path`, spørres det etter `www.example.com`.

## Slik leser du resultatene

Hver posttype vises separat med DNS-svarkode, resolverflagg, svarrader og rå JSON. `NoError` betyr at DNS-serveren svarte vellykket, men den kan fortsatt returnere ingen svarrader for en bestemt type. `NXDomain`, `ServFail` eller `Refused` betyr vanligvis at navnet ikke finnes, at resolveren ikke kunne fullføre oppslaget, eller at resolverens policy blokkerte forespørselen.

## Personvern og begrensninger

Spørringer sendes til den valgte DNS over HTTPS-resolveren, ikke til en InBrowser.App-server. Resolveratferd, hurtigbufferstatus, DNSSEC-validering og lokal nettverksfiltrering kan alle påvirke resultatene. Dette verktøyet erstatter ikke autoritative `dig`-kontroller fra flere nettverk, men det er en rask måte å se hva offentlige DoH-resolvere returnerer fra den gjeldende nettleseren din.
