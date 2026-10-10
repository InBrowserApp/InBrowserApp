## Converti le cartelle di lavoro Excel meno recenti nel browser

Apri o trascina un file XLS locale. Scegli un foglio di lavoro, esamina i dati delle celle e scarica una cartella di lavoro XLSX. Puoi spostarti nell’anteprima o inserire l’indirizzo della cella in alto a sinistra per passare a un’altra area. La finestra di anteprima non limita l’esportazione: sono inclusi tutti i fogli di lavoro e le relative celle importate.

Vengono mantenuti i nomi e l’ordine dei fogli di lavoro, i fogli vuoti, gli stati di visibilità dei fogli nascosti, testo, numeri, valori booleani, errori del foglio di calcolo, formati numerici supportati, celle unite, altezze delle righe, larghezze delle colonne e righe e colonne nascoste, quando il parser del file di origine li supporta. Gli identificatori di testo mantengono gli zeri iniziali. Le date mantengono i valori seriali di Excel e il sistema di date della cartella di lavoro.

## Formule e compatibilità

Le espressioni delle formule supportate e i relativi risultati salvati vengono mantenuti. Il browser non ricalcola le formule né aggiorna i dati esterni. Una formula senza risultato salvato appare nell’anteprima con un avviso; la sua espressione resta nel file di output affinché un’applicazione per fogli di calcolo possa calcolarla. Le espressioni delle formule o i riferimenti esterni non supportati potrebbero non essere mantenuti correttamente durante la conversione.

Si tratta di una conversione dei dati, non di una riproduzione fedele di tutte le funzionalità della cartella di lavoro. Grafici, immagini, macro, funzionalità pivot e stili avanzati non vengono mantenuti. L’anteprima non riproduce la disposizione delle celle unite o la formattazione. Controlla la cartella di lavoro scaricata nella tua applicazione per fogli di calcolo, soprattutto quando le formule o la disposizione sono importanti. I fogli macro, i fogli grafico, i file crittografati, i file danneggiati e i file semplicemente rinominati con estensione .xls non sono supportati.

## Elaborazione locale

La cartella di lavoro viene elaborata in questo browser senza caricarne il contenuto su server. Le macro non vengono eseguite e le risorse collegate non vengono recuperate. Sostituire o chiudere la cartella di lavoro elimina il risultato; annullare interrompe la conversione. Non esiste un limite fisso alla dimensione dei file o al numero di fogli di lavoro, anche se le cartelle di lavoro grandi dipendono comunque dalla memoria disponibile nel browser.

Per esplorare altri formati di fogli di calcolo, apri il [Visualizzatore di fogli di calcolo](../xlsx-viewer/).
