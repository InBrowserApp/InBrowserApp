## Vad är CityHash64?

CityHash64 är en snabb icke-kryptografisk hash-algoritm från Google som skapar ett 64-bitarsvärde (8 byte). Den är användbar när du behöver ett kompakt, deterministiskt fingeravtryck för text eller filer och hastighet är viktigare än kryptografisk säkerhet.

**Viktiga egenskaper:**

- **Snabb och deterministisk**: Samma inmatning och seed ger alltid samma 64-bitars hash
- **Icke-kryptografisk**: Använd inte CityHash64 för lösenord, signaturer, tokens eller manipulationssäkra integritetskontroller
- **Seed-medveten**: Lämna seed tomt för standard-CityHash64, eller ange ett decimalt seed eller ett hexadecimalt seed med `0x` när du behöver ett separat seedat hashutrymme
- **Lokal bearbetning**: Text och filer hashas i webbläsaren; uppladdade filer skickas inte till en server
- **Flera kodningar**: Resultat visas som hexadecimala, Base64-, decimala och binära värden

**Vanliga användningar:**

- Hashtabeller och datastrukturer
- Filfingeravtryck utan säkerhetskrav
- Datadeduplicering och indelning i bucketar
- Cachenycklar och shardingnycklar
- Regressionstestdata för system som redan använder CityHash64
- Databasindexering
