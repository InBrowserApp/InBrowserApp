## Was ist Local Font Access?

Local Font Access ist eine Browser-API, die lokal installierte Schriften auflistet.

Mit diesem Tool kannst du Ergebnisse durchsuchen, verwandte Schnitte vergleichen und einen CSS-Auszug für die gewählte Schrift kopieren.

Sie funktioniert nur in sicheren Kontexten und unterstützten Browsern und erfordert Nutzerberechtigung (local-fonts).

Die API liefert FontData mit family, fullName, postscriptName und style.

### Wichtige Punkte

- Nutze es, um die exakten Namen für einen CSS-`font-family`-Stack auf dem aktuellen Gerät zu bestätigen.
- Aufrufe müssen durch eine Nutzeraktion ausgelöst werden.
- Permissions Policy kann den Zugriff auf manchen Seiten blockieren.
- Dieses Tool bleibt lokal und lädt keine Schriften hoch.
