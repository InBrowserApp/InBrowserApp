## Qué hace

El convertidor Docker Run a Compose transforma uno o más comandos `docker run`
en un archivo `docker-compose.yml` en el navegador. Puede revisar el YAML
generado, copiarlo o descargarlo antes de incorporarlo a su proyecto.

## Cuándo usarlo

Úselo para convertir un comando de contenedor puntual en una definición de
servicio de Compose reutilizable, o para ver cómo se trasladan a Compose los
puertos, los volúmenes, las variables de entorno y las opciones de recursos.

## Qué esperar

Se conservan las opciones habituales, como los puertos, las variables de
entorno, la política de reinicio, las comprobaciones de estado, los montajes y
los límites de recursos. Las opciones no compatibles o ambiguas se señalan con
advertencias para que pueda revisar el resultado antes de utilizarlo.
