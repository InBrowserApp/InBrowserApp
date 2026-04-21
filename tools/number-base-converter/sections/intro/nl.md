Zet gehele getallen direct in de browser om tussen binair, octaal, decimaal, hexadecimaal, Base32, Base36, Base62, Base64 en aangepaste basissen van 2 tot 64. Alles wordt lokaal met BigInt berekend, zodat je grote waarden kunt inspecteren zonder ze naar een server te sturen.

## Wanneer gebruiken

Gebruik dit hulpmiddel wanneer hetzelfde gehele getal in logs, protocollen, ID's of specificaties met verschillende alfabetten voorkomt. Zodra je één veld wijzigt, worden de andere meteen herberekend. Dat is handig voor debuggen, documentatie en handmatige controle.

## Verschillen tussen basissen

Tot en met basis 36 worden letters hoofdletterongevoelig geaccepteerd. Hogere basissen behandelen hoofdletters en kleine letters als verschillende cijfers, en de Base64-regel gebruikt het numerieke alfabet `A-Z a-z 0-9 + /`, niet de bytegerichte Base64-tekstcodering.

## Let op

Alleen niet-negatieve gehele getallen worden ondersteund. Voorloopnullen gelden als opmaak, dus de geconverteerde uitvoer wordt genormaliseerd en kan de ingevoerde padding verliezen.
