## Cómo abrir un GeoPackage

Elige o suelta un archivo .gpkg y usa **Capa o tabla** para seleccionar su contenido. Selecciona **Probar un ejemplo** para abrir un paquete con una capa de puntos y otra de polígonos. El GeoPackage se abre en tu dispositivo. Una vez cargada la página, el mapa sin conexión funciona sin solicitar teselas a un servicio en línea.

## Explorar capas vectoriales y sus atributos

El mapa se ajusta a la capa vectorial seleccionada. Haz clic en un punto, una línea o un polígono, o selecciónalo en la lista **Entidades** para consultar sus atributos. Si la capa indica un sistema de referencia de coordenadas compatible, el visor ubica las entidades en WGS 84. También puedes seleccionar una tabla no espacial y consultar sus registros uno por uno. La vista previa muestra hasta 500 registros por capa para que el mapa responda con fluidez incluso con archivos grandes.

## Qué contiene un GeoPackage

GeoPackage es un formato del OGC que permite guardar datos espaciales en un solo archivo SQLite. Un paquete puede contener varias capas vectoriales, tablas de atributos y tablas de teselas. Las entradas con teselas se incluyen en la lista de capas. Elige una capa vectorial para ver sus geometrías en el mapa. Si tienes un Shapefile de Esri con archivos auxiliares separados, usa el [Visor de Shapefile](../shapefile-viewer/).
