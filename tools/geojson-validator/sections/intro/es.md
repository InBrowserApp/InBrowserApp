## Cómo comprobar un archivo GeoJSON

Abre un archivo .geojson o .json, o pega un documento GeoJSON y selecciona **Validar GeoJSON**. Usa **Probar un ejemplo** para ver una FeatureCollection válida. Puedes editar el contenido y volver a validarlo. Los archivos y el texto pegado se quedan en tu navegador.

## Qué comprueba el validador

La herramienta comprueba primero la sintaxis JSON y después la estructura de GeoJSON, incluidos los objetos FeatureCollection, Feature y GeometryCollection y los tipos de geometría individuales. Las posiciones usan WGS 84 con la longitud antes de la latitud. El validador comprueba los intervalos de coordenadas, el número mínimo de posiciones en líneas y anillos, el cierre de los anillos, las propiedades de las entidades y la estructura de los cuadros delimitadores. Las colecciones de entidades vacías y las entidades con geometría null son válidas.

## Encontrar y corregir un error

Una ruta de error como `$.features[0].geometry.coordinates` señala las coordenadas de la primera entidad. Corrige el campo indicado y vuelve a validar el documento. El resultado describe la estructura del archivo. Las propiedades topológicas, como las autointersecciones o los solapamientos, se comprueban por separado en un SIG. Para examinar visualmente el resultado válido, ábrelo en el [Visor de GeoJSON](../geojson-viewer/).
