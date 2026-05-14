## Wat is een JWT-ondertekenaar?

Een JWT-ondertekenaar maakt een compacte JSON Web Token door een header en payload te serialiseren en die vervolgens te ondertekenen met een geheim of privésleutel. Het resultaat is het driedelige `header.payload.signature`-token dat door veel API-, OAuth- en sessiesystemen wordt gebruikt.

## Wanneer gebruik je deze tool

- Maak lokale testtokens voor API-ontwikkeling, stagingomgevingen en demo's.
- Vergelijk hoe verschillende algoritmen de tokenheader en handtekening veranderen.
- Voeg claims zoals `sub`, `iss`, `aud`, `exp`, `iat`, `scope` of aangepaste applicatievelden toe zonder een wegwerpscript te schrijven.
- Genereer tokens met gedeelde HMAC-geheimen of met RSA/ECDSA-privésleutels in PKCS#8 PEM- of JWK-vorm.

## Wat moet je controleren voordat je een ondertekend token gebruikt

- Stem het algoritme af op het sleuteltype: `HS*` gebruikt een gedeeld geheim, `RS*` en `PS*` gebruiken RSA-privésleutels en `ES*` gebruikt EC-privésleutels.
- Voeg verval- en audience-claims toe wanneer de ontvangende service die verwacht.
- Houd productie-privésleutels uit gedeelde browsers en machines. Deze tool draait lokaal, maar kan sleutels niet beschermen tegen een apparaat dat al is gecompromitteerd.
- Onthoud dat ondertekenen geen versleuteling is. Iedereen die het token ontvangt, kan de header en payload decoderen.
