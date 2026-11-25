## Convertir un dibujo DXF a SVG

Pulsa **Abrir archivo DXF** o suelta un dibujo `.dxf` en formato ASCII. Pulsa **Probar un ejemplo** para cargar un soporte con su perfil, orificios, líneas de centro y etiquetas. La herramienta lee el dibujo en tu navegador y muestra una vista previa vectorial. Pulsa **Descargar SVG** para guardar la geometría seleccionada del espacio modelo en un archivo SVG independiente.

## Elegir las capas que se van a exportar

En **Capas**, selecciona las capas que quieras exportar. La vista previa se actualiza al incluir o excluir una capa. Por ejemplo, exporta el contorno y los orificios para una ilustración o incluye las líneas de centro y las etiquetas para obtener una vista anotada. El SVG conserva las capas seleccionadas como grupos vectoriales separados.

## Conservar la escala del dibujo

Si el DXF indica una unidad de longitud, como milímetros o pulgadas, el SVG guarda las dimensiones físicas en milímetros. La geometría conserva su escala original dentro del archivo. Los DXF sin unidad utilizan las coordenadas del dibujo en el atributo `viewBox` del SVG. La vista previa se ajusta al espacio disponible en pantalla. [Variables de cabecera de DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Exportar la geometría del espacio modelo

El conversor exporta las líneas, polilíneas, arcos, círculos, bloques y textos compatibles. Las curvas se dibujan con segmentos vectoriales, y los textos compatibles se convierten en contornos vectoriales con las fuentes disponibles. Si trabajas con una presentación, mueve la geometría al espacio modelo antes de exportar el DXF. Para inspeccionar el dibujo, desplaza la vista, usa el zoom y muestra u oculta capas en el [Visor de DXF](../dxf-viewer/).
