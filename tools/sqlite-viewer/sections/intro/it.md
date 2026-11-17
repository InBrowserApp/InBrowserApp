## Esamina i file SQLite in locale

Apri un database SQLite 3 per esplorarne tabelle e viste, esaminare definizioni delle colonne, indici, chiavi esterne e istruzioni CREATE oppure eseguire una query SQL in sola lettura. Prova il database di esempio per esplorare l’area di lavoro senza scegliere un file. File e query restano nel browser e non vengono salvati automaticamente.

## Esegui query ed esporta i risultati

Seleziona una tabella per visualizzarne le righe. Modifica il codice SQL e usa **Esegui query** o **Ctrl/⌘ + Invio** per eseguire una sola istruzione SELECT, WITH o EXPLAIN. Il limite dei risultati stabilisce il numero massimo di righe caricate; ogni pagina mostra 50 righe. Una query può interrompersi anche al raggiungimento del limite di 5 MiB per i risultati o dopo 10 secondi. L’annullamento mantiene reattiva l’interfaccia e ricarica l’istantanea del database alla query successiva.

Le esportazioni CSV e JSON contengono il risultato caricato, comprese le righe nelle altre pagine. JSON memorizza separatamente i nomi delle colonne e gli array delle righe, conservando nomi duplicati e valori NULL. Gli interi SQLite diventano stringhe decimali esatte e i BLOB diventano oggetti con un valore esadecimale `$blob`. CSV usa campi vuoti per NULL, racchiude tra virgolette i caratteri speciali e aggiunge un apostrofo davanti al testo che può essere interpretato come formula, per un uso più sicuro nei fogli di calcolo.

## Database supportati e limiti

Apri un file `.db`, `.sqlite` o `.sqlite3` non crittografato fino a 50 MiB. Il file originale non viene mai modificato. Questo strumento carica un’istantanea in memoria, quindi l’uso della memoria può superare le dimensioni del file. I file ausiliari WAL e journal non vengono importati; prima di aprire il database qui, crea una copia integra con la tua applicazione per database dopo aver eseguito un checkpoint. I database crittografati, le estensioni SQLite personalizzate e la modifica dei database non sono supportati.
