## What is a JWT decoder and verifier?

Et JSON Web Token er en kompakt streng med tre base64url-segmenter: en header, en nyttelast og en signatur. Dette verktøyet dekoder headeren og nyttelasten i nettleseren din, slik at du kan inspisere tokenstrukturen uten å sende den til en server.

Signaturverifisering kontrollerer om tokenet ble signert med nøkkelen og algoritmen du forventer. Bruk en delt hemmelighet for HS256-, HS384- eller HS512-tokener. Bruk en offentlig PEM-nøkkel, JWK eller JWKS for RS-, PS- og ES-tokener.

## When to use it

Bruk dekoderen når du feilsøker autentiseringsflyter, kontrollerer OAuth- eller OpenID Connect-claims, sammenligner miljøer eller bekrefter at en backend utsteder de forventede verdiene for audience, issuer, subject, expiration og key identifier.

Bruk verifisering når du har den samsvarende hemmeligheten eller offentlige nøkkelen og må bekrefte at headeren, nyttelasten og signaturen fortsatt hører sammen. Verktøyet fremhever også `exp`, `nbf` og `iat`, slik at vanlige klokke- og utløpsproblemer blir synlige umiddelbart.

## Security notes

JWT-nyttelaster er bare kodet, ikke kryptert. Alle med tokenet kan lese claimsene med mindre tokenet er en separat kryptert JWE, som dette verktøyet ikke behandler.

Ikke lim inn produksjonstokener eller private hemmeligheter på delte maskiner. Verktøyet kjører lokalt i nettleseren din og lagrer ikke tokenet eller verifiseringsmaterialet, men den tryggeste arbeidsflyten er fortsatt å bruke kortlivede testtokener og offentlige nøkler når det er mulig.
