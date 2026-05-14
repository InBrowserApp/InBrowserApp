## Vad är MurmurHash3 (x86 128-bit)?

MurmurHash3 är en snabb icke-kryptografisk hash-algoritm som är utformad för
repeterbara kontrollsummor med god fördelning. Varianten x86 128-bit
returnerar ett värde på 16 byte, vanligtvis visat som 32 hexadecimala tecken.
Det gör den mer lämpad än 32-bitars hashvärden när du vill ha en bredare
identifierare för stora uppsättningar poster, filer eller cachenycklar.

**Där det hjälper:**

- **Hashtabeller och sharding**: Skapa stabila nycklar för bucketar,
  partitioner eller uppslagstabeller.
- **Deduplicering**: Jämför stora text- eller filmängder med kompakta
  128-bitars fingeravtryck innan du gör djupare kontroller.
- **Cachenycklar**: Skapa deterministiska identifierare för byggartefakter,
  transformerade data eller genererat innehåll.
- **Integritetskontroller utan säkerhetskrav**: Upptäck oavsiktliga ändringar
  vid lagring eller överföring när kryptografiska garantier inte krävs.

**Seed-beteende:**

Det valfria seed-värdet är ett 32-bitars osignerat värde. Använd samma seed när
resultaten behöver matcha ett annat system, och låt det vara `0` när du inte har
något särskilt kompatibilitetskrav. Decimalvärden och hexadecimala `0x`-värden
accepteras; större värden slår runt till samma 32-bitarsintervall som algoritmen
använder.

**Säkerhetsanmärkningar:**

MurmurHash3 är inte en algoritm för lösenordshashning, signering eller
manipulationssäker verifiering. Använd SHA-256, HMAC eller ett verktyg för
lösenordshashning när utdata behöver säkerhetsegenskaper. Det här verktyget
passar bäst för lokal, offline och prestandainriktad hashning där hastighet och
stabil spridning är viktigare än motståndskraft mot angrepp.
