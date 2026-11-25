## Aprire un modello GLB o glTF online

Seleziona **Apri file** o trascina il modello nel visualizzatore. Un file `.glb` racchiude una scena glTF in un contenitore binario e spesso include geometria e texture in un unico file. Un file `.gltf` descrive la scena in JSON e può fare riferimento a file associati. Ad esempio, se l’esportazione contiene `model.bin` e `albedo.png`, selezionali insieme a `model.gltf`. Il visualizzatore legge i file sul tuo dispositivo.

## Esaminare i materiali e riprodurre le animazioni

Trascina per ruotare, usa la rotellina o il gesto di pizzicamento per lo zoom e scegli **Adatta alla vista** per inquadrare di nuovo l’intera scena. Attiva **Wireframe** per vedere i triangoli sotto i materiali. Se il file contiene animazioni, scegli una clip e seleziona **Riproduci animazione**. Seleziona **Prova un esempio** per aprire un modello animato.

## Aprire un modello con risorse mancanti

Se il modello fa riferimento a un buffer o a un’immagine esterni, selezionalo insieme ai file corrispondenti. Mantieni i nomi originali. Se il modello usa un’estensione per la compressione delle texture che il visualizzatore non supporta, esportalo di nuovo con texture PNG o JPEG. La [specifica glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) descrive nel dettaglio i due contenitori.

## Aprire altri formati 3D

Usa il [Visualizzatore OBJ](../obj-viewer/) per le mesh Wavefront con materiali MTL o il [Visualizzatore STL](../stl-viewer/) per esaminare una mesh triangolare prima della stampa 3D.

- [Visualizzatore 3MF](../3mf-viewer/)
