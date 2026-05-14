## Was ist ein JWT-Signer?

Ein JWT-Signer erstellt ein kompaktes JSON Web Token, indem er einen Header und eine Payload serialisiert und sie anschließend mit einem Secret oder privaten Schlüssel signiert. Das Ergebnis ist das dreiteilige `header.payload.signature`-Token, das von vielen API-, OAuth- und Sitzungssystemen verwendet wird.

## Wann dieses Tool verwendet werden sollte

- Erstellen Sie lokale Test-Token für API-Entwicklung, Staging-Umgebungen und Demos.
- Vergleichen Sie, wie verschiedene Algorithmen den Token-Header und die Signatur verändern.
- Fügen Sie Claims wie `sub`, `iss`, `aud`, `exp`, `iat`, `scope` oder benutzerdefinierte Anwendungsfelder hinzu, ohne ein Wegwerfskript zu schreiben.
- Erzeugen Sie Token mit gemeinsamen HMAC-Secrets oder mit privaten RSA/ECDSA-Schlüsseln in PKCS#8 PEM- oder JWK-Form.

## Was vor der Verwendung eines signierten Tokens geprüft werden sollte

- Stimmen Sie den Algorithmus auf den Schlüsseltyp ab: `HS*` verwendet ein gemeinsames Secret, `RS*` und `PS*` verwenden private RSA-Schlüssel, und `ES*` verwendet private EC-Schlüssel.
- Fügen Sie Ablauf- und Zielgruppen-Claims hinzu, wenn der empfangende Dienst sie erwartet.
- Halten Sie private Produktionsschlüssel von gemeinsam genutzten Browsern und Rechnern fern. Dieses Tool läuft lokal, kann Schlüssel aber nicht vor einem bereits kompromittierten Gerät schützen.
- Denken Sie daran, dass Signieren keine Verschlüsselung ist. Jeder, der das Token erhält, kann Header und Payload dekodieren.
