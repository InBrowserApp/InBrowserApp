## Convertir un archivo STEP o STP a STL

Pulsa **Abrir archivo** o suelta un archivo `.step` o `.stp` en el conversor. La herramienta convierte las superficies del modelo CAD en triángulos en tu dispositivo y prepara un archivo STL binario para descargar. Pulsa **Probar un ejemplo** para convertir un soporte de montaje y, después, **Descargar STL** para guardar el resultado.

## Conservar el tamaño correcto para la impresión 3D

STEP almacena dimensiones físicas. El conversor exporta las coordenadas en milímetros, incluida la posición de cada componente del ensamblaje. STL no indica la unidad de medida. Selecciona milímetros al abrir el resultado en el laminador. Por ejemplo, una arista que mide una pulgada en STEP mide 25,4 unidades de coordenadas en el STL.

## Comprobar la malla exportada

El STL contiene las superficies trianguladas de las piezas en sus posiciones dentro del ensamblaje. Usa el STEP para conservar las superficies CAD editables, los nombres de los componentes y la estructura del ensamblaje. Inspecciona el STL en el [Visor de STL](../stl-viewer/) o comprueba el volumen encerrado y la topología con el [Comprobador de volumen y topología de mallas](../mesh-inspector/).

## Inspeccionar o exportar el modelo original

Usa el [Visor de STEP](../step-viewer/) para comprobar dimensiones, girar el modelo CAD y usar **Exportar STL** en la barra de herramientas. Si tu laminador admite STEP, abre el original y elige los ajustes de mallado en el laminador. [Formatos compatibles con PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
