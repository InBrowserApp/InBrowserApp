## Estima los costes de almacenamiento en Filecoin Onchain Cloud

Introduce el tamaño de los datos, el **Plazo de conservación (días)** y el número de **Copias**. La calculadora estima el coste de almacenar un nuevo conjunto de datos por copia con Filecoin Warm Storage Service. Muestra la tarifa mensual de almacenamiento y generación de pruebas, el gasto del plazo seleccionado y los cargos por crear los conjuntos de datos y añadir piezas. Los importes se expresan en USDFC. El mes de facturación de Filecoin dura 30 días.

## Cómo se calcula la estimación de almacenamiento

Por cada conjunto de datos activo se paga una tarifa de almacenamiento que depende del tamaño más un cargo fijo por la prueba de posesión de datos (Proof of Data Possession, PDP). Por ejemplo, con una tarifa de almacenamiento de 2,50 USDFC por TiB y un cargo de 0,12 USDFC por copia por la generación de pruebas, almacenar un TiB con dos copias cuesta aproximadamente 5,24 USDFC cada 30 días. La estimación usa el tamaño que introduces. Filecoin calcula el tamaño exacto facturado a partir de los nodos hoja con datos, lo que puede añadir hasta 31 bytes por pieza.

## Planifica los cargos de subida y la reserva reembolsable

Abre **Detalles de la subida** para indicar cuántas piezas y lotes de subida incluye cada copia. La opción predeterminada es una pieza en un lote. Cada copia tiene su propio cargo por crear el conjunto de datos. Añadir piezas tiene un cargo base por lote y un cargo por pieza. La reserva para el ciclo de vida es un saldo que el servicio retiene para cubrir operaciones. La reserva que se muestra se mantiene separada del gasto estimado y los fondos sin utilizar se liberan después de la liquidación. Esta estimación cubre una subida nueva y su plazo de almacenamiento. La recuperación de datos y las operaciones posteriores tienen sus propios cargos.

## De dónde proceden las tarifas de Filecoin

La página calcula con las tarifas de referencia fechadas que aparecen junto al resultado. Selecciona **Actualizar tarifas de la red principal** para consultar el contrato de precios de Warm Storage mediante un RPC público de Filecoin. El navegador usa las tarifas devueltas y muestra el bloque del que proceden. Puedes calcular con las tarifas de referencia si la consulta no está disponible.

Consulta la [guía de costes de almacenamiento de Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) para conocer los tamaños exactos que se facturan, los fondos necesarios para cada cuenta y la lista completa de cargos.
