## Cos'è la conversione JWK ↔ PEM?

JWK (JSON Web Key) è un formato JSON per chiavi crittografiche usato nei sistemi JOSE/JWT. Può rappresentare chiavi RSA, EC o OKP e può apparire in un JWK Set (JWKS).

PEM è una chiave ASN.1/DER codificata in Base64 con intestazioni come BEGIN PUBLIC KEY o BEGIN PRIVATE KEY, comune in TLS, OpenSSL e molti SDK.

Questo strumento converte le chiavi in entrambe le direzioni, preservando il materiale della chiave scegliendo un output pubblico (SPKI) o privato (PKCS8). Supporta RSA, EC (P-256/384/521) e OKP (Ed25519/X25519/Ed448/X448), e funziona tutto localmente nel browser.

Scegli JWK → PEM quando una libreria, un gateway o una CLI si aspettano file di chiavi in stile OpenSSL. Scegli PEM → JWK quando devi inserire una chiave in un JWKS, passarla tramite configurazione basata su JSON o usarla in ambienti browser o serverless. La conversione di una chiave privata conserva il materiale privato, quindi condividi solo l'output pubblico quando è sufficiente.

- Usa una chiave JWK/JWKS in sistemi che accettano solo PEM.
- Esporta chiavi PEM per librerie JWT, gateway API o distribuzione delle chiavi.
- Condividi in modo sicuro le chiavi pubbliche senza esporre dati della chiave privata.
