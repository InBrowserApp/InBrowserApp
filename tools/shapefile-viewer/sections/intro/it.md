## Come aprire uno Shapefile

Trascina nel visualizzatore un archivio ZIP con il tuo Shapefile Esri. Puoi anche selezionare il file .shp e i file associati. Se lo ZIP contiene più Shapefile, usa **Layer** per passare dall’uno all’altro. Seleziona **Prova un esempio** per esplorare un set di dati con un layer di punti e uno di poligoni. I file vengono letti nel browser e restano su questo dispositivo.

## Quali file servono per aprire uno Shapefile?

Il file .shp contiene le geometrie ed è sufficiente per visualizzare un layer con coordinate geografiche. Includi il file .dbf corrispondente per gli attributi, il .prj per il sistema di riferimento delle coordinate e, se disponibile, il .cpg per la codifica del testo degli attributi. Tieni insieme i file dello stesso layer e verifica che abbiano lo stesso nome di base. Il file di indice .shx può rimanere nello ZIP o nella selezione.

## Esplorare la mappa e gli attributi

La mappa offline si adatta al layer corrente. Usa i comandi della mappa per modificare lo zoom o inquadrare nuovamente il layer. Seleziona una geometria sulla mappa o nell’elenco **Elementi geografici** per vederne gli attributi. Un file .prj supportato consente al visualizzatore di trasformare le coordinate proiettate per mostrarle sulla mappa. In assenza del file, le coordinate comprese negli intervalli di longitudine e latitudine sono interpretate come WGS 84. Se un layer richiede una proiezione, riaprilo insieme al suo file .prj per posizionarlo correttamente.
