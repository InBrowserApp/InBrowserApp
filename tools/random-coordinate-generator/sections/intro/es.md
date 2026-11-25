## Generar pares aleatorios de latitud y longitud

Elige **Todo el mundo** para generar coordenadas por todo el planeta, o **Cerca de un punto** para generarlas alrededor de un centro. Introduce la cantidad y selecciona **Generar**. Copia el lote o descarga un archivo de texto `UTF-8` con un par por línea. Puedes usar las coordenadas para colocar marcadores en mapas, probar campos de ubicación o crear datos geoespaciales de prueba.

## Generar coordenadas alrededor de un punto

Introduce la latitud y la longitud del centro y después el radio en kilómetros. Por ejemplo, introduce `37.774900` y `-122.419400` para situar el centro en San Francisco, con un radio de `25` km para obtener puntos cercanos. La latitud va de `-90` a `90` y la longitud de `-180` a `180`. Una latitud negativa indica una posición al sur del ecuador y una longitud negativa, al oeste del meridiano de Greenwich.

## Leer las coordenadas decimales

Cada línea contiene primero la latitud y después la longitud, separadas por una coma. Un par tiene este aspecto: `37.774900, -122.419400`. El resultado conserva seis decimales y un punto decimal en todos los idiomas de la página. Mantén el orden al pegarlo en otra herramienta y comprueba las etiquetas de sus campos por si espera primero la longitud.
