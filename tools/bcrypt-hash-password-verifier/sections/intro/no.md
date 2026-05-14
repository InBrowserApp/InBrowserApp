## Hva verktøyet gjør

Verifiser om et passord i klartekst samsvarer med en bcrypt-passordhash. Dette er nyttig når du feilsøker innloggingskode, kontrollerer importerte brukerposter eller bekrefter at en passordmigrering beholdt kompatible hasher.

## Godtatte inndata

Lim inn en standard bcrypt-hash, for eksempel `$2b$10$...`, og skriv inn passordkandidaten du vil teste. Verifisereren godtar prefiksene `$2a$`, `$2b$` og `$2y$` med kostnadsverdier fra `04` til `31`.

## Slik leser du resultatet

Et samsvarende resultat betyr at bcrypt godtok passordet for den hashverdien, inkludert saltet og kostnaden som er innebygd i hashstrengen. Et avvik betyr at passordet ikke kunne verifiseres; det beviser ikke at selve hashen er usikker. Feil om ugyldig hash betyr vanligvis at prefiks, kostnad, lengde eller bcrypt base64-tegn har feil format.

## Personvern- og sikkerhetsmerknader

- Verifiseringen kjører lokalt i nettleseren.
- Passord og hasher lagres ikke i lokal lagring.
- bcrypt er laget for passordlagring, ikke generelle filsjekksummer.
- Bruk dette verktøyet til feilsøking og validering, ikke som eneste kontroll av et produksjonssystem for autentisering.
