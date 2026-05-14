## Che cos'è bcrypt?

bcrypt è un algoritmo di hashing delle password progettato per l'archiviazione delle password. Combina la password con un salt casuale e ripete operazioni costose in base a un fattore di costo, quindi gli aggressori hanno bisogno di più tempo per provare ogni ipotesi.

## Quando usare questo strumento

- Genera un hash bcrypt per un account di test, uno script di seed o un ambiente di sviluppo locale.
- Confronta come fattori di costo diversi cambiano il formato dell'output e il tempo di esecuzione.
- Crea un hash pronto da copiare senza inviare la password a un server.

## Come scegliere il fattore di costo

Valori di costo più alti sono più lenti e di solito più sicuri, ma rendono anche più lento ogni tentativo di accesso per la tua applicazione. Un costo intorno a 10-12 è comune per i sistemi interattivi; valori più alti possono essere ragionevoli per flussi di lavoro riservati agli amministratori o a basso volume. Testa il costo sullo stesso tipo di hardware che verificherà la password.

## Cosa tenere presente

- Ogni hash generato usa un nuovo salt casuale, quindi l'output cambia anche quando password e costo restano uguali.
- Memorizza l'hash bcrypt, non la password originale.
- Usa bcrypt per le password, non per checksum di file, firme o hashing generico.
- Mantieni costante il comportamento di verifica ed evita di rivelare se un account utente esiste.
