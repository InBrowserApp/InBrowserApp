## Compara dos CID de carpetas de IPFS

Pega la dirección de la carpeta original en **Carpeta anterior** y la de la versión actualizada en **Carpeta nueva**. Después, selecciona **Comparar carpetas**. Cada campo acepta un CID, una dirección `ipfs://` o un enlace HTTP de una pasarela. Incluye una ruta para comparar dos subcarpetas. Abre un resultado para ver sus CID, usa **Filtrar por ruta** para acotar la lista o selecciona **Descargar JSON** para guardar la comparación.

## ¿Cuándo se considera que una ruta se ha añadido, eliminado o modificado?

Una ruta que solo existe en una de las carpetas se marca como añadida o eliminada. Si se añade o elimina una subcarpeta entera, esta aparece como una sola ruta. Cuando ambas versiones contienen una subcarpeta con CID distintos, la herramienta compara sus rutas internas. Si cambia el CID de una entrada, la entrada se marca como modificada. Los archivos importados con ajustes de fragmentación o codificación distintos pueden tener CID diferentes aunque su contenido visible sea idéntico.

## Compara versiones de IPFS sin descargar todos los archivos

El navegador lee bloques verificados de IPFS a través de pasarelas públicas y omite las ramas cuyos CID ya coinciden. Así puedes comparar versiones de un sitio web, de un conjunto de datos publicado o de una copia de seguridad mediante las direcciones inmutables de sus carpetas. Se pueden comparar los enlaces que han cambiado sin descargar los archivos completos. Si no está disponible una entrada de una carpeta, el resultado indica qué rutas no se pudieron comparar.

Más información sobre el [direccionamiento por contenido y las versiones de conjuntos de datos](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
