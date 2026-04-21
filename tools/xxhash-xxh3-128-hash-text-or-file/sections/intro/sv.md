## Vad är xxHash (XXH3 128)?

XXH3 är den moderna xxHash-algoritmen, utvecklad för mycket hög hastighet och mycket bra distribution. XXH3 128 ger ett 128-bitars hashvärde (16 byte), som vanligtvis visas som en 32 tecken lång hexadecimal sträng. Det är en icke-kryptografisk hash och stöder även valfri seed för reproducerbar hashning.

**Viktiga egenskaper:**

- **Extremt snabb**: Optimerad för hög prestanda på stora indata
- **Deterministisk**: Samma indata och samma seed ger alltid samma hash
- **Icke-kryptografisk**: Inte lämplig för säkerhetsändamål
- **Bra distribution**: Användbar för hashtabeller och indexering
- **Med seed**: Valfri seed hjälper till att variera hashutdata

**Vanliga användningsområden:**

- Hashtabeller och datastrukturer
- Integritetskontroller av filer (ej säkerhet)
- Deduplikering och chunking av data
- Cache-nycklar och databasindexering
- Datapipelines med hög genomströmning
