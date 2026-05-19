## Hva verktøyet genererer

Denne generatoren gjør et enkelt bilde om til en komplett, moderne favorittikon-pakke –
en `.ico`-fil med flere størrelser for eldre nettlesere, PNG-variantene 16 / 32 / 180 / 192 / 512,
en valgfri original `.svg`, en `site.webmanifest` for PWA-er,
og HTML-snutten du limer inn i `<head>`. Hver byte produseres i
nettleseren din; ingen opplasting, ingen server, ingen analyse.

## Hva pakken inneholder

- `favicon.ico` – flere bilder (16 / 32 / 48) for nettleserfaner, bokmerker
  og gamle Windows-snarveier.
- `favicon-16x16.png` og `favicon-32x32.png` – moderne PNG-varianter brukt av
  dagens nettlesere.
- `favicon.svg` – inkluderes kun når kildebildet er SVG og
  «Bruk original SVG»-bryteren er på.
- `apple-touch-icon.png` – 180×180, ugjennomsiktig, brukt av iOS-hjemskjermer.
- `pwa-192x192.png` og `pwa-512x512.png` – standard PWA-ikonene.
- `pwa-maskable-192x192.png` og `pwa-maskable-512x512.png` – maskbare
  varianter med W3C-anbefalt sikker sone.
- `site.webmanifest` – PWA-manifestet koblet til ikonene ovenfor.

## Hvordan utfylling, bakgrunn og maskbare sikre soner fungerer

Hver plattform har sin egen utfylling («Marg») slik at du kan gi luft
inne i ikon-lerretet. Bryteren «Legg til bakgrunn» maler en ugjennomsiktig firkant
bak kilden din – nyttig når kilden er gjennomsiktig og
destinasjonen krever ugjennomsiktighet (Apples hjemskjerm) eller bare for visuell
kontrast i en nettleserfane. Maskbare PWA-ikoner bruker en ekstra sikker sone
oppå plattformens marg: alt utenfor de sentrale ~80 % kan bli
beskåret av Android, Windows eller ChromeOS når de bruker en sirkulær,
avrundet eller squircle-maske.

## Koble pakken inn på nettstedet ditt

1. Pakk ut det nedlastede arkivet i web-roten din (slik at filene ligger på
   `/favicon.ico`, `/site.webmanifest`, osv.).
2. Lim inn HTML-snutten i nettstedets `<head>`.
3. Hvis du serverer ressurser fra en understi (for eksempel `/static/icons/`),
   sett «Ressurssti» før du genererer, slik at snutten og manifestet bruker
   riktige URL-er.
4. Hvis du har tilpasset manifestet ut over det dette verktøyet eksponerer (for
   eksempel for å legge til `categories` eller `screenshots`), åpne `site.webmanifest`
   i et tekstredigeringsprogram og rediger det direkte – det er ren JSON.
