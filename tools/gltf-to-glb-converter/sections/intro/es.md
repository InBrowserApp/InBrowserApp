## Convertir un modelo glTF en un solo archivo GLB

Pulsa **Abrir archivos** para seleccionar el modelo `.gltf`, sus búferes `.bin` y sus texturas a la vez. Si las texturas están en subcarpetas, pulsa **Abrir carpeta** para que el conversor pueda seguir las rutas del modelo. También admite archivos glTF con datos ya integrados. Pulsa **Probar un ejemplo** para empaquetar una pirámide animada y, después, **Descargar GLB**. Los archivos se procesan en tu navegador.

## Añadir un búfer o una textura que falta

Un archivo JSON `.gltf` puede hacer referencia a recursos como `model.bin` o `textures/albedo.png`. El conversor muestra las rutas que faltan. Pulsa **Añadir archivos** para seleccionar los recursos que faltan sin cerrar el modelo. Conserva los nombres originales. Si hay archivos con el mismo nombre en carpetas distintas, selecciona la carpeta que contiene el modelo y los archivos a los que hace referencia para conservar sus rutas.

## Compartir e inspeccionar el GLB

El GLB integra la geometría, las texturas compatibles y otros datos estándar a los que hace referencia el modelo. Conserva las mallas, los materiales y los clips de animación. El empaquetado mantiene la codificación original de las texturas y la compresión de las mallas. El programa de destino debe admitir esos formatos. Las texturas PNG y JPEG son compatibles con más programas glTF. Abre solo el archivo descargado en el [Visor de GLB / glTF](../gltf-viewer/) para inspeccionar sus dimensiones, materiales y animaciones. [Formato de archivo glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
