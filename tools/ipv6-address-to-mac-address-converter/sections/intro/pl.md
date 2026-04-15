## Jak przekonwertować IPv6 na adres MAC

Adres MAC można odzyskać z adresu IPv6 tylko wtedy, gdy identyfikator
interfejsu IPv6 został wyprowadzony z tego adresu MAC metodą EUI-64. Najczęściej
dotyczy to starszych adresów link-local zaczynających się od `fe80::` oraz
niektórych adresów konfigurowanych bezstanowo.

### Kiedy to działa

Ta odwrotna konwersja działa, gdy ostatnie 64 bity adresu IPv6 nadal zawierają
identyfikator interfejsu EUI-64.

- Identyfikator interfejsu został zbudowany z 48-bitowego adresu MAC.
- Środkowe bajty nadal mają wartość `ff:fe`.
- Adres nie został wygenerowany przez rozszerzenia prywatności ani inny
  mechanizm losowania.

### Jak działa konwersja

Konwerter odtwarza adres MAC w następujących krokach:

1. Odczytuje ostatnie 64 bity adresu IPv6.
2. Usuwa bajty `ff:fe` wstawione w środek identyfikatora interfejsu.
3. Odwraca bit universal/local w pierwszym bajcie.
4. Formatuje pozostałe 48 bitów jako standardowy adres MAC.

### Dlaczego nie pojawia się wynik

Możesz nie otrzymać wyniku z kilku powodów:

- Adres IPv6 ma nieprawidłową składnię.
- Adres jest poprawny, ale nie został wygenerowany z adresu MAC metodą EUI-64.
- Adres używa prywatności, stable-random, DHCPv6 lub innej metody przydziału
  niezwiązanej z MAC.
