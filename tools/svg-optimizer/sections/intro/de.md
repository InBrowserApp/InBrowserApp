## Was dieses Tool macht

Dieser SVG Optimizer komprimiert eine lokale SVG-Datei oder ein eingefügtes
SVG-Dokument in deinem Browser. Er verwendet SVGO-Bereinigungsdurchläufe, um
Kommentare, Metadaten, redundante Attribute, unnötige Zahlenpräzision und
anderes Markup zu entfernen, das das sichtbare Bild nicht verändert.

## Warum es hilft

Aus Design-Tools exportierte SVG-Dateien enthalten oft Editor-Metadaten,
ausführliche Pfade, ungenutzte IDs und Kommentare. Ihre Optimierung kann die
Downloadgröße reduzieren, das Laden von Seiten verbessern und Inline-SVG-Code
leichter prüfbar machen, bevor er in einer Website, App, E-Mail oder
Dokumentationsseite ausgeliefert wird.

## So funktioniert es

Lade eine `.svg`-Datei hoch oder füge SVG-Markup ein, wähle das sichere Preset
oder passe die einzelnen SVGO-Durchläufe an und starte dann die Optimierung. Das
Tool zeigt die Vorschau des Originals und der optimierten Ausgabe, die
eingesparten Bytes und das finale Markup, damit du es kopieren oder als
`.optimized.svg`-Datei herunterladen kannst. Das SVG muss dein Gerät nie
verlassen.

## Praktische Hinweise

- Behalte das sichere Preset bei, wenn das SVG von externem CSS, geskripteten
  IDs oder Symbolreferenzen abhängt, die du nicht leicht prüfen kannst.
- Verwende das aggressive Preset für einfache exportierte Icons, Logos und
  Illustrationen, bei denen das Entfernen von Abmessungen und das Inline-Setzen
  von Styles akzeptabel ist.
- Prüfe die Vorschau des optimierten Bildes, bevor du Quellgrafiken ersetzt,
  insbesondere wenn die Quelle Masken, Verläufe, Filter oder verlinkte Assets
  verwendet.
