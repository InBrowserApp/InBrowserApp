## Vad är en CSR?

En certifikatsigneringsförfrågan (CSR) är ett litet PKCS#10-dokument som en certifikatutfärdare (CA) behöver för att kunna utfärda ett TLS- eller kodsigneringscertifikat. Det samlar den publika halvdelen av ett nyckelpar, den identitet du vill att CA:n ska intyga (Subject), samt eventuella ytterligare identifierare som DNS-namn eller IP-adresser (Subject Alternative Names, eller SAN) – allt signerat av den matchande privata nyckeln.

Det här verktyget skapar CSR:en helt i din webbläsare med hjälp av Web Crypto API och [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Ingenting om din nyckel eller din förfrågan skickas till en server.

## När du ska använda det här verktyget

- Begär ett TLS-certifikat från en offentlig CA (Let's Encrypt, DigiCert, ZeroSSL, Sectigo m.fl.) när deras arbetsflöde ber dig klistra in din egen CSR.
- Generera en CSR för en intern certifikatutfärdare – ACME-baserad, smallstep, EJBCA, AD CS – utan att behöva lita på ett webbaserat formulär.
- Återutfärda ett certifikat med samma privata nyckel genom att importera en befintlig PKCS#8 PEM-nyckel och enbart signera en ny CSR.

## Hur du fyller i formuläret

- **Nyckelkälla** — välj _Generera ny_ för att skapa ett nytt nyckelpar, eller _Importera befintlig_ för att klistra in en okrypterad PKCS#8 PEM-nyckel. Krypterade nycklar, äldre `RSA PRIVATE KEY`- och `EC PRIVATE KEY`-block accepteras inte; konvertera dem med `openssl pkcs8 -topk8 -nocrypt` först.
- **Algoritm** — RSA ger bredast kompatibilitet som standard. ECDSA producerar mindre signaturer och stöds brett av moderna CA:er och TLS-klienter.
- **Subject** — de flesta offentliga CA:er ignorerar allt utom Common Name och behandlar DNS SAN-listan som auktoritativ, men privata CA:er kan fortfarande kräva ett fullständigt DN.
- **SAN-poster** — lista de värdnamn, IP-adresser, e-postadresser eller URI:er du vill att certifikatet ska täcka. En per rad, eller kommaseparerade.

## Vad du bör tänka på

- Den privata nyckeln som visas tillsammans med CSR:en genereras lokalt och lämnar aldrig din webbläsare. Spara den innan du stänger fliken – utan den matchande privata nyckeln är det signerade certifikatet oanvändbart.
- Offentliga CA:er kräver att Common Name (eller minst en SAN-post) är ett DNS-namn som de kan validera. IP-adress-SANs är framför allt användbara för interna certifikat.
- Den genererade privata nyckeln är okrypterad. Lägg till en lösenfras med `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` om du behöver det innan du lagrar den.
- Endast RSA (2048/3072/4096) och ECDSA (P-256/P-384/P-521) stöds. EdDSA utelämnas avsiktligt eftersom kompatibiliteten mellan webbläsare och CA:er fortfarande är inkonsekvent.
