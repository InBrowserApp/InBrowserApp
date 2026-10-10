## Esporta un foglio di lavoro in un formato portabile

Apri un file .xlsx, .xlsm, .xltx o .xltm locale o trascinalo nell’esportatore. Scegli un foglio di lavoro in base al nome originale, inclusi i fogli nascosti, e seleziona CSV, TSV, JSON o Markdown. Visualizza il risultato in anteprima, copialo o scarica un file UTF-8 con un nome basato sulla cartella e sul foglio di lavoro. Sostituire o chiudere il file annulla le operazioni non ancora completate e rimuove i download precedenti. Anche il Visualizzatore XLSX offre l’azione «Esporta foglio di lavoro» per il foglio corrente.

L’intervallo di celle predefinito è il rettangolo più piccolo che contiene valori salvati o formule. Le celle e le righe vuote all’interno del rettangolo restano nel risultato. Puoi inserire un altro intervallo, ad esempio A1:D20, e scegliere «Applica intervallo». Un foglio vuoto produce un file di testo vuoto o un array JSON vuoto, a meno che tu non scelga esplicitamente un intervallo.

## Scegli come rappresentare valori e intestazioni

Il testo formattato segue i formati numerici supportati, mantenendo le date visualizzate e i formati numerici con zeri iniziali quando disponibili. I formati che dipendono dalle impostazioni locali possono differire da Excel. I valori memorizzati conservano numeri e valori booleani; le date restano numeri seriali di Excel senza acquisire un fuso orario. Le celle di testo mantengono il testo in entrambe le modalità. Le formule usano i risultati salvati senza ricalcolo. Un risultato salvato mancante diventa una cella vuota, con un avviso nell’interfaccia. Gli errori del foglio di calcolo restano stringhe leggibili, come #DIV/0!.

CSV e TSV racchiudono tra virgolette i campi che contengono separatori, virgolette o interruzioni di riga. JSON è un array di array di righe: la prima riga resta nei dati, le intestazioni duplicate o vuote non diventano chiavi di oggetti e le celle vuote usano null. Markdown può usare la prima riga come intestazione o aggiungere un’intestazione vuota sopra tutte le righe di dati. I segni di punteggiatura Markdown, l’HTML, le barre verticali e le interruzioni di riga nelle celle vengono sottoposti a escape o rappresentati in modo sicuro. I download usano UTF-8 senza indicatore dell’ordine dei byte; scegli UTF-8 quando importi in un’altra applicazione.

## Elaborazione locale e compatibilità

La cartella di lavoro resta in questo browser e non viene caricata su server né salvata dallo strumento. Macro, script e connessioni a dati esterni non vengono eseguiti o aggiornati. Le righe e le colonne nascoste sono incluse nell’intervallo selezionato. Le celle unite non vengono espanse in valori ripetuti. Grafici, immagini, commenti e stili della cartella di lavoro non fanno parte di questi formati di testo.

Le cartelle di lavoro crittografate, danneggiate o non supportate mostrano un errore chiaro. Non ci sono limiti fissi per la dimensione del file o il numero di fogli, righe o colonne, ma un’esportazione di grandi dimensioni può superare la memoria del browser. Lo strumento esporta i dati salvati; non modifica la cartella di lavoro e non garantisce che un’altra applicazione per fogli di calcolo interpreti i campi di testo semplice allo stesso modo.
