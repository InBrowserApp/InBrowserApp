## Come esportare SQLite in un file SQL

Apri o trascina un file di database SQLite 3, come `.db`, `.sqlite` o `.sqlite3`. Lo strumento genera automaticamente un dump SQL. Attiva **Solo schema** per esportare la struttura senza le righe delle tabelle e scegli **Scarica .sql** per salvare lo script completo. Prova il database di esempio per vedere il risultato.

## Cosa contiene un dump SQL di SQLite

Un dump SQL è uno script di testo che permette di ricreare un database. Include istruzioni `CREATE` per tabelle, indici, viste e trigger. L’esportazione completa include anche le istruzioni `INSERT` per le righe delle tabelle. Usa il dump per esaminare le modifiche allo schema in Git, conservare una copia di backup leggibile o spostare il database in un altro ambiente SQLite.

Il file originale resta sul tuo dispositivo. Se il database usa un log di scrittura anticipata (WAL), esporta una copia autonoma. Usa l’app di origine o il comando di backup di SQLite affinché la copia includa le modifiche confermate nel log.

## Come ripristinare il dump SQL

Esegui questo comando per importare lo script in un nuovo database SQLite.

```sh
sqlite3 restored.sqlite < database.sql
```

Sostituisci `database.sql` con il nome del file scaricato. Lo script usa la sintassi di SQLite. Se il database usa tabelle virtuali o estensioni, ripristinalo in un’installazione di SQLite con i moduli necessari.

Per esplorare le tabelle o esportare i risultati delle query in CSV o JSON, apri il [Visualizzatore SQLite](../sqlite-viewer/). Per creare un database da fogli di calcolo, usa il [Convertitore da CSV ed Excel a SQLite](../csv-excel-to-sqlite/).
