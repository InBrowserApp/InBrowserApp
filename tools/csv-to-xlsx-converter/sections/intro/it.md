## Converti testo delimitato in Excel

Apri o trascina un file CSV o TSV locale, esamina le celle e scarica una cartella di lavoro XLSX con un foglio di lavoro chiamato Sheet1. Scegli il delimitatore e la codifica del testo se il rilevamento automatico non corrisponde al file. I file TSV usano le tabulazioni per impostazione predefinita. La finestra di anteprima non limita i dati esportati.

## Mantieni gli identificatori e il testo originale

CSV e TSV non memorizzano i tipi delle celle di un foglio di calcolo. Questo convertitore mantiene ogni campo come testo, inclusi gli zeri iniziali, gli identificatori lunghi, i numeri dall’aspetto decimale, le date e il testo che inizia con un segno di uguale. Non interpreta numeri o date come tali e non esegue formule. Vengono mantenuti i separatori tra virgolette, le virgolette con escape, Unicode, le interruzioni di riga nei campi, i campi vuoti e i record vuoti. Le righe più corte lasciano celle vuote. Un’interruzione di riga finale conclude l’ultimo record invece di aggiungere un’altra riga.

L’impostazione della prima riga permette di scegliere tra dati normali e un’intestazione con filtri Excel. Entrambe le opzioni mantengono la riga esattamente come è scritta, incluse le intestazioni duplicate o vuote. La codifica automatica supporta UTF-8 e UTF-16 con indicatore dell’ordine dei byte. Le altre codifiche possono essere selezionate manualmente. Una direttiva sep= iniziale viene omessa solo quando è selezionato il rilevamento automatico del delimitatore o quando il suo separatore corrisponde al delimitatore selezionato.

Campi tra virgolette non corretti, codifica del testo non valida e dati che superano i limiti di Excel per righe, colonne o testo delle celle generano un errore anziché una cartella di lavoro troncata. Controlla i valori importanti in un’applicazione per fogli di calcolo dopo il download.

## Elaborazione locale

La conversione avviene in questo browser senza caricare il file su server. Modificando le impostazioni di importazione, sostituendo o chiudendo il file viene scartato il risultato precedente. Annullando si interrompe il processo in background. Non esiste un limite fisso alla dimensione dei file; la memoria disponibile nel browser determina quali file possono essere elaborati.

Per esplorare file di fogli di calcolo, apri il [Visualizzatore di fogli di calcolo](../xlsx-viewer/).
