## Was dieses Tool nachschlägt

IP Info Lookup löst eine IPv4-Adresse, IPv6-Adresse, Domain oder URL auf und zeigt die öffentlichen Metadaten an, die Internetdienste für jede Adresse melden können. Das ist hilfreich, wenn du prüfen musst, wohin eine Domain zeigt, welchem Netzwerk eine Adresse gehört, welcher Reverse-DNS-Hostname existiert oder ob IPv4- und IPv6-Einträge zu unterschiedlichen Anbietern führen.

## So funktionieren Domain- und URL-Abfragen

Wenn du eine Domain oder URL eingibst, extrahiert das Tool den Hostnamen und fragt den ausgewählten DNS-over-HTTPS-Resolver sowohl nach A- als auch nach AAAA-Einträgen ab. Jede zurückgegebene Adresse wird anschließend separat angereichert, sodass Dual-Stack-Domains für IPv4 und IPv6 unterschiedliche Länder, ASNs, ISPs, Hostnamen oder Zeitzonen anzeigen können.

## Was die Ergebnisse bedeuten

Standort- und ISP-Felder stammen von öffentlichen IP-Metadatenanbietern wie geojs.io und ip.sb, während Hostnamen aus Reverse-DNS-PTR-Abfragen stammen, sofern verfügbar. Diese Einträge beschreiben, wie öffentliche Datenbanken die Adresse sehen, nicht den exakten physischen Standort einer Person oder eines Geräts.

## Hinweise zu Datenschutz und Genauigkeit

Die Abfrage läuft in deinem Browser und sendet DNS- und IP-Metadatenanfragen an Drittanbieterdienste. VPNs, Proxys, CDNs, Mobilfunknetze und Cloud-Plattformen können dazu führen, dass der gemeldete Standort oder die Organisation von dem erwarteten Endnutzer oder Server abweicht. Leere Felder sind bei privaten, reservierten, neu zugewiesenen oder wenig dokumentierten Adressen normal.
