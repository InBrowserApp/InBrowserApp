## Convertire un file STEP o STP in STL

Seleziona **Apri file** o trascina un file `.step` o `.stp` nel convertitore. Sul tuo dispositivo, lo strumento trasforma le superfici del modello CAD in triangoli e prepara un STL binario da scaricare. Seleziona **Prova un esempio** per convertire una staffa di montaggio, poi scegli **Scarica STL** per salvare il risultato.

## Conservare le dimensioni corrette per la stampa 3D

Il formato STEP include le dimensioni fisiche. Il convertitore esporta le coordinate in millimetri, compresa la posizione di ciascun componente dell’assieme. Il formato STL non specifica un’unità di misura. Seleziona i millimetri quando apri il risultato nello slicer. Per esempio, uno spigolo lungo un pollice nel modello STEP misura 25,4 unità di coordinate nel file STL.

## Controllare la mesh esportata

Il file STL contiene le superfici triangolate delle parti nella loro posizione nell’assieme. Conserva il file STEP per mantenere le superfici CAD modificabili, i nomi dei componenti e la struttura dell’assieme. Apri l’STL nel [Visualizzatore STL](../stl-viewer/) o usa lo strumento di [Verifica del volume e della topologia della mesh](../mesh-inspector/) per controllare il volume racchiuso e la topologia.

## Esaminare o esportare il modello originale

Usa il [Visualizzatore STEP](../step-viewer/) per controllare le dimensioni, ruotare il modello CAD e scegliere **Esporta STL** dalla barra degli strumenti. Se lo slicer importa file STEP, apri l’originale e scegli le impostazioni della mesh nello slicer. [Formati supportati da PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
