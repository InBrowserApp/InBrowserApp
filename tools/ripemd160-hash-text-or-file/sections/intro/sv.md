## Vad är RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) är en kryptografisk hash-funktion som producerar ett 160-bitars (20-byte) hash-värde, vanligtvis återgivet som ett 40-tecken heksadecimalt tal. Det utvecklades 1996 av Hans Dobbertin, Antoon Bosselaers och Bart Preneel som del av det europeiska RACE-projektet.

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Rimligt snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Fast utmatningsstorlek**: Producerar alltid en 160-bitars hash oavsett inmatningsstorlek
- **Tvålinjers parallell struktur**: Använder två parallella beräkningslinjer för förbättrad säkerhet

**Säkerhetsstatus:**
✅ **RIPEMD-160 anses vara kryptografiskt säker** utan kända praktiska attacker. Det ger en bra säkerhetsmarginal och rekommenderas fortfarande för kryptografiska applikationer där en 160-bitars hash är tillräcklig.

**Vanliga användningar:**

- Bitcoin-adressgenerering (Base58Check-kodning)
- Digitala signaturer och certifikat
- Dataintegritetsverifiering
- Kryptografiska protokoll som kräver 160-bitars hasher
- Alternativ till SHA-1 vid behov

**Jämförelse med andra algoritmer:**

- Säkrare än MD5 och SHA-1
- Mindre utmatning än SHA-256 (160-bitar vs 256-bitar)
- Bra prestandaegenskaper
- Väl studerad och betrodd i kryptografiska gemenskapen

**Rekommenderas för:**

- Applikationer som kräver 160-bitars hash-säkerhet
- Bitcoin-relaterade kryptografiska operationer
- Kompatibilitet med äldre system där RIPEMD-160 är specificerat
