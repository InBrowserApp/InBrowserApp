## Was ist eine IPv6 Link-Local-Adresse?

IPv6 Link-Local-Adressen sind spezielle IPv6-Adressen, die automatisch auf jeder IPv6-fähigen Schnittstelle konfiguriert werden. Sie beginnen immer mit dem Präfix fe80::/10 und werden für die Kommunikation zwischen Geräten im selben Netzwerksegment verwendet. Diese Adressen sind nicht über den lokalen Link hinaus routbar und werden häufig für Nachbarschaftserkennung, Router-Erkennung und andere lokale Netzwerkprotokolle verwendet. Link-Local-Adressen können aus der MAC-Adresse eines Geräts im EUI-64-Format generiert werden.

### Wann es hilfreich ist

Verwenden Sie ihn, wenn Sie die deterministische Link-Local-Adresse benötigen, die EUI-64 aus der MAC-Adresse eines Geräts ableitet.

### So funktioniert das EUI-64-Mapping

1. Normalisieren Sie die MAC-Adresse auf 48 Bit.
2. Drehen Sie das `U/L bit` im ersten Byte um.
3. Fügen Sie in der Mitte `ff:fe` ein, um eine 64-Bit-Schnittstellenkennung zu erzeugen.
4. Stellen Sie `fe80::/10` voran.

### Unterstützte Eingabeformate

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Optionales Schnittstellen-Suffix

Fügen Sie `%eth0`, `%en0` oder einen anderen Zonenindex nur hinzu, wenn ein lokaler Befehl wissen muss, welche Schnittstelle verwendet werden soll.
