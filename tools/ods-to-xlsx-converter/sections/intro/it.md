## Converti fogli di calcolo OpenDocument in Excel

Apri o trascina un file ODS locale, esamina le celle e scarica una cartella di lavoro XLSX. Sono inclusi i nomi e l’ordine dei fogli di lavoro, i fogli nascosti, testo, numeri, valori booleani, date, risultati salvati delle formule e celle unite. Vengono mantenuti i fogli di lavoro vuoti e gli spazi vuoti tra le celle. La finestra di anteprima non limita i dati esportati.

## Valori salvati e compatibilità

Le formule vengono convertite nei valori salvati, non in formule Excel. I risultati salvati mancanti vengono segnalati e le relative celle restano vuote. Il browser non ricalcola le formule né aggiorna i dati esterni. I risultati di errore diventano errori generici del foglio di calcolo. Il testo letterale, inclusi gli identificatori con zeri iniziali, i caratteri non latini e il testo che inizia con un segno di uguale, rimane testo.

Le date usano un formato standard per data e ora; se è specificato un fuso orario, vengono normalizzate in UTC. Le durate restano numeri di giorni e le percentuali usano un formato percentuale di base. I valori monetari mantengono il valore numerico senza l’etichetta della valuta o la formattazione originale. Stili, dimensioni di righe e colonne, grafici, immagini, commenti, collegamenti, macro e impostazioni della cartella di lavoro non vengono riprodotti.

File crittografati, archivi non validi, dati non supportati e valori o nomi di fogli di lavoro al di fuori dei limiti supportati da Excel generano un errore chiaro. Questo convertitore non accetta file OpenDocument in formato piatto (.fods). Controlla i risultati importanti nella tua applicazione per fogli di calcolo dopo il download.

## Elaborazione locale

La conversione avviene in questo browser senza caricare il documento su server. Sostituendo o chiudendo il file viene scartato il risultato precedente preparato per il download; annullando si interrompe il processo in background. Non esiste un limite fisso alla dimensione dei file o al numero di fogli di lavoro. La memoria disponibile nel browser determina comunque quali cartelle di lavoro possono essere elaborate.

Per esplorare ODS e altri formati di fogli di calcolo, apri il [Visualizzatore di fogli di calcolo](../xlsx-viewer/).
