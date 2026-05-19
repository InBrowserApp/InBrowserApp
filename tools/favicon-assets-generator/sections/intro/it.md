## Cosa genera lo strumento

Questo generatore trasforma una singola immagine in un bundle di favicon
completo e moderno: un `.ico` multi-dimensione per i browser legacy, le
varianti PNG da 16 / 32 / 180 / 192 / 512, un `.svg` originale opzionale,
un `site.webmanifest` per le PWA e lo snippet HTML da incollare in `<head>`.
Ogni byte viene prodotto nel tuo browser; nessun upload, nessun server,
nessuna analitica.

## Cosa contiene il bundle

- `favicon.ico` — multi-immagine (16 / 32 / 48) per le schede del browser,
  i preferiti e i vecchi collegamenti di Windows.
- `favicon-16x16.png` e `favicon-32x32.png` — varianti PNG moderne usate
  dai browser attuali.
- `favicon.svg` — incluso solo quando l'immagine sorgente è in formato SVG
  ed è attivo l'interruttore "Usa SVG originale".
- `apple-touch-icon.png` — 180×180, opaca, usata dalle schermate Home di
  iOS.
- `pwa-192x192.png` e `pwa-512x512.png` — le icone PWA standard.
- `pwa-maskable-192x192.png` e `pwa-maskable-512x512.png` — varianti
  maskable con l'area sicura raccomandata dal W3C.
- `site.webmanifest` — il manifest PWA collegato alle icone sopra elencate.

## Come funzionano padding, sfondo e zone sicure maskable

Ogni piattaforma ha il proprio padding ("Margine") così puoi lasciare
spazio di respiro all'interno del canvas dell'icona. L'interruttore
"Aggiungi sfondo" dipinge un quadrato opaco dietro la sorgente: utile
quando la sorgente è trasparente e la destinazione richiede opacità
(la schermata Home di Apple) oppure semplicemente per contrasto visivo
in una scheda del browser. Le icone PWA maskable usano una zona sicura
aggiuntiva sopra al margine della piattaforma: tutto ciò che si trova
al di fuori del ~80% centrale può essere ritagliato da Android, Windows
o ChromeOS quando applicano una maschera circolare, arrotondata o
a squircle.

## Collegare il bundle al tuo sito

1. Estrai l'archivio scaricato nella radice del tuo sito web (in modo che
   i file si trovino in `/favicon.ico`, `/site.webmanifest`, ecc.).
2. Incolla lo snippet HTML nel `<head>` del tuo sito.
3. Se servi gli asset da un sotto-percorso (ad esempio `/static/icons/`),
   imposta "Percorso degli asset" prima di generare, in modo che lo
   snippet e il manifest usino gli URL corretti.
4. Se hai personalizzato il manifest oltre a quanto questo strumento
   espone (ad esempio per aggiungere `categories` o `screenshots`), apri
   `site.webmanifest` in un editor di testo e modificalo direttamente:
   è semplice JSON.
