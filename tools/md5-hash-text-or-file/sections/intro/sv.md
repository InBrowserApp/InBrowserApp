## Vad är MD5?

MD5 (Message Digest Algorithm 5) är en allmänt använd kryptografisk hash-funktion som producerar ett 128-bitars (16-byte) hash-värde, vanligtvis återgivet som ett 32-tecken heksadecimalt tal. Det designades av Ron Rivest 1991 som efterföljare till MD4.

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Fast utmatningsstorlek**: Producerar alltid en 128-bitars hash oavsett inmatningsstorlek
- **Kollisionssårbar**: Kända sårbarheter gör det möjligt att hitta kollisioner

**Säkerhetsstatus:**
⚠️ **MD5 är kryptografiskt brutet och bör inte användas för säkerhetskritiska applikationer**. Kollisionsattacker demonstrerades 2004, och praktisk kollisionsgenerering blev genomförbar med modern beräkningskraft.

**Vanliga användningar (nuvarande och historiska):**

- Filintegritetsverifiering (inte säkerhetskritiskt)
- Kontrollsummor för upptäckt av datakorruption
- Äldre system som kräver MD5
- Databasnyckelgenerering (icke-kryptografisk)
- Vissa äldre protokoll och system

**Rekommenderade alternativ:**

- SHA-256 eller SHA-3 för nya applikationer
- SHA-512 för höga säkerhetskrav
- BLAKE2 för högpresterande applikationer
