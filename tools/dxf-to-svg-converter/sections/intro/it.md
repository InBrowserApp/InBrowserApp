## Convertire un disegno DXF in SVG

Seleziona **Apri file DXF** o trascina un disegno `.dxf` in formato ASCII. Seleziona **Prova un esempio** per caricare una staffa con profilo, fori, linee d’asse e annotazioni. Lo strumento legge il disegno nel browser e mostra un’anteprima vettoriale. Seleziona **Scarica SVG** per salvare la geometria selezionata dello spazio modello in un file SVG autonomo.

## Scegliere i layer da esportare

In **Layer**, seleziona i layer che vuoi esportare. L’anteprima si aggiorna quando includi o escludi un layer. Ad esempio, esporta il contorno e i fori per un’illustrazione o includi le linee d’asse e le annotazioni per una vista annotata. Il file SVG mantiene i layer selezionati come gruppi vettoriali separati.

## Conservare la scala del disegno

Se il DXF specifica un’unità di lunghezza, come millimetri o pollici, il file SVG registra le dimensioni fisiche in millimetri. La geometria mantiene la scala originale nel file. Per i disegni DXF senza unità di misura, l’attributo `viewBox` dell’SVG usa le coordinate del disegno. L’anteprima si adatta allo spazio disponibile sullo schermo. [Variabili di intestazione DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Esportare la geometria dello spazio modello

Il convertitore esporta le linee, polilinee, archi, cerchi, blocchi e testi supportati. Le curve sono disegnate con segmenti vettoriali, mentre i testi supportati diventano contorni vettoriali ottenuti dai caratteri disponibili. Prima di salvare il DXF, esplodi le serie rettangolari di blocchi in singoli riferimenti di blocco nel programma CAD. Per i layout, sposta la geometria nello spazio modello prima di esportare il DXF. Per esaminare il disegno, sposta la vista, regola lo zoom e mostra o nascondi i layer nel [Visualizzatore DXF](../dxf-viewer/).
