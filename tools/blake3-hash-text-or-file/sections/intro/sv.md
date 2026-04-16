## Vad är BLAKE3?

BLAKE3 är en modern kryptografisk hashfunktion som härstammar från BLAKE2. Den är utformad för mycket hög prestanda och parallellism samtidigt som säkerheten är stark. Den producerar som standard en 256-bitars hash och stöder utbyggbar utdatalängd (XOF).

**Nyckelegenskaper:**

- **Utbyggbar utdatalängd**: Kan producera hasher av valfri längd
- **Hög prestanda**: Snabb och parallelliserbar på moderna CPU:er
- **Deterministisk**: Samma inmatning producerar alltid samma hash
- **Lavineffekt**: Små förändringar i inmatningen ger drastiskt olika utdata
- **Irreversibel**: Beräkningsmässigt omöjligt att vända hashen för att hitta den ursprungliga inmatningen
- **Kollisionsresistent**: Mycket svårt att hitta två olika inmatningar som producerar samma hash
- **Nyckel-hashing**: Stöder en valfri 32-byte-nyckel för MAC-funktionalitet
- **Nyckelhärledning**: Kan härleda delnycklar från nyckelmaterial och kontext

**Vanliga användningar:**

- Filintegritetsverifiering
- Innehållsadresserad lagring och deduplicering
- Digitala signaturer och certifikat
- Lösenordslagring och autentisering
- Kryptografiska protokoll och system
