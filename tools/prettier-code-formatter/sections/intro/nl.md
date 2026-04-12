## Wat is Prettier Code Formatter?

Prettier Code Formatter draait de officiële Prettier-standalone pipeline direct
in je browser, zodat je bronbestanden kunt normaliseren zonder code naar een
server te sturen. Het is handig wanneer je snel wilt formatteren, verschillende
printinstellingen wilt vergelijken, of meteen een schoon bestand wilt kopiëren
of downloaden.

## Ondersteunde formaten

Deze rewrite houdt de tool gericht op de formaten die Prettier al goed in de
browser ondersteunt: JavaScript, TypeScript, Flow, JSON, HTML, CSS, SCSS,
Less, Markdown, MDX, YAML, GraphQL en verwante templatingformaten zoals Vue en
Handlebars. De taalkeuze bepaalt welke parser wordt gebruikt, en bij het
importeren van een bestand wordt de parser automatisch herkend zodra de
extensie bekend is.

## Hoe deze rewrite werkt

De rewrite houdt zware formatteringslogica uit het hoofdpad van de UI. De
formatteeraanvragen worden opgebouwd uit zuivere tool-lokale configuratie en
daarna uitgevoerd via een luie, worker-gestuurde Prettier-pipeline, zodat
normaal typen responsief blijft. Grote invoer pauzeert het automatisch
formatteren en schakelt over op een expliciete actie `Nu formatteren`, wat
voorspelbaarder is dan bij elke toetsaanslag een groot bestand opnieuw proberen
te formatteren.
