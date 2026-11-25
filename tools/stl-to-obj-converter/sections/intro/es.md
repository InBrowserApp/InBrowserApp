## Convertir un archivo STL a Wavefront OBJ

Pulsa **Abrir archivo** o suelta un archivo `.stl` en el conversor. El navegador lee archivos STL ASCII y binarios y genera un `.obj` para descargar. Pulsa **Probar un ejemplo** para convertir primero un pequeño soporte de montaje. Después, pulsa **Descargar OBJ** para guardarlo.

## Comprobar qué contiene el OBJ

El conversor guarda los triángulos de la superficie original en un archivo Wavefront OBJ. Conserva los ejes de coordenadas y la escala de la malla. El formato STL carece de una unidad estándar. Si una arista mide 40 unidades en el original, seguirá midiendo 40 unidades de coordenadas en el OBJ. Selecciona la unidad correcta al importarlo en otro programa.

La descarga contiene la geometría de la malla. Los archivos STL estándar describen la superficie de la pieza, por lo que el OBJ generado se entrega sin biblioteca de materiales ni texturas.

## Ver el resultado o convertir en sentido contrario

Abre el archivo descargado en el [Visor de OBJ](../obj-viewer/) para revisar el resultado. Usa el [Visor de STL](../stl-viewer/) para abrir el archivo original o el [Conversor de OBJ a STL](../obj-to-stl-converter/) para convertir en sentido contrario.
