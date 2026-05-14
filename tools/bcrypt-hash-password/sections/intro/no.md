## Hva er bcrypt?

bcrypt er en passordhashing-algoritme laget for lagring av passord. Den kombinerer passordet med et tilfeldig salt og gjentar kostbart arbeid basert på en kostnadsfaktor, slik at angripere trenger mer tid til å teste hver gjetning.

## Når du bør bruke dette verktøyet

- Generer en bcrypt-hash for en testkonto, et seed-skript eller et lokalt utviklingsmiljø.
- Sammenlign hvordan ulike kostnadsfaktorer endrer utdataformatet og kjøretiden.
- Lag en kopieringsklar hash uten å sende passordet til en server.

## Slik velger du kostnadsfaktoren

Høyere kostnadsverdier er tregere og vanligvis tryggere, men de gjør også hvert innloggingsforsøk tregere for applikasjonen din. En kostnad rundt 10-12 er vanlig for interaktive systemer; høyere verdier kan være rimelige for arbeidsflyter kun for administratorer eller med lav trafikk. Test kostnaden på samme type maskinvare som skal verifisere passordet.

## Dette bør du huske på

- Hver genererte hash bruker et nytt tilfeldig salt, så utdataene endres selv når passordet og kostnaden er de samme.
- Lagre bcrypt-hashen, ikke det opprinnelige passordet.
- Bruk bcrypt for passord, ikke for fil-checksums, signaturer eller generell hashing.
- Hold verifiseringsoppførselen konstant og unngå å avsløre om en brukerkonto finnes.
