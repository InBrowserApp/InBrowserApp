## Hva er RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) er en kryptografisk hash-funksjon som produserer en hashverdi på 320 biter (40 byte), vanligvis vist som et heksadesimalt tall på 80 tegn. Den er en del av RIPEMD-familien som ble utviklet i Europa som et alternativ til MD4/MD5.

Bruk dette verktøyet når du må beregne en RIPEMD-320-hash for innlimt tekst, kopierte konfigurasjonsdata eller en lokal fil. Beregningen kjøres i nettleseren din, så filinnholdet trenger ikke å lastes opp til en server.

**Nøkkelegenskaper:**

- **Deterministisk**: Samme inndata produserer alltid samme hash
- **Rask beregning**: Rask å beregne for alle typer inndata
- **Skredeffekt**: Små endringer i inndata gir svært forskjellige utdata
- **Fast størrelse på utdata**: Produserer alltid en 320-biters hash uansett størrelse på inndataene
- **Enveis**: Det er beregningsmessig ugjennomførbart å gjenopprette de opprinnelige inndataene fra hashen

**Vanlige bruksområder:**

- Kontroll av dataintegritet
- Fingeravtrykk og deduplisering
- Kompatibilitet med eldre systemer

**Sikkerhetsmerknad:**

RIPEMD-320 er hovedsakelig nyttig når en protokoll, et arkiv, en sjekksumliste eller et eldre system allerede angir det. For nye sikkerhetssensitive løsninger bør du bruke en hashfunksjon som er standardisert i dag, for eksempel SHA-256, SHA-512, SHA-3 eller BLAKE3, med mindre RIPEMD-kompatibilitet er påkrevd.
