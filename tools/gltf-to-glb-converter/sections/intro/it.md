## Convertire un modello glTF in un unico file GLB

Seleziona **Apri file** per scegliere insieme il modello `.gltf`, i suoi buffer `.bin` e le sue texture. Se le texture si trovano in sottocartelle, usa **Apri cartella** per consentire al convertitore di seguire i percorsi del modello. Puoi anche aprire file glTF con dati già incorporati. Seleziona **Prova un esempio** per convertire una piramide animata, poi scegli **Scarica GLB**. I file vengono elaborati nel browser.

## Aggiungere un buffer o una texture mancante

Un file JSON `.gltf` può fare riferimento a risorse come `model.bin` o `textures/albedo.png`. Il convertitore elenca i percorsi mancanti. Seleziona **Aggiungi file** per fornire le risorse mancanti mantenendo aperto il modello. Conserva i nomi originali dei file. Se più cartelle contengono file con lo stesso nome, seleziona la cartella che contiene il modello e i file a cui fa riferimento, così il convertitore può distinguerne i percorsi.

## Condividere ed esaminare il GLB

Il file GLB incorpora la geometria, le texture supportate e gli altri dati standard a cui fa riferimento il modello. Le mesh, i materiali e le clip di animazione vengono conservati. La conversione mantiene la codifica originale delle texture e la compressione delle mesh. Il programma di destinazione deve quindi supportare questi formati. Le texture PNG e JPEG sono compatibili con la maggior parte dei programmi glTF. Apri il solo file scaricato nel [Visualizzatore GLB / glTF](../gltf-viewer/) per esaminarne dimensioni, materiali e animazione. [Formato di file glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
