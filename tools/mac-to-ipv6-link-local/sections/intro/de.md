## Was ist eine IPv6 Link-Local-Adresse?

IPv6 Link-Local-Adressen sind spezielle IPv6-Adressen, die automatisch auf jeder IPv6-fähigen Schnittstelle konfiguriert werden. Sie beginnen immer mit dem Präfix fe80::/10 und werden für die Kommunikation zwischen Geräten im selben Netzwerksegment verwendet. Diese Adressen sind nicht über den lokalen Link hinaus routbar und werden häufig für Nachbarschaftserkennung, Router-Erkennung und andere lokale Netzwerkprotokolle verwendet. Link-Local-Adressen können aus der MAC-Adresse eines Geräts im EUI-64-Format generiert werden.

### Eingabeformate

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### EUI-64-Ausgabe

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Schnittstellen-Suffix

- `%eth0`
- `%en0`
- `%wlan0`
