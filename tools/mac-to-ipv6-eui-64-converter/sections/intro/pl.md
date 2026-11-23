## Jak przekonwertować adres MAC na IPv6

Wpisz 48-bitowy adres MAC z dwukropkami, łącznikami, kropkami lub bez separatorów. Dodaj prefiks sieci IPv6 `/64`, którego chcesz użyć. Konwerter przyjmuje zapis skrócony i pełny, a wszystkie bity hosta w prefiksie muszą być zerami. Adres IPv6 zmienia się w trakcie wpisywania i można go od razu skopiować. Przycisk **Wypróbuj przykład** uzupełnia oba pola przykładowymi wartościami.

## Jak zmodyfikowany EUI-64 tworzy adres

W podsieci `/64` pierwsze 64 bity pochodzą z prefiksu sieci, a ostatnie 64 z identyfikatora interfejsu. Zmodyfikowany EUI-64 wstawia `ff:fe` między dwie połowy adresu MAC i odwraca bit uniwersalny/lokalny (U/L) w pierwszym bajcie. Z adresu `00:11:22:33:44:55` powstaje w ten sposób identyfikator interfejsu `211:22ff:fe33:4455`. Po połączeniu z prefiksem `2001:db8:1:2::/64` otrzymasz adres `2001:db8:1:2:211:22ff:fe33:4455`.

## Typowe prefiksy IPv6

- **Link-local.** Użyj `fe80::/64` do komunikacji w obrębie tego samego łącza. Przycisk **Wstaw prefiks link-local** wpisuje ten prefiks i zachowuje podany adres MAC. Aby dodać nazwę interfejsu, np. `%eth0`, użyj [konwertera adresów IPv6 link-local](/pl/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Unikalny lokalny (ULA).** Przycisk **Wstaw przykład ULA** wpisuje `fd12:3456:789a:1::/64`, przykładowy prefiks z zakresu `fd00::/8` przeznaczonego dla sieci wewnętrznych. Aby utworzyć unikalny prefiks dla swojej sieci, użyj [generatora IPv6 ULA](/pl/tools/ipv6-ula-generator/).
- **Globalny unicast.** Wpisz podsieć `/64` z puli przydzielonej Ci przez dostawcę internetu, dostawcę usług w chmurze lub administratora sieci.
- **Dokumentacyjny.** Prefiks `2001:db8:1:2::/64` należy do zakresu `2001:db8::/32`, zarezerwowanego na potrzeby dokumentacji i przykładów.

## Czy wynik będzie zgodny z adresem IPv6 mojego urządzenia?

Wynik to adres utworzony dla podanego prefiksu przy użyciu zmodyfikowanego EUI-64. Urządzenie może używać innego identyfikatora interfejsu, na przykład stałego lub tymczasowego identyfikatora generowanego w celu ochrony prywatności. Jeśli masz już adres IPv6 z identyfikatorem interfejsu wyprowadzonym z adresu MAC, odzyskasz adres MAC za pomocą [konwertera IPv6 na MAC](/pl/tools/ipv6-address-to-mac-address-converter/).
