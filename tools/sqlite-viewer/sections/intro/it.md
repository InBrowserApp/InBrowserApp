## Esplora database SQLite nel browser

Apri un database SQLite 3 per esplorare tabelle e viste, esaminare colonne, indici, chiavi esterne e istruzioni CREATE oppure eseguire una query SQL in sola lettura. Prova il database di esempio per esplorare l’area di lavoro. Il file viene elaborato localmente e non viene mai modificato.

## Esegui query ed esporta i risultati

Seleziona una tabella o una vista per caricarne le righe, poi modifica il codice SQL per filtrare, ordinare o unire i dati. Esegui una sola istruzione SELECT, WITH o EXPLAIN con **Esegui query** o **Ctrl/⌘ + Invio**. Fai clic su una cella per esaminarne e copiarne il valore completo.

Scegli un limite di 100, 1.000 o 10.000 righe e sfoglia il risultato 50 righe alla volta. Le query hanno un limite di 10 secondi e di 5 MiB per le dimensioni dei risultati. Le esportazioni CSV e JSON includono tutte le righe caricate, in tutte le pagine.

JSON usa nomi di colonna e array di righe separati per conservare nomi duplicati e valori NULL. Gli interi sono stringhe decimali esatte e i BLOB contengono un valore esadecimale `$blob`. CSV include una riga di intestazione, usa campi vuoti per NULL e aggiunge un apostrofo davanti al testo che può essere interpretato come formula.

## File SQLite supportati

Apri un file `.db`, `.sqlite` o `.sqlite3` non crittografato fino a 50 MiB. Per un database che usa WAL, crea una copia su cui è stato eseguito un checkpoint prima di aprirla; i file ausiliari WAL e journal non vengono caricati. Le estensioni SQLite personalizzate non sono supportate. File e query non vengono salvati automaticamente.
