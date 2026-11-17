## Abrir una captura HAR

Exporta un archivo HAR (HTTP Archive) desde el panel Red de tu navegador después de grabar las solicitudes que quieras investigar. Abre o suelta aquí el archivo `.har` o `.json`, o carga el ejemplo. El límite es de 20 MiB y 20.000 entradas.

## Localizar solicitudes lentas o fallidas

Busca por URL, método, estado o tipo MIME y ordena por hora de inicio, duración o tamaño transferido. Las solicitudes comparten una escala de tiempo que empieza en la primera solicitud. Selecciona una para inspeccionar sus encabezados, cookies, parámetros, cuerpos y fases de tiempo.

El filtro de solicitudes fallidas incluye los estados 0, 4xx y 5xx. El estado 0 significa que no se registró ninguna respuesta HTTP; el filtro 3xx incluye las respuestas 304 de la caché. TLS forma parte del tiempo de conexión.

## Leer los datos registrados

El procesamiento se realiza en tu navegador. Los detalles disponibles dependen de la exportación. Los tamaños desconocidos se excluyen de los totales; la duración de la captura no está disponible si falta la duración de alguna solicitud. La cascada sigue usando los inicios registrados y las finalizaciones conocidas.

Las vistas previas del cuerpo conservan el texto registrado. Las vistas previas y sus copias, así como los valores de cada campo, se limitan a 100.000 caracteres. Los cuerpos codificados se mantienen codificados.
