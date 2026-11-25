## Come controllare un file GeoJSON

Apri un file .geojson o .json oppure incolla un documento GeoJSON e scegli **Convalida GeoJSON**. Seleziona **Prova un esempio** per vedere una FeatureCollection valida. Puoi modificare il contenuto e convalidarlo di nuovo. I file e il testo incollato restano nel browser.

## Cosa controlla il validatore

Lo strumento controlla prima la sintassi JSON e poi la struttura GeoJSON, compresi gli oggetti FeatureCollection, Feature e GeometryCollection e i singoli tipi di geometria. Le posizioni usano WGS 84 con la longitudine prima della latitudine. Il validatore verifica gli intervalli delle coordinate, il numero minimo di posizioni per linee e anelli, la chiusura degli anelli, le proprietà degli elementi geografici e la struttura dei riquadri di delimitazione. Le raccolte vuote e gli elementi con geometria null sono validi.

## Individuare e correggere un errore

Un percorso di errore come `$.features[0].geometry.coordinates` indica le coordinate del primo elemento. Correggi il campo indicato e ripeti la convalida. Il risultato descrive la struttura del file. Le proprietà topologiche, come le autointersezioni e le sovrapposizioni, si verificano a parte in un GIS. Per esaminare visivamente il risultato valido, aprilo nel [Visualizzatore GeoJSON](../geojson-viewer/).
