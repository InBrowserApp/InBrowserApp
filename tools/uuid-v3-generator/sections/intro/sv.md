## Vad är UUID v3?

UUID v3 är ett namnbaserat UUID-format. Det tar ett namnrymds-UUID och ett
namn, hashar dem med MD5 och formaterar resultatet som ett standard-UUID. Det
viktiga beteendet är determinism: samma namnrymd och namn skapar alltid samma
UUID.

Det här verktyget körs helt i din webbläsare. Namnrymden, namnet och det
genererade UUID:t stannar på din enhet om du inte kopierar resultatet någon
annanstans.

## När du ska använda det

- Använd UUID v3 när du behöver en stabil identifierare för ett känt namn, till
  exempel ett DNS-namn, en URL, en objektsökväg eller ett användarnamn.
- Välj den namnrymd som matchar typen av namn du identifierar. DNS och URL är de
  vanligaste förinställningarna.
- Återanvänd samma namnrymd konsekvent. Om du byter namnrymd ändras varje
  genererat UUID, även när namnet är detsamma.
- Välj hellre UUID v5 eller en annan modern identifierare när du har möjlighet
  och behöver ett namnbaserat UUID med en starkare hash. UUID v3 finns för
  kompatibilitet med system som specifikt förväntar sig MD5-baserade UUID:n.

## Om säkerhet

UUID v3 är inte ett slumpmässigt ID och är inte hemligt. Den som känner till
namnrymden och namnet kan återskapa samma UUID. Använd det inte för lösenord,
sessionstoken, API-nycklar eller andra värden som måste vara oförutsägbara.
