## Vad är Basic Auth?

Basic Auth lägger `username:password` i `Authorization`-huvudet efter Base64-kodning. Det är enkelt och stöds brett, men Base64 är bara kodning och inte kryptering.

## Vad verktyget genererar

- Ett `Authorization: Basic ...`-huvud som du kan klistra in i API-klienter.
- Ett körklart `curl`-exempel för snabba tester.
- Allt körs lokalt i webbläsaren.

## Vad du bör tänka på

- Använd alltid HTTPS när du skickar Basic Auth-uppgifter.
- Alla som ser huvudet kan avkoda det ursprungliga användarnamnet och lösenordet.
- Basic Auth passar bra för interna verktyg, stagingmiljöer och snabba API-kontroller.
