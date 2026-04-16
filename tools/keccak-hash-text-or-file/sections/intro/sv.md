## Vad är Keccak?

Keccak är en familj av kryptografiska hash-funktioner som fungerar som grund för SHA-3 (Secure Hash Algorithm 3) standarden. Utvecklad av Guido Bertoni, Joan Daemen, Michaël Peeters och Gilles Van Assche, vann den NIST hash-funktions tävlingen 2012.

**Nyckelegenskaper:**

- **Svamp-konstruktion**: Använder en innovativ svamp-funktions design med absorbering och utkramning faser
- **Variabel utmatningslängd**: Kan producera hash-utmatningar av valfri önskad längd
- **Hög säkerhetsmarginal**: Designad med betydande säkerhetsreserver
- **Skiljer sig från SHA-1/SHA-2**: Baserad på helt olika matematiska principer
- **Keccak[c=2d] variant**: Denna implementation använder den ursprungliga Keccak specifikationen med kapacitet c = 2d (där d är utmatningslängden)

**Keccak vs SHA-3 (FIPS 202) skillnader:**
🔍 **Viktig åtskillnad**: Den ursprungliga Keccak och den standardiserade SHA-3 är **inte identiska**:

- **Ursprunglig Keccak**: Använder kapacitet c = 2d och olika utfyllnad (Keccak utfyllnad: 0x01)
- **FIPS 202 SHA-3**: Använder kapacitet c = 2d men olika utfyllnad (SHA-3 utfyllnad: 0x06)
- **Domänseparation**: Utfyllnadsskillnaden säkerställer att Keccak och SHA-3 producerar olika utmatningar för samma inmatning
- **Detta verktyg implementerar**: Den **ursprungliga Keccak specifikationen** med Keccak[c=2d] parametrisering

**Säkerhetsstatus:**
✅ **Keccak anses vara mycket säker** utan kända praktiska attacker. Det ger utmärkta säkerhetsmarginaler och motstånd mot olika kryptoanalytiska tekniker.

**Vanliga användningar:**

- Ethereum blockchain (använder ursprunglig Keccak-256)
- Akademisk forskning och kryptografiska protokoll
- Applikationer som kräver hash-utmatningar av variabel längd
- System som behöver alternativ till SHA-2 familjen
- Blockchain och kryptovaluta implementationer

**Fördelar över traditionella hasher:**

- Fundamentalt olika design minskar risken för relaterade attacker
- Flexibel utmatningslängd (inte begränsad till fasta storlekar)
- Stark teoretisk säkerhetsgrund
- Motstånd mot längdförlängningsattacker
- Utmärkt prestanda på olika plattformar

**Teknisk notering:**

- **Keccak-256**: Producerar 256-bit utmatning (vanligaste varianten)
- **Kapacitetsformel**: c = 2d säkerställer lämplig säkerhetsnivå
- **Ethereum användning**: Ethereum använder specifikt ursprunglig Keccak-256, inte SHA3-256
