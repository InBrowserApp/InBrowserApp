## Hva er Keccak?

Keccak er en familie av kryptografiske hash-funksjoner som fungerer som grunnlag for SHA-3 (Secure Hash Algorithm 3) standarden. Utviklet av Guido Bertoni, Joan Daemen, Michaël Peeters og Gilles Van Assche, vant den NIST hash-funksjonskonkurransen i 2012.

**Nøkkelegenskaper:**

- **Svamp-konstruksjon**: Bruker et innovativt svamp-funksjonsdesign med absorpsjons- og utpressingsfaser
- **Variabel utdatalengde**: Kan produsere hash-utdata av ønsket lengde
- **Høy sikkerhetsmarginn**: Designet med betydelige sikkerhetsreserver
- **Forskjellig fra SHA-1/SHA-2**: Basert på helt andre matematiske prinsipper
- **Keccak[c=2d] variant**: Denne implementeringen bruker den opprinnelige Keccak-spesifikasjonen med kapasitet c = 2d (hvor d er utdatalengden)

**Forskjeller mellom Keccak og SHA-3 (FIPS 202):**
🔍 **Viktig skille**: Den opprinnelige Keccak og standardiserte SHA-3 er **ikke identiske**:

- **Opprinnelig Keccak**: Bruker kapasitet c = 2d og annerledes padding (Keccak padding: 0x01)
- **FIPS 202 SHA-3**: Bruker kapasitet c = 2d men annerledes padding (SHA-3 padding: 0x06)
- **Domeneseparasjon**: Padding-forskjellen sikrer at Keccak og SHA-3 produserer forskjellige utdata for samme inndata
- **Dette verktøyets implementering**: **Opprinnelig Keccak-spesifikasjon** med Keccak[c=2d] parametrisering

**Sikkerhetsstatus:**
✅ **Keccak anses som svært sikker** uten kjente praktiske angrep. Det gir utmerkede sikkerhetsmarginer og motstand mot forskjellige kryptanalytiske teknikker.

**Vanlige bruksområder:**

- Ethereum blockchain (bruker opprinnelig Keccak-256)
- Akademisk forskning og kryptografiske protokoller
- Applikasjoner som krever hash-utdata med variabel lengde
- Systemer som trenger et alternativ til SHA-2-familien
- Blockchain- og kryptovaluta-implementeringer

**Fordeler over tradisjonelle hashes:**

- Fundamentalt annerledes design reduserer risiko for relaterte angrep
- Fleksibel utdatalengde (ikke begrenset til faste størrelser)
- Sterkt teoretisk sikkerhetsfundament
- Motstand mot lengdeutvidelsesangrep
- Utmerket ytelse på tvers av forskjellige plattformer

**Tekniske merknader:**

- **Keccak-256**: Produserer 256-bits utdata (mest vanlige variant)
- **Kapasitetsformel**: c = 2d sikrer passende sikkerhetsnivå
- **Ethereum-bruk**: Ethereum bruker spesifikt opprinnelig Keccak-256, ikke SHA3-256
