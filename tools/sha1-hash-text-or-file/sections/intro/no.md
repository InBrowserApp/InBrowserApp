## Hva er SHA-1?

SHA-1 (Secure Hash Algorithm 1) er en kryptografisk hash-funksjon som produserer en 160-bits (20-byte) hash-verdi, vanligvis gjengitt som et 40-tegn heksadesimalt tall. Den ble designet av NSA og publisert av NIST i 1995 som en del av Digital Signature Standard.

**Nøkkelegenskaper:**

- **Deterministisk**: Samme inndata produserer alltid samme hash
- **Rask beregning**: Rask å beregne for enhver gitt inndata
- **Snøskredeffekt**: Små endringer i inndata produserer drastisk forskjellige utdata
- **Irreversibel**: Beregningsmessig umulig å reversere hashen for å finne opprinnelig inndata
- **Sårbar for kollisjoner**: Kjente sårbarheter gjør det mulig å finne kollisjoner

**Sikkerhetsstatus:**
⚠️ **SHA-1 er kryptografisk ødelagt og bør ikke brukes for sikkerhetskritiske applikasjoner**. Teoretiske angrep ble demonstrert i 2005, og praktiske kollisjonsangrep ble oppnådd i 2017.

**Vanlige bruksområder (historiske):**

- Digitale signaturer og sertifikater (utdatert)
- Git versjonskontrollsystem (for kompatibilitet)
- Eldre systemer som krever SHA-1
- Filintegritetsverifisering (ikke sikkerhetskritisk)
- Proof-of-work algoritmer (noen eldre kryptovalutaer)

**Anbefalte alternativer:**

- SHA-256 eller SHA-3 for nye applikasjoner
- SHA-512 for høye sikkerhetskrav
