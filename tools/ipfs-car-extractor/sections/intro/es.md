## Abre un archivo CAR de IPFS o Filecoin en el navegador

Selecciona un archivo `.car` de tu dispositivo. El extractor lee el archivo de forma local y muestra su CID raíz. Si el archivo contiene varias raíces, elige la que quieras. Los archivos CAR (Content Addressable aRchives) se utilizan en IPFS y Filecoin. Los catálogos de recursos de Apple comparten la misma extensión y usan un formato distinto.

## Extrae archivos o convierte una carpeta de CAR a ZIP

Abre una carpeta para ver su contenido. Selecciona un archivo y pulsa **Descargar archivo** para guardar sus bytes originales. Para exportar una carpeta con sus subcarpetas, pulsa **Descargar ZIP**. El ZIP conserva la estructura de carpetas de UnixFS.

## ¿Qué significa que falte un bloque?

Un archivo CAR almacena contenido en bloques identificados por CID. Una raíz puede enlazar a bloques que estén fuera de un archivo parcial. Si a una entrada le falta un bloque necesario, solicita una exportación completa al proveedor del archivo o descarga una entrada cuyos bloques sí estén disponibles. Los archivos CAR también pueden contener datos en otros formatos de IPLD. Esta herramienta extrae archivos y carpetas de UnixFS. [Formato CAR de IPLD](https://ipld.io/specs/transport/car/)
