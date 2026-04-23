## Was dieses Tool normalisiert

Dieses Tool konvertiert IPv4-Adressen, IPv6-Adressen und CIDR-Bereiche direkt im Browser in die kanonische Notation. Es entfernt unnötige IPv4-Auffüllungen, komprimiert IPv6 auf die standardmäßige Kurzform und behält die ursprüngliche Adressfamilie bei.

## So funktioniert die CIDR-Normalisierung

Wenn Sie einen CIDR-Block eingeben, schreibt das Tool die Adresse in die tatsächliche Netzwerkadresse für dieses Präfix um. Hostbits werden gelöscht, sodass `192.168.0.15/24` zu `192.168.0.0/24` und `2001:db8::1234/64` zu `2001:db8::/64` wird.

## Wenn dies nützlich ist

Verwenden Sie es, bevor Sie Firewall-Regeln, ACLs, Routentabellen, VPN-Zulassungslisten oder importierte Konfigurationsdateien vergleichen. Die normalisierte Eingabe macht die Erkennung von Duplikaten, Überprüfungen und das Kopieren und Einfügen in Netzwerktools zuverlässiger.

## Warum Eingaben möglicherweise abgelehnt werden

Das Tool lehnt fehlerhafte IPv4- oder IPv6-Adressen, ungültige CIDR-Präfixe und Adress- oder Präfixkombinationen ab, die nicht zur Protokollfamilie passen. Wenn der Wert nicht eindeutig analysiert werden kann, ist es sicherer, ihn abzulehnen, als das falsche Netzwerk zu normalisieren.
