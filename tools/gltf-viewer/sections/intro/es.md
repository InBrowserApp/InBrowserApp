## Abrir un modelo GLB o glTF en línea

Pulsa **Abrir archivos** o suelta el modelo en el visor. Un archivo `.glb` guarda una escena glTF en un contenedor binario y suele incluir en el mismo archivo la geometría y las texturas. Un archivo `.gltf` describe la escena en JSON y puede hacer referencia a otros archivos. Si la exportación incluye `model.bin` y `albedo.png`, por ejemplo, selecciónalos junto con `model.gltf`. El visor lee los archivos en tu dispositivo.

## Inspeccionar los materiales y reproducir animaciones

Arrastra para girar, acerca o aleja con la rueda del ratón o el gesto de pinza y pulsa **Ajustar a la vista** para volver a ver la escena completa. Activa **Malla alámbrica** para ver los triángulos que hay debajo de los materiales. Si el archivo incluye animaciones, elige un clip y pulsa **Reproducir animación**. Usa **Probar un ejemplo** para abrir un modelo animado.

## Abrir un modelo cuando faltan recursos

Si el modelo hace referencia a un búfer o a una imagen externos, selecciónalo junto con los archivos correspondientes. Conserva los nombres originales. Si el modelo usa una extensión de compresión de texturas que el visor no admite, vuelve a exportarlo con texturas PNG o JPEG. Consulta la [especificación glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) para conocer los detalles de ambos contenedores.

## Ver otros formatos 3D

Usa el [Visor de OBJ](../obj-viewer/) para ver mallas Wavefront con materiales MTL o el [Visor de STL](../stl-viewer/) para inspeccionar una malla triangular antes de imprimirla en 3D.

- [Visor de 3MF](../3mf-viewer/)
