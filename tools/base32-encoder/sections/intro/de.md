## Was ist Base32?

Base32 ist nützlich, wenn ein reiner Textkanal oder ein Kanal ohne Unterscheidung von Groß- und Kleinschreibung Binärdaten transportieren muss, etwa OTP-Geheimnisse, DNS-taugliche Tokens oder exportierte Konfigurationswerte. Es ist eine Kodierungsschicht, keine Sicherheitsschicht.

## Wann sollte man es verwenden

- Bytes, Text oder Dateien in Base32 kodieren, bevor sie über reine Textkanäle gesendet werden.
- OTP-Geheimnisse, exportierte Einstellungen oder Binärblobs für Systeme vorbereiten, die Base32-Eingaben erwarten.
- Rohe Dateibytes in eine kopierbare Zeichenkette für Übertragung, Logging oder manuelle Eingabe umwandeln.

## Was zu beachten ist

- Base32 vergrößert Daten stärker als Base64.
- Es verschlüsselt oder verbirgt den ursprünglichen Wert nicht.
- Manche Systeme verlangen `=`-Padding, andere akzeptieren ungepaddingte Ausgabe. Richte dich daher nach dem Empfänger.
