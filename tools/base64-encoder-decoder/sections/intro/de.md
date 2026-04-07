## Was ist Base64?

Base64 ist nützlich, wenn ein textbasierter Kanal binärfreundliche Nutzdaten übertragen muss, etwa E-Mail-Inhalte, JSON-Blobs oder kleine data URLs. Es ist eine Kodierungsschicht, keine Sicherheitsschicht.

## Wann sollte man es verwenden

- Schnelles Debugging, wenn eine API Base64-Strings zurückgibt oder erwartet.
- Umwandlung von Browsertext in ein sicheres Transportformat für Logs oder Nutzdaten.
- Prüfen, ob ein eingefügter Base64-Block zum erwarteten Inhalt dekodiert wird.

## Was zu beachten ist

- Base64 vergrößert die Datenmenge um etwa ein Drittel.
- Es verschlüsselt oder verbirgt den ursprünglichen Wert nicht.
- Ungültiges Padding oder abgeschnittenes Kopieren zeigt sich meist als Dekodierfehler.
