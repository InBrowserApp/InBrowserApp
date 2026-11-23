## So entsteht die IPv6-Adresse

Modified EUI-64 fügt `ff:fe` zwischen den beiden Hälften der MAC-Adresse ein und kehrt das Universal-/Local-Bit im ersten Byte um. Aus `00:11:22:33:44:55` wird so die Schnittstellen-ID `211:22ff:fe33:4455`. Mit dem Präfix `2001:db8:1:2::/64` ergibt sich die IPv6-Adresse `2001:db8:1:2:211:22ff:fe33:4455`.

Geben Sie `fe80::/64` für eine Link-Local-Adresse ein. Einen Schnittstellennamen können Sie mit dem [Link-Local-Konverter](/de/tools/mac-address-to-ipv6-link-local-address-converter/) anhängen. Für eine einsetzbare Unicast-Adresse verwenden Sie ein /64-Präfix, das Ihrem Netzwerk zugewiesen ist. Das Beispiel nutzt ein Dokumentationspräfix.
