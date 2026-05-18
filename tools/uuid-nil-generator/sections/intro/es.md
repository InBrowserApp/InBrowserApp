## ¿Qué es un UUID nil?

Un UUID nil es el UUID estandarizado cuyos 128 bits son todos cero. Su forma de texto canónica es `00000000-0000-0000-0000-000000000000`, y se usa a menudo para indicar que "todavía no se ha asignado ningún UUID".

## Cuándo usarlo

Usa un UUID nil cuando una API, una columna de base de datos, un fixture o un archivo de configuración requiere un valor con forma de UUID, pero el identificador real está ausente intencionalmente. Es útil como marcador de posición en pruebas, plantillas de importación, scripts de migración y protocolos que definen un valor UUID vacío explícito.

## Qué debes vigilar

No trates el UUID nil como un identificador único generado. Es el mismo valor cada vez, por lo que almacenarlo donde se espera un ID de objeto real puede ocultar datos faltantes, romper supuestos de unicidad o hacer que los registros parezcan conectados cuando no lo están.
