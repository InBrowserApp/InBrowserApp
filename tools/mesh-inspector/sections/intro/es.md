## Comprobar una malla STL u OBJ en línea

Pulsa **Abrir archivo** o suelta un modelo `.stl` u `.obj` en el comprobador. La herramienta lee la malla en tu dispositivo y muestra el área superficial, el volumen encerrado y los problemas de topología. Pulsa **Probar un ejemplo** para comprobar un soporte de montaje con malla cerrada antes de inspeccionar tu archivo.

## Interpretar el área superficial y el volumen

Las coordenadas de un STL o un OBJ no indican una unidad física común. En **Unidad de coordenadas**, selecciona la unidad que usaste al exportar el modelo. El área se expresa en unidades cuadradas y el volumen en unidades cúbicas. La opción asigna una unidad a las coordenadas guardadas y conserva su escala. El soporte del ejemplo tiene un volumen de 16 016 mm³ cuando sus coordenadas están en milímetros.

Si la malla supera las comprobaciones de topología, la herramienta calcula el volumen a partir de la orientación de las caras. Las superficies que se cortan a sí mismas y los componentes con una orientación incorrecta o que se solapan pueden afectar a la estimación. Si el resultado es importante, compáralo con el modelo sólido original.

## Interpretar los resultados de topología

- Una **arista de contorno** pertenece a un único triángulo. Estas aristas delimitan los bordes abiertos, incluidos los agujeros.
- Una **arista no manifold** pertenece a más de dos triángulos. En un **vértice no manifold** se juntan grupos de caras desconectados entre sí.
- Hay **orientación incoherente** cuando dos triángulos recorren en el mismo sentido la arista que comparten. Las caras vecinas orientadas correctamente recorren la arista en sentidos opuestos.
- Las **caras degeneradas** tienen área cero. Las **caras duplicadas** repiten el mismo triángulo.

La herramienta agrupa las posiciones exactamente iguales en un único vértice. Identifica los componentes de la malla a partir de las aristas que comparten sus triángulos. Si detecta un defecto de topología, muestra el área superficial y el recuento de problemas. Estos recuentos pueden ayudarte a identificar qué debes reparar antes de usar el volumen.

## Inspeccionar o convertir el modelo

Usa el [Visor de STL](../stl-viewer/) o el [Visor de OBJ](../obj-viewer/) para ver el modelo en 3D, incluida su malla alámbrica. Si el siguiente programa requiere un archivo STL, usa el [Conversor de OBJ a STL](../obj-to-stl-converter/).
