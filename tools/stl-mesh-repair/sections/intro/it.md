## Riparare un file STL online

Seleziona **Apri file** o trascina un file `.stl` ASCII o binario nello strumento. La riparazione avviene sul tuo dispositivo. Seleziona **Prova un esempio** per vedere una piccola mesh con facce duplicate, con area nulla e invertite. Confronta i risultati e scegli **Scarica STL** per salvare un nuovo file con le dimensioni e le coordinate originali. Il file scaricato è in formato ASCII se il formato STL binario comporterebbe un arrotondamento delle coordinate originali.

## Cosa cambia con la riparazione della mesh

Lo strumento rimuove i triangoli esattamente uguali e quelli con area nulla. Confronta l’orientamento delle facce adiacenti e lo corregge quando uno dei due orientamenti coerenti richiede di invertire meno facce dell’altro. I punti della mesh restano nelle posizioni originali. I contorni aperti, gli orientamenti ambigui e i collegamenti non manifold possono richiedere una riparazione manuale. Lo strumento lascia invariati i fori, i punti quasi coincidenti e le intersezioni. [Problemi comuni delle mesh per la stampa 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Confrontare la topologia prima e dopo la riparazione

Controlla il numero di triangoli, facce duplicate e facce degeneri. Il rapporto mostra anche gli spigoli con orientamento incoerente, i contorni aperti e gli spigoli e vertici non manifold ancora presenti. Apri il file scaricato nel [Visualizzatore STL](../stl-viewer/) per esaminarlo in 3D. Per controllare l’area superficiale o il volume racchiuso, usa lo strumento di [Verifica del volume e della topologia della mesh](../mesh-inspector/). Il rapporto di analisi di un file STL offre **Ripara STL** quando rileva facce duplicate o degeneri oppure orientamenti incoerenti.
