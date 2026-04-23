## Co to narzędzie normalizuje

To narzędzie konwertuje adresy IPv4, adresy IPv6 i zakresy CIDR na notację kanoniczną bezpośrednio w przeglądarce. Usuwa niepotrzebne dopełnienie IPv4, kompresuje IPv6 do standardowej skróconej formy i zachowuje oryginalną rodzinę adresów.

## Jak działa normalizacja CIDR

Po wprowadzeniu bloku CIDR narzędzie przepisuje adres na rzeczywisty adres sieciowy dla tego prefiksu. Bity hosta zostają wyczyszczone, więc `192.168.0.15/24` staje się `192.168.0.0/24`, a `2001:db8::1234/64` staje się `2001:db8::/64`.

## Kiedy jest to przydatne

Użyj go przed porównaniem reguł zapory sieciowej, list ACL, tabel tras, list dozwolonych VPN lub zaimportowanych plików konfiguracyjnych. Znormalizowane dane wejściowe sprawiają, że wykrywanie duplikatów, przeglądanie i kopiowanie-wklejanie do narzędzi sieciowych jest bardziej niezawodne.

## Dlaczego dane wejściowe mogą zostać odrzucone

Narzędzie odrzuca zniekształcone adresy IPv4 lub IPv6, nieprawidłowe prefiksy CIDR oraz kombinacje adresów lub prefiksów, które nie pasują do rodziny protokołów. Jeśli wartości nie można jednoznacznie przeanalizować, bezpieczniej jest ją odrzucić niż normalizować niewłaściwą sieć.
