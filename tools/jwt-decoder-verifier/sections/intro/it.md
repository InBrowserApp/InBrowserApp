## What is a JWT decoder and verifier?

Un JSON Web Token è una stringa compatta con tre segmenti base64url: un header, un payload e una firma. Questo strumento decodifica l'header e il payload nel browser, così puoi esaminare la struttura del token senza inviarlo a un server.

La verifica della firma controlla se il token è stato firmato con la chiave e l'algoritmo che ti aspetti. Usa un segreto condiviso per i token HS256, HS384 o HS512. Usa una chiave pubblica PEM, JWK o JWKS per i token RS, PS ed ES.

## When to use it

Usa il decoder durante il debug dei flussi di autenticazione, la verifica delle claim OAuth o OpenID Connect, il confronto tra ambienti o la conferma che un backend stia emettendo i valori attesi per audience, issuer, subject, scadenza e identificatore della chiave.

Usa la verifica quando hai il segreto o la chiave pubblica corrispondente e devi confermare che header, payload e firma appartengano ancora allo stesso token. Lo strumento evidenzia anche `exp`, `nbf` e `iat`, così i problemi comuni di orologio e scadenza sono visibili immediatamente.

## Security notes

I payload JWT sono solo codificati, non crittografati. Chiunque abbia il token può leggerne le claim, a meno che il token non sia un JWE crittografato separato, che questo strumento non elabora.

Non incollare token di produzione o segreti privati su macchine condivise. Lo strumento viene eseguito localmente nel browser e non archivia il token o il materiale di verifica, ma il flusso di lavoro più sicuro resta usare token di test a breve durata e chiavi pubbliche ogni volta che è possibile.
