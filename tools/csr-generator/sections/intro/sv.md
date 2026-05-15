# CSR-generator

En Certificate Signing Request (CSR) är ett PKCS#10-meddelande som innehåller din publika nyckel, identifierande Subject-fält, valfria tillägg som Subject Alternative Names och en signatur skapad med den matchande privata nyckeln. Certifikatutfärdare använder CSR:en för att utfärda ett X.509-certifikat utan att någonsin ta emot din privata nyckel.

Den här generatorn skapar CSR:er direkt i din webbläsare. Du kan generera ett nytt RSA- eller ECDSA-nyckelpar, eller importera en befintlig okrypterad privat PEM-nyckel när du behöver förnya ett certifikat för en nyckel som redan är i drift.

## När du ska använda den

Använd en CSR när du behöver att en certifikatutfärdare utfärdar eller förnyar ett TLS-, S/MIME-, klientautentiserings- eller internt tjänstecertifikat. CSR:en bevisar innehav av den privata nyckeln och bär den publika identitetsinformation som ska visas i certifikatet.

För offentliga TLS-certifikat ska värdnamn anges i Subject Alternative Names. Common Name är fortfarande användbart för läsbarhet och äldre system, men moderna klienter validerar DNS-namn och IP-adresser från SAN.

## Så genererar du en CSR

Välj om du vill generera en ny nyckel eller importera en befintlig privat nyckel. Fyll i de Subject-fält som är relevanta för din certifikatbegäran och lägg sedan till SAN-poster för DNS-namn, IP-adresser, e-postadresser eller URI:er. Generera CSR:en och skicka endast CSR-PEM:en till din certifikatutfärdare.

Om det här verktyget genererar en ny nyckel ska du ladda ner och lagra den privata nyckeln innan du lämnar sidan. Om du importerar en nyckel genererar verktyget endast CSR:en och exporterar inte den importerade privata nyckeln igen.

## Nyckel- och formatanteckningar

RSA 2048 bitar har bred kompatibilitet; 3072 eller 4096 bitar kan vara att föredra för interna certifikat med längre livslängd. ECDSA P-256 är kompakt och har brett stöd, medan P-384 eller P-521 kan krävas av striktare policyer. Importflödet för nycklar stöder okrypterade PEM-block för PKCS#8, RSA PRIVATE KEY och EC PRIVATE KEY.

Privata nycklar är känsliga. Klistra inte in dem på webbplatser du inte litar på, skicka dem inte till certifikatutfärdare och checka inte in dem i versionshantering. Det här verktyget körs lokalt i webbläsaren, men din driftsprocess behöver fortfarande säker nyckellagring och rotation.
