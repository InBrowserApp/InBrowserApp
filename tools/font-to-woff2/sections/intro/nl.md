## TTF of OTF naar WOFF2 converteren

Kies een of meer TrueType-bestanden (`.ttf`) of OpenType-bestanden (`.otf`), of sleep ze naar de converter. De conversie start zodra je de bestanden toevoegt. Zodra een lettertype klaar is, kun je de bestandsgroottes vergelijken en **WOFF2 downloaden** kiezen. Zo wordt `Inter-Regular.ttf` bijvoorbeeld `Inter-Regular.woff2`. Je browser verwerkt de bestanden lokaal, zodat ze op je apparaat blijven.

## Waarom WOFF2 gebruiken voor webfonts?

WOFF2 (Web Open Font Format 2) comprimeert lettertypegegevens met Brotli. Doorgaans draagt je site hierdoor minder gegevens over dan wanneer je het oorspronkelijke TTF- of OTF-bestand aanbiedt. De besparing hangt af van het lettertype. Bij de conversie blijven alle glyphs en de assen van variabele lettertypen behouden. Zo kan één variabel lettertypebestand nog steeds meerdere lettergewichten ondersteunen. Gebruikt je site alleen bepaalde tekens? Met de [generator voor lettertypesubsets](../font-subset-generator/) kun je het bestand verder verkleinen.

## Een WOFF2-bestand gebruiken in CSS

Zet het gedownloade bestand in de lettertypemap van je site en verwijs ernaar met `@font-face`. Stem het pad, het gewicht en de stijl af op het bestand dat je aanbiedt. Dit voorbeeld laadt een lettertype in normale stijl uit `/fonts/` en toont de tekst tijdens het laden in een vervangend lettertype.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

Gebruik voor een variabel lettertype het gewichtsbereik dat het bestand ondersteunt, bijvoorbeeld `font-weight: 100 900;`. Controleer de licentie voordat je het lettertype op een website aanbiedt en test de talen en lettergewichten die je pagina's gebruiken. [MDN-documentatie over @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
