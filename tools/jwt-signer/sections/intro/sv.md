## Vad är en JWT-signer?

En JWT-signer skapar en kompakt JSON Web Token genom att serialisera en header och payload och sedan signera dem med en hemlighet eller privat nyckel. Resultatet är den tredelade `header.payload.signature`-token som används av många API-, OAuth- och sessionssystem.

## När ska du använda det här verktyget?

- Skapa lokala testtoken för API-utveckling, stagingmiljöer och demos.
- Jämför hur olika algoritmer ändrar tokenheadern och signaturen.
- Lägg till claims som `sub`, `iss`, `aud`, `exp`, `iat`, `scope` eller anpassade applikationsfält utan att skriva ett tillfälligt skript.
- Generera token med delade HMAC-hemligheter eller med privata RSA-/ECDSA-nycklar i PKCS#8 PEM- eller JWK-format.

## Vad du bör kontrollera innan du använder en signerad token

- Matcha algoritmen med nyckeltypen: `HS*` använder en delad hemlighet, `RS*` och `PS*` använder privata RSA-nycklar och `ES*` använder privata EC-nycklar.
- Lägg till claims för utgångstid och mottagare när den mottagande tjänsten förväntar sig dem.
- Håll privata produktionsnycklar borta från delade webbläsare och datorer. Det här verktyget körs lokalt, men det kan inte skydda nycklar från en enhet som redan är komprometterad.
- Kom ihåg att signering inte är kryptering. Alla som tar emot token kan avkoda headern och payloaden.
