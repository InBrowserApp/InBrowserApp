## Vad är RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) är en kryptografisk hashfunktion som producerar ett hashvärde på 128 bitar (16 byte), vanligtvis återgivet som ett 32-tecken hexadecimalt tal. Den ingår i RIPEMD-familjen som utvecklades i Europa som ett alternativ till MD4/MD5.

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Fast utmatningsstorlek**: Producerar alltid en 128-bitars hash oavsett inmatningsstorlek
- **Enkelriktad**: Det är beräkningsmässigt omöjligt att återställa den ursprungliga inmatningen från hashen

**Vanliga användningar:**

- Kontroller av dataintegritet
- Fingeravtryck och deduplicering
- Kompatibilitet med äldre system
