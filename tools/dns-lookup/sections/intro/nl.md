DNS Lookup controleert de openbare DNS-records die voor een domeinnaam worden teruggegeven. Dit is handig wanneer je een nieuwe site-lancering verifieert, e-mailbezorging debugt, wijzigingen aan een CDN of load balancer controleert, of bevestigt of DNSSEC-gerelateerde antwoorden per resolver verschillen.

## Wanneer te Gebruiken

Gebruik dit hulpmiddel wanneer je snel in de browser antwoord nodig hebt voor gangbare DNS-recordtypen. A- en AAAA-records tonen IPv4- en IPv6-bestemmingen, CNAME-records tonen aliassen, MX-records identificeren mail exchangers, TXT-records bevatten vaak SPF- of verificatietokens, en NS/SOA/CAA/SRV/HTTPS/SVCB-records geven delegatie, autoriteit, certificaat-, service- en moderne endpoint-hints weer.

## Hoe Het Werkt

De lookup draait in je browser met DNS over HTTPS. Kies een resolver, selecteer een of meer recordtypen en dien een domein of URL in. URL's worden genormaliseerd naar hun hostnaam voordat de query wordt verzonden, dus het plakken van `https://www.example.com/path` vraagt `www.example.com` op.

## Resultaten Lezen

Elk recordtype wordt afzonderlijk weergegeven met de DNS-responscode, resolvervlaggen, antwoordrijen en ruwe JSON. `NoError` betekent dat de DNS-server succesvol heeft geantwoord, maar er kunnen nog steeds geen antwoordrijen voor een specifiek type zijn. `NXDomain`, `ServFail` of `Refused` betekent meestal dat de naam niet bestaat, dat de resolver de lookup niet kon voltooien, of dat het resolverbeleid het verzoek heeft geblokkeerd.

## Privacy en Beperkingen

Queries worden naar de geselecteerde DNS over HTTPS-resolver verzonden, niet naar een InBrowser.App-server. Resolvergedrag, cachestatus, DNSSEC-validatie en filtering door het lokale netwerk kunnen allemaal invloed hebben op de resultaten. Dit hulpmiddel vervangt geen gezaghebbende `dig`-controles vanaf meerdere netwerken, maar het is een snelle manier om te bekijken wat openbare DoH-resolvers vanuit je huidige browser teruggeven.
