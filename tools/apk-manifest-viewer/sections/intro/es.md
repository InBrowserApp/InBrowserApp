## Abrir un APK y leer su manifiesto

Arrastra un archivo `.apk` de Android o elige **Abrir APK o manifiesto**. El visor abre el `AndroidManifest.xml` que contiene el APK, incluso si está compilado en el formato XML binario habitual. También puedes abrir un manifiesto que ya hayas extraído, tanto en formato binario como en texto. Prueba el APK de ejemplo para explorar el resumen y el XML decodificado. Tus archivos permanecen en tu navegador.

## Entender el paquete, la versión y los niveles de SDK

El **Nombre del paquete** identifica la aplicación de Android. El nombre de la versión es la etiqueta que ven los usuarios. El código de versión es el número que Android usa para ordenar las actualizaciones. El SDK mínimo indica el nivel de API de Android más antiguo que declara el manifiesto y el SDK objetivo indica el nivel al que se dirige la aplicación. Los campos omitidos en el manifiesto aparecen como no especificados.

## Consultar permisos y exportar AndroidManifest.xml

El resumen muestra los nombres de los permisos que declara el paquete. Android determina qué permisos se conceden en el dispositivo según la versión del sistema, la configuración de la aplicación y las elecciones del usuario. Abre **XML del manifiesto** para consultar los componentes, los filtros de intents y las declaraciones de permisos condicionales. Usa **Copiar XML** o **Descargar XML** para conservar el archivo decodificado. Las referencias a recursos compilados pueden aparecer como identificadores, por ejemplo `@0x7f010001`.

[Estructura y elementos del manifiesto de Android](https://developer.android.com/guide/topics/manifest/manifest-intro)
