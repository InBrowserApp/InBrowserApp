## Che cos'e un codice di stato HTTP?

I codici di stato HTTP sono codici di risposta a tre cifre restituiti da un server per mostrare che cosa e successo a una richiesta. Li trovi spesso negli strumenti di sviluppo del browser, nelle risposte API, nei log del server, nei controlli di disponibilita e nelle dashboard dei reverse proxy.

### Come leggere le principali famiglie di codici

- **1xx Informativo:** Il server ha ricevuto la richiesta e l'elaborazione e ancora in corso.
- **2xx Successo:** La richiesta e stata completata correttamente.
- **3xx Reindirizzamento:** Il client deve seguire un'altra posizione oppure riutilizzare un risultato in cache.
- **4xx Errore del client:** La richiesta stessa ha un problema, come una risorsa mancante, un input non valido o un'autenticazione fallita.
- **5xx Errore del server:** Il server o una dipendenza a monte ha fallito durante l'elaborazione di una richiesta valida.

### Quando questo lookup e utile

Usa questo strumento quando vuoi confermare il significato di un codice, confrontare codici simili come 401 e 403 oppure 502 e 504, o cercare una frase vista in un messaggio di errore. La ricerca supporta codice, nome dello stato e descrizione localizzata.

### Perche una corretta interpretazione conta

Durante il debugging, il codice di stato e spesso l'indizio piu rapido. Una risposta 4xx di solito punta alla richiesta, alle credenziali o alla risorsa di destinazione. Una risposta 5xx di solito punta all'applicazione, al gateway o a un servizio a monte. Leggere prima la categoria aiuta a scegliere il passo successivo giusto.
