## Czym jest Basic Auth?

Basic Auth umieszcza `username:password` w nagłówku `Authorization` po zakodowaniu go w Base64. To prosty i szeroko wspierany mechanizm, ale Base64 jest tylko kodowaniem, a nie szyfrowaniem.

## Co generuje to narzędzie

- Nagłówek `Authorization: Basic ...`, który można wkleić do klienta API.
- Gotowy przykład `curl` do szybkich testów.
- Wszystko działa lokalnie w przeglądarce.

## O czym warto pamiętać

- Zawsze używaj HTTPS podczas wysyłania poświadczeń Basic Auth.
- Każdy, kto zobaczy nagłówek, może odkodować oryginalną nazwę użytkownika i hasło.
- Basic Auth dobrze sprawdza się w narzędziach wewnętrznych, środowiskach stagingowych i szybkich testach API.
