## Converti AsciiDoc in locale

Apri un file locale `.adoc` o `.asciidoc`, esamina il documento riprodotto e scarica un file HTML UTF-8 autonomo. Il file si apre offline e mantiene il testo selezionabile. Per esaminare gli avvisi del sorgente o i file inclusi non disponibili prima della conversione, usa il [Visualizzatore AsciiDoc](../asciidoc-viewer/).

## Risultato e compatibilità

Titoli, elenchi, tabelle, blocchi di codice, note, citazioni, note a piè di pagina, link e immagini raster incorporate supportate vengono conservati con un tema di lettura fisso. I segnalibri interni e le note a piè di pagina restano nel documento; i link esterni si aprono solo quando li selezioni. Il codice e le tabelle larghi scorrono orizzontalmente. Lo zoom dell’anteprima non modifica il file scaricato. Caratteri e spaziatura possono differire da quelli di altri strumenti AsciiDoc.

Usa un sorgente autonomo in UTF-8 o in UTF-16 con indicatore BOM. I file inclusi e le risorse esterne per immagini e stili non vengono caricati. File inclusi non disponibili, avvisi di analisi, attributi non risolti e risorse mancanti o illeggibili interrompono l’esportazione senza consentire un download parziale. Le immagini incorporate, comprese le immagini di sfondo CSS, devono essere decodificate correttamente. Macro personalizzate, diagrammi, estensioni e caratteri incorporati non sono supportati. Script, moduli, app incorporate, SVG e MathML vengono omessi. La sintassi del sorgente non supportata può restare come testo normale.

## Privacy e risorse del browser

I file restano in questo browser. Le risorse mancanti non vengono mai recuperate dal tuo computer o da un sito web e il contenuto dei file non viene mai caricato su un server. L’HTML generato blocca gli script e il caricamento automatico di risorse esterne. Seguire un link esterno è un’azione separata che può contattare quel sito. Puoi annullare la conversione, chiudere o sostituire il documento sorgente. Non ci sono limiti fissi per le dimensioni dei file o il numero di pagine; i documenti di grandi dimensioni dipendono dalla memoria disponibile nel browser e gli errori dovuti alle risorse vengono segnalati quando rilevabili.
