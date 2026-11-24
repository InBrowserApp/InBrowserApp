## Come ingrandire un’immagine con l’IA

1. Scegli o trascina un’immagine JPG, PNG o WebP. Usa la copia migliore che hai, anche se è piccola.
2. Seleziona **2×** o **4×** e controlla le dimensioni finali. Un’immagine da 400 × 300 diventa da 800 × 600 a 2× o da 1600 × 1200 a 4×.
3. Seleziona **Ingrandisci immagine**, poi sposta il cursore di confronto per esaminare i contorni e le texture. Scarica il risultato come PNG senza perdita di qualità.

## Cos’è la super-risoluzione delle immagini con l’IA?

La super-risoluzione aumenta le dimensioni in pixel di un’immagine a bassa risoluzione. InBrowser.App usa Real-ESRGAN, un modello addestrato a stimare contorni più definiti e texture più fini a partire dai pixel disponibili. Può rendere più nitide foto piccole, illustrazioni e immagini web compresse quando vengono ingrandite. Controlla i volti, i caratteri piccoli e le trame fini nell’anteprima. I dettagli aggiunti sono stime e possono differire dalla scena originale.

## Quando scegliere 2× o 4×?

Scegli 2× per un ingrandimento moderato, ad esempio per inserire una miniatura in un layout più grande. Scegli 4× quando l’immagine deve occupare molto più spazio, ad esempio per mostrare una piccola scansione a dimensioni maggiori. Raddoppiando entrambi i lati si quadruplica il numero di pixel. Quadruplicandoli si ottengono sedici volte più pixel. L’immagine di partenza può avere fino a 2.048 pixel per lato e 1 megapixel in totale.

## L’immagine viene ingrandita sul mio dispositivo?

Sì. Il browser scarica il modello Real-ESRGAN quando avvii il primo ingrandimento. Elabora l’immagine sul tuo dispositivo usando WebGPU quando è disponibile e può usare la CPU tramite WebAssembly. Il primo ingrandimento può richiedere più tempo. La durata dipende dalle dimensioni dell’immagine e dal dispositivo. L’immagine rimane sul tuo dispositivo per tutto il processo.
