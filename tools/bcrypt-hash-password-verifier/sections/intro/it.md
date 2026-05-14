## Cosa fa

Verifica se una password in chiaro corrisponde a un hash bcrypt di password. È utile quando esegui il debug del codice di accesso, controlli record utente importati o confermi che una migrazione delle password abbia mantenuto gli hash compatibili.

## Input accettato

Incolla un hash bcrypt standard come `$2b$10$...` e inserisci la password candidata che vuoi testare. Il verificatore accetta i prefissi `$2a$`, `$2b$` e `$2y$` con valori di costo da `04` a `31`.

## Lettura del risultato

Un risultato corrispondente significa che bcrypt ha accettato la password per quell'hash, inclusi il salt e il costo incorporati nella stringa hash. Una mancata corrispondenza significa che la password non è stata verificata; non prova che l'hash stesso sia insicuro. Gli errori di hash non valido di solito indicano che prefisso, costo, lunghezza o caratteri bcrypt base64 non sono nel formato corretto.

## Note su privacy e sicurezza

- La verifica viene eseguita localmente nel browser.
- Password e hash non vengono salvati nello spazio di archiviazione locale.
- bcrypt è progettato per l'archiviazione delle password, non per checksum di file generici.
- Usa questo strumento per debug e validazione, non come unico audit di un sistema di autenticazione in produzione.
