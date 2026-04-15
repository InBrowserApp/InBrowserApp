## Co to jest adres IPv6 Link-Local?

Adresy IPv6 Link-Local to specjalne adresy IPv6, które są automatycznie konfigurowane na każdym interfejsie z obsługą IPv6. Zawsze zaczynają się od prefiksu fe80::/10 i są używane do komunikacji między urządzeniami w tym samym segmencie sieci. Te adresy nie są rutowalny poza lokalnym łączem i są powszechnie używane do odkrywania sąsiadów, odkrywania routerów i innych protokołów sieci lokalnej. Adresy link-local mogą być generowane z adresu MAC urządzenia przy użyciu formatu EUI-64.

### Formaty wejściowe

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Wynik EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Sufiks interfejsu

- `%eth0`
- `%en0`
- `%wlan0`
