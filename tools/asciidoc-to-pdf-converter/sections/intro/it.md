## Converti un documento AsciiDoc in locale

Apri un documento locale `.adoc` o `.asciidoc`, esamina le pagine generate e scarica il PDF mostrato nell’anteprima. Il file PDF viene generato direttamente, senza bisogno della finestra di dialogo di stampa. Sono supportati i sorgenti UTF-8 e UTF-16 con indicatore BOM. Per leggere senza conversione, usa il [Visualizzatore AsciiDoc](../asciidoc-viewer/).

## Risultato di stampa e sorgenti supportati

Il documento viene riprodotto con un tema di stampa fisso su pagine A4 verticali con margini di 18 mm, poi acquisito come pagine di immagini a 150 DPI. Sono inclusi titoli, sezioni, paragrafi, elenchi, tabelle, codice, riquadri di avvertenza, richiami, note a piè di pagina, interruzioni di pagina esplicite e immagini raster incorporate supportati. Le tabelle larghe e il codice vengono reimpaginati in base alla larghezza della pagina. Il testo nel PDF non è selezionabile e non vengono aggiunti OCR né link interattivi. Caratteri, spaziatura e impaginazione possono differire da quelli di altri strumenti AsciiDoc. Controlla ogni pagina prima di fare affidamento sul risultato.

File inclusi, risorse mancanti per immagini e stili, immagini illeggibili, avvisi di analisi e attributi non risolti interrompono la conversione senza consentire un download parziale. Riunisci prima i contenuti sorgente necessari in un unico documento autonomo. Macro personalizzate, diagrammi, estensioni, temi di progetto e caratteri incorporati non sono supportati; la notazione non supportata può restare come testo. Script, moduli, app incorporate, SVG e MathML vengono omessi. I contenuti attivi nell’HTML passthrough vengono rimossi. I formati di pagina del sorgente vengono sostituiti dall’impaginazione A4 fissa.

## Privacy e risorse del browser

Il documento resta in questo browser. File sorgente, immagini e altre risorse non vengono mai recuperati dal computer o dalla rete e i contenuti dei file non vengono mai caricati. I dati raster incorporati vengono letti dal documento selezionato. I file di grandi dimensioni possono richiedere tempo e memoria perché ogni pagina viene riprodotta come immagine. Puoi annullare, chiudere o sostituire il documento. Non è previsto alcun limite fisso alle dimensioni del file o al numero di pagine; gli effettivi problemi di risorse del browser generano un errore quando possono essere rilevati.
