## Hva er MD5?

MD5 (Message Digest Algorithm 5) er en mye brukt kryptografisk hash-funksjon som produserer en 128-bits (16-byte) hash-verdi, vanligvis gjengitt som et 32-tegn heksadesimalt tall. Den ble designet av Ron Rivest i 1991 som en etterfølger til MD4.

**Nøkkelegenskaper:**

- **Deterministisk**: Samme inndata produserer alltid samme hash
- **Rask beregning**: Rask å beregne for enhver gitt inndata
- **Snøskredeffekt**: Små endringer i inndata produserer drastisk forskjellige utdata
- **Fast utdatastørrelse**: Produserer alltid en 128-bits hash uavhengig av inndata-størrelse
- **Sårbar for kollisjoner**: Kjente sårbarheter gjør det mulig å finne kollisjoner

**Sikkerhetsstatus:**
⚠️ **MD5 er kryptografisk ødelagt og bør ikke brukes for sikkerhetskritiske applikasjoner**. Kollisjonsangrep ble demonstrert i 2004, og praktisk kollisjonsgenerering ble mulig med moderne datakraft.

**Vanlige bruksområder (nåværende og historiske):**

- Filintegritetsverifisering (ikke sikkerhetskritisk)
- Kontrollsummer for påvisning av datakorrupsjon
- Eldre systemer som krever MD5
- Databasenøkkelgenerering (ikke-kryptografisk)
- Noen eldre protokoller og systemer

**Anbefalte alternativer:**

- SHA-256 eller SHA-3 for nye applikasjoner
- SHA-512 for høye sikkerhetskrav
- BLAKE2 for høyytelsesapplikasjoner
