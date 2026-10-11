## Converti testo formattato in locale

Apri un documento `.rtf` locale, convertilo in PDF, controlla le pagine risultanti e scarica lo stesso PDF mostrato nell’anteprima. Per leggere senza conversione, usa il [Visualizzatore RTF](../rtf-viewer/).

## Aspetto del PDF e compatibilità

Il motore di conversione riproduce dimensioni e orientamento delle pagine, intestazioni, piè di pagina, interruzioni di pagina, tabelle e immagini PNG/JPEG incorporate supportate. Il testo supportato rimane selezionabile. Le codifiche dei caratteri RTF originali e le sequenze di escape Unicode vengono passate al motore; non viene aggiunto OCR al testo scansionato. I caratteri mancanti vengono sostituiti con quelli inclusi, quindi interruzioni di riga, spaziatura e impaginazione possono cambiare. I layout complessi possono differire dall’applicazione originale. Controlla ogni pagina prima di fare affidamento sul PDF.

Il PDF è un’esportazione statica. I controlli dei moduli usano l’aspetto che hanno in stampa. Commenti, macro e firme digitali non vengono conservati né verificati. Oggetti incorporati, risorse esterne del documento, formati di immagine non supportati e istruzioni di campo non supportate vengono rifiutati. I file danneggiati o illeggibili producono un errore senza rendere disponibile un download incompleto. Rinominare l’estensione non cambia il formato effettivo.

## Privacy e risorse del browser

La conversione avviene sul tuo dispositivo. La prima conversione scarica circa 90 MB di file del motore e dei caratteri, che il browser può memorizzare nella cache; il documento non viene mai caricato online. Il motore si carica solo dopo aver scelto un file. È necessario un browser aggiornato che supporti WebAssembly e la memoria condivisa. I documenti grandi o complessi possono richiedere tempo e memoria. Puoi annullare la conversione, chiudere o sostituire il file. Non ci sono limiti fissi alla dimensione dei file o al numero di pagine.
