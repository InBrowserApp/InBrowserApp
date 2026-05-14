## Vad är en JWT-avkodare och verifierare?

En JSON Web Token är en kompakt sträng med tre base64url-segment: ett huvud, en nyttolast och en signatur. Det här verktyget avkodar huvudet och nyttolasten i din webbläsare så att du kan granska tokenstrukturen utan att skicka den till en server.

Signaturverifiering kontrollerar om tokenen signerades med den nyckel och algoritm du förväntar dig. Använd en delad hemlighet för HS256-, HS384- eller HS512-tokens. Använd en PEM-offentlig nyckel, JWK eller JWKS för RS-, PS- och ES-tokens.

## När du ska använda den

Använd avkodaren när du felsöker autentiseringsflöden, kontrollerar OAuth- eller OpenID Connect-claims, jämför miljöer eller bekräftar att en backend utfärdar de förväntade värdena för målgrupp, utfärdare, subjekt, utgångstid och nyckelidentifierare.

Använd verifiering när du har den matchande hemligheten eller offentliga nyckeln och behöver bekräfta att huvudet, nyttolasten och signaturen fortfarande hör ihop. Verktyget markerar också `exp`, `nbf` och `iat` så att vanliga problem med klocka och giltighetstid syns direkt.

## Säkerhetsnoteringar

JWT-nyttolaster är bara kodade, inte krypterade. Alla som har tokenen kan läsa dess claims om tokenen inte är en separat krypterad JWE, vilket det här verktyget inte behandlar.

Klistra inte in produktionstokens eller privata hemligheter på delade datorer. Verktyget körs lokalt i din webbläsare och lagrar inte tokenen eller verifieringsmaterialet, men det säkraste arbetsflödet är fortfarande att använda kortlivade testtokens och offentliga nycklar när det är möjligt.
