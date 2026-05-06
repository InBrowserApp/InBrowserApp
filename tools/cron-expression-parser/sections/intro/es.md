## Comprende las programaciones cron antes de publicarlas

Las expresiones cron son compactas, pero un pequeño error en un campo puede hacer que una tarea se ejecute mucho más a menudo, o mucho menos, de lo previsto. Este analizador valida la expresión en tu navegador, explica la programación en lenguaje claro, desglosa cada campo y previsualiza las próximas ejecuciones.

### Cuándo usarlo

- Revisa una programación de despliegue, copia de seguridad, limpieza o notificación antes de agregarla a un servidor, sistema de CI o ejecutor de tareas.
- Compara una expresión cron copiada con la programación que realmente esperas.
- Aprende o depura la sintaxis cron cambiando un campo a la vez y observando cómo se actualiza la explicación.

### Formato admitido

La herramienta admite expresiones cron Unix estándar de cinco campos: minuto, hora, día del mes, mes y día de la semana. También acepta una expresión de seis campos con segundos al inicio para programadores que admiten precisión a nivel de segundos.

### Lectura del resultado

El resumen ofrece una descripción en lenguaje claro, mientras que la tabla de campos muestra cómo se divide la expresión sin procesar. Las próximas ejecuciones usan la zona horaria local de tu navegador, así que compáralas con la zona horaria usada por el programador que ejecutará la tarea.

### Notas

- Los valores de día de la semana suelen usar `0` o `7` para domingo, y también se aceptan nombres como `MON` o `FRI`.
- Los nombres de meses como `JAN` o `DEC` pueden facilitar la revisión de programaciones de producción.
- Si tu programador usa un dialecto cron diferente, confirma tokens especiales como `?`, `L`, `W` o `#` en la documentación propia de ese programador.
