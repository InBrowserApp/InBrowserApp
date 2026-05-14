## Hva er Argon2?

Argon2 er en algoritme for passordhashing som er utformet for å gjøre frakoblet passordknekking dyrt. Den kombinerer gjentatt beregning med en konfigurerbar minnekostnad, slik at angripere trenger både tid og minne for hvert passordforsøk.

**Hvorfor Argon2id vanligvis er standardvalget:**

- Den balanserer motstand mot sidekanalangrep og GPU-knekking bedre enn å bruke Argon2i eller Argon2d for de fleste systemer for passordlagring
- Det kodede resultatet lagrer algoritmen, versjonen, minnet, iterasjonene, parallelliteten, saltet og hashen i én portabel streng
- Et unikt tilfeldig salt hindrer at identiske passord gir identiske lagrede hasher
- Minne- og iterasjonsinnstillinger kan økes etter hvert som verifiseringsmiljøet ditt blir raskere

**Slik bruker du dette verktøyet:**

1. Skriv inn passordet du vil hashe.
2. Behold det genererte saltet eller opprett et nytt tilfeldig salt.
3. Velg Argon2-variant og juster minne, iterasjoner, parallellitet og hashlengde for systemet som skal verifisere hashen.
4. Generer den kodede hashen og lagre hele strengen i applikasjonens database.

**Sikkerhetsmerknader:**

- Ikke lagre eller loggfør passordet i klartekst.
- Bruk et nytt tilfeldig salt for hvert passord.
- Bruk den valgfrie hemmeligheten bare hvis verifiseringskomponenten også har den samme hemmeligheten; ellers kan ikke hashen verifiseres senere.
- Foretrekk de høyeste minne- og iterasjonsinnstillingene som holder påloggingsforsinkelsen akseptabel for faktiske brukere.
