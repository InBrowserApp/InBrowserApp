## Generowanie prefiksu /48 dla ULA IPv6

Skopiuj wygenerowany prefiks `fd` do użycia w sieci domowej, laboratorium lub VPN. Zapisz wybrany prefiks `/48` w konfiguracji sieci, aby używać go przy dodawaniu podsieci. Wybierz **Generuj nowy prefiks**, jeśli chcesz przydzielić nowy zakres.

## Obliczanie podsieci /64

Wpisz szesnastkowy **Identyfikator podsieci** z zakresu od `0000` do `ffff`. Na przykład identyfikator `00a0` w obrębie `fd12:3456:789a::/48` daje `fd12:3456:789a:a0::/64`. Prefiks `/48` mieści 65 536 podsieci `/64`, więc możesz przypisać osobne prefiksy do sieci LAN, Wi-Fi dla gości lub VPN.

## Skąd pochodzi prefiks fd

RFC 4193 definiuje unikalne adresy lokalne w zakresie `fc00::/7`. Połowa tego zakresu przeznaczona do lokalnego przydzielania, `fd00::/8`, zaczyna się od `fd`. Generator pobiera losowy 40-bitowy identyfikator globalny z Web Crypto API przeglądarki i dodaje go, tworząc prefiks `/48`.

## Kiedy używać unikalnego adresu lokalnego

Użyj ULA, aby zapewnić stałą adresację IPv6 wewnątrz sieci lub między lokalizacjami połączonymi przez VPN. Urządzenie może korzystać z globalnego adresu IPv6 do komunikacji w publicznym internecie, a z adresu ULA do usług wewnętrznych.
