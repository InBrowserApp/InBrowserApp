DNS-Abfrage prüft die öffentlichen DNS-Einträge, die für einen Domainnamen zurückgegeben werden. Das ist nützlich, wenn du den Start einer neuen Website verifizierst, die E-Mail-Zustellung debuggst, CDN- oder Load-Balancer-Änderungen prüfst oder bestätigen möchtest, ob DNSSEC-bezogene Antworten bei verschiedenen Resolvern unterschiedlich aussehen.

## Wann verwenden

Verwende dieses Tool, wenn du schnell im Browser eine Antwort für gängige DNS-Eintragstypen brauchst. A- und AAAA-Einträge zeigen IPv4- und IPv6-Ziele, CNAME-Einträge zeigen Aliase, MX-Einträge identifizieren Mail Exchanger, TXT-Einträge enthalten häufig SPF- oder Verifizierungs-Tokens, und NS/SOA/CAA/SRV/HTTPS/SVCB-Einträge zeigen Delegierung, Autorität, Zertifikat-, Dienst- und moderne Endpunkt-Hinweise.

## Funktionsweise

Die Abfrage läuft in deinem Browser mit DNS over HTTPS. Wähle einen Resolver, wähle einen oder mehrere Eintragstypen aus und sende eine Domain oder URL ab. URLs werden vor dem Senden der Abfrage auf ihren Hostnamen normalisiert. Wenn du also `https://www.example.com/path` einfügst, wird `www.example.com` abgefragt.

## Ergebnisse lesen

Jeder Eintragstyp wird separat mit DNS-Antwortcode, Resolver-Flags, Antwortzeilen und Roh-JSON angezeigt. `NoError` bedeutet, dass der DNS-Server erfolgreich geantwortet hat, kann für einen bestimmten Typ aber trotzdem keine Antwortzeilen zurückgeben. `NXDomain`, `ServFail` oder `Refused` bedeutet normalerweise, dass der Name nicht existiert, der Resolver die Abfrage nicht abschließen konnte oder die Resolver-Richtlinie die Anfrage blockiert hat.

## Datenschutz und Einschränkungen

Abfragen werden an den ausgewählten DNS over HTTPS Resolver gesendet, nicht an einen InBrowser.App Server. Resolver-Verhalten, Cache-Zustand, DNSSEC-Validierung und lokale Netzwerkfilter können die Ergebnisse beeinflussen. Dieses Tool ersetzt keine autoritativen `dig`-Prüfungen aus mehreren Netzwerken, ist aber ein schneller Weg, um zu prüfen, was öffentliche DoH-Resolver aus deinem aktuellen Browser zurückgeben.
