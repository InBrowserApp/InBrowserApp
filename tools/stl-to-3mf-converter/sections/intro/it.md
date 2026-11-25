## Convertire un file STL in 3MF

Scegli **Unità delle coordinate STL**, poi seleziona **Apri file** o trascina un `.stl` nel convertitore. Sono supportati i file STL ASCII e binari. Seleziona **Prova un esempio** per convertire una staffa di montaggio, poi scegli **Scarica 3MF** per salvare il modello. Se cambi l’unità di misura, il file corrente viene convertito di nuovo.

## Scegliere le dimensioni corrette per lo slicer

Il formato STL memorizza le coordinate senza specificarne l’unità. Scegli l’unità usata nel file di origine. Per esempio, un pezzo largo 2 unità di coordinate STL misura 2 pollici se scegli i pollici, o 2 millimetri se scegli i millimetri. Il file 3MF registra questa scala affinché uno slicer compatibile apra il modello con le dimensioni previste.

## Controllare il modello 3MF o eseguire la conversione inversa

Il file 3MF conserva i triangoli originali. Il convertitore registra un solido quando la mesh racchiude un volume e le facce hanno un orientamento coerente. Le mesh aperte o incoerenti vengono registrate come superfici. Usa lo slicer per impostare materiali e parametri di stampa. Apri il risultato nel [Visualizzatore 3MF](../3mf-viewer/) per controllare le dimensioni o esamina il file di origine con il [Visualizzatore STL](../stl-viewer/). Usa lo strumento di [Verifica del volume e della topologia della mesh](../mesh-inspector/) se la mesh di origine contiene aperture o altri difetti topologici. Per la conversione inversa, usa il [Convertitore da 3MF a STL](../3mf-to-stl-converter/). [Informazioni sul formato 3MF](https://3mf.io/resources/faq/)
