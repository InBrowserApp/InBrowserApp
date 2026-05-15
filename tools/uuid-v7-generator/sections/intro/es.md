UUID v7 es un formato UUID moderno que coloca una marca de tiempo Unix en milisegundos al inicio del identificador y rellena los bits restantes con aleatoriedad. Esto hace que los valores sean globalmente únicos en la práctica, a la vez que los mantiene ordenables de forma natural por hora de creación.

## Qué hace esta herramienta

Este generador crea valores UUID v7 completamente en tu navegador. Puedes generar un solo identificador o un lote de hasta 100, y luego copiar la lista o descargarla como archivo de texto para datos semilla, registros de base de datos, datos de prueba para eventos o cargas de prueba.

## Cuándo ayuda UUID v7

UUID v7 es útil cuando quieres identificadores opacos que aun así se ordenen bien en bases de datos, registros, colas y flujos de eventos distribuidos. En comparación con los valores UUID v4 aleatorios, UUID v7 reduce el movimiento en los índices porque los registros nuevos tienden a aparecer cerca del final de un espacio de claves ordenado.

## Notas sobre ordenabilidad y seguridad

La parte de marca de tiempo registra milisegundos, no un valor privado ni secreto. Si un identificador no debe revelar la hora aproximada de creación, usa en su lugar un formato completamente aleatorio. Dentro de un lote generado, esta herramienta mantiene los valores monotónicos para el mismo milisegundo mientras conserva los bits de versión y variante de UUID v7.
