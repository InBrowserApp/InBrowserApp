## Was Es Tut

Dieses Tool parst rohe Cookie- und Set-Cookie-Header direkt im Browser in strukturiertes JSON. Du kannst eine einzelne Header-Zeile, mehrere Zeilen oder auch nur Werte ohne die üblichen Präfixe einfügen.

## Cookie Vs. Set-Cookie

Ein Cookie-Header enthält meist mehrere Name/Wert-Paare, die vom Client gesendet werden. Ein Set-Cookie-Header definiert dagegen in der Regel ein einzelnes Cookie mit Attributen wie Path, Secure, HttpOnly, SameSite, Expires oder Max-Age.

## Hinweise

Der Parser läuft vollständig lokal und lädt keine Header auf einen Server hoch. Ungültige Segmente werden separat aufgeführt, damit sich fehlerhafte Cookie-Strings schnell erkennen lassen.
