## Che cos'è un firmatore JWT?

Un firmatore JWT crea un JSON Web Token compatto serializzando un header e un payload, quindi firmandoli con un segreto o una chiave privata. Il risultato è il token in tre parti `header.payload.signature` usato da molti sistemi API, OAuth e di sessione.

## Quando usare questo strumento

- Crea token di test locali per sviluppo API, ambienti di staging e demo.
- Confronta come algoritmi diversi cambiano l'header e la firma del token.
- Aggiungi claim come `sub`, `iss`, `aud`, `exp`, `iat`, `scope` o campi applicativi personalizzati senza scrivere uno script usa e getta.
- Genera token con segreti condivisi HMAC o con chiavi private RSA/ECDSA in formato PKCS#8 PEM o JWK.

## Cosa controllare prima di usare un token firmato

- Abbina l'algoritmo al tipo di chiave: `HS*` usa un segreto condiviso, `RS*` e `PS*` usano chiavi private RSA, e `ES*` usa chiavi private EC.
- Aggiungi claim di scadenza e audience quando il servizio ricevente li richiede.
- Tieni le chiavi private di produzione fuori da browser e macchine condivisi. Questo strumento viene eseguito localmente, ma non può proteggere le chiavi da un dispositivo già compromesso.
- Ricorda che la firma non è crittografia. Chiunque riceva il token può decodificare header e payload.
