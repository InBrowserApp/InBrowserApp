## Slik konverterer du TTF eller OTF til WOFF2

Velg én eller flere skriftfiler i TrueType-format (`.ttf`) eller OpenType-format (`.otf`), eller dra dem inn i konverteren. Konverteringen starter så snart du legger til filene. Når en skrift er klar, kan du sammenligne filstørrelsene og velge **Last ned WOFF2**. For eksempel blir `Inter-Regular.ttf` til `Inter-Regular.woff2`. Nettleseren behandler filene lokalt, så de blir på enheten din.

## Hvorfor bruke WOFF2 til nettskrifter?

WOFF2 (Web Open Font Format 2) bruker Brotli til å komprimere skriftdata. Dermed kan nettstedet vanligvis overføre mindre data enn med den opprinnelige TTF- eller OTF-filen. Hvor mye plass du sparer, avhenger av skriften. Konverteringen beholder alle glyfene og aksene i variable skrifter. Én variabel skriftfil kan derfor fortsatt dekke flere skriftvekter. Hvis nettstedet bare bruker bestemte tegn, kan du gjøre filen enda mindre med [generatoren for skriftdelmengder](../font-subset-generator/).

## Slik bruker du en WOFF2-fil i CSS

Legg den nedlastede filen i skriftmappen på nettstedet, og vis til den med `@font-face`. Tilpass filbanen, skriftvekten og skriftstilen til filen du bruker. Eksemplet laster inn en skrift i normal stil fra `/fonts/` og viser teksten med en reserveskrift mens filen lastes inn.

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

For en variabel skrift oppgir du vektintervallet som skriften faktisk støtter, for eksempel `font-weight: 100 900;`. Sjekk lisensen før du legger ut skriften på et nettsted, og test språkene og skriftvektene sidene bruker. [MDN-referansen for @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
