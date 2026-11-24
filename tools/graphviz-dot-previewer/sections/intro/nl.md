## Bekijk een Graphviz DOT-graaf online

Plak DOT uit een bestand, script of document in **DOT-brontekst**. De graaf wordt bijgewerkt terwijl je typt. Gebruik `digraph` en `->` voor gerichte verbindingen, of `graph` en `--` voor ongerichte verbindingen. De ingebouwde voorbeelden laten zien hoe je afhankelijkheden, netwerken en clusters in DOT beschrijft.

## Kies een indelingsalgoritme voor Graphviz

Begin met `dot` voor grafen met lagen, bijvoorbeeld afhankelijkheden in een build. Probeer `neato` of `fdp` om de knopen van een ongericht netwerk te spreiden en `sfdp` voor grotere netwerken. Kies `circo` voor een cirkelvormige indeling, `twopi` voor een radiale boom, `osage` voor geclusterde grafen of `patchwork` voor boomkaarten. Je DOT-code blijft staan wanneer je een ander algoritme kiest.

## Lees meldingen over indeling en syntaxis

Graphviz kan een fout melden wanneer de operator voor een verbinding niet bij het type graaf past of als er een accolade of aanhalingsteken ontbreekt. Controleer de gemelde regel en de regel erboven. Graphviz kan ook een graaf tonen met opmerkingen over attributen die niet konden worden toegepast. Als de graaf zelf een `layout`-attribuut bevat, gebruikt Graphviz het algoritme dat daarin staat. Meer informatie vind je in de [DOT-taalreferentie](https://graphviz.org/doc/info/lang.html) en de [Graphviz-indelingsgids](https://graphviz.org/docs/layouts/).

## Download een graaf als SVG

Kies **SVG downloaden** om de huidige indeling als vectorafbeelding op te slaan. **Passend in beeld** en **Ware grootte** passen alleen de voorvertoning aan. Bewaar de DOT-brontekst om de graaf later te bewerken.
