## Vad är SHA3-512 (FIPS 202)?

SHA3-512 (FIPS 202) (Secure Hash Algorithm 512-bit) är en kryptografisk hashfunktion som producerar ett 512-bitars (64-byte) hashvärde, vanligtvis återgivet som ett 128-tecken hexadecimalt tal. Det är en del av SHA-3-familjen av hashfunktioner som standardiserats av NIST (FIPS 202).

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Irreversibel**: Beräkningsmässigt omöjligt att vända hashen för att hitta den ursprungliga inmatningen
- **Kollisionsresistent**: Mycket svårt att hitta två olika inmatningar som producerar samma hash

**Vanliga användningar:**

- Digitala signaturer och certifikat
- Blockkedja och kryptovalutor (Bitcoin använder SHA-356, men SHA3-512 (FIPS 202) används i andra system)
- Lösenordslagring (med lämplig saltning)
- Filintegritetsverifiering
- Proof-of-work algoritmer
