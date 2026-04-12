## Vad är SHA-1?

SHA-1 (Secure Hash Algorithm 1) är en kryptografisk hash-funktion som producerar ett 160-bitars (20-byte) hash-värde, vanligtvis återgivet som ett 40-tecken heksadecimalt tal. Det designades av NSA och publicerades av NIST 1995 som en del av Digital Signature Standard.

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Irreversibel**: Beräkningsmässigt omöjligt att vända hashen för att hitta den ursprungliga inmatningen
- **Kollisionssårbar**: Kända sårbarheter gör det möjligt att hitta kollisioner

**Säkerhetsstatus:**
⚠️ **SHA-1 är kryptografiskt brutet och bör inte användas för säkerhetskritiska applikationer**. Teoretiska attacker demonstrerades 2005, och praktiska kollisionsattacker uppnåddes 2017.

**Vanliga användningar (historiska):**

- Digitala signaturer och certifikat (föråldrat)
- Git versionskontrollsystem (för kompatibilitet)
- Äldre system som kräver SHA-1
- Filintegritetsverifiering (inte säkerhetskritiskt)
- Proof-of-work algoritmer (vissa äldre kryptovalutor)

**Rekommenderade alternativ:**

- SHA-256 eller SHA-3 för nya applikationer
- SHA-512 för höga säkerhetskrav
