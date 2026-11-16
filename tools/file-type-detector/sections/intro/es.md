## Cómo funciona la detección del tipo de archivo

Esta herramienta lee hasta los primeros 64 KiB de un archivo local y comprueba
su firma binaria con [file-type](https://github.com/sindresorhus/file-type). El
resultado incluye el tipo MIME detectado, las extensiones esperadas y una vista
previa de los primeros 256 bytes en hexadecimal y ASCII. No se sube nada.

## Por qué una extensión puede no coincidir

Renombrar un archivo cambia su nombre, no su contenido. Un PNG llamado photo.jpg
sigue teniendo una firma PNG. Se aceptan variantes habituales como .jpg y .jpeg.
El MIME declarado por el navegador se muestra por separado porque suele basarse
en el nombre del archivo en lugar de inspeccionar los bytes.

## Límites de la detección

Las firmas son indicios, no pruebas de que un archivo sea válido o seguro. Es
posible que no se reconozcan formatos de texto como TXT, CSV y SVG. Una muestra
corta puede identificar ZIP u otro contenedor sin confirmar su subtipo, como un
documento de Office. La vista hexadecimal muestra el contenido del archivo sin
procesar, no una suma de comprobación criptográfica.
