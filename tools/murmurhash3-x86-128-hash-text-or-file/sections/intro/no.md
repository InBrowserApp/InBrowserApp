## Hva er MurmurHash3 (x86 128-bit)?

MurmurHash3 er en rask ikke-kryptografisk hash-algoritme laget for
gjentakbare sjekksummer med god fordeling. x86 128-bit-varianten returnerer en
16-byte-verdi, vanligvis vist som 32 heksadesimale tegn, noe som gjør den
bedre egnet enn 32-bit-hasher når du vil ha en bredere identifikator for store
sett med poster, filer eller cache-nøkler.

**Der den er nyttig:**

- **Hashtabeller og sharding**: Lag stabile nøkler for buckets, partisjoner
  eller oppslagstabeller.
- **Deduplisering**: Sammenlign store tekst- eller filsett med kompakte
  128-bit-fingeravtrykk før du gjør dypere kontroller.
- **Cache-nøkler**: Produser deterministiske identifikatorer for
  byggeartefakter, transformerte data eller generert innhold.
- **Integritetssjekker uten sikkerhetsgaranti**: Oppdag utilsiktede endringer
  under lagring eller overføring når kryptografiske garantier ikke kreves.

**Seed-oppførsel:**

Den valgfrie seeden er en usignert 32-bit-verdi. Bruk samme seed når du må ha
resultater som samsvarer med et annet system, og la den stå på `0` når du ikke
har et bestemt kompatibilitetskrav. Desimalverdier og heksadesimale `0x`-verdier
godtas; større verdier håndteres modulo det samme 32-bit-området som algoritmen
bruker.

**Sikkerhetsmerknader:**

MurmurHash3 er ikke en algoritme for passordhashing, signering eller
manipulasjonssikker verifisering. Bruk SHA-256, HMAC eller et verktøy for
passordhashing når utdataene trenger sikkerhetsegenskaper. Dette verktøyet
passer best for lokal, frakoblet, ytelsesorientert hashing der hastighet og
stabil fordeling betyr mer enn motstand mot angrep.
