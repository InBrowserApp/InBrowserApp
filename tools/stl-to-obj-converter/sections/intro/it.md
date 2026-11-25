## Convertire un file STL in Wavefront OBJ

Seleziona **Apri file** o trascina un file `.stl` nel convertitore. Il programma legge file STL ASCII e binari e prepara un `.obj` da scaricare nel browser. Seleziona **Prova un esempio** per convertire una piccola staffa di montaggio, poi scegli **Scarica OBJ** per salvarla.

## Controllare il contenuto del file OBJ

La conversione scrive i triangoli della superficie originale in un file Wavefront OBJ. I vertici nella stessa posizione condividono lo stesso indice nell’OBJ, facilitando la modifica della mesh. Gli assi delle coordinate e la scala della mesh restano invariati. Il formato STL non definisce un’unità di misura standard. Se uno spigolo misura 40 unità nell’originale, misura ancora 40 unità di coordinate nell’OBJ. Seleziona l’unità prevista quando lo importi in un’altra applicazione.

Il file scaricato contiene la geometria della mesh. Il formato STL standard descrive la superficie, perciò l’OBJ generato non include una libreria di materiali o texture.

## Visualizzare il risultato o eseguire la conversione inversa

Apri il file scaricato nel [Visualizzatore OBJ](../obj-viewer/) per esaminare il risultato. Usa il [Visualizzatore STL](../stl-viewer/) per esaminare il file originale o il [Convertitore da OBJ a STL](../obj-to-stl-converter/) per la conversione inversa.
