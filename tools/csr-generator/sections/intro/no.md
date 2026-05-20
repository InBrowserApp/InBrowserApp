## Hva er en CSR?

En Certificate Signing Request (CSR) er et lite PKCS#10-dokument som en sertifikatutsteder (CA) trenger for å utstede et TLS- eller kodesigneringssertifikat. Den samler den offentlige halvdelen av et nøkkelpar, identiteten du vil at CA-en skal bekrefte (Subject), og eventuelle tilleggsidentifikatorer som DNS-navn eller IP-adresser (Subject Alternative Names, eller SAN), alt signert av den tilhørende privatnøkkelen.

Dette verktøyet bygger CSR-en helt i nettleseren ved hjelp av Web Crypto API og [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Ingenting om nøkkelen din eller forespørselen din sendes til en server.

## Når du bør bruke dette verktøyet

- Be om et TLS-sertifikat fra en offentlig CA (Let's Encrypt, DigiCert, ZeroSSL, Sectigo osv.) når arbeidsflytene deres ber deg om å lime inn din egen CSR.
- Generer en CSR for en intern sertifikatutsteder — ACME-basert, smallstep, EJBCA, AD CS — uten å stole på et eksternt skjema.
- Reissuer et sertifikat med samme privatnøkkel ved å importere en eksisterende PKCS#8 PEM-nøkkel og kun signere en ny CSR.

## Slik fyller du ut skjemaet

- **Nøkkelkilde** — velg *Generer ny* for å opprette et nytt nøkkelpar, eller *Importer eksisterende* for å lime inn en ukryptert PKCS#8 PEM-nøkkel. Krypterte nøkler, eldre `RSA PRIVATE KEY`- og `EC PRIVATE KEY`-blokker godtas ikke; konverter dem med `openssl pkcs8 -topk8 -nocrypt` først.
- **Algoritme** — RSA gir bredest kompatibilitet som standardvalg. ECDSA produserer mindre signaturer og støttes av moderne CA-er og TLS-klienter.
- **Subject** — de fleste offentlige CA-er ignorerer alt annet enn Common Name og behandler DNS SAN-listen som autoritativ, men private CA-er kan fremdeles trenge et fullstendig DN.
- **SAN-oppføringer** — list opp vertsnavn, IP-adresser, e-postadresser eller URI-er du vil at sertifikatet skal dekke. Én per linje, eller kommaseparert.

## Hva du bør ha i tankene

- Privatnøkkelen som vises ved siden av CSR-en, genereres lokalt og forlater aldri nettleseren din. Lagre den før du lukker fanen — uten den tilhørende privatnøkkelen er det signerte sertifikatet ubrukelig.
- Offentlige CA-er krever at Common Name (eller minst én SAN-oppføring) er et DNS-navn de kan validere mot. IP-adresse-SAN-er er mest nyttige for interne sertifikater.
- Den genererte privatnøkkelen er ukryptert. Legg til en passfrase med `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` om du trenger det før lagring.
- Bare RSA (2048/3072/4096) og ECDSA (P-256/P-384/P-521) støttes. EdDSA er bevisst utelatt fordi støtten på tvers av nettlesere og CA-er fremdeles er inkonsekvent.
