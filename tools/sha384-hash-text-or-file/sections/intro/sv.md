## Vad är SHA-384?

SHA-384 (Secure Hash Algorithm 384-bit) är en kryptografisk hashfunktion som producerar ett 384-bitars (48-byte) hashvärde, vanligtvis återgivet som ett 96-tecken hexadecimalt tal. Det är en del av SHA-2-familjen av hashfunktioner designade av NSA och publicerade av NIST.

**Nyckelegenskaper:**
- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Irreversibel**: Beräkningsmässigt omöjligt att vända hashen för att hitta den ursprungliga inmatningen
- **Kollisionsresistent**: Mycket svårt att hitta två olika inmatningar som producerar samma hash

**Vanliga användningar:**
- Digitala signaturer och certifikat
- Blockkedja och kryptovalutor (vissa system använder SHA-384)
- Lösenordslagring (med lämplig saltning)
- Filintegritetsverifiering
- Proof-of-work algoritmer

