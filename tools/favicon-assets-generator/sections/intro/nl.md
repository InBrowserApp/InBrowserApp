## Wat de tool genereert

Deze generator zet een enkele afbeelding om in een complete, moderne favicon-bundel —
een `.ico` met meerdere formaten voor oudere browsers, de PNG-varianten in
16 / 32 / 180 / 192 / 512, een optionele originele `.svg`, een `site.webmanifest`
voor PWA's, en het HTML-fragment dat je in `<head>` plakt. Elke byte wordt in
je browser geproduceerd; geen upload, geen server, geen analytics.

## Wat zit er in de bundel

- `favicon.ico` — meerdere afbeeldingen (16 / 32 / 48) voor browsertabbladen,
  bladwijzers en oude Windows-snelkoppelingen.
- `favicon-16x16.png` en `favicon-32x32.png` — moderne PNG-varianten die
  worden gebruikt door huidige browsers.
- `favicon.svg` — alleen opgenomen wanneer je bronafbeelding SVG is en de
  schakelaar "Originele SVG gebruiken" aanstaat.
- `apple-touch-icon.png` — 180×180, ondoorzichtig, gebruikt door iOS-beginschermen.
- `pwa-192x192.png` en `pwa-512x512.png` — de standaard PWA-iconen.
- `pwa-maskable-192x192.png` en `pwa-maskable-512x512.png` — maskeerbare
  varianten met het door W3C aanbevolen veilige gebied.
- `site.webmanifest` — het PWA-manifest dat is gekoppeld aan de bovenstaande iconen.

## Hoe opvulling, achtergrond en maskeerbare veilige zones werken

Elk platform heeft zijn eigen opvulling ("Marge") zodat je ruimte kunt laten
binnen het icoonvlak. De schakelaar "Achtergrond toevoegen" tekent een
ondoorzichtig vierkant achter je bron — nuttig wanneer de bron transparant is
en de bestemming ondoorzichtigheid vereist (Apple's beginscherm) of gewoon
voor visueel contrast in een browsertabblad. Maskeerbare PWA-iconen gebruiken
een extra veilige zone bovenop de platformmarge: alles buiten de centrale ~80%
kan worden bijgesneden door Android, Windows of ChromeOS wanneer ze een
cirkel-, afgerond of squircle-masker toepassen.

## De bundel in je site integreren

1. Pak het gedownloade archief uit in je webroot (zodat de bestanden zich
   bevinden op `/favicon.ico`, `/site.webmanifest`, enzovoort).
2. Plak het HTML-fragment in de `<head>` van je site.
3. Als je assets serveert vanaf een subpad (bijvoorbeeld `/static/icons/`),
   stel dan "Asset-pad" in voordat je genereert, zodat het fragment en
   manifest de juiste URL's gebruiken.
4. Als je het manifest hebt aangepast verder dan wat deze tool blootlegt
   (bijvoorbeeld om `categories` of `screenshots` toe te voegen), open dan
   `site.webmanifest` in een teksteditor en bewerk het direct — het is
   gewone JSON.
