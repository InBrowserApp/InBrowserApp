## Come convertire un notebook Jupyter in PDF

Apri o trascina un file `.ipynb` salvato da Jupyter, Google Colab o VS Code. Controlla l’anteprima, scegli A4 o US Letter e seleziona **Salva come PDF**. Nella finestra di stampa del browser, scegli **Salva come PDF** come destinazione. Nella stessa finestra puoi anche scegliere una stampante. Ad esempio, `analysis.ipynb` diventa un PDF da allegare a un’e-mail o consegnare con una relazione.

## Cosa contiene il PDF

Il PDF rispetta l’ordine delle celle del notebook. Include titoli e tabelle Markdown, codice sorgente e output salvati supportati, come testo della console, tabelle e immagini di grafici incorporate. Le righe di codice lunghe vanno a capo per adattarsi alla pagina. Le celle lunghe possono continuare nella pagina successiva e il testo rimane selezionabile nel browser.

Per ottenere i risultati più recenti, salva il notebook con i suoi output prima della conversione. Il convertitore legge il file salvato localmente e non esegue le celle. Per apparire, i widget richiedono una rappresentazione statica salvata. Il codice sorgente LaTeX rimane testo e le immagini remote e altre risorse esterne non vengono caricate.

## Altri modi per usare il notebook

Usa il [visualizzatore Jupyter Notebook](../notebook-viewer/) per leggere in modo interattivo celle e output salvati. Usa il [convertitore Jupyter Notebook](../notebook-export/) se ti servono HTML, Markdown o uno script di codice.
