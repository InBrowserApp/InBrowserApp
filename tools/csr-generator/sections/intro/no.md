# CSR-generator

En Certificate Signing Request (CSR) er en PKCS#10-melding som inneholder den offentlige nøkkelen din, identifiserende Subject-felt, valgfrie utvidelser som Subject Alternative Names, og en signatur laget med den tilhørende private nøkkelen. Sertifikatutstedere bruker CSR-en til å utstede et X.509-sertifikat uten noen gang å motta den private nøkkelen din.

Denne generatoren oppretter CSR-er direkte i nettleseren din. Du kan generere et nytt RSA- eller ECDSA-nøkkelpar, eller importere en eksisterende ukryptert privat PEM-nøkkel når du må fornye et sertifikat for en nøkkel som allerede er i bruk.

## Når du bør bruke den

Bruk en CSR når du trenger at en sertifikatutsteder skal utstede eller fornye et TLS-, S/MIME-, klientautentiserings- eller internt tjenestesertifikat. CSR-en beviser eierskap til den private nøkkelen og inneholder den offentlige identitetsinformasjonen som skal vises i sertifikatet.

For offentlige TLS-sertifikater bør du legge vertsnavn i Subject Alternative Names. Common Name er fortsatt nyttig for lesbarhet og eldre systemer, men moderne klienter validerer DNS-navn og IP-adresser fra SAN.

## Slik genererer du en CSR

Velg om du vil generere en ny nøkkel eller importere en eksisterende privat nøkkel. Fyll ut Subject-feltene som er relevante for sertifikatforespørselen din, og legg deretter til SAN-oppføringer for DNS-navn, IP-adresser, e-postadresser eller URI-er. Generer CSR-en og send bare CSR-PEM-en til sertifikatutstederen.

Hvis dette verktøyet genererer en ny nøkkel, må du laste ned og lagre den private nøkkelen før du forlater siden. Hvis du importerer en nøkkel, genererer verktøyet bare CSR-en og eksporterer ikke den importerte private nøkkelen på nytt.

## Merknader om nøkler og formater

RSA 2048 bit er bredt kompatibelt; 3072 eller 4096 bit kan være å foretrekke for interne sertifikater med lengre levetid. ECDSA P-256 er kompakt og bredt støttet, mens P-384 eller P-521 kan kreves av strengere retningslinjer. Import av nøkler støtter ukrypterte PKCS#8-, RSA PRIVATE KEY- og EC PRIVATE KEY-PEM-blokker.

Private nøkler er sensitive. Ikke lim dem inn på uklarerte nettsteder, ikke send dem til sertifikatutstedere, og ikke legg dem inn i kildekontroll. Dette verktøyet kjører lokalt i nettleseren, men den operative prosessen din trenger fortsatt sikker nøkkellagring og rotasjon.
