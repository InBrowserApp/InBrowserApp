## Så konverterar du TTF eller OTF till WOFF2

Välj en eller flera teckensnittsfiler i TrueType-format (`.ttf`) eller OpenType-format (`.otf`), eller dra dem till konverteraren. Konverteringen börjar när du lägger till filerna. När ett teckensnitt är klart kan du jämföra filstorlekarna och välja **Ladda ned WOFF2**. Till exempel blir `Inter-Regular.ttf` till `Inter-Regular.woff2`. Webbläsaren sköter hela konverteringen, så filerna stannar på din enhet.

## Varför använda WOFF2 för webbteckensnitt?

WOFF2 (Web Open Font Format 2) använder Brotli för att komprimera teckensnittsdata. Det brukar ge mindre filer att ladda ned än om webbplatsen använder det ursprungliga TTF- eller OTF-formatet. Hur stor skillnaden blir beror på teckensnittet. Alla glyfer och axlar i variabla teckensnitt finns kvar efter konverteringen. En enda variabel teckensnittsfil kan alltså fortfarande täcka flera teckenvikter. Om webbplatsen bara använder vissa tecken kan du minska filstorleken ytterligare med [generatorn för teckensnittsdelmängder](../font-subset-generator/).

## Använda en WOFF2-fil i CSS

Lägg den nedladdade filen i webbplatsens teckensnittsmapp och hänvisa till den med `@font-face`. Anpassa sökvägen, vikten och stilen efter filen. Exemplet läser in ett teckensnitt i normal stil från `/fonts/` och visar texten med ett reservteckensnitt under tiden.

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

Ange det viktintervall som det variabla teckensnittet faktiskt stöder, till exempel `font-weight: 100 900;`. Kontrollera teckensnittets licens innan du använder det på en webbplats och testa de språk och teckenvikter som används på dina sidor. [MDN:s referens för @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
