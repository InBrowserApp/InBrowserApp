## DNS-Zonendateien lesen

Öffne einen DNS-Export im BIND-Format oder füge den Text ein. Das Beispiel enthält einen SOA-Eintrag, IPv4- und IPv6-Adresseinträge, Mail-Einträge und eine TXT-Zeichenfolge. Der Parser zeigt pro Zeile den Namen, die Klasse, den Typ, die Gültigkeitsdauer (TTL) in Sekunden und die Eintragsdaten. Filtere nach einem Namen, einem Typ wie MX oder einem Teil des Werts. Kopiere dann die sichtbaren Einträge als JSON für eine Bestandsaufnahme oder Migration.

## Wie Zonendomain, TTL und Eintragsdaten verarbeitet werden

Mit dem $ORIGIN-Wert `example.com.` wird aus dem relativen Eintragsnamen „www“ der vollständige Name `www.example.com.` Der Name @ steht für die aktuelle Zonendomain. Ein eingerückter Eintrag übernimmt den Namen des vorherigen Eintrags. Fehlt $ORIGIN in der Datei, trage die Domain unter Zonendomain ein. Ein Standardwert von 1h für $TTL entspricht 3.600 Sekunden. Ein Eintrag mit eigener TTL behält seinen Wert. Anführungszeichen, Escape-Sequenzen und relative Zielnamen bleiben in den Eintragsdaten erhalten. So bleibt „hello; world“ ein einzelner TXT-Wert, und „mail“ in einem MX-Eintrag bleibt „mail“.

## Was die Ergebnisse enthalten

Der Parser berücksichtigt Kommentare, Text in Anführungszeichen und mehrzeilige Einträge. Hinweise benennen die betroffene Zeile eines Problems. Lesbare Einträge bleiben sichtbar. Verwendet die Zone $INCLUDE oder $GENERATE, löse diese Direktiven auf und füge die vollständigen Einträge ein. Das Tool verarbeitet die Eingabe lokal, fragt keine DNS-Server ab und prüft nicht, ob ein bestimmter Anbieter die Zone laden kann.
