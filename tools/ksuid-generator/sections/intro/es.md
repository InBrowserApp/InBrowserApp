Genera KSUID localmente en tu navegador sin enviar el lote actual a otro servicio. Esta herramienta es útil cuando necesitas identificadores que sigan siendo únicos en sistemas distribuidos y que, al mismo tiempo, se ordenen aproximadamente por momento de creación para registros, cronologías, importaciones o listas ordenadas.

## Por Qué Usar KSUID

KSUID combina una marca de tiempo de 32 bits con 128 bits de aleatoriedad y codifica el resultado como una cadena Base62 de 27 caracteres. Eso hace que cada ID sea compacto, amigable con las URL y fácil de almacenar, mientras que la marca de tiempo integrada hace que los valores más nuevos queden por lo general después de los más antiguos.

## Elegir Hora Actual O Personalizada

Usa la hora actual cuando quieras IDs nuevos para datos de producción, demos o generación por lotes habitual. Cambia a una marca de tiempo personalizada cuando necesites fixtures reproducibles, registros cargados retroactivamente, ejemplos de migración o casos de prueba que deban parecer creados en un momento concreto.

## Lo Que Conviene Saber Antes De Exportar

KSUID solo conserva precisión de segundos, por lo que cualquier entrada con milisegundos se redondea hacia abajo al inicio de ese segundo. Los IDs creados en el mismo segundo siguen siendo únicos, pero su orden final también depende de la parte aleatoria, así que conviene tratar KSUID como ordenable por tiempo, no como una secuencia estrictamente continua.
