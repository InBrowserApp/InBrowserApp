## Was dieses Tool macht

Dieses Tool kombiniert CIDR-Blöcke zur kleinsten gleichwertigen Menge und zieht anschließend alle CIDR-Blöcke ab, die du in die Ausschlussliste einträgst. Es unterstützt IPv4 und IPv6 im selben Durchlauf, und die gesamte Verarbeitung erfolgt lokal in deinem Browser.

## Wie Zusammenführen und Ausschließen funktioniert

Die Zusammenführungsliste wird zuerst normalisiert: Host-Bits werden gelöscht, überlappende Netzwerke werden zusammengelegt, und angrenzende Netzwerke werden zusammengefasst, wenn sie durch einen kürzeren CIDR-Block dargestellt werden können. Danach wird die Ausschlussliste von den zusammengeführten Bereichen abgezogen. Die endgültige Ausgabe wird wieder zur minimalen CIDR-Liste erweitert, die exakt abdeckt, was übrig bleibt.

## Wann das nützlich ist

Nutze es zum Bereinigen von Firewall-Regeln, Vorbereiten von Einträgen für Cloud-Sicherheitsgruppen, Prüfen von VPN-Erlaubnislisten, Zusammenfassen von Routingtabellen oder Entfernen reservierter Bereiche aus einer größeren Zuteilung. Es ist besonders hilfreich, wenn kopierte Konfigurationen überlappende Blöcke enthalten oder wenn aus einem breiten Netzwerk einige kleinere Bereiche entfernt werden müssen.

## Eingabehinweise

Gib eine CIDR pro Zeile ein oder trenne mehrere CIDRs mit Kommas. IPv4- und IPv6-Blöcke können gemeinsam eingefügt werden, aber Ausschlüsse gelten nur für Blöcke derselben Adressfamilie. Ungültige Einträge werden mit ihrer Liste und Zeilennummer gemeldet, damit du große eingefügte Eingaben ohne Rätselraten korrigieren kannst.
