## Was ist ein JWT Decoder und Verifier?

Ein JSON Web Token ist eine kompakte Zeichenfolge mit drei base64url-Segmenten: einem Header, einer Payload und einer Signatur. Dieses Tool decodiert Header und Payload in deinem Browser, damit du die Token-Struktur pruefen kannst, ohne sie an einen Server zu senden.

Die Signaturverifizierung prueft, ob das Token mit dem erwarteten Schluessel und Algorithmus signiert wurde. Verwende ein gemeinsames Secret fuer HS256-, HS384- oder HS512-Token. Verwende einen oeffentlichen PEM-Schluessel, JWK oder JWKS fuer RS-, PS- und ES-Token.

## Wann du es verwenden solltest

Verwende den Decoder beim Debuggen von Authentifizierungsablaeufen, beim Pruefen von OAuth- oder OpenID-Connect-Claims, beim Vergleichen von Umgebungen oder beim Bestaetigen, dass ein Backend die erwarteten Werte fuer Audience, Issuer, Subject, Ablaufzeit und Schluesselkennung ausstellt.

Verwende die Verifizierung, wenn du das passende Secret oder den passenden oeffentlichen Schluessel hast und bestaetigen musst, dass Header, Payload und Signatur weiterhin zusammengehoeren. Das Tool hebt auch `exp`, `nbf` und `iat` hervor, damit haeufige Uhrzeit- und Ablaufprobleme sofort sichtbar sind.

## Sicherheitshinweise

JWT-Payloads sind nur codiert, nicht verschluesselt. Jede Person mit dem Token kann seine Claims lesen, sofern das Token kein separates verschluesseltes JWE ist, das dieses Tool nicht verarbeitet.

Fuege keine Produktions-Token oder privaten Secrets auf gemeinsam genutzten Rechnern ein. Das Tool laeuft lokal in deinem Browser und speichert weder das Token noch Verifizierungsmaterial, aber der sicherste Ablauf ist weiterhin, wann immer moeglich kurzlebige Test-Token und oeffentliche Schluessel zu verwenden.
