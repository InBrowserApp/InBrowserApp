## Come convertire da GPX a GeoJSON

Apri un file .gpx o incolla l’XML del GPX e seleziona **Converti in GeoJSON**. Usa **Prova un esempio** per vedere come appaiono nel risultato una traccia, un percorso e un waypoint. Copia il GeoJSON o scarica un file .geojson per il tuo progetto cartografico o GIS. La conversione avviene nel browser e i dati restano sul tuo dispositivo.

## Come vengono convertiti tracce, percorsi e waypoint

Il risultato è una FeatureCollection GeoJSON. I waypoint diventano punti e i percorsi diventano linee. Se una traccia è formata da più segmenti continui, questi rimangono separati. Un segmento o un percorso con una sola posizione diventa un punto. I campi descrittivi, come nomi e note, restano associati ai rispettivi elementi geografici.

## Coordinate, quota e orario

GeoJSON memorizza prima la longitudine e poi la latitudine. Le linee che attraversano l’antimeridiano vengono divise a 180° per la visualizzazione sulle mappe del mondo. Se disponibile, la quota viene aggiunta come terza coordinata in metri. Gli orari dei punti sono memorizzati nelle proprietà degli elementi. Lungo i percorsi e i segmenti di traccia, gli orari seguono l’ordine delle coordinate per poterli associare alle rispettive posizioni. Puoi aprire il risultato nel [Visualizzatore GeoJSON](../geojson-viewer/) o esplorare il GPX originale nel [Visualizzatore GPX con profilo altimetrico](../gpx-viewer/).
