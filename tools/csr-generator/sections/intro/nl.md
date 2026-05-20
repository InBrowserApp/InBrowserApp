## Wat is een CSR?

Een Certificate Signing Request (CSR) is een klein PKCS#10-document dat een certificeringsinstantie (CA) nodig heeft om een TLS- of code-ondertekeningscertificaat uit te geven. Het bundelt de publieke helft van een sleutelpaar, de identiteit die u door de CA wilt laten bevestigen (het Subject) en eventuele aanvullende identifiers zoals DNS-namen of IP-adressen (de Subject Alternative Names, of SAN), allemaal ondertekend door de bijbehorende privésleutel.

Dit hulpmiddel bouwt de CSR volledig in uw browser op met behulp van de Web Crypto API en [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Niets over uw sleutel of uw verzoek wordt naar een server verzonden.

## Wanneer dit hulpmiddel gebruiken

- Vraag een TLS-certificaat aan bij een openbare CA (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, enz.) wanneer hun werkwijze vraagt om uw eigen CSR te plakken.
- Genereer een CSR voor een interne certificeringsinstantie — ACME-gebaseerd, smallstep, EJBCA, AD CS — zonder een gehoste webpagina te vertrouwen.
- Geef een certificaat opnieuw uit met dezelfde privésleutel door een bestaande PKCS#8 PEM-sleutel te importeren en alleen een nieuwe CSR te ondertekenen.

## Hoe het formulier invullen

- **Sleutelbron** — kies *Nieuw aanmaken* om een nieuw sleutelpaar te genereren, of *Bestaande importeren* om een niet-versleutelde PKCS#8 PEM-sleutel te plakken. Versleutelde sleutels, verouderde `RSA PRIVATE KEY`- en `EC PRIVATE KEY`-blokken worden niet geaccepteerd; converteer ze eerst met `openssl pkcs8 -topk8 -nocrypt`.
- **Algoritme** — RSA biedt de breedste compatibiliteit als standaard. ECDSA produceert kleinere handtekeningen en wordt breed ondersteund door moderne CA's en TLS-clients.
- **Subject** — de meeste openbare CA's negeren alles behalve de Common Name en beschouwen de DNS SAN-lijst als leidend, maar private CA's hebben mogelijk toch een volledig DN nodig.
- **SAN-vermeldingen** — geef de hostnamen, IP-adressen, e-mailadressen of URI's op die het certificaat moet omvatten. Één per regel of kommagescheiden.

## Aandachtspunten

- De privésleutel die naast de CSR wordt getoond, wordt lokaal gegenereerd en verlaat nooit uw browser. Sla deze op voordat u het tabblad sluit — zonder de bijbehorende privésleutel is het ondertekende certificaat onbruikbaar.
- Openbare CA's vereisen dat de Common Name (of minimaal één SAN-vermelding) een DNS-naam is die zij kunnen valideren. SAN-vermeldingen op basis van IP-adressen zijn voornamelijk nuttig voor interne certificaten.
- De gegenereerde privésleutel is niet versleuteld. Voeg een wachtwoordzin toe met `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` als u die nodig hebt voordat u de sleutel opslaat.
- Alleen RSA (2048/3072/4096) en ECDSA (P-256/P-384/P-521) worden ondersteund. EdDSA is opzettelijk weggelaten omdat de ondersteuning in browsers en bij CA's nog inconsistent is.
