## Jak powstaje adres

Zmodyfikowany EUI-64 wstawia `ff:fe` między dwie połowy adresu MAC i odwraca bit uniwersalny/lokalny (U/L) w pierwszym bajcie. Z adresu `00:11:22:33:44:55` powstaje w ten sposób identyfikator interfejsu `211:22ff:fe33:4455`. Po połączeniu z prefiksem `2001:db8:1:2::/64` otrzymasz adres `2001:db8:1:2:211:22ff:fe33:4455`.

Aby uzyskać adres link-local, wpisz `fe80::/64`. Jeśli chcesz dodać nazwę interfejsu, użyj [konwertera adresów link-local](/pl/tools/mac-address-to-ipv6-link-local-address-converter/). Aby uzyskać adres unicast do użycia w swojej sieci, wpisz przydzielony jej prefiks /64. Przykład używa prefiksu dokumentacyjnego.
