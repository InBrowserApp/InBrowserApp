## Crea programaciones cron visualmente

Las expresiones cron son compactas, pero un pequeño cambio en el campo equivocado puede mover una tarea de "mañanas entre semana" a "cada minuto". Este generador da a cada campo sus propios controles para que puedas crear una expresión estándar de cinco campos sin memorizar cada regla de sintaxis.

### Cuándo ayuda

- Crea programaciones para trabajos de CI, copias de seguridad, precalentamiento de caché, informes y otras tareas recurrentes.
- Comienza con un preajuste conocido y ajusta un campo a la vez.
- Previsualiza las próximas horas de ejecución locales antes de pegar la expresión en un planificador.

### Cómo usarlo

1. Elige un preajuste rápido, o conserva la expresión predeterminada y edita cada campo manualmente.
2. Elige si cada campo debe usar todos los valores, un intervalo, valores específicos o un rango.
3. Revisa la expresión generada y la vista previa de próximas ejecuciones; luego cópiala en tu planificador.

### Notas

- Esta herramienta genera cron estándar de cinco campos: minuto, hora, día del mes, mes y día de la semana.
- El domingo se muestra como `0`, lo cual es aceptado por los planificadores cron comunes de estilo Unix.
- Si tanto el día del mes como el día de la semana están restringidos, muchas implementaciones de cron se ejecutan cuando cualquiera de los campos coincide. Algunos sistemas difieren, así que verifica esa combinación en tu planificador de destino.
