## Cómo convertir GPX a GeoJSON

Abre un archivo .gpx o pega el XML de GPX y selecciona **Convertir a GeoJSON**. Usa **Probar un ejemplo** para ver cómo aparecen un trayecto, una ruta y un punto de paso en el resultado. Copia el GeoJSON o descarga un archivo .geojson para tu proyecto cartográfico o SIG. La conversión se realiza en tu navegador y los datos se quedan en tu dispositivo.

## Cómo se convierten los trayectos, las rutas y los puntos de paso

El resultado es una FeatureCollection de GeoJSON. Los puntos de paso se convierten en puntos y las rutas en líneas. Si un trayecto tiene varios segmentos continuos, estos se mantienen separados. Un segmento o una ruta con una sola posición se convierte en un punto. Los campos descriptivos, como los nombres y las notas, se conservan en sus respectivas entidades.

## Coordenadas, elevación y hora

GeoJSON almacena primero la longitud y luego la latitud. Las líneas que cruzan el antimeridiano se dividen a 180° para representarlas en mapas del mundo. Si hay un valor de elevación, se añade como tercera coordenada en metros. Las horas de los puntos se guardan en las propiedades de cada entidad. En las rutas y los segmentos de trayecto se mantienen en el orden de las coordenadas para que puedan asociarse a sus posiciones. Puedes abrir el resultado en el [Visor de GeoJSON](../geojson-viewer/) o explorar el GPX original en el [Visor GPX con perfil de elevación](../gpx-viewer/).
