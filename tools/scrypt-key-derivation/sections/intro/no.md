## Hva er scrypt?

scrypt er en minnehard passordbasert nøkkelavledningsfunksjon (KDF). Den gjør et passord og salt om til deterministiske nøkkelbyte samtidig som den bevisst bruker CPU-tid og minne, noe som gjør passordgjetting i stor skala dyrere enn enkel hashing.

**Hovedpunkter:**

- Bruker `N` (kostnadsfaktor), `r` (blokkstørrelse) og `p` (parallellitet)
- Høyere innstillinger for `N` og `r` øker minne- og beregningskostnaden
- Produserer samme avledede nøkkel bare når passord, salt, parametere og utdatalengde samsvarer

**Beste praksis:**

- Bruk et unikt, tilfeldig salt for hvert passord eller hver hemmelighet
- Lagre `N`, `r`, `p`, saltformat og utdatalengde sammen med den avledede nøkkelen
- Juster parameterne på den tregeste enheten du må støtte, før du bruker dem i produksjon
