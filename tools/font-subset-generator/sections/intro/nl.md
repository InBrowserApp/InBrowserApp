## Wat is een lettertypesubset?

Een lettertypesubset bevat de tekens die nodig zijn voor een bepaalde tekst,
samen met de ondersteunende glyphs die nodig zijn om ze weer te geven.
Door ongebruikte glyphs te verwijderen, kun je lettertypedownloads aanzienlijk
verkleinen. Dit helpt vooral bij grote Chinese, Japanse en Koreaanse lettertypen
of bij een vaste kop, een logo of een campagnepagina.

## Hoe gebruik je deze tool?

Kies een TTF-, OTF-, WOFF- of WOFF2-bestand en plak alle tekst die het lettertype
zal gebruiken. Kies WOFF2 voor levering via het web of TTF / OTF voor een
ongecomprimeerd lettertype en genereer vervolgens de subset. Vergelijk de
groottes, controleer de voorvertoning en download het lettertype met de
bijbehorende CSS. De verwerking gebeurt lokaal in een Web Worker.

## Wat blijft behouden?

HarfBuzz behoudt de glyphafhankelijkheden en OpenType-lay-outfuncties die nodig
zijn voor ligaturen, kerning, gecombineerde tekens en complexe schriften.
Hinting en assen van variabele lettertypen blijven behouden. Canoniek
gelijkwaardige samengestelde en ontlede tekstvormen worden opgenomen waar het
bronlettertype deze ondersteunt. De voorvertoning gebruikt het gegenereerde
lettertype; ontbrekende brontekens worden afzonderlijk vermeld.

## Praktische tips

- Neem spaties, leestekens, cijfers en alle benodigde vertaalde teksten op.
  Voeg de Latijnse voorinstelling toe als je tekst ook gewone Latijnse tekens bevat.
- Genereer de subset opnieuw wanneer je tekst verandert. Een vaste subset is
  het geschiktst voor bekende inhoud; gebruik een bredere tekendekking voor
  tekst die gebruikers zelf invoeren.
- Een subset kan geen tekens toevoegen die in het oorspronkelijke lettertype
  ontbreken. Houd een vervangend CSS-lettertype beschikbaar voor tekens buiten de subset.
- Gebruik een lettertype waarvan de licentie wijzigingen en insluiting op het
  web toestaat. Lettertypeverzamelingen (`.ttc` / `.otc`) moeten eerst als
  afzonderlijke lettertypen worden geëxporteerd.
- Kleine of al verkleinde lettertypen worden mogelijk niet kleiner. WOFF2
  levert doorgaans de kleinste webdownload op; het aantal glyphs omvat ook
  ondersteunende glyphs.
