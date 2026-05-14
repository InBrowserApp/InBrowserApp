## Vad verktyget gör

Image Palette Extractor hittar de dominerande färgerna i en bild direkt i
webbläsaren. Verktyget samplar bilden, grupperar visuellt liknande pixlar och
returnerar en praktisk palett med HEX-, RGB-, HSL- och procentvärden för
varje färg.

## Bra användningsområden

- Plocka fram varumärkes- eller produktfärger från en skärmbild, logotyp,
  foto eller mockup.
- Bygg snabbt en CSS-palett för en landningssida, miniatyrbild eller
  designöverlämning.
- Jämför hur mycket av en bild som styrs av en dominerande färg jämfört med
  stödjande accentfärger.
- Arbeta med privata bilder utan att skicka filen till en server.

## Exportalternativ

Resultatet kan kopieras som en enkel HEX-lista, anpassade CSS-egenskaper eller
JSON. CSS-formatet är användbart när du vill ha variabler som `--palette-1`,
medan JSON håller ihop färgformaten och dominansförhållandet för skript eller
designautomatisering.

## Att tänka på

- Palettextrahering är ungefärlig. Den är avsedd att skapa användbara visuella
  grupper, inte en fullständig inventering av varje pixelfärg.
- Transparenta pixlar ignoreras som standard så att ikoner och frilagda objekt
  inte snedvrider paletten; stäng av det när själva transparensen är en del av
  bilden.
- Den precisa kvalitetsinställningen samplar fler pixlar och kan vara
  långsammare för mycket stora bilder.
