## Cos'è la conversione JWK ↔ PEM?

JWK (JSON Web Key) è materiale di chiave in forma JSON usato da JOSE/JWT, endpoint JWKS e configurazioni serverless o browser. È facile da leggere per il software, ma meno accettato da CLI e infrastrutture che si aspettano file di chiave.

PEM racchiude dati di chiave DER con etichette BEGIN/END, il formato richiesto di solito da OpenSSL, strumenti TLS, gateway API e molti SDK.

Questo convertitore collega i due formati localmente nel browser. Gestisce contenitori di chiavi RSA, EC (P-256/384/521) e OKP, consente di scegliere PEM pubblico SPKI o privato PKCS8 partendo da JWK, e può trasformare blocchi PEM supportati in JWK JSON leggibile o compatto.

Usa l’output pubblico quando ti serve solo verifica o distribuzione. Le conversioni private espongono materiale di chiave privata sullo schermo e nei download, quindi tratta il risultato come un segreto e chiudi la scheda quando hai finito.

- Sposta chiavi tra configurazione JWKS/JSON e file PEM in stile OpenSSL.
- Estrai una chiave pubblica prima di condividerla con verificatori JWT, gateway o client.
- Converti localmente senza caricare materiale di chiave su un server.
