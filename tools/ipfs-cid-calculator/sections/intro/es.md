## Calcula el CID de un archivo o carpeta

Elige un archivo o carpeta de tu dispositivo y selecciona **Calcular CID**. Copia el identificador de contenido (CID) para anotarlo en un manifiesto o compararlo con el de una importación anterior de IPFS. El cálculo se hace en tu navegador y los archivos permanecen en tu dispositivo.

## ¿Por qué puede tener distintos CID de IPFS el mismo archivo?

IPFS puede dividir un archivo en bloques y guardar los enlaces entre ellos mediante UnixFS. El CID raíz depende de cómo se dividan, codifiquen y organicen esos bloques. Para reproducir un CID, usa el mismo tamaño de fragmento, la misma opción para los bloques hoja y la misma estructura de carpetas que en la importación original. El CID de una carpeta también incorpora los nombres de sus entradas. El selector de carpetas del navegador omite las subcarpetas vacías. El selector de carpetas también puede omitir los enlaces simbólicos.

## Reproduce el CID con Kubo

Abre **Opciones de importación** para cambiar la versión del CID, el tamaño de fragmento, el formato de los bloques hoja o la carpeta envolvente. La versión predeterminada es CIDv1. Usa CIDv0 si quieres reproducir una importación anterior que se hizo con esa versión. **Envolver en una carpeta** agrega un directorio externo que te permite acceder al archivo por su nombre desde el CID raíz.

Copia el comando `ipfs add --only-hash` que aparece para reproducir el cálculo en Kubo con el mismo archivo o carpeta. Si tienes el CID de una importación anterior, pégalo en el campo de comparación. Un CIDv0 y un CIDv1 equivalentes coinciden porque identifican el mismo bloque. [Documentación de IPFS sobre identificadores de contenido](https://docs.ipfs.tech/concepts/content-addressing/)
