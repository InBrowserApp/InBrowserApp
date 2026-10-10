## Converti cartelle di lavoro Excel in OpenDocument

Apri o trascina un file XLSX locale, esamina le celle e scarica una cartella di lavoro ODS. Sono inclusi i nomi e l’ordine dei fogli di lavoro, i fogli vuoti e nascosti, le posizioni delle celle, testo, numeri, valori booleani, date e risultati salvati delle formule. La finestra di anteprima non limita i dati esportati. I fogli molto nascosti diventano normali fogli nascosti.

## Valori salvati e compatibilità

Le formule vengono convertite nei valori salvati. I risultati mancanti vengono segnalati e le relative celle restano vuote; il browser non ricalcola le formule né aggiorna i dati esterni. I risultati di errore del foglio di calcolo diventano testo semplice. Gli identificatori con zeri iniziali, i caratteri non latini e il testo letterale che inizia con un segno di uguale rimangono testo.

Le date rispettano il sistema di date 1900 o 1904 della cartella di lavoro e usano un formato standard per data e ora. I valori contenenti solo un orario e le durate usano un formato di durata di base. Le percentuali e i valori monetari mantengono il valore numerico senza la formattazione originale o l’etichetta della valuta. La data fittizia di Excel del 29 febbraio 1900 e i formati di data personalizzati non supportati generano un errore anziché una data sfalsata.

Stili, dimensioni di righe e colonne, disposizione delle celle unite, grafici, immagini, commenti, collegamenti, macro e impostazioni della cartella di lavoro non vengono riprodotti. I valori memorizzati nelle aree unite restano nelle posizioni delle celle originali. Questo convertitore accetta XLSX, ma non XLS, XLSB o XLSM. File crittografati, archivi non validi, tipi di foglio non supportati e dati che non possono essere rappresentati in ODS generano un errore chiaro. Controlla i risultati importanti nella tua applicazione per fogli di calcolo dopo il download.

## Elaborazione locale

La conversione avviene in questo browser senza caricare il documento su server. Sostituendo o chiudendo il file viene scartato il risultato precedente preparato per il download; annullando si interrompe il processo in background. Non esiste un limite fisso alla dimensione dei file o al numero di fogli di lavoro. La memoria disponibile nel browser determina comunque quali cartelle di lavoro possono essere elaborate.

Per esplorare Excel e altri formati di fogli di calcolo, apri il [Visualizzatore di fogli di calcolo](../xlsx-viewer/).
