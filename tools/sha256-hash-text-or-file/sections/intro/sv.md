## Vad är SHA-256?

SHA-256 (Secure Hash Algorithm 256-bit) är en kryptografisk hashfunktion som producerar ett 256-bitars (32-byte) hashvärde, vanligtvis återgivet som ett 64-tecken hexadecimalt tal. Det är en del av SHA-2-familjen av hashfunktioner designade av NSA och publicerade av NIST.

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Irreversibel**: Beräkningsmässigt omöjligt att vända hashen för att hitta den ursprungliga inmatningen
- **Kollisionsresistent**: Mycket svårt att hitta två olika inmatningar som producerar samma hash

**Vanliga användningar:**

- Digitala signaturer och certifikat
- Blockkedja och kryptovalutor (Bitcoin använder SHA-256)
- Lösenordslagring (med lämplig saltning)
- Filintegritetsverifiering
- Proof-of-work algoritmer
