# CSR-generator

Een Certificate Signing Request (CSR) is een PKCS#10-bericht dat je openbare sleutel bevat, identificerende Subject-velden, optionele extensies zoals Subject Alternative Names en een handtekening die met de bijbehorende privesleutel is gemaakt. Certificaatautoriteiten gebruiken de CSR om een X.509-certificaat uit te geven zonder ooit je privesleutel te ontvangen.

Deze generator maakt CSR's direct in je browser. Je kunt een nieuw RSA- of ECDSA-sleutelpaar genereren, of een bestaande onversleutelde PEM-privesleutel importeren wanneer je een certificaat moet vernieuwen voor een sleutel die al is uitgerold.

## Wanneer je dit gebruikt

Gebruik een CSR wanneer je een certificaatautoriteit nodig hebt om een TLS-, S/MIME-, clientauthenticatie- of intern servicecertificaat uit te geven of te vernieuwen. De CSR bewijst het bezit van de privesleutel en bevat de openbare identiteitsgegevens die in het certificaat moeten verschijnen.

Zet voor openbare TLS-certificaten hostnamen in Subject Alternative Names. De Common Name blijft nuttig voor leesbaarheid en oudere systemen, maar moderne clients valideren DNS-namen en IP-adressen via SAN.

## Een CSR genereren

Kies of je een nieuwe sleutel wilt genereren of een bestaande privesleutel wilt importeren. Vul de Subject-velden in die relevant zijn voor je certificaataanvraag en voeg daarna SAN-vermeldingen toe voor DNS-namen, IP-adressen, e-mailadressen of URI's. Genereer de CSR en stuur alleen de CSR-PEM naar je certificaatautoriteit.

Als deze tool een nieuwe sleutel genereert, download en bewaar de privesleutel voordat je de pagina verlaat. Als je een sleutel importeert, genereert de tool alleen de CSR en exporteert deze de geimporteerde privesleutel niet opnieuw.

## Opmerkingen over sleutels en indelingen

RSA 2048 bits is breed compatibel; 3072 of 4096 bits kan de voorkeur hebben voor interne certificaten met een langere levensduur. ECDSA P-256 is compact en breed ondersteund, terwijl P-384 of P-521 vereist kan zijn door strengere beleidsregels. Het importpad voor sleutels ondersteunt onversleutelde PKCS#8-, RSA PRIVATE KEY- en EC PRIVATE KEY-PEM-blokken.

Privesleutels zijn gevoelig. Plak ze niet in niet-vertrouwde websites, stuur ze niet naar certificaatautoriteiten en commit ze niet naar broncodebeheer. Deze tool draait lokaal in de browser, maar je operationele proces heeft nog steeds veilige sleutelopslag en rotatie nodig.
