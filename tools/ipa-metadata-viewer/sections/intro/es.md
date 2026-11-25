## Abrir un IPA y leer los metadatos de la app principal

Arrastra un archivo `.ipa` de iOS o elige **Abrir archivo IPA**. El visor lee la lista de propiedades de la app principal en una ruta como `Payload/Trail Notes.app/Info.plist`. Prueba el IPA de ejemplo para ver los campos antes de abrir tu propio archivo. La extracción del archivo y la lectura de la lista de propiedades se realizan en tu navegador.

## Entender el ID de paquete, la versión y las plataformas

El ID de paquete, almacenado en `CFBundleIdentifier`, identifica el paquete de la app. La versión en `CFBundleShortVersionString` es la de lanzamiento y `CFBundleVersion` identifica la compilación. Consulta `MinimumOSVersion` y `CFBundleSupportedPlatforms` para conocer la versión mínima del sistema y los nombres de plataforma registrados en el paquete. El nombre visible proviene de `CFBundleDisplayName` o `CFBundleName`.

## Examinar y exportar Info.plist

Selecciona **Info.plist** para ver la lista de propiedades completa en XML legible, incluidas las claves que no aparecen en el resumen. El visor puede leer listas de propiedades binarias y XML. Elige **Copiar XML** para usar la versión legible en otra herramienta o **Descargar Info.plist** para guardar el archivo original sin cambios. La ruta que se muestra dentro del archivo indica de qué paquete de app proceden los metadatos.

[Referencia de Apple sobre las listas de propiedades de información](https://developer.apple.com/documentation/bundleresources/information-property-list)
