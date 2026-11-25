## Convertir un archivo Wavefront OBJ a STL

Pulsa **Abrir archivo** o suelta un archivo `.obj` en el conversor. Pulsa **Probar un ejemplo** para convertir primero un pequeño soporte de montaje. La herramienta divide las caras poligonales en triángulos. Luego puedes pulsar **Descargar STL** para guardar un archivo `.stl` binario. La conversión se realiza en tu dispositivo.

## Qué cambia al exportar a STL

El STL almacena una superficie triangular. La conversión descarta los materiales, las imágenes de textura, las coordenadas UV y las líneas y puntos independientes. Los ejes y las coordenadas se conservan. Elige la unidad correcta en tu laminador antes de imprimir. Por ejemplo, una longitud de 40 unidades de coordenadas en el OBJ sigue midiendo 40 en el STL.

Una malla con agujeros u otros problemas geométricos puede convertirse correctamente. Revisa el resultado en tu laminador antes de imprimir.

## Ver el resultado o convertir en sentido contrario

Usa el [Visor de STL](../stl-viewer/) para abrir el archivo descargado o el [Visor de OBJ](../obj-viewer/) para inspeccionar el original con los materiales que añadas. Usa el [Conversor de STL a OBJ](../stl-to-obj-converter/) para convertir en sentido contrario.
