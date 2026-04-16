## Co to jest adres IPv6 Link-Local?

Adresy IPv6 Link-Local to specjalne adresy IPv6, które są automatycznie konfigurowane na każdym interfejsie z obsługą IPv6. Zawsze zaczynają się od prefiksu fe80::/10 i są używane do komunikacji między urządzeniami w tym samym segmencie sieci. Te adresy nie są rutowalny poza lokalnym łączem i są powszechnie używane do odkrywania sąsiadów, odkrywania routerów i innych protokołów sieci lokalnej. Adresy link-local mogą być generowane z adresu MAC urządzenia przy użyciu formatu EUI-64.

### Kiedy to się przydaje

Użyj tego narzędzia, gdy potrzebujesz deterministycznego adresu link-local wyprowadzanego przez EUI-64 z adresu MAC urządzenia.

### Jak działa mapowanie EUI-64

1. Znormalizuj adres MAC do 48 bitów.
2. Odwróć `U/L bit` w pierwszym bajcie.
3. Wstaw `ff:fe` pośrodku, aby utworzyć 64-bitowy identyfikator interfejsu.
4. Dodaj prefiks `fe80::/10`.

### Obsługiwane formaty wejściowe

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Opcjonalny sufiks interfejsu

Dodaj `%eth0`, `%en0` lub inny identyfikator strefy tylko wtedy, gdy lokalne polecenie musi wiedzieć, którego interfejsu użyć.
