## Esporta un notebook Jupyter salvato

Apri un notebook IPYNB e scegli HTML, Markdown o codice. HTML e Markdown mantengono le celle nell’ordine salvato, inclusi gli output salvati supportati. Tutto resta nel tuo browser. Non vengono avviati kernel, codice o ambienti di esecuzione dei widget.

## Scegli un formato utile

HTML è una copia autonoma per la lettura, con testo selezionabile, immagini incluse supportate e tabelle leggibili. Markdown offre contenuti riutilizzabili; le tabelle possono contenere HTML sicuro e le immagini usano URL di dati incorporati, che alcune applicazioni Markdown non visualizzano. Il layout e la formattazione originali possono cambiare.

L’esportazione del codice mantiene le celle di codice in ordine e omette Markdown, celle di testo grezzo e output salvati. Se il linguaggio del notebook è riconosciuto, determina l’estensione dello script; per i linguaggi sconosciuti viene usato TXT. I comandi magic del notebook e la sintassi della shell restano come scritti, quindi il codice esportato potrebbe richiedere modifiche manuali o il kernel originale del notebook. Un notebook senza celle di codice produce un file di codice vuoto.

## Risultati salvati e compatibilità

Il convertitore legge il formato notebook 4. I risultati provengono dal file salvato e potrebbero non essere aggiornati. I contenuti avanzati non supportati e le immagini non disponibili vengono segnalati. Le risorse remote non vengono scaricate; script e widget non vengono eseguiti, audio e video non vengono riprodotti. LaTeX resta come testo sorgente e le celle di testo grezzo o di tipo sconosciuto appaiono come testo leggibile nelle esportazioni del documento.

Le risorse del browser determinano i limiti pratici; non c’è un limite fisso per la dimensione dei file o il numero di celle. Per esaminare il notebook originale, usa il [Visualizzatore di notebook Jupyter](/tools/notebook-viewer/).
