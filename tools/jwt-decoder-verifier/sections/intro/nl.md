## Wat is een JWT-decoder en -verifier?

Een JSON Web Token is een compacte tekenreeks met drie base64url-segmenten: een header, een payload en een handtekening. Deze tool decodeert de header en payload in je browser, zodat je de tokenstructuur kunt inspecteren zonder deze naar een server te sturen.

Handtekeningverificatie controleert of de token is ondertekend met de key en het algoritme die je verwacht. Gebruik een gedeeld secret voor HS256-, HS384- of HS512-tokens. Gebruik een PEM-public key, JWK of JWKS voor RS-, PS- en ES-tokens.

## Wanneer je deze gebruikt

Gebruik de decoder bij het debuggen van authenticatiestromen, het controleren van OAuth- of OpenID Connect-claims, het vergelijken van omgevingen of het bevestigen dat een backend de verwachte waarden voor audience, issuer, subject, expiration en key identifier uitgeeft.

Gebruik verificatie wanneer je het bijbehorende secret of de public key hebt en moet bevestigen dat de header, payload en handtekening nog bij elkaar horen. De tool markeert ook `exp`, `nbf` en `iat`, zodat veelvoorkomende klok- en verloopproblemen direct zichtbaar zijn.

## Beveiligingsnotities

JWT-payloads zijn alleen gecodeerd, niet versleuteld. Iedereen met de token kan de claims lezen, tenzij de token een afzonderlijke versleutelde JWE is, die deze tool niet verwerkt.

Plak geen productietokens of private secrets op gedeelde machines. De tool draait lokaal in je browser en slaat de token of het verificatiemateriaal niet op, maar de veiligste workflow blijft om waar mogelijk kortlevende testtokens en public keys te gebruiken.
