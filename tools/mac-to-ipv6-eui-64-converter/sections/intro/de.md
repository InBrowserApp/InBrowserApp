## Eine MAC-Adresse in eine IPv6-Adresse umwandeln

Geben Sie eine 48-Bit-MAC-Adresse ein. Sie können Doppelpunkte, Bindestriche oder Punkte als Trennzeichen verwenden oder die Trennzeichen weglassen. Geben Sie dann das gewünschte IPv6-Netzpräfix der Länge `/64` ein. Komprimierte und ausgeschriebene Schreibweisen sind möglich. Alle Hostbits im Präfix müssen null sein. Die IPv6-Adresse wird während der Eingabe aktualisiert und lässt sich direkt kopieren. **Beispiel ausprobieren** füllt beide Felder mit Beispielwerten.

## So bildet Modified EUI-64 die Adresse

In einem `/64`-Subnetz bildet das Netzpräfix die ersten 64 Bits und die Schnittstellen-ID die letzten 64 Bits. Modified EUI-64 fügt `ff:fe` zwischen den beiden Hälften der MAC-Adresse ein und kehrt das Universal-/Local-Bit im ersten Byte um. Aus `00:11:22:33:44:55` wird so die Schnittstellen-ID `211:22ff:fe33:4455`. Mit `2001:db8:1:2::/64` ergibt sich die IPv6-Adresse `2001:db8:1:2:211:22ff:fe33:4455`.

## Gängige IPv6-Präfixe

- **Link-Local.** Verwenden Sie `fe80::/64` für die Kommunikation auf demselben Netzwerksegment. **Link-Local-Präfix verwenden** trägt dieses Präfix ein und behält Ihre MAC-Adresse bei. Einen Schnittstellennamen wie `%eth0` können Sie mit dem [IPv6-Link-Local-Konverter](/de/tools/mac-address-to-ipv6-link-local-address-converter/) anhängen.
- **Unique Local (ULA).** **ULA-Beispiel verwenden** trägt `fd12:3456:789a:1::/64` ein, ein Beispiel aus `fd00::/8` für interne Netzwerke. Mit dem [IPv6-ULA-Generator](/de/tools/ipv6-ula-generator/) können Sie ein eindeutiges Präfix für Ihr eigenes Netzwerk erzeugen.
- **Global Unicast.** Geben Sie ein `/64`-Subnetz aus dem Adressbereich ein, den Ihnen Ihr Internetanbieter, Cloud-Anbieter oder Netzwerkadministrator zugewiesen hat.
- **Dokumentation.** `2001:db8:1:2::/64` liegt im Bereich `2001:db8::/32`, der für Dokumentation und Beispiele reserviert ist.

## Entspricht das Ergebnis der IPv6-Adresse meines Geräts?

Das Ergebnis ist die IPv6-Adresse, die sich für Ihr Präfix mit Modified EUI-64 ergibt. Ein Gerät kann eine andere Schnittstellen-ID verwenden, etwa eine stabile oder temporäre ID zum Schutz der Privatsphäre. Wenn Sie bereits eine IPv6-Adresse mit einer aus der MAC-Adresse abgeleiteten Schnittstellen-ID haben, können Sie die MAC-Adresse mit dem [IPv6-zu-MAC-Konverter](/de/tools/ipv6-address-to-mac-address-converter/) ermitteln.
