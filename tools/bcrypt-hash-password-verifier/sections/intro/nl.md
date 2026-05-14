## Wat het doet

Verifieer of een wachtwoord in platte tekst overeenkomt met een bcrypt-wachtwoordhash. Dit is handig wanneer je inlogcode debugt, geïmporteerde gebruikersrecords controleert of bevestigt dat een wachtwoordmigratie hashes compatibel heeft gehouden.

## Geaccepteerde invoer

Plak een standaard bcrypt-hash zoals `$2b$10$...` en voer het te testen wachtwoord in. De verifier accepteert de voorvoegsels `$2a$`, `$2b$` en `$2y$` met kostenfactoren van `04` tot en met `31`.

## Het resultaat lezen

Een overeenkomend resultaat betekent dat bcrypt het wachtwoord voor die hash heeft geaccepteerd, inclusief de salt en kostenfactor die in de hashstring zijn ingesloten. Een mismatch betekent dat het wachtwoord niet is geverifieerd; het bewijst niet dat de hash zelf onveilig is. Fouten met ongeldige hashes betekenen meestal dat het voorvoegsel, de kostenfactor, de lengte of de bcrypt-base64-tekens onjuist zijn gevormd.

## Privacy- en beveiligingsnotities

- Verificatie wordt lokaal in je browser uitgevoerd.
- Wachtwoorden en hashes worden niet opgeslagen in lokale opslag.
- bcrypt is ontworpen voor wachtwoordopslag, niet voor algemene bestandscontrolesommen.
- Gebruik deze tool voor debugging en validatie, niet als enige audit van een productie-authenticatiesysteem.
