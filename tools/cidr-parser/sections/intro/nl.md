CIDR Parser zet een blok zoals `10.24.8.19/21` of `2001:db8:abcd::123/64` om naar het netwerk dat je werkelijk bedoelt. Het normaliseert hostadres-invoer, toont het canonieke subnet en maakt de grenzen zichtbaar die je meestal nodig hebt voor firewallregels, documentatie of controles op te ruime allocaties.

## Wat het toont

Het resultaat begint met een kort overzicht en splitst het blok daarna op in praktische details: canonieke CIDR, totaal en bruikbaar aantal adressen, begin en einde van het bereik, plus de integerwaarden achter het blok. Voor IPv4 krijg je ook netmasker, wildcardmasker en broadcastadres. Voor IPv6 blijft de workflow gelijk, maar velden die niet gelden worden verborgen.

## Waarom canonicalisatie belangrijk is

Veel geplakte CIDR-waarden bevatten hostbits. Dat is prima voor mensen, maar routers, ACLs en documentatie hebben meestal het canonieke netwerkadres nodig. Door het blok te herschrijven voordat je iets kopieert, helpt de tool off-by-one-aannames te vinden voordat ze in configuratie belanden.

## Praktische notities

- IPv4-blokken `/31` en `/32` worden als volledig bruikbaar behandeld, wat past bij modern point-to-point- en host-route-gebruik.
- IPv6-blokken tonen de volledige adresruimte en het bruikbare bereik zonder een broadcastconcept te verzinnen.
- Alles draait lokaal in de browser, zodat interne subnetten de pagina niet verlaten tijdens het inspecteren.
