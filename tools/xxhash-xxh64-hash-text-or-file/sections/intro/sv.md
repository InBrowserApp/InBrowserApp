## Vad är xxHash (XXH64)?

xxHash är en extremt snabb icke-kryptografisk hash-algoritm som fokuserar på hastighet och prestanda samtidigt som den bibehåller goda distributionsegenskaper. XXH64 är 64-bitarsvarianten som producerar ett 64-bitars (8-byte) hash-värde, vanligtvis visat som ett 16-tecken hexadecimalt nummer.

**Nyckelegenskaper:**

- **Extremt snabb**: Optimerad för hastighet, mycket snabbare än kryptografiska hash-funktioner
- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **God distribution**: Ger utmärkt hash-distribution för hash-tabeller
- **Icke-kryptografisk**: Inte lämplig för säkerhetsändamål, designad för prestanda
- **Större utmatning**: 64-bitars hash ger bättre kollisionsresistens än 32-bitars varianter
- **Plattformsoptimerad**: Använder SIMD-instruktioner när tillgängliga för maximal hastighet

**Vanliga användningar:**

- Hash-tabeller och datastrukturer
- Filintegritetskontroller (icke-säkerhet)
- Datadeduplicering
- Checksummor för dataöverföring
- Prestandakritiska applikationer
- Databasindexering
- Cache-nyckelgenerering
