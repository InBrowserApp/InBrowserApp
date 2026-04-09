## Resumen

JSON Diff Path compara dos documentos JSON y convierte cada cambio estructural en un registro de ruta legible con salida JSONPath y JSON Pointer.

## Cuándo usarlo

Úsalo cuando necesites revisar cambios en cargas útiles de API, inspeccionar migraciones de configuración o generar operaciones RFC 6902 JSON Patch para automatización.

## Cómo funciona

La herramienta analiza ambas entradas JSON, calcula cambios `add`, `remove` y `replace`, y luego te permite filtrar esas operaciones y alternar entre una lista de rutas y la salida JSON Patch en el mismo panel de resultados.
