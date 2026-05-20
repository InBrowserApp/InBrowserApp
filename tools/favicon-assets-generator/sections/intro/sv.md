## Vad verktyget genererar

Den här generatorn omvandlar en enda bild till ett komplett, modernt favicon-paket —
en `.ico` med flera storlekar för äldre webbläsare, PNG-varianter i 16 / 32 / 180 / 192 / 512,
en valfri ursprunglig `.svg`, en `site.webmanifest` för PWA:er,
och HTML-snutten du klistrar in i `<head>`. Varje byte produceras i
din webbläsare; ingen uppladdning, ingen server, ingen analys.

## Vad som ingår i paketet

- `favicon.ico` — flera bilder (16 / 32 / 48) för webbläsarflikar, bokmärken
  och gamla Windows-genvägar.
- `favicon-16x16.png` och `favicon-32x32.png` — moderna PNG-varianter som används av
  aktuella webbläsare.
- `favicon.svg` — inkluderas endast när din källbild är SVG och
  växeln "Använd original-SVG" är aktiverad.
- `apple-touch-icon.png` — 180×180, ogenomskinlig, används av iOS hemskärmar.
- `pwa-192x192.png` och `pwa-512x512.png` — standardikoner för PWA.
- `pwa-maskable-192x192.png` och `pwa-maskable-512x512.png` — maskbara
  varianter med den W3C-rekommenderade säkra zonen.
- `site.webmanifest` — PWA-manifestet kopplat till ikonerna ovan.

## Hur utfyllnad, bakgrund och säkra zoner för maskbara ikoner fungerar

Varje plattform har sin egen utfyllnad ("Marginal") så att du kan lämna utrymme
inuti ikon-canvasen. Reglaget "Lägg till bakgrund" målar en ogenomskinlig kvadrat
bakom källan — användbart när källan är transparent och
målet kräver ogenomskinlighet (Apples hemskärm) eller bara för visuell
kontrast i en webbläsarflik. Maskbara PWA-ikoner använder en extra säker zon
utöver plattformens marginal: allt utanför de centrala ~80 % kan beskäras
av Android, Windows eller ChromeOS när de tillämpar en cirkulär,
rundad eller squircle-formad mask.

## Koppla in paketet i din webbplats

1. Packa upp det nedladdade arkivet i din webbrot (så att filerna ligger på
   `/favicon.ico`, `/site.webmanifest`, osv.).
2. Klistra in HTML-snutten i webbplatsens `<head>`.
3. Om du serverar tillgångar från en underväg (till exempel `/static/icons/`),
   ange "Tillgångsväg" innan du genererar så att snutten och manifestet använder
   rätt URL:er.
4. Om du har anpassat manifestet utöver vad det här verktyget exponerar (till
   exempel för att lägga till `categories` eller `screenshots`), öppna `site.webmanifest`
   i en textredigerare och redigera den direkt — det är ren JSON.
