## Che cos'è un hash di testo o file?

Una funzione hash trasforma testo o byte di file in un digest di lunghezza fissa. Lo stesso input e lo stesso algoritmo producono sempre lo stesso digest, quindi gli hash sono utili quando serve un'impronta ripetibile senza caricare dati privati.

## Quando usare questo strumento

Usa questo strumento per verificare checksum di download, confrontare se due file sono identici, registrare rapidamente un'impronta per un frammento di testo o eseguire debug di sistemi che pubblicano digest SHA. L'importazione di un file calcola l'hash direttamente sui byte del file, mentre la modalità testo calcola l'hash del testo UTF-8 mostrato nell'editor.

## Scegliere un algoritmo

SHA-256 è una scelta predefinita solida per i nuovi controlli di integrità. SHA-384 e SHA-512 forniscono digest SHA-2 più lunghi quando un altro sistema richiede quei formati. SHA-1 è incluso per confronti con sistemi legacy, ma non dovrebbe essere usato per nuovi progetti sensibili alla sicurezza.

## Privacy e limiti

Il calcolo dell'hash viene eseguito localmente nel browser tramite Web Crypto e i file non vengono caricati. Un hash non è crittografia: da solo non può proteggere un segreto, e l'archiviazione delle password richiede una funzione dedicata per password hashing con sale e fattore di lavoro.
