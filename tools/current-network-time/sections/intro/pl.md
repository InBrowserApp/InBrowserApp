## Do czego sluzy to narzedzie

Uzyj tego narzedzia, aby porownac zegar urzadzenia z czasem pobranym z sieci.
Pobiera znacznik czasu z endpointu trace Cloudflare, szacuje srodek opoznienia
zadania i pokazuje wynikowy zegar sieciowy w przegladarce.

## Kiedy pomaga

- Sprawdzic, czy lokalny zegar systemowy spieszy sie lub opoznia.
- Potwierdzic dryf czasu przed analizowaniem TLS, tokenow, harmonogramow lub
  logow.
- Szybko uzyskac sieciowy czas odniesienia bez instalowania narzedzi NTP.

## Na co uwazac

- Pokazane przesuniecie jest wartoscia szacunkowa i zalezy od opoznienia sieci.
- Jesli zadanie trace sie nie powiedzie, narzedzie wroci do lokalnego zegara
  do czasu nastepnej udanej synchronizacji.
- Aby wykonac precyzyjna korekte w calym systemie, dostosuj ustawienia
  synchronizacji czasu urzadzenia lub konfiguracje NTP.
