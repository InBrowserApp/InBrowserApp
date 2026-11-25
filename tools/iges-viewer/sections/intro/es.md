## Abrir un archivo IGS o IGES en línea

Pulsa **Abrir archivos** o suelta un modelo CAD `.igs` o `.iges` en el visor. Ambas extensiones corresponden al formato de intercambio IGES. Pulsa **Probar un ejemplo** para explorar una pieza escalonada. El visor lee el archivo en tu dispositivo.

## Inspeccionar las superficies del modelo en 3D

Arrastra para girar, usa la rueda del ratón o el gesto de pinza para acercar o alejar, y arrastra con el botón derecho o con dos dedos para desplazar la vista. Pulsa **Ajustar a la vista** para encuadrar el modelo, **Malla alámbrica** para ver los triángulos de la representación o **Abrir en pantalla completa** para disponer de más espacio. El visor convierte las superficies IGES compatibles en una malla triangular y muestra los colores que puede leer del archivo. Si el archivo IGES solo contiene curvas, exporta también las superficies desde tu programa CAD. [Importador IGES de OpenCascade](https://github.com/kovacsv/occt-import-js)

## Medir distancias y cambiar la unidad

**Dimensiones totales** indica la extensión del modelo en los ejes X, Y y Z. En **Unidad de medida** puedes elegir milímetros, metros o pulgadas. Pulsa **Medir** y selecciona dos puntos de las superficies visibles para obtener la distancia en línea recta. Las mediciones en superficies curvas son aproximadas porque se calculan sobre los triángulos de la representación. Comprueba las dimensiones críticas en el modelo CAD original.

## Guardar una imagen PNG o abrir otro formato CAD

Ajusta el ángulo y el zoom y pulsa **Guardar PNG** para capturar la vista actual y añadirla a una revisión del dibujo o a una nota de fabricación. Abre las versiones STEP o STP de piezas y ensamblajes CAD en el [Visor de STEP](../step-viewer/).
