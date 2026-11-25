## Reparar un archivo STL en línea

Pulsa **Abrir archivo** o suelta un `.stl` en formato ASCII o binario en la herramienta. La reparación se realiza en tu dispositivo. Pulsa **Probar un ejemplo** para ver una malla pequeña con caras duplicadas, de área cero e invertidas. Compara los resultados y pulsa **Descargar STL** para guardar un nuevo archivo binario con las dimensiones y coordenadas originales.

## Qué cambia al reparar la malla

La herramienta elimina los triángulos idénticos y los de área cero. Compara las orientaciones de las caras vecinas y las corrige si una de las dos orientaciones coherentes exige invertir menos caras que la otra. Los puntos de la malla conservan sus posiciones. Los contornos abiertos, las orientaciones ambiguas y las uniones no manifold pueden requerir reparación manual. La herramienta conserva los agujeros, los puntos casi coincidentes y las intersecciones. [Problemas comunes de las mallas para impresión 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Comparar la topología antes y después

Comprueba los recuentos de triángulos, caras duplicadas y caras degeneradas. El informe también muestra las aristas con orientación incoherente, los contornos abiertos y las aristas y vértices no manifold que quedan. Abre el archivo descargado en el [Visor de STL](../stl-viewer/) para inspeccionarlo en 3D. Para calcular el área superficial o el volumen encerrado, usa el [Comprobador de volumen y topología de mallas](../mesh-inspector/). También puedes pulsar **Reparar STL** directamente desde un informe de inspección que muestre problemas de topología.
