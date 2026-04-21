## Was dieses Tool anzeigt

Dieses Tool sucht nach den öffentlichen IPv4- und IPv6-Adressen, die externe Dienste in Ihrer aktuellen Browsersitzung sehen können. Wenn der Browser auch lokale Schnittstellenkandidaten über WebRTC verfügbar machen kann, listet das Tool diese separat auf.

## Warum IPv4-, IPv6- und WebRTC-Ergebnisse unterschiedlich sein können

Ihre IPv4-Adresse und IPv6-Adresse können von verschiedenen Netzwerkpfaden, ISPs oder Tunnelkonfigurationen stammen. Zu den WebRTC-Kandidaten können private LAN-Adressen, temporäre IPv6-Schnittstellenadressen oder VPN-bezogene Routen gehören, die auf normalen Websites nicht immer direkt angezeigt werden.

## So funktioniert die Suche

Das Tool fragt öffentliche IP-Anbieter wie Cloudflare, geojs.io, ip.sb und ipify.org ab und reichert die erkannte Adresse dann mit Hostnamen, ASN, Organisation, Land, Zeitzone und Koordinatenmetadaten an, sofern verfügbar. Das bedeutet, dass das Tool eine aktive Internetverbindung benötigt und von der Antwortqualität dieser Drittanbieterdienste abhängig ist.

## Warum eine Adresse möglicherweise fehlt

Eine Adresse wird möglicherweise nicht angezeigt, wenn Ihr Netzwerk eine Protokollfamilie blockiert, Ihr VPN oder Proxy die Anfrage filtert, Ihr Browser die WebRTC-Offenlegung deaktiviert oder der Upstream-Suchdienst vorübergehend nicht verfügbar ist. Wenn IPv6 in Ihrem Netzwerk nicht verfügbar ist, ist es normal, dass nur IPv4 angezeigt wird.
