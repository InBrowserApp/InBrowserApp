## Vad verktyget gör

Denna SVG optimizer komprimerar en lokal SVG-fil eller ett inklistrat
SVG-dokument i din webbläsare. Den använder SVGO-rensningspass för att ta bort
kommentarer, metadata, redundanta attribut, onödig precision och annan kod som
inte ändrar den synliga bilden.

## Varför det hjälper

SVG-filer som exporteras från designverktyg innehåller ofta redigerarmetadata,
utförliga sökvägar, oanvända ID:n och kommentarer. Att optimera dem kan minska
nedladdningsstorleken, förbättra sidladdningen och göra inline SVG-kod enklare
att granska innan den publiceras på en webbplats, i en app, i ett mejl eller på
en dokumentationssida.

## Så fungerar det

Ladda upp en `.svg`-fil eller klistra in SVG-kod, välj den säkra
förinställningen eller finjustera de enskilda SVGO-passen och kör sedan
optimeringen. Verktyget visar originalets och den optimerade versionens
förhandsvisningar, bytebesparingen och den slutliga koden så att du kan kopiera
den eller ladda ner en `.optimized.svg`-fil. SVG-filen behöver aldrig lämna din
enhet.

## Praktiska råd

- Behåll den säkra förinställningen när SVG-filen är beroende av extern CSS,
  skriptade ID:n eller symbolreferenser som du inte enkelt kan granska.
- Använd den aggressiva förinställningen för enkla exporterade ikoner,
  logotyper och illustrationer där det är acceptabelt att ta bort dimensioner
  och infoga stilar inline.
- Förhandsvisa den optimerade bilden innan du ersätter källgrafik, särskilt när
  källan använder masker, gradienter, filter eller länkade resurser.
