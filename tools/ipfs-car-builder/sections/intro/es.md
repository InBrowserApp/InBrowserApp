## Crea un archivo CAR a partir de archivos o una carpeta

Elige archivos o una carpeta y selecciona **Crear CAR**. Copia el CID raíz y guarda el archivo `.car`. El navegador lee la selección en tu dispositivo y la empaqueta en un archivo CARv1 con una raíz UnixFS. Puedes guardar el archivo como copia de seguridad o importarlo en un nodo de IPFS o un servicio de almacenamiento.

## Cómo conserva el CAR tus archivos

Si seleccionas un solo archivo, este se convierte en la raíz. Si seleccionas varios, se agrupan bajo un directorio raíz. Si seleccionas una carpeta, se conservan las rutas de sus archivos. El selector de carpetas del navegador proporciona los archivos y sus rutas. Si tu navegador permite arrastrar y soltar carpetas, suelta la carpeta para incluir las subcarpetas vacías.

## Qué significa el CID raíz

El CID raíz identifica el archivo o directorio empaquetado. El generador utiliza las mismas opciones predeterminadas de CIDv1 que la Calculadora de CID de IPFS. Una misma estructura de archivos y carpetas da el mismo identificador de contenido. Para añadir el CAR a Kubo, ejecuta `ipfs dag import archive.car` con el nombre del archivo descargado. [Referencia de comandos de Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
