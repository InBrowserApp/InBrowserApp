## Cosa fa

Decodifica l'intestazione HTTP Basic Authorization per estrarre nome utente e password da Base64. Utile per il debugging e i test API.

## Input accettato

Incolla qualcosa come: Basic dXNlcjpwYXNz
Questo strumento accetta anche una riga completa `Authorization: Basic ...`.

## Note

- Base64 si limita a codificare le credenziali; non le protegge.
- Il decodificatore divide il testo al primo `:` e conserva il resto nella password.
- Tutto viene eseguito localmente nel browser.
