## Cómo abrir un Shapefile

Suelta en el visor un ZIP que contenga tu Shapefile de Esri. También puedes seleccionar el archivo .shp junto con sus archivos auxiliares. Si el ZIP contiene varios Shapefiles, usa **Capa** para cambiar de uno a otro. Selecciona **Probar un ejemplo** para explorar un conjunto de datos con una capa de puntos y otra de polígonos. Los archivos se leen en el navegador y se quedan en este dispositivo.

## ¿Qué archivos del Shapefile necesitas?

El archivo .shp contiene las geometrías y basta para previsualizar una capa con coordenadas geográficas. Incluye el .dbf para consultar los atributos, el .prj para identificar el sistema de referencia de coordenadas y el .cpg para la codificación del texto de los atributos, si está disponible. Mantén juntos los archivos de cada capa y usa el mismo nombre base. El índice .shx puede quedarse en el ZIP o en la selección.

## Explorar el mapa y los atributos

El mapa sin conexión se ajusta a la capa actual. Usa los controles del mapa para acercar, alejar o volver a ajustar la vista. Selecciona una geometría en el mapa o en la lista **Entidades** para ver sus atributos. Un archivo .prj compatible permite transformar las coordenadas proyectadas para mostrarlas en el mapa. Sin ese archivo, las coordenadas que estén dentro del intervalo de longitud y latitud se interpretan como WGS 84. Si una capa necesita una proyección, vuelve a abrirla con su .prj para ubicarla correctamente.
