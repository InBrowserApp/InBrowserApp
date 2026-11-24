## Cómo leer un informe agregado DMARC

Abre el adjunto de un informe agregado enviado a la dirección indicada en `rua` en tu registro DMARC. El visor admite XML, GZIP y archivos ZIP con un solo informe XML. También puedes pegar el XML o cargar el ejemplo. El resumen indica quién emitió el informe, qué periodo abarca en UTC y cuál es la política publicada del dominio. Los archivos y el texto pegado se procesan en tu navegador.

## Cómo interpretar el recuento de mensajes

Cada registro de origen agrupa mensajes que comparten la IP de origen y el resultado de la evaluación. Puede representar varios mensajes, y una misma IP puede aparecer en más de un registro. Los totales se calculan a partir del número de mensajes de cada fila. Un mensaje supera DMARC si supera SPF o DKIM y el dominio de ese mecanismo está alineado con el dominio visible del campo De (From). El visor cuenta un mensaje como fallo cuando ambas comprobaciones de alineación fallan. Si faltan datos de alineación, el resultado se muestra como desconocido.

## Por qué pueden diferir la alineación, la autenticación y la medida aplicada

Despliega Resultados de autenticación sin procesar para ver los dominios, los resultados y los selectores DKIM que aparecen en el informe. SPF o DKIM pueden dar un resultado correcto para otro dominio y fallar en la comprobación de alineación DMARC. La medida aplicada describe qué hizo el servidor receptor con un grupo de mensajes. Si el servidor aplica una excepción, la medida puede diferir de la política publicada. Filtra por IP de origen o por el dominio del campo De para revisar un remitente sin cambiar los totales del informe.

## Qué formatos XML de DMARC admite el visor

El visor lee informes agregados de acuerdo con RFC 9990, incluido su espacio de nombres DMARC, e informes anteriores basados en RFC 7489. RFC 9990 describe el formato XML con el que los informes agregados resumen la autenticación y las medidas aplicadas. Si tu sistema de correo reúne varios informes en un mismo archivo comprimido, extrae el que quieras revisar y ábrelo por separado.
