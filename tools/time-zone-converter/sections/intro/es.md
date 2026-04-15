## Para qué sirve esta herramienta

Usa este conversor para transformar una fecha y hora local de una zona horaria IANA en la hora local equivalente de otra zona. Resulta útil cuando necesitas comparar horarios entre ciudades sin sumar offsets manualmente ni adivinar si el horario de verano está activo.

## Casos de uso habituales

- Comprobar si una reunión en Tokio cae en el mismo día calendario en Nueva York o Londres.
- Verificar offsets antes de publicar horarios, alertas u horas de soporte.
- Copiar los valores equivalentes de ISO 8601, UTC o timestamp Unix para logs y APIs.

## Cómo funciona este conversor

- Introduce una fecha y hora local con el formato `YYYY-MM-DD HH:mm:ss.SSS` en cualquiera de los dos lados y luego elige las zonas horarias de origen y destino.
- El lado que editaste más recientemente se toma como referencia. La herramienta convierte ese instante a UTC internamente y después muestra la hora local equivalente en la otra zona.
- Usa `Now` para rellenar rápidamente la hora actual o `Swap` para invertir la comparación. Los offsets pueden cambiar alrededor de las transiciones de horario de verano.
