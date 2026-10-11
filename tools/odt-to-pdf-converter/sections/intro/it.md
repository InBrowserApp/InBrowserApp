## Converti documenti di testo OpenDocument in locale

Apri un documento OpenDocument `.odt` o un modello `.ott`, convertilo in PDF, controlla le pagine ottenute e scarica lo stesso PDF mostrato nell’anteprima. Per leggere senza convertire, usa il [Visualizzatore ODT](../odt-viewer/).

## Aspetto del PDF e compatibilità

Il motore di conversione riproduce stili di pagina, formati della carta, orientamento, intestazioni, piè di pagina, colonne, tabelle e immagini incorporate. Le pagine restano nell’ordine prodotto dal motore di conversione, comprese le pagine vuote inserite dagli stili di pagina. Il testo supportato rimane selezionabile; non viene aggiunto OCR al testo scansionato. I caratteri mancanti vengono sostituiti con quelli forniti con lo strumento, quindi interruzioni di riga, spaziatura e impaginazione possono cambiare. I layout complessi possono differire dall’applicazione originale. Controlla ogni pagina prima di fare affidamento sul PDF.

Il PDF è un’esportazione statica. I controlli dei moduli mantengono l’aspetto che hanno in stampa. Commenti, macro e firme digitali non vengono conservati né verificati. Oggetti incorporati, contenuti multimediali e risorse esterne del documento non sono supportati. Documenti protetti, pacchetti danneggiati o contenuti mancanti rilevati generano un errore senza offrire file incompleti da scaricare. Cambiare l’estensione non modifica il formato effettivo.

## Privacy e risorse del browser

La conversione avviene sul tuo dispositivo. La prima conversione scarica circa 90 MB di file del motore e dei caratteri, che il browser può memorizzare nella cache; il documento non viene mai caricato online. Il motore viene caricato solo dopo aver scelto un file. È necessario un browser aggiornato che supporti WebAssembly e la memoria condivisa. I documenti grandi o complessi possono richiedere tempo e memoria. Puoi annullare, chiudere o sostituire il file. Non esistono limiti fissi alla dimensione del file o al numero di pagine.
