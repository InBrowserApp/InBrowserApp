## Was das Tool erzeugt

Dieser Generator wandelt ein einzelnes Bild in ein vollständiges, modernes
Favicon-Bundle um – eine mehrgrößige `.ico` für ältere Browser, die
PNG-Varianten in 16 / 32 / 180 / 192 / 512, eine optionale Original-`.svg`,
ein `site.webmanifest` für PWAs sowie das HTML-Snippet, das Sie in `<head>`
einfügen. Jedes Byte wird in Ihrem Browser erzeugt; kein Upload, kein Server,
keine Analytics.

## Was im Bundle enthalten ist

- `favicon.ico` – Mehrbild-Datei (16 / 32 / 48) für Browser-Tabs, Lesezeichen
  und alte Windows-Verknüpfungen.
- `favicon-16x16.png` und `favicon-32x32.png` – moderne PNG-Varianten, die
  von aktuellen Browsern verwendet werden.
- `favicon.svg` – nur enthalten, wenn Ihr Quellbild eine SVG ist und der
  Schalter „Original-SVG verwenden" aktiviert ist.
- `apple-touch-icon.png` – 180×180, deckend, für iOS-Startbildschirme.
- `pwa-192x192.png` und `pwa-512x512.png` – die Standard-PWA-Icons.
- `pwa-maskable-192x192.png` und `pwa-maskable-512x512.png` – maskierbare
  Varianten mit dem vom W3C empfohlenen Sicherheitsbereich.
- `site.webmanifest` – das PWA-Manifest, das mit den obigen Icons verknüpft ist.

## Wie Innenabstand, Hintergrund und maskierbare Sicherheitszonen funktionieren

Jede Plattform hat ihren eigenen Innenabstand („Margin"), damit Sie etwas
Luft innerhalb der Icon-Fläche lassen können. Der Schalter „Hintergrund
hinzufügen" zeichnet ein deckendes Quadrat hinter Ihrer Quelle – nützlich,
wenn die Quelle transparent ist und das Ziel Deckkraft erfordert
(Apples Startbildschirm) oder einfach für visuellen Kontrast in einem
Browser-Tab. Maskierbare PWA-Icons verwenden zusätzlich zum Plattform-Rand
eine weitere Sicherheitszone: Alles außerhalb der zentralen ~80 % kann von
Android, Windows oder ChromeOS abgeschnitten werden, wenn diese eine
kreisförmige, abgerundete oder Squircle-Maske anwenden.

## Das Bundle in Ihre Website einbinden

1. Entpacken Sie das heruntergeladene Archiv in Ihr Web-Root (sodass die
   Dateien unter `/favicon.ico`, `/site.webmanifest` usw. liegen).
2. Fügen Sie das HTML-Snippet in den `<head>` Ihrer Website ein.
3. Wenn Sie Assets aus einem Unterpfad ausliefern (zum Beispiel
   `/static/icons/`), legen Sie vor dem Generieren den „Asset-Pfad" fest,
   damit Snippet und Manifest die richtigen URLs verwenden.
4. Wenn Sie das Manifest über das hinaus angepasst haben, was dieses Tool
   bereitstellt (zum Beispiel um `categories` oder `screenshots`
   hinzuzufügen), öffnen Sie `site.webmanifest` in einem Texteditor und
   bearbeiten Sie es direkt – es ist einfaches JSON.
