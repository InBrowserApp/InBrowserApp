## Was ist Base32?

Base32 ist nützlich, wenn ein reiner Textkanal oder ein Kanal ohne Unterscheidung von Groß- und Kleinschreibung Binärdaten transportieren muss, etwa OTP-Geheimnisse, DNS-taugliche Tokens oder exportierte Konfigurationswerte. Es ist eine Kodierungsschicht, keine Sicherheitsschicht.

## Wann sollte man es verwenden

- Base32-Geheimnisse oder Tokens zurück in ihre ursprünglichen Bytes dekodieren.
- Werte prüfen, die aus TOTP-Einrichtung, Integrations-Exports oder Konfigurationsdateien kopiert wurden.
- Kontrollieren, ob eingefügte Base32-Daten vor der Verwendung gültige Zeichen und korrektes Padding haben.

## Was zu beachten ist

- Base32 vergrößert Daten stärker als Base64.
- Es verschlüsselt oder verbirgt den ursprünglichen Wert nicht.
- Manche Systeme lassen das `=`-Padding weg, aber ungültige Zeichen führen weiterhin zu Dekodierfehlern.
