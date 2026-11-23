## Så bildas adressen

Modifierad EUI-64 placerar `ff:fe` mellan MAC-adressens två halvor och inverterar biten för universell eller lokal adressering i den första byten. MAC-adressen `00:11:22:33:44:55` blir till exempel gränssnitts-ID:t `211:22ff:fe33:4455`. Med prefixet `2001:db8:1:2::/64` blir IPv6-adressen `2001:db8:1:2:211:22ff:fe33:4455`.

Ange `fe80::/64` för att få en link-local-adress. Använd [link-local-konverteraren](/sv/tools/mac-address-to-ipv6-link-local-address-converter/) för att lägga till ett gränssnittsnamn. För en unicast-adress som ska användas i ditt nätverk väljer du ett /64-prefix som har tilldelats nätverket. Exemplet använder ett dokumentationsprefix.
