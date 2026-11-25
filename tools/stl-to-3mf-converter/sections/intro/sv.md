## Konvertera en STL-fil till 3MF

Välj **Måttenhet för STL-koordinater** och sedan **Öppna fil** eller dra en `.stl`-fil till konverteraren. Både STL-filer i ASCII-format och binära STL-filer kan öppnas. Välj **Prova ett exempel** för att konvertera ett monteringsbeslag och **Ladda ner 3MF** för att spara modellen. När du byter måttenhet konverteras den aktuella filen på nytt.

## Välj rätt storlek för slicerprogrammet

STL lagrar koordinater utan måttenhet. Välj den måttenhet som användes i källfilen. En del som är 2 STL-koordinatenheter bred är till exempel 2 tum bred om du väljer tum, eller 2 millimeter bred om du väljer millimeter. 3MF sparar måttenheten uttryckligen, så att ett kompatibelt slicerprogram kan läsa modellen i avsedd storlek.

## Granska 3MF-modellen eller konvertera tillbaka

3MF-filen innehåller de ursprungliga trianglarna. Om nätet bildar en sluten volym med konsekvent orienterade ytor sparar konverteraren det som en solidmodell. Öppna eller inkonsekventa nät sparas som ytor. Material och utskriftsinställningar hanteras i ditt slicerprogram. Kontrollera måtten i [3MF-visaren](../3mf-viewer/) eller granska originalet i [STL-visaren](../stl-viewer/). Använd [Kontrollera nätets volym och topologi](../mesh-inspector/) om nätet har öppningar eller andra topologiproblem. Använd [3MF till STL-konverteraren](../3mf-to-stl-converter/) för att konvertera i motsatt riktning. [Om 3MF-formatet](https://3mf.io/resources/faq/)
