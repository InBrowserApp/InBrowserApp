## Convertire un file Wavefront OBJ in STL

Seleziona **Apri file** o trascina un file `.obj` nel convertitore. Seleziona **Prova un esempio** per convertire una piccola staffa di montaggio. Lo strumento suddivide le facce poligonali in triangoli. Seleziona **Scarica STL** per salvare il file `.stl` binario. La conversione avviene sul tuo dispositivo.

## Cosa cambia con l’esportazione in STL

Il formato STL memorizza una superficie triangolare. La conversione esclude materiali, immagini delle texture, coordinate UV, linee e punti isolati. Le coordinate e gli assi originali restano invariati. Prima di stampare, scegli l’unità di misura prevista nello slicer. Per esempio, una lunghezza di 40 unità di coordinate nell’OBJ rimane di 40 unità nello STL.

La conversione può riuscire anche quando la mesh presenta fori o altri problemi geometrici. Controlla il risultato nello slicer prima della stampa.

## Visualizzare il risultato o eseguire la conversione inversa

Usa il [Visualizzatore STL](../stl-viewer/) per aprire il file scaricato o il [Visualizzatore OBJ](../obj-viewer/) per esaminare l’originale con gli eventuali materiali che selezioni. Usa il [Convertitore da STL a OBJ](../stl-to-obj-converter/) per la conversione inversa.
