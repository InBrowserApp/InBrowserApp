Un visor de archivos comprimidos te permite inspeccionar un archivo comprimido antes de extraerlo. Esta herramienta abre archivos ZIP, TAR, GZ, TGZ y TAR.GZ directamente en el navegador para que puedas confirmar qué hay dentro, explorar carpetas, previsualizar archivos legibles y descargar solo la entrada que necesitas.

## Cuándo usarlo

Úsalo cuando recibas un paquete comprimido y quieras verlo rápidamente sin desempaquetar todo el archivo. Es útil para revisar paquetes de versión, plantillas descargadas, paquetes de registros, instantáneas de código fuente o un adjunto `.gz` de un solo archivo.

## Privacidad y manejo de archivos

El contenido del archivo comprimido se lee localmente en tu sesión del navegador. El archivo no se sube a InBrowser.App. Las entradas de texto grandes se limitan en la vista previa para mantener la página ágil; descarga la entrada cuando necesites inspeccionar el archivo completo.

## Formatos de archivo compatibles

El visor admite archivos ZIP estándar, archivos TAR sin comprimir, archivos únicos comprimidos con GZIP y archivos TAR envueltos en GZIP (`.tgz` o `.tar.gz`). Los archivos protegidos con contraseña o cifrados no son compatibles en esta primera pasada de la reescritura.

## Comportamiento de la vista previa

Los archivos similares a texto, como JSON, Markdown, registros, código fuente, CSV, XML, YAML y TOML, se pueden previsualizar con resaltado de sintaxis cuando haya un lenguaje coincidente disponible. Los archivos de imagen comunes se pueden previsualizar visualmente, y los documentos PDF se abren en el visor PDF integrado del navegador cuando está disponible. Otros archivos binarios permanecen disponibles para descargar, pero la herramienta no intentará renderizarlos.
