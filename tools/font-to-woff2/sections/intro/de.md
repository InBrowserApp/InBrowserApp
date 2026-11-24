## TTF- oder OTF-Schriften in WOFF2 umwandeln

Wähle eine oder mehrere TrueType- (`.ttf`) oder OpenType-Schriftdateien (`.otf`) aus oder ziehe sie in den Konverter. Die Umwandlung startet automatisch. Sobald eine Schrift fertig ist, kannst du die Dateigrößen vergleichen und **WOFF2 herunterladen** wählen. Aus `Inter-Regular.ttf` wird zum Beispiel `Inter-Regular.woff2`. Dein Browser verarbeitet die Schriften direkt auf deinem Gerät.

## Warum WOFF2 für Webfonts verwenden?

WOFF2 (Web Open Font Format 2) komprimiert Schriftdaten mit Brotli. Beim Laden einer Website müssen dadurch meist weniger Daten übertragen werden als mit der ursprünglichen TTF- oder OTF-Datei. Wie viel kleiner die Datei wird, hängt von der Schrift ab. Bei der Umwandlung bleiben alle Glyphen und die Achsen variabler Schriften erhalten. Damit kann eine einzige variable Schriftdatei weiterhin mehrere Schriftstärken abdecken. Wenn deine Website nur bestimmte Zeichen verwendet, kannst du mit dem [Generator für Schrift-Teilmengen](../font-subset-generator/) die Datei weiter verkleinern.

## Eine WOFF2-Datei in CSS einbinden

Lege die heruntergeladene Datei im Schriftenordner deiner Website ab und binde sie mit `@font-face` ein. Passe Pfad, Schriftstärke und Schriftstil an die Datei an. Dieses Beispiel lädt eine Schrift im normalen Schnitt aus `/fonts/` und zeigt den Text während des Ladens in einer Ersatzschrift an.

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

Gib bei einer variablen Schrift den tatsächlich unterstützten Bereich an, etwa `font-weight: 100 900;`. Prüfe die Schriftlizenz, bevor du die Datei auf einer Website bereitstellst, und teste die Sprachen und Schriftstärken, die deine Seiten verwenden. [MDN-Referenz zu @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
