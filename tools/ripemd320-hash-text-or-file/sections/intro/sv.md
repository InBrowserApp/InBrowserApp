## Vad är RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) är en kryptografisk hashfunktion som producerar ett 320-bitars (40-byte) hashvärde, vanligtvis återgivet som ett 80-teckens hexadecimalt tal. Den ingår i RIPEMD-familjen som utvecklades i Europa som ett alternativ till MD4/MD5.

Använd det här verktyget när du behöver beräkna en RIPEMD-320-digest för inklistrad text, kopierade konfigurationsdata eller en lokal fil. Beräkningen körs i din webbläsare, så filinnehållet behöver inte laddas upp till en server.

**Nyckelegenskaper:**

- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst
- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar
- **Fast utmatningsstorlek**: Producerar alltid en 320-bitars hash oavsett inmatningsstorlek
- **Enkelriktad**: Det är beräkningsmässigt omöjligt att återställa den ursprungliga inmatningen från hashen

**Vanliga användningar:**

- Kontroller av dataintegritet
- Fingeravtryck och deduplicering
- Kompatibilitet med äldre system

**Säkerhetsnotering:**

RIPEMD-320 är främst användbart när ett protokoll, arkiv, en lista med kontrollsummor eller ett äldre system redan anger det. För nya säkerhetskänsliga konstruktioner bör du föredra en hash som är standardiserad idag, till exempel SHA-256, SHA-512, SHA-3 eller BLAKE3, om inte RIPEMD-kompatibilitet krävs.
