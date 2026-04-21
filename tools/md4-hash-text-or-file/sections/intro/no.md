## Hva er MD4?

MD4 (Message Digest Algorithm 4) er en mye brukt kryptografisk hash-funksjon som produserer en 128-bits (16-byte) hash-verdi, vanligvis gjengitt som et 32-tegn heksadesimalt tall. Den ble designet av Ron Rivest i 1990.

**Nøkkelegenskaper:**

- **Deterministisk**: Samme inndata produserer alltid samme hash
- **Rask beregning**: Rask å beregne for enhver gitt inndata
- **Snøskredeffekt**: Små endringer i inndata produserer drastisk forskjellige utdata
- **Fast utdatastørrelse**: Produserer alltid en 128-bits hash uavhengig av inndata-størrelse
- **Sårbar for kollisjoner**: Kjente sårbarheter gjør det mulig å finne kollisjoner

**Sikkerhetsstatus:**
⚠️ **MD4 er kryptografisk ødelagt og bør ikke brukes for sikkerhetskritiske applikasjoner**. Kollisjonsangrep ble demonstrert i 1995, og praktisk kollisjonsgenerering ble mulig med moderne datakraft.

**Vanlige bruksområder (nåværende og historiske):**

- Filintegritetsverifisering (ikke sikkerhetskritisk)
- Kontrollsummer for påvisning av datakorrupsjon
- Eldre systemer som krever MD4
- Databasenøkkelgenerering (ikke-kryptografisk)
- Noen eldre protokoller og systemer

**Anbefalte alternativer:**

- SHA-256 eller SHA-3 for nye applikasjoner
- SHA-512 for høye sikkerhetskrav
- BLAKE2 for høyytelsesapplikasjoner
