## Convertir un archivo STL a 3MF

Selecciona la **Unidad de las coordenadas STL** y pulsa **Abrir archivo** o suelta un `.stl` en el conversor. Se admiten archivos STL ASCII y binarios. Pulsa **Probar un ejemplo** para convertir un soporte de montaje y **Descargar 3MF** para guardar el modelo. Si cambias la unidad, se vuelve a convertir el archivo actual.

## Elegir el tamaño correcto para el laminador

El formato STL guarda las coordenadas sin indicar una unidad de medida. Elige la unidad usada al crear el archivo de origen. Por ejemplo, una pieza que mide 2 unidades de coordenadas STL tendrá 2 pulgadas de ancho si eliges pulgadas, o 2 milímetros si eliges milímetros. El 3MF guarda esa escala de forma explícita para que un laminador compatible lea el modelo con las dimensiones correctas.

## Revisar el modelo 3MF o convertir en sentido contrario

El 3MF conserva los triángulos originales. El conversor registra un sólido si todos los componentes de la malla están cerrados y sus caras se orientan de forma coherente hacia el exterior. Si la malla está abierta, presenta incoherencias o contiene componentes orientados hacia dentro, incluidas las paredes de cavidades cerradas, se registra como superficie y conserva los triángulos originales. Usa tu laminador para configurar los materiales y los ajustes de impresión. Abre el resultado en el [Visor de 3MF](../3mf-viewer/) para comprobar las dimensiones o inspecciona el original en el [Visor de STL](../stl-viewer/). Usa el [Comprobador de volumen y topología de mallas](../mesh-inspector/) si la malla de origen tiene aberturas u otros problemas de topología. Para la conversión inversa, usa el [Conversor de 3MF a STL](../3mf-to-stl-converter/). [Acerca del formato 3MF](https://3mf.io/resources/faq/)
