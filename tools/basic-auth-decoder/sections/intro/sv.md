## Vad verktyget gör

Avkoda HTTP Basic Authorization-rubriken för att extrahera användarnamn och lösenord från Base64. Användbart för felsökning och API-testning.

## Indata som stöds

Klistra in något som: Basic dXNlcjpwYXNz
Verktyget accepterar även en hel `Authorization: Basic ...`-rad.

## Att tänka på

- Base64 kodar bara inloggningsuppgifter; det skyddar dem inte.
- Avkodaren delar vid det första `:` och behåller resten i lösenordet.
- Allt körs lokalt i din webbläsare.
