## Verificare una mesh STL o OBJ online

Seleziona **Apri file** o trascina un modello `.stl` o `.obj` nello strumento. Il modello viene letto sul tuo dispositivo. I risultati mostrano l’area superficiale, il volume racchiuso e i problemi di topologia. Seleziona **Prova un esempio** per verificare una staffa di montaggio con mesh chiusa prima di aprire il tuo file.

## Leggere l’area superficiale e il volume

Le coordinate STL e OBJ non definiscono un’unità fisica comune. In **Unità delle coordinate**, scegli l’unità usata per esportare il modello. L’area è espressa in unità quadrate e il volume in unità cubiche. La scelta dell’unità aggiunge un’etichetta ai valori memorizzati e ne conserva la scala. La staffa di esempio ha un volume di 16.016 mm³ se le sue coordinate sono in millimetri.

L’area superficiale è la somma delle aree dei triangoli del file, comprese tutte le copie delle facce duplicate. Se la mesh supera le verifiche di topologia, lo strumento calcola il volume dall’orientamento delle facce. Le superfici che si intersecano con sé stesse, le componenti orientate in modo errato e quelle sovrapposte possono alterare la stima. Se il risultato è importante, confrontalo con il modello solido originale.

## Interpretare i risultati delle verifiche di topologia

- Uno **spigolo di bordo** appartiene a un solo triangolo. Questi spigoli delimitano i contorni aperti, ad esempio quelli dei fori.
- Uno **spigolo non manifold** appartiene a più di due triangoli. Un **vertice non manifold** è l’estremità di uno di questi spigoli o il punto d’incontro di gruppi di facce scollegati tra loro.
- L’**orientamento è incoerente** quando due triangoli percorrono lo spigolo in comune nella stessa direzione. Due facce adiacenti orientate correttamente lo percorrono in direzioni opposte.
- Le **facce degeneri** hanno area nulla. Le **facce duplicate** ripetono lo stesso triangolo.

Lo strumento conta le posizioni esattamente coincidenti come un unico vertice. Individua le componenti della mesh in base agli spigoli condivisi dai triangoli. Quando rileva un difetto di topologia, mostra comunque l’area superficiale e il conteggio dei problemi. Questi valori possono aiutarti a capire cosa correggere prima di usare il volume.

## Ispezionare o convertire il modello

Usa il [Visualizzatore STL](../stl-viewer/) o il [Visualizzatore OBJ](../obj-viewer/) per esaminare il modello in 3D, anche in modalità wireframe. Se il prossimo strumento richiede un file STL, usa il [Convertitore da OBJ a STL](../obj-to-stl-converter/).

Se il rapporto di un STL mostra problemi di topologia, scegli **Ripara STL** per lavorare sullo stesso file. Lo strumento di [Riparazione mesh STL](../stl-mesh-repair/) confronta anche le facce duplicate o con area nulla, l’orientamento delle facce e i problemi di topologia rimanenti prima di scaricare un nuovo STL.
