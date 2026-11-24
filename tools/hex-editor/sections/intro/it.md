## Visualizzare e modificare un file binario online

Apri o trascina un file locale nell’editor esadecimale, oppure scegli **Prova un esempio** per vedere come sono disposti i byte. Puoi esaminare l’intestazione di un file, controllare un numero magico come `89 50 4E 47` in un PNG, analizzare byte non stampabili o correggere un valore noto in una posizione precisa.

## Leggere gli offset, i byte esadecimali e l’ASCII

L’offset a sinistra indica la posizione del primo byte della riga, contando da zero. Al centro ogni byte è rappresentato da due cifre esadecimali, da `00` a `FF`. La colonna ASCII mostra i caratteri stampabili corrispondenti e usa un punto per gli altri valori. Ad esempio, i byte `48 65 6C 6C 6F` appaiono come `Hello`.

Inserisci un offset esadecimale come `1A` o `0x1A` per andare direttamente al byte in posizione 26. Usa i pulsanti di navigazione per esplorare i byte vicini. L’editor legge una pagina alla volta, così puoi esaminare anche solo una piccola porzione di un file di grandi dimensioni.

## Sovrascrivere i byte e salvare una copia

Seleziona un byte nella colonna esadecimale e digita due cifre. L’editor aggiorna il carattere ASCII corrispondente e passa al byte successivo. Usa i tasti freccia per spostarti tra i byte e **Annulla** o **Ripristina** per annullare o riapplicare una modifica. La sovrascrittura lascia invariati la dimensione del file e gli offset degli altri byte.

Scegli **Scarica una copia** per salvare il risultato. Il file originale resta invariato. La lettura e la modifica avvengono interamente nel browser.
