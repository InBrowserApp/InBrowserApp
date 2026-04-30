## Hva er Local Font Access?

Local Font Access er et nettleser-API som lister fonter installert på enheten.

Dette verktøyet lar deg søke i resultatene, sammenligne beslektede varianter og kopiere et CSS-utdrag for fonten du velger.

Det fungerer bare i sikre kontekster og støttede nettlesere, og krever bruker­tillatelse (local-fonts).

API-et returnerer FontData med family, fullName, postscriptName og style.

### Viktige punkter

- Bruk det for å bekrefte de nøyaktige navnene du trenger i en CSS-`font-family`-stakk på den gjeldende enheten.
- Kall må trigges av en brukerhandling.
- Permissions Policy kan blokkere tilgang på enkelte nettsteder.
- Dette verktøyet kjører lokalt og laster ikke opp fonter.
